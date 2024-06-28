import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { User } from './dto/user.dto';
import { TokenPayload, UserModel } from './dto/user-array.dto';
import { FetchedOpenedMoviesResponse, GetMovieByTitleResponse, GetMoviesListResponse, LoginResponse, viewOrderHistoryResponse } from './dto/response.dto';
import { InsertMoviesPayload, RandomMovieApi, UpdateMoviesPayload, getCurrentTime12h, getRandomRanting } from './dto/insert-movies.dto';
import { getRandMoviesTitle } from './dto/get-movies-list.dto';
import { OpenMoviesPayload, generateRandomStringCode, getFinishTime, getFormattedDate, getRandPrice } from './dto/insert-opened-movies.dto';
import { JwtService } from '@nestjs/jwt';
import { OrderMoviePayload, extractTime } from './dto/order-movie.dto';
import { readToFile, writeToFile } from './utils/readWriteToFiles';
import { AxiosResponse } from 'axios';
import { choiceRandUA } from './utils/randomUA';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService
  ){
    // let initUsers: UserModel =
    //   {
    //     username: "Iceman Admin",
    //     email: "IcemanPadiumkm@gmail.com",
    //     password: "Iceman2000#"
    //   }
    // writeToFile('users', JSON.stringify(initUsers))
  }

  private async getRandUsers(){
    return await firstValueFrom(this.httpService.get<User>(process.env.RANDOM_REGISTER_API))
  }

  private async getRandMovies(): Promise<InsertMoviesPayload[]>{
    let payload: InsertMoviesPayload[] = []
    const res  = await firstValueFrom(this.httpService.get<RandomMovieApi>(process.env.RANDOM_MOVIES_API, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'e8ef8c9ecbmsh0f11653e94c3efep1a2b2djsna3f6070045dc',
        'X-RapidAPI-Host': 'movies-api14.p.rapidapi.com'
      }
    }));

    const data = res.data.movies
    data.forEach((item) => {
      const mockData: InsertMoviesPayload = {
        title: item.title,
        genres: item.genres,
        duration: getCurrentTime12h(),
        rating: getRandomRanting()
      };

      payload.push(mockData)
      writeToFile('movie_title', item.title)
    })

    return payload
  }

  private async getRandIndexUsers(length: number){
    return Math.floor(Math.random() * length) + 1;
  }

  private async loginUser(){
    const users = await readToFile<UserModel>('users')
    const idx = await this.getRandIndexUsers(users.length - 1)
    const userData = users[(idx > users.length) ? users.length : idx]

    return (await firstValueFrom(this.httpService.post<LoginResponse>(process.env.REMOTE_BASE_URL + '/auth/signin', userData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))).data
  }

  private async loginAdmin(){
    const admin = await readToFile<UserModel>('users')

    return (await firstValueFrom(this.httpService.post<LoginResponse>(process.env.REMOTE_BASE_URL + '/auth/signin', admin[0], {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))).data
  }

  private async fetchAllMovies(acc_token: string){
    return (await firstValueFrom(this.httpService.get<GetMoviesListResponse>(process.env.REMOTE_BASE_URL + '/movies/allMovies', {
      headers: {
        Authorization: `Bearer ${acc_token}`
      }
    }))).data
  }

  async getHome(){
    return await firstValueFrom(this.httpService.get<{ message: string }>(process.env.REMOTE_BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }
  
  async registerUser(){
    const user = (await this.getRandUsers()).data.results[0];

    const payload: UserModel = {
      username: user.login.username,
      email: user.email,
      password: user.login.password
    }

    writeToFile('users', JSON.stringify(payload))

    return await firstValueFrom(this.httpService.post(process.env.REMOTE_BASE_URL + '/auth/signup', payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }

  async insertMovies(){
    // login admin
    const loginRes = await this.loginAdmin()

    // insert movie
    const payload = await this.getRandMovies()
    return await firstValueFrom(this.httpService.post(process.env.REMOTE_BASE_URL + '/movies/insertMovies', payload, {
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }));
  }

  async searchMoviesByTitle(role: string){
    // login user or admin
    let loginRes: LoginResponse;

    switch(role){
      case 'user':
        loginRes = await this.loginUser()
        break;
      case 'admin':
        loginRes = await this.loginAdmin()
        break;
    };
    
    const movieTitle = await getRandMoviesTitle()
    console.log('title: ', movieTitle)

    return await firstValueFrom(this.httpService.get<GetMovieByTitleResponse>(process.env.REMOTE_BASE_URL + `/movies/searchMovies/${movieTitle}`, {
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }

  async updateMovies(){
    // login admin
    const loginRes = await this.loginAdmin()

    // update
    let updatePayload: UpdateMoviesPayload[] = []
    for(let i = 0; i < 3; i++){
      updatePayload.push({
        title: await getRandMoviesTitle(),
        rating: getRandomRanting()
      })
    }

    return await firstValueFrom(this.httpService.patch(process.env.REMOTE_BASE_URL + '/movies/updateMovies', updatePayload, {
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }

  async removeMovies(){
    // login admin
    const loginRes = await this.loginAdmin()

    // find movies title to delete
    let deletedMovies: string[] = []
    for(let i = 1; i < 3; i++){
      const title = await getRandMoviesTitle()
      const moviesTitle = await readToFile<string>('movie_title')

      deletedMovies.push(title)

      moviesTitle.splice(
        moviesTitle.findIndex((movieTitle) => movieTitle === title),
        1
      );
    }

    return await firstValueFrom(this.httpService.delete(process.env.REMOTE_BASE_URL + '/movies/removeMovies', {
      data: deletedMovies,
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }

  async insertOpenedMovies(){
    // login admin
    const loginRes = await this.loginAdmin()

    // get movies list
    const moviesData = (await this.fetchAllMovies(loginRes.acc_token)).data

    // construct payload
    let insertNewOpenedMoviesPayload: OpenMoviesPayload[] = []
    for(let i = 0; i < 3; i++){
      let idx = Math.floor(Math.random() * moviesData.length)

      let payload: OpenMoviesPayload = {
        movie_id: moviesData[idx]._id,
        available_seats: 0,
        max_seats: Math.floor(Math.random() * 100),
        room_code: generateRandomStringCode(),
        start_time: getFormattedDate(),
        finish_time: getFinishTime(moviesData[idx].duration),
        ticket_price: getRandPrice(),
        status: 'open'
      };

      insertNewOpenedMoviesPayload.push(payload)
    }

    // make request
    return await firstValueFrom(this.httpService.post(
      process.env.REMOTE_BASE_URL + '/openList/insertNewOpenedMovies', 
      insertNewOpenedMoviesPayload, 
      {
        headers: {
          Authorization: `Bearer ${loginRes.acc_token}`,
          'Content-Type': 'application/json',
          'User-Agent': choiceRandUA()
        }
      }
    ))
  }

  async fetchOpenedMovies(role: string = 'user'){
    let loginRes: LoginResponse

    if(role === 'user') loginRes = await this.loginUser();
    else loginRes = await this.loginAdmin();

    return await firstValueFrom(this.httpService.get<FetchedOpenedMoviesResponse>(process.env.REMOTE_BASE_URL + '/openList/fetchOpenedMovies', {
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }

  async createOrderMovie(role: string = 'user'): Promise<AxiosResponse<any, any> | null>{
    let loginRes: LoginResponse
    const removeSubstring = (str: string) => {
      const parts = str.split(' ')
      parts.splice(3, 1)

      return parts.join(' ')
    }

    if(role === 'user') loginRes = await this.loginUser();
    else loginRes = await this.loginAdmin();

    const res_token = await this.jwtService.verifyAsync<TokenPayload>(loginRes.acc_token, { secret: process.env.SECRET_KEY_USER })
    const res_open_movie = (await this.fetchOpenedMovies(role)).data.data

    if(typeof res_open_movie === 'string') return null;

    const randIdx = Math.floor(Math.random() * res_open_movie.length)
    
    const payload: OrderMoviePayload = {
      username: res_token.username,
      title: res_open_movie[randIdx].movie_details.title,
      start_time: removeSubstring(res_open_movie[randIdx].start_time),
      finish_time: removeSubstring(res_open_movie[randIdx].finish_time),
      movie_start_time: extractTime(res_open_movie[randIdx].start_time),
      movie_finish_time: extractTime(res_open_movie[randIdx].finish_time),
      ticket_purchase_amounts: randIdx % 4,
      payment_status: 'paid'
    }

    return await firstValueFrom(this.httpService.post(process.env.REMOTE_BASE_URL + '/orderMovie/createNewOrder', payload, {
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }

  async viewOrderHistory(role: string = 'user'){
    let loginRes: LoginResponse

    if(role === 'user') loginRes = await this.loginUser();
    else loginRes = await this.loginAdmin();

    const username = (await this.jwtService.verifyAsync<TokenPayload>(loginRes.acc_token, { secret: process.env.SECRET_KEY_USER })).username;

    return await firstValueFrom(this.httpService.get<viewOrderHistoryResponse>(process.env.REMOTE_BASE_URL + `/orderMovie/viewOrderHistory?name=${username}`, {
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }

  async deleteOrderHistory(role: string = 'user'): Promise<AxiosResponse<any, any> | Promise<string>>{
    let loginRes: LoginResponse

    if(role === 'user') loginRes = await this.loginUser();
    else loginRes = await this.loginAdmin();

    const username = (await this.jwtService.verifyAsync<TokenPayload>(loginRes.acc_token, { secret: process.env.SECRET_KEY_USER })).username;
    const viw_open_movie = (await this.viewOrderHistory()).data.data

    if(typeof viw_open_movie === 'string') return viw_open_movie

    const randIdx = Math.floor(Math.random() * viw_open_movie.length)
    const title = viw_open_movie[randIdx].movie_details.title

    return await firstValueFrom(this.httpService.delete(process.env.REMOTE_BASE_URL + `/orderMovie/deleteOrder?name=${username}&title=${title}`, {
      headers: {
        Authorization: `Bearer ${loginRes.acc_token}`,
        'Content-Type': 'application/json',
        'User-Agent': choiceRandUA()
      }
    }))
  }
}
