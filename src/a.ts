
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

const arr = [1, 2, 5, 8, 689, 10]
export const newArray = arr.filter(item => item > 8)

const map = (item: number) => item > 2
export { map }