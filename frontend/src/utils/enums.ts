import {GroupRoles} from '../types/Groups'

export const getRoleEnumText = (role: GroupRoles): string => {
  switch (role) {
    case GroupRoles.invited:
      return 'Pozvaný'
    case GroupRoles.member:
      return 'Užívateľ'
    case GroupRoles.habitManager:
      return 'Manažér aktivít'
    case GroupRoles.owner:
      return 'Vlastník skupiny'
  }
}
