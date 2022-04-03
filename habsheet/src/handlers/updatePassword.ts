import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'

import {isTokenError, validateToken} from 'src/utils/token'
import {UpdatePasswordRequest} from 'src/types/auth'
import {updatePasswordRequestSchema} from 'src/validation/auth'
import {changeUserPassword, checkCredentialsByID} from 'src/database/users'

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
  let body: UpdatePasswordRequest
  try {
    body = updatePasswordRequestSchema.validateSync(event.body, {abortEarly: false})
  } catch (e) {
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: e.errors,
      }),
      statusCode: 400,
    }
  }
  if (!(await checkCredentialsByID(userInfo.id, body.oldPassword))) {
    return {
      body: JSON.stringify({
        message: 'CredentialsNotCorrect',
      }),
      statusCode: 400,
    }
  }
  await changeUserPassword(userInfo.id, body.newPassword)
  return {statusCode: 200, body: JSON.stringify({message: 'PasswordUpdated'})}
}
