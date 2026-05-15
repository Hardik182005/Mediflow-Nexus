
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkGtmErrors() {
  const { data, error } = await supabase
    .from('gtm_recommendations')
    .select('id, startup_id, status, error_message, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching GTM recommendations:', error);
    return;
  }

  console.log('Recent GTM Recommendations:');
  console.table(data);
}

checkGtmErrors();
