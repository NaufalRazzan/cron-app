export type UserModel = {
    username: string,
    email: string,
    password: string,
}

export type TokenPayload = {
    user_id: any,
    username: string,
    password: string
}