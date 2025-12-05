import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async checkHealth() {
    const { data, error } = await this.supabaseService.getClient().from('items').select('count', { count: 'exact', head: true });
    return {
      status: 'ok',
      supabase: error ? 'error' : 'connected',
      message: error ? error.message : 'Supabase connection successful'
    };
  }
}
