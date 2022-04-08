import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'
import {checkCredentialsByEmail} from 'src/database/users'
import {generateTokens} from 'src/utils/token'
import {loginRequestSchema} from 'src/validation/auth'
import handlerMiddleware from './handlerMiddleware'

const ssm = new SSM()

export const handler = handlerMiddleware(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  let body: {email: string; password: string}
  try {
    body = loginRequestSchema.validateSync(event.body, {abortEarly: false})
  } catch (e) {
    return {
      body: JSON.stringify({
        message: 'ValidationError',
        errorCodes: e.errors,
      }),
      statusCode: 400,
    }
  }
  const {email, password} = body
  const id = await checkCredentialsByEmail(email, password)
  if (!id) {
    return {
      body: JSON.stringify({
        message: 'CredentialsNotCorrect',
      }),
      statusCode: 400,
    }
  }
  const tokens = await generateTokens(id, ssm)
  return {
    statusCode: 200,
    body: JSON.stringify({...tokens, message: 'LoginSuccessful'}),
  }
})
