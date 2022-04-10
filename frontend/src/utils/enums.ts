import {GroupRoles} from '../types/Groups'
import {HabitInterval} from '../types/habits'

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

export const getHabitIntervalEnumText = (interval: HabitInterval): string => {
  switch (interval) {
    case HabitInterval.daily:
      return 'Denný'
    case HabitInterval.weekly:
      return 'Týždenný'
    case HabitInterval.monthly:
      return 'Mesačný'
  }
}
