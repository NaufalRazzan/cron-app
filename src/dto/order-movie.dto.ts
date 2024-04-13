export type OrderMoviePayload = {
    username: string,
    title: string,
    start_time: string,
    finish_time: string,
    movie_start_time: string,
    movie_finish_time: string,
    ticket_purchase_amounts: number,
    payment_status: 'pending' | 'paid'
}

export const extractTime = (dateTime: string): string => {
    const parts = dateTime.split('at');

    return parts[1].trim()
}