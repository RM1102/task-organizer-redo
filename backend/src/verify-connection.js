
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('Verifying Supabase Connection...');

    // 1. Frontend Simulation
    console.log('Simulating Frontend Insert (No user_id)...');
    try {
        const { data, error } = await supabase
            .from('items')
            .insert({
                title: 'Frontend Simulation',
                is_task: true,
                // No user_id included
            })
            .select()
            .single();

        if (error) {
            console.error('Frontend Simulation Failed:', error);
        } else {
            console.log('Frontend Simulation Success:', data);
        }
    } catch (err) {
        console.error('Frontend Simulation Exception:', err);
    }
}

verify();
