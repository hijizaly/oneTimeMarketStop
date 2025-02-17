import { jwtToken, TokenPayload } from '../types/tokenPayload';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenGenerator {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateJWT_(payload: TokenPayload): Promise<jwtToken> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_AT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(
        { sub: payload.id, role: payload.role },
        {
          secret: this.configService.get('JWT_RT_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        },
      ),
    ]);
    //CHECK IF RT IS EXPIRE NDO U REPLACE IT ...
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
