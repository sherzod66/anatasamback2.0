import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Post()
  // getToken() {
  //   return this.authService.generateToken();
  // }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  auth(@Body() register: authDto) {
    return this.authService.auth(register);
  }
  @HttpCode(200)
  @Post('confirmation/:key')
  confirmation(@Param() key: { key: string }) {
    return this.authService.confirmationNumber(key);
  }
}
