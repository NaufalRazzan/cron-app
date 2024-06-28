import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

    @Get('/')
    async testService(){
      try {
        const res = await this.appService.deleteOrderHistory()

        return res
      } catch (error) {
        console.error(error)
      }
    }
    @Cron(CronExpression.EVERY_30_MINUTES)
    async registeringUser(){
      const res = await this.appService.registerUser()

      if(res.status !== HttpStatus.OK){
        console.log('failed on register user')
      }
      console.log('registering user succed')
    }
    
    @Cron(CronExpression.EVERY_6_HOURS)
    async insertingMovies(){
      const res = await this.appService.insertMovies()

      if(res.status !== HttpStatus.OK){
        console.log('failed on inserting movies')
      }

      console.log('inserting movies succeed')
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async findMovieByTitleUser(){
      // find movies from user
      const resUser = await this.appService.searchMoviesByTitle('user')

      if(resUser.status !== HttpStatus.OK){
        console.log('failed on find movies by title from user')
      }

      console.log('finding movies by title from user succeed')
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async findMovieByTitleAdmin(){
      // find movies from user
      const resAdmin = await this.appService.searchMoviesByTitle('user')

      if(resAdmin.status !== HttpStatus.OK){
        console.log('failed on find movies by title from admin')
      }

      console.log('finding movies by title from admin succeed')
    }

    @Cron(CronExpression.EVERY_6_HOURS)
    async updatingMovies(){
      const res = await this.appService.updateMovies()

      if(res.status !== HttpStatus.OK){
        console.log('failed on updating movies')
      }

      console.log('updating movies succeed')
    }

    @Cron(CronExpression.EVERY_6_HOURS)
    async removingMovies(){
      const res = await this.appService.removeMovies()

      if(res.status !== HttpStatus.OK){
        console.log('failed on removing movies')
      }

      console.log('removing movies succeed')
    }

    @Cron(CronExpression.EVERY_6_HOURS)
    async insertingOpenedMovies(){
      const res = await this.appService.insertOpenedMovies()

      if(res.status !== HttpStatus.OK){
        console.log('failed on inserting opened movies')
      }

      console.log('inserting opened movies succeed')
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async fetchingOpenedMovies(){
      const res = await this.appService.fetchOpenedMovies()

      if(res.status !== HttpStatus.OK){
        console.log('failed on fetching opened movies')
      }

      console.log('fetching opened movies succeed')
    }

    @Cron(CronExpression.EVERY_HOUR)
    async creatingOrderMovie(){
      const res = await this.appService.createOrderMovie()

      if(res.status !== HttpStatus.OK){
        console.log('failed on creating order movie')
      }

      console.log('creating order movie succeed')
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async viewingOrderHistory(){
      const res = await this.appService.viewOrderHistory()

      if(res.status !== HttpStatus.OK){
        console.log('failed on viewing order history')
      }

      console.log('viewing order history succeed')
    }

    @Cron(CronExpression.EVERY_HOUR)
    async deletingOrderHistory(){
      const res = await this.appService.deleteOrderHistory()

      if(typeof res === 'string'){
        console.log(res)
      }
      if(typeof res === 'object' && res.status !== HttpStatus.OK){
        console.log('failed on deleting order history')
      }

      console.log('deleting order history succeed')
    }
}
