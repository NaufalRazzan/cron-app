import { FileHandle, appendFile, open } from "fs/promises"

export const writeToFile = async (type: 'users' | 'movie_title', data: string) => {
    let filename: string

    type === 'users' ? filename = './users.txt' : filename = './movie_title.txt'; 
    
    return await appendFile(filename, '\n' + data)
}
/**
 * Read file from txt files. Please add the generics either UsersModel or string for smoother use.
 * @param type either choose to insert a user or the title
 * @returns a promise of the data based on the type and the generics provided, otherwise return unknown
 */

export const readToFile = async <T = any>(type: 'users' | 'movie_title') => {
    let filename: string
    let file: FileHandle
    let data: Array<T> = []

    if(type === 'users'){
        try {
            filename = './users.txt';
            file = await open(filename, 'r')
    
            for await (let user of file.readLines()){
                data.push(JSON.parse(user))
            }
        } catch (error) {
            console.error(error)
            throw error
        } finally{
            await file?.close()

            return data
        }
    }
    else{
        try {
            filename = './movie_title.txt';
            file = await open(filename, 'r')
    
            for await (let title of file.readLines()){
                data.push(title as T)
            }
        } catch (error) {
            console.error(error)
            throw error
        } finally{
            await file?.close()

            return data
        }
    }
}