import 'dotenv/config';
import {customAlphabet} from 'nanoid';
import {PrismaClient} from '../dist';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const uidGenerate = (type?: 'pk_test' | 'sk_test' | 'pk_live' | 'sk_live' | 'cus' | 'pi' | 'cs' | 'tx' | 'pw') => {
  switch (type) {
    case 'pk_test':
      return 'pk_test_' + customAlphabet(alphabet, 46)();
    case 'sk_test':
      return 'sk_test_' + customAlphabet(alphabet, 46)();
    case 'pk_live':
      return 'pk_live_' + customAlphabet(alphabet, 46)();
    case 'sk_live':
      return 'sk_live_' + customAlphabet(alphabet, 46)();
    case 'cus':
      return 'cus_' + customAlphabet(alphabet, 22)();
    case 'pi':
      return 'pi_' + customAlphabet(alphabet, 22)();
    case 'cs':
      return 'cs_' + customAlphabet(alphabet, 22)();
    case 'tx':
      return 'tx_' + customAlphabet(alphabet, 22)();
    case 'pw':
      return 'pw_' + customAlphabet(alphabet, 22)();
    default:
      return customAlphabet(alphabet, 46)();
  }
};

const main = async () => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

  console.log('Seed script finished');
};

await main();
