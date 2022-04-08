import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {deleteGroup, isUserGroupOwner} from 'src/database/groups'
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
  const {groupID} = event.pathParameters
  if (!(await isUserGroupOwner(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'NotAllowed'}],
      }),
      statusCode: 403,
    }
  await deleteGroup(groupID)
  return {
    body: JSON.stringify({
      message: 'GroupSuccessfullyDeleted',
    }),
    statusCode: 200,
  }
})
