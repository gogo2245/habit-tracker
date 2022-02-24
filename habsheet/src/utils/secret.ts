import {SSM} from 'aws-sdk'

export const getSecret = ({ssm, path}: {ssm: SSM; path: string}): Promise<string> =>
  ssm
    .getParameter({Name: path, WithDecryption: true})
    .promise()
    .then(({Parameter: {Value}}) => Value)
