import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const { sessionId } = await this.authService.login(dto.email, dto.password);

    res.cookie('sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return { success: true };
  }

  @Post('auth/logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const sid = req.cookies?.sid;
    await this.authService.logout(sid);
    res.clearCookie('sid', { path: '/' });
    return { success: true };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@Req() req: any) {
    const user = req.user;
    return this.authService.profile(user.id);
  }
}
