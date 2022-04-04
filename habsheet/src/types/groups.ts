import {inviteMemberRequestSchema} from 'src/validation/groups'
import * as yup from 'yup'

export type InviteMemberRequest = yup.InferType<typeof inviteMemberRequestSchema>
