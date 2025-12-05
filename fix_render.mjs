
import fetch from 'node-fetch';

const RENDER_API_KEY = 'rnd_emM7iB8m4dQUrr2Lop4ZFl0eixFi';
const SERVICE_NAME = 'task-organizer-backend'; // Or we search for it

async function fixRender() {
    try {
        console.log('Fetching services...');
        const res = await fetch('https://api.render.com/v1/services', {
            headers: { 'Authorization': `Bearer ${RENDER_API_KEY}` }
        });

        if (!res.ok) throw new Error(`Failed to list services: ${res.statusText}`);

        const data = await res.json();
        // Find our service. It might be named differently, so look for repo match or fuzzy name
        const service = data.find(s => s.service.repo.includes('task-organizer-redo'));

        if (!service) {
            console.error('Could not find a service connected to task-organizer-redo repository.');
            // List names to debug
            console.log('Available services:', data.map(s => s.service.name));
            return;
        }

        const serviceId = service.service.id;
        console.log(`Found Service: ${service.service.name} (${serviceId})`);
        console.log(`Current Root Dir: ${service.service.rootDir}`);

        if (service.service.rootDir !== 'backend') {
            console.log('Updating Root Directory to "backend"...');
            const updateRes = await fetch(`https://api.render.com/v1/services/${serviceId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${RENDER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rootDir: 'backend' })
            });

            if (!updateRes.ok) {
                const err = await updateRes.text();
                throw new Error(`Failed to update service: ${err}`);
            }
            console.log('✅ Service configuration updated!');

            // Trigger Deploy
            console.log('Triggering new deployment...');
            const deployRes = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${RENDER_API_KEY}` }
            });

            if (!deployRes.ok) {
                const err = await deployRes.text();
                throw new Error(`Failed to deploy: ${err}`);
            }
            console.log('✅ Deployment triggered!');

        } else {
            console.log('✅ Root Directory is already correct.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

fixRender();
