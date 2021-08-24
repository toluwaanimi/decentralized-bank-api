import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../../models/user.entity';
import { JWT_SECRET } from '../../config/env.config';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const Authorization = request.get('Authorization');
    if (!Authorization) {
      throw new UnauthorizedException('Unauthorized request');
    }
    const token = Authorization.split(' ');
    if (!((token[1] && token[0] === 'Bearer') || token[0] === 'bearer')) {
      throw new UnauthorizedException('Unauthorized request');
    }
    let decrypt;
    try {
      decrypt = await verify(token[1], JWT_SECRET);
    } catch (e) {
      throw new UnauthorizedException('Unauthorized request');
    }

    if (!decrypt) {
      throw new UnauthorizedException('Unauthorized request');
    }
    const user = await getRepository(User).findOne({
      where: { id: decrypt.id },
    });
    if (!user) {
      throw new UnauthorizedException('Unauthorized request');
    }
    request.user = user;
    return true;
  }
}
