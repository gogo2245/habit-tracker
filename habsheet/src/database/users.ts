import {DynamoDB} from 'aws-sdk'
import * as uuid from 'uuid'
import {hashSync} from 'bcryptjs'

import {DatabaseUser} from 'src/types/users'

const ddb = new DynamoDB.DocumentClient()

const TableName = 'habsheet-users'

const returnIfOneOrZero = <Item>(items: Item[]): Item | undefined => {
  if (items.length === 1) return items[0]
  if (items.length === 0) return undefined
  throw new Error('Multiple users with same email')
}

export const createUser = async (email: string, username: string, password: string): Promise<unknown> =>
  ddb
    .put({
      TableName,
      Item: {
        pk: uuid.v4(),
        email,
        username,
        password: hashSync(password, 10),
      },
    })
    .promise()

const getUserPKByEmail = async (email: string): Promise<Omit<DatabaseUser, 'username' | 'password'> | undefined> => {
  const user = await ddb
    .query({
      TableName,
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email=:email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    })
    .promise()
  return returnIfOneOrZero(user.Items) as Omit<DatabaseUser, 'username' | 'password'>
}

export const isEmailAlreadyUsed = async (email: string): Promise<boolean> => !!(await getUserPKByEmail(email))
