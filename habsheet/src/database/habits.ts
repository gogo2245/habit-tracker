import {DynamoDB} from 'aws-sdk'
import * as _ from 'lodash'
import {DatabaseHabit} from 'src/types/database'
import * as uuid from 'uuid'

const ddb = new DynamoDB.DocumentClient()

export const addHabit = async (habit: Omit<DatabaseHabit, 'id' | 'createdAt'>): Promise<void> => {
  await ddb
    .put({TableName: process.env.HabitsTableName, Item: {...habit, id: uuid.v4(), createdAt: new Date().toISOString()}})
    .promise()
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
