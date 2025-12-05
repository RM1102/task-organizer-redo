import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Polyfill fetch for node environment if needed (rare in Node 18+ but harmless)
// simpler reference to ensure it's picked up if global is missing
import 'node-fetch';

@Injectable()
export class SupabaseService {
    private readonly logger = new Logger(SupabaseService.name);
    private client: SupabaseClient;

    constructor(private readonly configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            this.logger.error('Supabase URL or Key is missing');
            // In production, we might want to throw an error here
        }

        this.client = createClient(supabaseUrl || '', supabaseKey || '');
    }

    getClient(): SupabaseClient {
        return this.client;
    }
}
