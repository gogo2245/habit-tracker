import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {inviteMemberRequestSchema} from 'src/validation/groups'
import {isTokenError, validateToken} from 'src/utils/token'
import {InviteMemberRequest} from 'src/types/groups'
import {getUserByEmail} from 'src/database/users'
import {inviteMemberToGroup, isUserGroup, isUserGroupOwner} from 'src/database/groups'

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
  let body: InviteMemberRequest
  try {
    body = inviteMemberRequestSchema.validateSync(event.body, {abortEarly: false})
  } catch (e) {
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: e.errors,
      }),
      statusCode: 400,
    }
  }
  const {groupID, email} = body
  const user = await getUserByEmail(email)
  if (!user)
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{email: 'DoesNotExist'}],
      }),
      statusCode: 400,
    }
  if (!(await isUserGroupOwner(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'NotAllowed'}],
      }),
      statusCode: 403,
    }
  if (await isUserGroup(user.id, groupID))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{email: 'AlreadyMember'}],
      }),
      statusCode: 400,
    }
  await inviteMemberToGroup(user.id, groupID)
  return {
    body: JSON.stringify({
      message: 'UserSuccessfullyInvited',
    }),
    statusCode: 200,
  }
}
