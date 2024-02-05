import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decarator';
import { UserUpdateDto } from './dto/userUpdate.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('profile')
  @Auth()
  getById(@User('id') id: number) {
    return this.usersService.profile(id);
  }

  @Get('all-user')
  @Auth('admin')
  getAllUser() {
    return this.usersService.getAllUser();
  }
  @Patch('add-name')
  @HttpCode(200)
  @Auth()
  addUserName(@User('id') id: number, @Body() addUserName: { name: string }) {
    return this.usersService.addUserName(id, addUserName);
  }
  @Put('update/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  updateUser(@Param() param: { id: string }, @Body() body: UserUpdateDto) {
    return this.usersService.updateUser(param, body);
  }
}
