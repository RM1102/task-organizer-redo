
import { Injectable } from '@nestjs/common';
// @ts-ignore
import ICAL from 'ical.js';
import fetch from 'node-fetch';

@Injectable()
export class AppleStrategy {
    async fetchEventsFromUrl(url: string) {
        try {
            const response = await fetch(url);
            const data = await response.text();
            const jcalData = ICAL.parse(data);
            const comp = new ICAL.Component(jcalData);
            const events = comp.getAllSubcomponents('vevent');

            return events.map(event => {
                return {
                    uid: event.getFirstPropertyValue('uid'),
                    summary: event.getFirstPropertyValue('summary'),
                    start: event.getFirstPropertyValue('dtstart'),
                    end: event.getFirstPropertyValue('dtend'),
                };
            });
        } catch (e) {
            console.error('Error fetching/parsing ICS:', e);
            return [];
        }
    }
}
