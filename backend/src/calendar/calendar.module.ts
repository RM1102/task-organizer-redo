
import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { AppleStrategy } from './strategies/apple.strategy';

@Module({
    controllers: [CalendarController],
    providers: [
        CalendarService,
        GoogleStrategy,
        MicrosoftStrategy,
        AppleStrategy,
    ],
    exports: [CalendarService],
})
export class CalendarModule { }
