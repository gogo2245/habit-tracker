import {ReactElement, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions} from '@mui/material'
import {GroupRoles} from '../../../types/Groups'

import style from './GroupDetail.module.css'
import {deleteGroup} from '../../../api/groups'

export type ControlPanelProps = {
  role: GroupRoles
}

const ControlPanel = ({role}: ControlPanelProps): ReactElement => {
  const navigate = useNavigate()
  const [removeGroupOpen, setRemoveGroupOpen] = useState(false)
  const {groupID} = useParams()

  const onRemoveGroup = async () => {
    await deleteGroup(groupID || '')
    navigate('/')
  }

  return (
    <div className={style['control-panel']}>
      {role === GroupRoles.owner && <Button>Pozvať nového člena</Button>}
      {role === GroupRoles.owner && (
        <Button onClick={() => navigate(`/groups/${groupID}/update`)}>Upraviť skupinu</Button>
      )}
      {role === GroupRoles.owner && <Button onClick={() => setRemoveGroupOpen(true)}>Zmazať skupinu</Button>}
      {role >= GroupRoles.habitManager && <Button>Pridať Aktivitu</Button>}
      {role < GroupRoles.owner && <Button>Opustiť skupinu</Button>}
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
    </div>
  )
}

export default ControlPanel
