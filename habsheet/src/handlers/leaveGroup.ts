import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {isTokenError, validateToken} from 'src/utils/token'
import {isUserGroup, isUserGroupOwner, leaveGroup} from 'src/database/groups'
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
  if (!(await isUserGroup(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'UserIsNotMemberOfThisGroup'}],
      }),
      statusCode: 400,
    }
  if (await isUserGroupOwner(userInfo.id, groupID))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'GroupOwnerCannotLeaveGroup'}],
      }),
      statusCode: 400,
    }
  await leaveGroup(userInfo.id, groupID)
  return {
    body: JSON.stringify({
      message: 'GroupLeaved',
    }),
    statusCode: 200,
  }
})
