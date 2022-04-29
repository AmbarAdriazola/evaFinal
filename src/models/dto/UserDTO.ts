export interface BaseUserDTO {
  email: string,
  firstName: string,
  lastName: string
}

export interface UserDTO extends BaseUserDTO{
  id:number
}

export interface CreateUserDTO extends BaseUserDTO{
  password: string
}

export type UpdateUserDTO = Partial<CreateUserDTO>

export interface LoginUserDTO extends UserDTO{
  password: string
}