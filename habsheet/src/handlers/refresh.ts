import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'
import {RefreshTokenRequest} from 'src/types/auth'
import {validateAndRefreshTokens} from 'src/utils/token'
import {refreshTokenRequestSchema} from 'src/validation/auth'
import handlerMiddleware from './handlerMiddleware'

const ssm = new SSM()

export const handler = handlerMiddleware(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  let body: RefreshTokenRequest
  try {
    body = refreshTokenRequestSchema.validateSync(event.body, {abortEarly: false})
  } catch (e) {
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: e.errors,
      }),
      statusCode: 400,
    }
  }
  const tokens = await validateAndRefreshTokens(body.refreshToken, ssm)
  if (!tokens)
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'InvalidOrExpiredToken'}),
    }
  return {
    statusCode: 200,
    body: JSON.stringify({...tokens, message: 'SuccessfullyRefreshed'}),
  }
})
