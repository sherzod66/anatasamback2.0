import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ElectronicService } from './electronic.service';
import { CreateElectronicDto } from './dto/create-electronic.dto';
import { UpdateElectronicDto } from './dto/update-electronic.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/users/decorators/user.decarator';

@Controller('electronic')
export class ElectronicController {
  constructor(private readonly electronicService: ElectronicService) {}

  @Post('create')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  create(
    @Body() createElectronicDto: CreateElectronicDto,
    @User('id') userId: number,
  ) {
    return this.electronicService.create(createElectronicDto, userId);
  }

  @Get()
  @Auth('admin')
  findAll() {
    return this.electronicService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.electronicService.findById(+id);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: string) {
    return this.electronicService.remove(+id);
  }
}
