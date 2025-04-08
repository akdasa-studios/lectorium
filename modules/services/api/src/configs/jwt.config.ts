import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.LECTORIUM_JWT_SECRET || 'secret',
  accessTokenExpiresIn:
    process.env.LECTORIUM_JWT_ACCESS_TOKEN_EXPIRES_IN || '1d',
  refreshTokenExpiresIn:
    process.env.LECTORIUM_JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
}));
