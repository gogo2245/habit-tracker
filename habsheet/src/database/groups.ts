import {DynamoDB} from 'aws-sdk'
import * as _ from 'lodash'
import {DatabaseGroup, DatabaseGroupUser, DatabaseUser, GroupRole} from 'src/types/database'
import * as uuid from 'uuid'

const ddb = new DynamoDB.DocumentClient()

export const createGroup = async (userID: string, name: string, description: string): Promise<void> => {
  const groupID = uuid.v4()
  await ddb
    .put({
      TableName: process.env.GroupsTableName,
      Item: {
        id: groupID,
        description,
        name,
      },
    })
    .promise()
  await ddb
    .put({
      TableName: process.env.GroupsUsersTableName,
      Item: {
        groupID,
        userID,
        role: GroupRole.owner,
      },
    })
    .promise()
}

export const listGroupsByUserID = async (userID: string): Promise<(DatabaseGroup & {role: GroupRole})[]> => {
  const {Items: groups} = await ddb
    .query({
      TableName: process.env.GroupsUsersTableName,
      IndexName: 'userIDIndex',
      KeyConditionExpression: 'userID=:userID',
      ExpressionAttributeValues: {
        ':userID': userID,
      },
    })
    .promise()
  return Promise.all(
    _.map(groups, async ({groupID, role}: DatabaseGroupUser) => ({
      ...((
        await ddb
          .get({
            TableName: process.env.GroupsTableName,
            Key: {id: groupID},
          })
          .promise()
      ).Item as DatabaseGroup),
      role,
    })),
  )
}

const getUserGroup = async (userID: string, groupID: string): Promise<DatabaseGroupUser> => {
  const {Item: userGroup} = await ddb
    .get({
      TableName: process.env.GroupsUsersTableName,
      Key: {userID, groupID},
    })
    .promise()
  return userGroup as DatabaseGroupUser | undefined
}

export const isUserGroup = async (userID: string, groupID: string): Promise<boolean> =>
  !!(await getUserGroup(userID, groupID))

export const isUserGroupOwner = async (userID: string, groupID: string): Promise<boolean> => {
  const userGroup = await getUserGroup(userID, groupID)
  return userGroup && userGroup.role === GroupRole.owner
}

export const isUserGroupInvited = async (userID: string, groupID: string): Promise<boolean> => {
  const userGroup = await getUserGroup(userID, groupID)
  return userGroup && userGroup.role === GroupRole.invited
}

export const inviteMemberToGroup = async (userID: string, groupID: string): Promise<void> => {
  if (await isUserGroup(userID, groupID))
    throw new Error(`User with id: ${userID} is already member of group: ${groupID}`)
  await ddb
    .put({
      TableName: process.env.GroupsUsersTableName,
      Item: {
        userID,
        groupID,
        role: GroupRole.invited,
      },
    })
    .promise()
}

export const listUsersByGroupID = async (groupID: string): Promise<(DatabaseUser & {role: GroupRole})[]> => {
  const {Items: users} = await ddb
    .query({
      TableName: process.env.GroupsUsersTableName,
      KeyConditionExpression: 'groupID=:groupID',
      ExpressionAttributeValues: {
        ':groupID': groupID,
      },
    })
    .promise()
  return Promise.all(
    _.map(users, async ({userID, role}: DatabaseGroupUser) => ({
      ...((
        await ddb
          .get({
            TableName: process.env.UsersTableName,
            Key: {id: userID},
          })
          .promise()
      ).Item as DatabaseUser),
      role,
    })),
  )
}

export const acceptInvitationToGroup = async (userID: string, groupID: string): Promise<void> => {
  await ddb
    .update({
      TableName: process.env.GroupsUsersTableName,
      Key: {userID, groupID},
      UpdateExpression: 'set #rl = :role',
      ExpressionAttributeNames: {'#rl': 'role'},
      ExpressionAttributeValues: {':role': GroupRole.member},
    })
    .promise()
}

export const leaveGroup = async (userID: string, groupID: string): Promise<void> => {
  await ddb.delete({TableName: process.env.GroupsUsersTableName, Key: {userID, groupID}}).promise()
}
