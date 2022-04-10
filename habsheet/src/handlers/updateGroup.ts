import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {DatabaseGroup} from '../types/database'
import {createGroupRequestSchema} from 'src/validation/groups'
import {isUserGroupOwner, updateGroup} from 'src/database/groups'
import {isTokenError, validateToken} from 'src/utils/token'
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
  let body: Omit<DatabaseGroup, 'id'>
  try {
    body = createGroupRequestSchema.validateSync(event.body, {abortEarly: false})
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
  if (!(await isUserGroupOwner(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'NotAllowed'}],
      }),
      statusCode: 403,
    }
  const {name, description} = body
  await updateGroup(groupID, name, description)
  return {
    body: JSON.stringify({
      message: 'GroupUpdated',
    }),
    statusCode: 200,
  }
})
