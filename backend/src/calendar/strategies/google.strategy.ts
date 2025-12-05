
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleStrategy {
    private oauth2Client;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI,
        );
    }

    generateAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar.readonly'],
            prompt: 'consent', // Force refresh token
        });
    }

    async getTokens(code: string) {
        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }

    async getEvents(authToken: string) {
        this.oauth2Client.setCredentials({ access_token: authToken });
        const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

        try {
            const res = await calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: 50,
                singleEvents: true,
                orderBy: 'startTime',
            });

            return (res.data.items || []).map(event => ({
                id: event.id,
                title: event.summary || 'No Title',
                description: event.description,
                startTime: event.start?.dateTime || event.start?.date,
                endTime: event.end?.dateTime || event.end?.date,
                allDay: !event.start?.dateTime,
                provider: 'google',
                url: event.htmlLink,
            }));
        } catch (error) {
            console.error('Google Calendar API Error:', error);
            return [];
        }
    }
}
