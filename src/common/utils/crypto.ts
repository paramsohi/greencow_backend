import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { env } from '../../config/env';

export const hashPassword = (value: string) => bcrypt.hash(value, env.BCRYPT_SALT_ROUNDS);
export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

export const sha256 = (value: string) =>
  crypto.createHash('sha256').update(value, 'utf8').digest('hex');
