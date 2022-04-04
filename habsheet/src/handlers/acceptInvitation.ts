import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {isTokenError, validateToken} from 'src/utils/token'
import {acceptInvitationToGroup, isUserGroupInvited} from 'src/database/groups'

const ssm = new SSM()

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const userInfo = await validateToken(event.headers, ssm)
  if (isTokenError(userInfo))
    return {
      body: JSON.stringify({
        message: userInfo.errorMessage,
      }),
      statusCode: 401,
    }
  const {groupID} = event.pathParameters
  if (!(await isUserGroupInvited(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'UserIsNotInvitedToThisGroup'}],
      }),
      statusCode: 400,
    }
  await acceptInvitationToGroup(userInfo.id, groupID)
  return {
    body: JSON.stringify({
      message: 'InvitationAccepted',
    }),
    statusCode: 200,
  }
}
