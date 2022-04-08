import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'

import {DatabaseUser} from '../types/database'
import {createUser, isEmailAlreadyUsed} from '../database/users'
import {registerRequestSchema} from '../validation/auth'
import handlerMiddleware from './handlerMiddleware'

export const handler = handlerMiddleware(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  let body: Omit<DatabaseUser, 'id'>
  try {
    body = registerRequestSchema.validateSync(event.body, {abortEarly: false})
  } catch (e) {
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: e.errors,
      }),
      statusCode: 400,
    }
  }
  const {email, username, password} = body
  if (await isEmailAlreadyUsed(email)) {
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{email: 'AlreadyUsed'}],
      }),
      statusCode: 400,
    }
  }
  await createUser(email, username, password)
  return {
    body: JSON.stringify({
      message: 'UserCreated',
    }),
    statusCode: 200,
  }
})
