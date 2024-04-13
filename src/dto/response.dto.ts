import { GetMoviesListData } from "./get-movies-list.dto"

export type LoginResponse = {
    message: string,
    acc_token?: string
}

export type GetMoviesListResponse = {
    message: string,
    data: GetMoviesListData[]
}

export type GetMovieByTitleResponse = {
    message: string,
    data: GetMoviesListData
}

export type FetchedOpenedMoviesResponse = {
    message: string,
    data: OpenMoviesData[] | string
}

type OpenMoviesData = {
    _id: any
    available_seats: number,
    max_seats: number,
    room_code: string,
    start_time: string,
    finish_time: string,
    ticket_price: number,
    status: string,
    movie_details: {
        _id: any,
        title: string,
        genres: string[],
        duration: string,
        rating: string,
        createdAt: string,
        updatedAt: string,
        __v: number
    }
}

export type viewOrderHistoryResponse = {
    message: string,
    data: viewOrderHistoryData[] | string
}

type viewOrderHistoryData = {
    _id: any,
    user_id: string,
    ticket_purchase_amounts: number,
    total_amount: number,
    movie_start_time: string,
    movie_finish_time: string,
    movie_details: {
        _id: any,
        title: string,
        genres: string[],
        duration: string,
        rating: string,
        createdAt: string,
        updatedAt: string,
        __v: number
    }
}
