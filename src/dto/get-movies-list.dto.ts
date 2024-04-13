import { Types } from "mongoose"
import { readToFile } from "src/utils/readWriteToFiles"

export type GetMoviesListData = {
    _id: string,
    title: string,
    genres: string[],
    duration: string,
    rating: string,
    createdAt: Date,
    updatedAt: Date,
    __v: string
}

export const getRandMoviesTitle = async () => {
    const movie_titles = await readToFile<string>('movie_title')

    return movie_titles[Math.floor(Math.random() * movie_titles.length)]
}