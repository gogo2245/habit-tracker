import {SSM} from 'aws-sdk'
import * as jwt from 'jsonwebtoken'
import {TokenResponse} from 'src/types/token'
import {getSecret} from './secret'

export const generateTokens = async (pk: string, ssm: SSM): Promise<TokenResponse> => {
  const secret = await getSecret({ssm, path: process.env.SecretKeySignPath})
  const accessToken = jwt.sign({pk, type: 'accessToken'}, secret, {expiresIn: '1h', algorithm: 'RS256'})
  const refreshToken = jwt.sign({pk, type: 'refreshToken'}, secret, {expiresIn: '1w', algorithm: 'RS256'})
  return {accessToken, refreshToken}
}

export const validateAndRefreshTokens = async (refreshToken: string, ssm: SSM): Promise<TokenResponse | undefined> => {
  try {
    const decoded = jwt.decode(refreshToken, {complete: true})
    if (!decoded || typeof decoded === 'string') return
    const secret = await getSecret({ssm, path: process.env.SecretKeySignPath})
    const verified = jwt.verify(refreshToken, secret, {algorithms: ['RS256']})
    if (!verified || typeof verified === 'string') return
    if (verified.type !== 'refreshToken') return
    return generateTokens(verified.pk, ssm)
  } catch (e) {
    return
  }
}
