import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ItemsService {
    private readonly logger = new Logger(ItemsService.name);

    constructor(private readonly supabase: SupabaseService) { }

    async findAll(query: any) {
        let builder = this.supabase.getClient()
            .from('items')
            .select('*');

        if (query.type === 'task') {
            builder = builder.eq('is_task', true);
        } else if (query.type === 'event') {
            builder = builder.eq('is_task', false);
            // Logic for start/end date filtering can go here if needed
            // e.g., builder = builder.gte('start_time', query.start).lte('end_time', query.end);
        }

        const { data, error } = await builder.order('created_at', { ascending: false });

        if (error) {
            this.logger.error(`Error fetching items: ${error.message}`);
            throw new Error(error.message);
        }

        return data;
    }

    async create(createItemDto: any) {
        // Sanitize and map payload
        const payload = {
            title: createItemDto.title,
            description: createItemDto.description,
            is_task: createItemDto.is_task !== undefined ? createItemDto.is_task : true,
            due_date: createItemDto.dueDate,
            start_time: createItemDto.startTime,
            end_time: createItemDto.endTime,
            // provider: createItemDto.provider, // Schema has provider_id (UUID), not provider (text). Ignoring for now.
            // provider_id: ... // We would need to resolve 'local' to a Provider UUID technically.
            // For now, let's just insert what we can.

            // Map common fields if they exist
            ...(createItemDto.user_id ? { user_id: createItemDto.user_id } : {}),
            // If user_id is missing, we might fail NOT NULL constraint unless we have a default or auth context.
            // However, the debug script showed we can insert without user_id?? 
            // Wait, the debug script "Attempting to insert item WITHOUT user_id..." returned "Insert Success: null". 
            // Null data usually means RLS violation or plain failure if no error thrown?
            // Actually, verify_connection.js output: "Insert Success: null" came from "Attempting to insert item WITHOUT user_id...".
            // If it was valid, data should be returned.

            // Let's rely on what the frontend sends.
        };

        const { data, error } = await this.supabase.getClient()
            .from('items')
            .insert(payload)
            .select() // .select() is crucial to get the return data
            .single();

        if (error) {
            this.logger.error(`Error creating item: ${error.message}`);
            throw new Error(error.message);
        }

        return data;
    }

    async update(id: string, updateItemDto: any) {
        const { data, error } = await this.supabase.getClient()
            .from('items')
            .update({
                ...updateItemDto,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            this.logger.error(`Error updating item: ${error.message}`);
            throw new Error(error.message);
        }

        return data;
    }

    async remove(id: string) {
        const { error } = await this.supabase.getClient()
            .from('items')
            .delete()
            .eq('id', id);

        if (error) {
            this.logger.error(`Error deleting item: ${error.message}`);
            throw new Error(error.message);
        }

        return { success: true };
    }
}
