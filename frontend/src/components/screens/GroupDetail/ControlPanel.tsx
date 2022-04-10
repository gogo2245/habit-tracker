import {ReactElement, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions} from '@mui/material'
import {GroupRoles} from '../../../types/Groups'

import style from './GroupDetail.module.css'
import {deleteGroup, inviteUser, leaveGroup} from '../../../api/groups'
import TextFieldWithErrors from '../../TextFieldWithErrors/TextFieldWithErrors'
import {onInputChange} from '../../../utils/inputs'
import {isApiError, simplifyErrors} from '../../../utils/errors'
import {DataError} from '../../../types/api'

export type ControlPanelProps = {
  role: GroupRoles
}

const ControlPanel = ({role}: ControlPanelProps): ReactElement => {
  const navigate = useNavigate()
  const [removeGroupOpen, setRemoveGroupOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userEmailErrors, setUserEmailErrors] = useState<string | undefined>()
  const [inviteUserOpen, setInviteUserOpen] = useState(false)
  const {groupID} = useParams()

  const onRemoveGroup = async () => {
    await deleteGroup(groupID || '')
    navigate('/')
  }

  const onLeaveGroup = async () => {
    await leaveGroup(groupID || '')
    navigate('/')
  }

  const onInviteUser = async () => {
    try {
      await inviteUser(groupID || '', userEmail)
      setInviteUserOpen(false)
      setUserEmail('')
    } catch (e) {
      if (isApiError<DataError>(e)) {
        const data = e.response.data
        const errors = simplifyErrors(data.errorCodes)
        setUserEmailErrors(errors.email)
      }
    }
  }

  return (
    <div className={style['control-panel']}>
      {role === GroupRoles.owner && <Button onClick={() => setInviteUserOpen(true)}>Pozvať nového člena</Button>}
      {role === GroupRoles.owner && (
        <Button onClick={() => navigate(`/groups/${groupID}/update`)}>Upraviť skupinu</Button>
      )}
      {role === GroupRoles.owner && <Button onClick={() => setRemoveGroupOpen(true)}>Zmazať skupinu</Button>}
      {role >= GroupRoles.habitManager && <Button>Pridať Aktivitu</Button>}
      {role < GroupRoles.owner && <Button onClick={onLeaveGroup}>Opustiť skupinu</Button>}
      <Dialog
        open={removeGroupOpen}
        onClose={() => setRemoveGroupOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Naozaj si želáte zmazať skupinu?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Naozaj si želáte zmazať skupinu a všetky jej aktivity? Táto akcia sa už nedá zvrátiť
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveGroupOpen(false)}>Nie</Button>
          <Button onClick={onRemoveGroup} autoFocus>
            Áno
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={inviteUserOpen} onClose={() => setInviteUserOpen(false)}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>Prosím napíšte email užívateľa ktorého si želáte pozvať do skupiny</DialogContentText>
          <TextFieldWithErrors
            value={userEmail}
            onChange={onInputChange(setUserEmail)}
            errors={userEmailErrors}
            variant="outlined"
            placeholder="Email"
            type="text"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteUserOpen(false)}>Zrušiť</Button>
          <Button onClick={onInviteUser}>Pozvať</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ControlPanel
