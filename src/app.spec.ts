import { Test, TestingModule } from "@nestjs/testing"
import { AppService } from "./app.service"
import { HttpStatus } from "@nestjs/common";

describe('Cron Service', () => {
    let cronService: AppService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService]
        }).compile()

        cronService = module.get<AppService>(AppService)
    });

    describe('Home Page', () => {
        it('should return 200 OK', async () => {
            const homePage = await cronService.getHome()

            expect(homePage.status).toBe(HttpStatus.OK)
        });

        it('should return successful json', async () => {
            const mockRes = { message: 'welcome to movie pirate 2020' }
            const actualRes = await cronService.getHome()
            
            expect(actualRes.data).toEqual(mockRes)
        });
    })
})