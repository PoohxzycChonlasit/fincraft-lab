import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class BcryptService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
