
import { Injectable } from '@nestjs/common';
import { GoogleStrategy } from './strategies/google.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { AppleStrategy } from './strategies/apple.strategy';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CalendarService {
    constructor(
        private readonly googleStrategy: GoogleStrategy,
        private readonly microsoftStrategy: MicrosoftStrategy,
        private readonly appleStrategy: AppleStrategy,
        private readonly supabaseService: SupabaseService,
    ) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async getAllEvents(userId: string) {
        const { data: providers } = await this.supabase
            .from('providers')
            .select('*')
            .eq('user_id', userId);

        if (!providers) return [];

        const allEvents = await Promise.all(providers.map(async (provider) => {
            try {
                if (provider.type === 'google') {
                    return await this.googleStrategy.getEvents(provider.access_token);
                } else if (provider.type === 'microsoft') {
                    return await this.microsoftStrategy.getEvents(provider.access_token);
                } else if (provider.type === 'apple') {
                    return await this.appleStrategy.fetchEventsFromUrl(provider.metadata.url);
                }
            } catch (e) {
                console.error(`Failed to fetch events from ${provider.type}`, e);
                return [];
            }
            return [];
        }));

        return allEvents.flat();
    }

    async saveProvider(userId: string, type: string, tokens: any, metadata: any = {}) {
        // Upsert logic based on user_id + type
        const { error } = await this.supabase
            .from('providers')
            .upsert({
                user_id: userId,
                type,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                metadata,
                updated_at: new Date(),
            }, { onConflict: 'user_id, type' as never }); // Cast to never to bypass typing if schema not generated

        if (error) throw new Error(`Failed to save provider: ${error.message}`);
    }
}
