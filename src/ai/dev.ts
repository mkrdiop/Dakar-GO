import { config } from 'dotenv';
config();

import '@/ai/flows/estimate-delivery-time.ts';
import '@/ai/flows/translate-address-to-gps.ts';