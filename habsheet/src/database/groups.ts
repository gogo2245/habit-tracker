import {DynamoDB} from 'aws-sdk'
import * as _ from 'lodash'
import {DatabaseGroup, DatabaseGroupUser, GroupRole} from 'src/types/database'
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
