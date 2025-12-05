
import fetch from 'node-fetch';

const RENDER_API_KEY = 'rnd_emM7iB8m4dQUrr2Lop4ZFl0eixFi';

async function getLogs() {
    try {
        // 1. Get Service ID
        const servicesRes = await fetch('https://api.render.com/v1/services', {
            headers: { 'Authorization': `Bearer ${RENDER_API_KEY}` }
        });
        const services = await servicesRes.json();
        const service = services.find(s => s.service.repo.includes('task-organizer-redo'));

        if (!service) { console.log('Service not found'); return; }

        const serviceId = service.service.id;
        console.log(`Getting logs for ${serviceId}...`);

        // 2. Get Logs
        const logsRes = await fetch(`https://api.render.com/v1/services/${serviceId}/logs?limit=100`, {
            headers: { 'Authorization': `Bearer ${RENDER_API_KEY}` }
        });
        if (!logsRes.ok) {
            const text = await logsRes.text();
            console.error(`Status: ${logsRes.status}, Body: ${text}`);
            return;
        }

        const logs = await logsRes.json();
        // Render returns array of objects with { text, timestamp }
        logs.forEach(log => console.log(log.text));

    } catch (error) {
        console.error('Error:', error);
    }
}

getLogs();
