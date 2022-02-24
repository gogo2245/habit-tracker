import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {SSM} from 'aws-sdk'
import {checkCredentials} from 'src/database/users'
import {generateTokens} from 'src/utils/token'
import {loginRequestSchema} from 'src/validation/auth'

const ssm = new SSM()

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  let body: {email: string; password: string}
  try {
    body = loginRequestSchema.validateSync(event.body)
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
  const pk = await checkCredentials(email, password)
  if (!pk) {
    return {
      body: JSON.stringify({
        message: 'CredentialsNotCorrect',
      }),
      statusCode: 400,
    }
  }
  const tokens = await generateTokens(pk, ssm)
  return {
    statusCode: 200,
    body: JSON.stringify({...tokens, message: 'LoginSuccessfull'}),
  }
}
