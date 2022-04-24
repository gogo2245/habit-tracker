import {DynamoDB} from 'aws-sdk'
import * as _ from 'lodash'
import {DatabaseHabit, HabitInterval} from 'src/types/database'
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

export const getHabit = async (habitID: string, groupID: string): Promise<DatabaseHabit | undefined> => {
  return (await ddb.get({TableName: process.env.HabitsTableName, Key: {id: habitID, groupID}}).promise())
    .Item as DatabaseHabit
}

export const completeHabit = async (habitID: string, groupID: string, userID: string, value: number): Promise<void> => {
  const habit = await getHabit(habitID, groupID)
  const lastDate = new Date()
  switch (habit.interval) {
    case HabitInterval.daily:
      break
    case HabitInterval.weekly:
      lastDate.setDate(lastDate.getDate() - ((lastDate.getDay() + 6) % 7))
      break
    case HabitInterval.monthly:
      lastDate.setDate(1)
      break
  }
  const date = new Date(lastDate.toISOString().slice(0, 10)).getTime()
  await ddb.put({TableName: process.env.HabitInsancesTableName, Item: {date, habitID, userID, value}}).promise()
}

export const isHabit = async (habitID: string, groupID: string): Promise<boolean> =>
  !!(await getHabit(habitID, groupID))
