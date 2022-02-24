import {DynamoDB} from 'aws-sdk'
import * as uuid from 'uuid'
import {hashSync, compareSync} from 'bcryptjs'

import {DatabaseUser} from 'src/types/users'

const ddb = new DynamoDB.DocumentClient()

const returnIfOneOrZero = <Item>(items: Item[]): Item | undefined => {
  if (items.length === 1) return items[0]
  if (items.length === 0) return undefined
  throw new Error('Multiple users with same email')
}

export const createUser = async (email: string, username: string, password: string): Promise<unknown> =>
  ddb
    .put({
      TableName: process.env.UsersTableName,
      Item: {
        pk: uuid.v4(),
        email,
        username,
        password: hashSync(password, 10),
      },
    })
    .promise()

const getUserPKByEmail = async (email: string): Promise<Omit<DatabaseUser, 'username'> | undefined> => {
  const user = await ddb
    .query({
      TableName: process.env.UsersTableName,
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email=:email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    })
    .promise()
  return returnIfOneOrZero(user.Items) as Omit<DatabaseUser, 'username'>
}

export const isEmailAlreadyUsed = async (email: string): Promise<boolean> => !!(await getUserPKByEmail(email))

export const checkCredentials = async (email: string, password: string): Promise<string | undefined> => {
  const user = await getUserPKByEmail(email)
  if (!user || !compareSync(password, user.password)) return undefined
  return user.pk
}
