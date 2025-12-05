import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const cookies = req.cookies || {};
    const sid = cookies['sid'];

    if (!sid) {
      return next();
    }

    try {
      const session = await this.prisma.session.findUnique({
        where: { id: sid },
        include: { user: true },
      });

      if (!session) {
        return next();
      }

      const now = new Date();
      if (session.expiresAt <= now) {
        await this.prisma.session.delete({ where: { id: sid } }).catch(() => {});
        return next();
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
      };
      req.sessionId = session.id;
    } catch {
      // не роняем запрос
    }

    next();
  }
}
