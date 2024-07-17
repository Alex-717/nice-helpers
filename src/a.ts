
export type User = {
  id: number,
  name: string,
  age: number,
  sex: '男' | '女'
}

export type VipUser = User & {
  level: number
}

export function getUserName(user: User) {
  return user.name
}

export function getVipUserLevel(user: VipUser) {
  return user.level
}