import type {AWS} from '@serverless/typescript'

const UsersTableName = 'habsheet-users'
const GroupsTableName = 'habsheet-groups'
const GroupsUsersTableName = 'habsheet-groups-users'
const SecretKeySignPath = 'login-private-key'

const serverlessConfiguration: AWS = {
  service: 'habsheet',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    logRetentionInDays: 30,
    versionFunctions: false,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    register: {
      handler: 'src/handlers/register.handler',
      environment: {
        UsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:PutItem', 'dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users/index/emailIndex`,
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/auth/register',
          },
        },
      ],
    },
    login: {
      handler: 'src/handlers/login.handler',
      environment: {
        SecretKeySignPath,
        UsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem', 'dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users/index/emailIndex`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/auth/login',
          },
        },
      ],
    },
    refresh: {
      handler: 'src/handlers/refresh.handler',
      environment: {
        SecretKeySignPath,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/auth/refresh',
          },
        },
      ],
    },
    updatePassword: {
      handler: 'src/handlers/updatePassword.handler',
      environment: {
        SecretKeySignPath,
        UsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:UpdateItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/habsheet-users`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/auth/password/update',
          },
        },
        {
          httpApi: {
            method: 'patch',
            path: '/v1/auth/password/update',
          },
        },
        {
          httpApi: {
            method: 'put',
            path: '/v1/auth/password/update',
          },
        },
      ],
    },
    createGroup: {
      handler: 'src/handlers/createGroup.handler',
      environment: {
        SecretKeySignPath,
        GroupsTableName,
        GroupsUsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:PutItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:PutItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/groups/create',
          },
        },
      ],
    },
    listGroups: {
      handler: 'src/handlers/listGroups.handler',
      environment: {
        SecretKeySignPath,
        GroupsTableName,
        GroupsUsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem', 'dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}/index/userIDIndex`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'get',
            path: '/v1/groups',
          },
        },
      ],
    },
    InviteMemberToGroup: {
      handler: 'src/handlers/inviteMember.handler',
      environment: {
        SecretKeySignPath,
        GroupsUsersTableName,
        UsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:PutItem', 'dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${UsersTableName}/index/emailIndex`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/groups/invite',
          },
        },
      ],
    },
    AcceptInvitation: {
      handler: 'src/handlers/acceptInvitation.handler',
      environment: {
        SecretKeySignPath,
        GroupsUsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:UpdateItem', 'dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/groups/{groupID}/invite/accept',
          },
        },
      ],
    },
    LeaveGroup: {
      handler: 'src/handlers/leaveGroup.handler',
      environment: {
        SecretKeySignPath,
        GroupsUsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:DeleteItem', 'dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/groups/{groupID}/leave',
          },
        },
      ],
    },
    ListGroupUsers: {
      handler: 'src/handlers/listGroupUsers.handler',
      environment: {
        SecretKeySignPath,
        GroupsUsersTableName,
        UsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query', 'dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${UsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'get',
            path: '/v1/groups/{groupID}/users',
          },
        },
      ],
    },
    ManageGroupUser: {
      handler: 'src/handlers/manageGroupUser.handler',
      environment: {
        SecretKeySignPath,
        GroupsUsersTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:DeleteItem', 'dynamodb:UpdateItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'post',
            path: '/v1/groups/{groupID}/users/manage',
          },
        },
      ],
    },
    DeleteGroup: {
      handler: 'src/handlers/deleteGroup.handler',
      environment: {
        SecretKeySignPath,
        GroupsUsersTableName,
        UsersTableName,
        GroupsTableName,
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:Query', 'dynamodb:GetItem', 'dynamodb:DeleteItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsUsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${UsersTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:DeleteItem'],
          Resource: `arn:aws:dynamodb:\${self:provider.region}:*:table/${GroupsTableName}`,
        },
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: `arn:aws:ssm:\${self:provider.region}:\${aws:accountId}:parameter/${SecretKeySignPath}`,
        },
        {
          Effect: 'Allow',
          Action: ['kms:Decrypt'],
          Resource: '*',
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': 'alias/aws/ssm',
            },
          },
        },
      ],
      events: [
        {
          httpApi: {
            method: 'delete',
            path: '/v1/groups/{groupID}',
          },
        },
      ],
    },
  },
  package: {individually: true},
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: {'require.resolve': undefined},
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      DDBUsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: UsersTableName,
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'email',
              AttributeType: 'S',
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'emailIndex',
              KeySchema: [
                {
                  AttributeName: 'email',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          Tags: [
            {
              Key: 'BackupPlan',
              Value: 'Standard',
            },
          ],
        },
      },
      DDBGroupTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: GroupsTableName,
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          Tags: [
            {
              Key: 'BackupPlan',
              Value: 'Standard',
            },
          ],
        },
      },
      DDBGroupsUsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: GroupsUsersTableName,
          AttributeDefinitions: [
            {
              AttributeName: 'groupID',
              AttributeType: 'S',
            },
            {
              AttributeName: 'userID',
              AttributeType: 'S',
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'userIDIndex',
              KeySchema: [
                {
                  AttributeName: 'userID',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'groupID',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
          KeySchema: [
            {
              AttributeName: 'groupID',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'userID',
              KeyType: 'RANGE',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          Tags: [
            {
              Key: 'BackupPlan',
              Value: 'Standard',
            },
          ],
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
