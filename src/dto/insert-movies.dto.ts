export type InsertMoviesPayload = {
    title: string,
    genres: string[],
    duration: string,
    rating: string,
}

export type UpdateMoviesPayload = {
    title: string,
    rating: string,
}

type MovieData = {
    _id: number,
    backdrop_path: string,
    genres: string[],
    original_title: string,
    overview: string,
    poster_path: string,
    release_date: string,
    title: string,
    contentType: string
}

export type RandomMovieApi = {
    movies: MovieData[],
    page: number
}

export function getCurrentTime12h(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
  
    hours = hours % 12 || 12;

    hours = hours > 3 ? (hours / 4) : hours;
  
    return `${Math.floor(hours)}:${minutes}:${seconds}`;
}

export function getRandomRanting(){
    const ranting = ['SU', 'BO-A', 'BO', 'R', 'D'];

    return ranting[Math.floor(Math.random() * ranting.length)]
}