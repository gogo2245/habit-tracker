import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {isUserGroup, isUserGroupInvited, listUsersByGroupID} from 'src/database/groups'
import {isTokenError, validateToken} from 'src/utils/token'

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
  if (!(await isUserGroup(userInfo.id, groupID)) || (await isUserGroupInvited(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'GroupNotFound',
      }),
      statusCode: 404,
    }
  const users = await listUsersByGroupID(groupID)
  return {
    body: JSON.stringify({
      message: 'GroupUsersSuccessfullyFetched',
      users,
    }),
    statusCode: 200,
  }
}
