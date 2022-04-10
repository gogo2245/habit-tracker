import {DynamoDB} from 'aws-sdk'
import * as _ from 'lodash'
import {DatabaseHabit} from 'src/types/database'
import * as uuid from 'uuid'
import {listGroupsByUserID} from './groups'

const ddb = new DynamoDB.DocumentClient()

export const addHabit = async (habit: Omit<DatabaseHabit, 'id' | 'createdAt'>): Promise<string> => {
  const id = uuid.v4()
  await ddb
    .put({TableName: process.env.HabitsTableName, Item: {...habit, id, createdAt: new Date().toISOString()}})
    .promise()
  return id
}

export const listHabits = async (groupID: string): Promise<DatabaseHabit[]> =>
  _.map(
    (
      await ddb
        .query({
          TableName: process.env.HabitsTableName,
          IndexName: 'groupIDIndex',
          KeyConditionExpression: 'groupID=:groupID',
          ExpressionAttributeValues: {':groupID': groupID},
        })
        .promise()
    ).Items,
    (item: DatabaseHabit) => ({...item, createdAt: new Date(item.createdAt)}),
  )

export const listAllHabits = async (userID: string): Promise<DatabaseHabit[]> => {
  const groups = await listGroupsByUserID(userID)
  const habits = await Promise.all(_.map(groups, ({id}) => listHabits(id)))
  return _.flatten(habits)
}
