import { Controller, Get, Query, Post, Body, Res } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';

@Controller('calendar')
export class CalendarController {
    constructor(
        private readonly calendarService: CalendarService,
        private readonly googleStrategy: GoogleStrategy,
        private readonly microsoftStrategy: MicrosoftStrategy,
    ) { }

    @Get('events')
    async getEvents(@Query('userId') userId: string) {
        return this.calendarService.getAllEvents(userId);
    }

    @Get('auth/google')
    async googleAuth(@Res() res: any) {
        const url = this.googleStrategy.generateAuthUrl();
        res.redirect(url);
    }

    @Get('auth/google/callback')
    async googleAuthCallback(@Query('code') code: string, @Res() res: any) {
        const tokens = await this.googleStrategy.getTokens(code);
        // TODO: Get real userId from session/auth guard. Hardcoding for dev.
        const userId = '123e4567-e89b-12d3-a456-426614174000';
        await this.calendarService.saveProvider(userId, 'google', tokens);
        res.redirect('http://localhost:5173/?status=success&provider=google');
    }

    @Get('auth/microsoft')
    async microsoftAuth(@Res() res: any) {
        const url = await this.microsoftStrategy.getAuthUrl();
        res.redirect(url);
    }

    @Get('auth/microsoft/callback')
    async microsoftAuthCallback(@Query('code') code: string, @Res() res: any) {
        const tokens = await this.microsoftStrategy.getTokens(code);
        const userId = '123e4567-e89b-12d3-a456-426614174000';
        await this.calendarService.saveProvider(userId, 'microsoft', tokens);
        res.redirect('http://localhost:5173/?status=success&provider=microsoft');
    }

    @Post('connect/apple')
    async connectApple(@Body() body: { url: string }, @Res() res: any) {
        const userId = '123e4567-e89b-12d3-a456-426614174000';
        await this.calendarService.saveProvider(userId, 'apple', {}, { url: body.url });
        return res.status(200).json({ success: true });
    }
}
