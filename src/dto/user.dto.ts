type LoginData = {
    uuid: string,
    username: string,
    password: string,
    salt: string,
    md5: string,
    sha1: string,
    sha256: string
}

type Data = {
    email: string,
    login: LoginData
}

type InfoData = {
    seed: string,
    results: number,
    page: number,
    version: string
}

export interface User{
    results: Data[],
    info: InfoData
}