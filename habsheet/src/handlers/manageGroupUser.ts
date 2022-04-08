import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {isTokenError, validateToken} from 'src/utils/token'
import {changeUserRole, isUserGroup, isUserGroupOwner, leaveGroup} from 'src/database/groups'
import {ManageGroupUserRequest} from 'src/types/groups'
import {manageGroupUserRequestSchema} from 'src/validation/groups'
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
  let body: ManageGroupUserRequest
  try {
    body = manageGroupUserRequestSchema.validateSync(event.body, {abortEarly: false})
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
  const {userID, role} = body
  if (userID === userInfo.id)
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{userID: 'CannotModifyOwner'}],
      }),
      statusCode: 400,
    }
  if (!(await isUserGroupOwner(userInfo.id, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{groupID: 'NotAllowed'}],
      }),
      statusCode: 400,
    }
  if (!(await isUserGroup(userID, groupID)))
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: [{userID: 'DoesNotExist'}],
      }),
      statusCode: 400,
    }
  if (role === -1) await leaveGroup(userID, groupID)
  else await changeUserRole(userID, groupID, role)
  return {
    body: JSON.stringify({
      message: 'UserModified',
    }),
    statusCode: 200,
  }
})
