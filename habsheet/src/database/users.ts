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

const getUserByEmail = async (email: string): Promise<DatabaseUser | undefined> => {
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
  return returnIfOneOrZero(user.Items) as DatabaseUser | undefined
}

const getUserByPK = async (pk: string): Promise<DatabaseUser | undefined> => {
  const user = await ddb
    .get({
      TableName: process.env.UsersTableName,
      Key: {pk},
    })
    .promise()
  return user.Item as DatabaseUser | undefined
}

export const isEmailAlreadyUsed = async (email: string): Promise<boolean> => !!(await getUserByEmail(email))

export const checkCredentialsByEmail = async (email: string, password: string): Promise<string | undefined> => {
  const user = await getUserByEmail(email)
  if (!user || !compareSync(password, user.password)) return undefined
  return user.pk
}

export const checkCredentialsByPK = async (pk: string, password: string): Promise<boolean> => {
  const user = await getUserByPK(pk)
  return user && compareSync(password, user.password)
}

export const changeUserPassword = (pk: string, newPassword: string): Promise<unknown> =>
  ddb
    .update({
      TableName: process.env.UsersTableName,
      Key: {pk},
      UpdateExpression: 'SET password=:password',
      ExpressionAttributeValues: {
        ':password': hashSync(newPassword),
      },
    })
    .promise()
