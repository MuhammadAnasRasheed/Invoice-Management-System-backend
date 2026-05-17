import jwt,{SignOptions} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

export class TokenService {
  private static instance: TokenService;
  private readonly secret: string;
  private readonly expiresIn: SignOptions['expiresIn'];

  private constructor() {
    this.secret = process.env.JWT_SECRET || 'your_secret_key';
    this.expiresIn = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] || '7d';
  }

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): TokenPayload | null {
  try {
    console.log('Verifying token with secret:', this.secret);
    const decoded = jwt.verify(token, this.secret) as TokenPayload;
    console.log('Decoded successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error instanceof Error ? error.message : error);
    return null;
  }
}
  decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}