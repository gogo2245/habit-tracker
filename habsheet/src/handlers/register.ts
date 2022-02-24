import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'

import {DatabaseUser} from '../types/users'
import {createUser, isEmailAlreadyUsed} from '../database/users'
import {registerRequestSchema} from '../validation/auth'

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  let body: Omit<DatabaseUser, 'pk'>
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
}
