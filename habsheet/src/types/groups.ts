import {inviteMemberRequestSchema, manageGroupUserRequestSchema} from 'src/validation/groups'
import * as yup from 'yup'

export type InviteMemberRequest = yup.InferType<typeof inviteMemberRequestSchema>

export type ManageGroupUserRequest = yup.InferType<typeof manageGroupUserRequestSchema>
