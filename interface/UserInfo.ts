export interface UserInfo {
  nickname: string,
  email: string,
  createTime: Date,
  birthday: Date,
  avatar?: string,
  level: number,
  expireDate: Date,
  lastLoginTime?: string,
}