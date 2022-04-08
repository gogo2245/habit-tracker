import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {DatabaseHabit} from '../types/database'
import {isTokenError, validateToken} from 'src/utils/token'
import {addHabitRequestSchema} from 'src/validation/habits'
import {addHabit} from 'src/database/habits'
import {isUserGroupManager} from 'src/database/groups'
import handlerMiddleware from './handlerMiddleware'

const ssm = new SSM()

export const handler = handlerMiddleware(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const userInfo = await validateToken(event.headers, ssm)
  if (isTokenError(userInfo))
    return {
      body: JSON.stringify({
        message: userInfo.errorMessage,
      }),
      statusCode: 401,
    }
  let body: Omit<DatabaseHabit, 'id' | 'createdAt' | 'groupID'>
  try {
    body = addHabitRequestSchema.validateSync(event.body, {abortEarly: false})
  } catch (e) {
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: e.errors,
      }),
      statusCode: 400,
    }
  }
  const {groupID} = event.pathParameters
  if (!(await isUserGroupManager(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'NotAllowed'}],
      }),
      statusCode: 403,
    }
  await addHabit({...body, groupID})
  return {
    body: JSON.stringify({
      message: 'HabitAdded',
    }),
    statusCode: 200,
  }
})
