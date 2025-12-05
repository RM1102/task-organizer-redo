
import { Injectable } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';

@Injectable()
export class MicrosoftStrategy {
    private msalClient: ConfidentialClientApplication;

    constructor() {
        // Basic initialization - will need real config
        this.msalClient = new ConfidentialClientApplication({
            auth: {
                clientId: process.env.MICROSOFT_CLIENT_ID || '',
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
            }
        });
    }

    async getAuthUrl() {
        return await this.msalClient.getAuthCodeUrl({
            scopes: ['Calendars.Read'],
            redirectUri: process.env.MICROSOFT_REDIRECT_URI || '',
        });
    }

    async getTokens(code: string) {
        const response = await this.msalClient.acquireTokenByCode({
            code,
            scopes: ['Calendars.Read'],
            redirectUri: process.env.MICROSOFT_REDIRECT_URI || '',
        });
        return {
            access_token: response.accessToken,
            refresh_token: null, // MSAL handles caching usually, but flow might differ
        };
    }

    async getEvents(accessToken: string) {
        const client = Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            }
        });

        try {
            const res = await client.api('/me/events')
                .select('id,subject,bodyPreview,start,end,webLink')
                .top(50)
                .get();

            return (res.value || []).map((event: any) => ({
                id: event.id,
                title: event.subject,
                body: event.bodyPreview,
                startTime: event.start?.dateTime,
                endTime: event.end?.dateTime,
                allDay: event.isAllDay,
                provider: 'microsoft',
                url: event.webLink
            }));
        } catch (error) {
            console.error('Microsoft Graph API Error:', error);
            return [];
        }
    }
}
