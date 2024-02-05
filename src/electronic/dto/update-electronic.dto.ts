import { PartialType } from '@nestjs/mapped-types';
import { CreateElectronicDto } from './create-electronic.dto';

export class UpdateElectronicDto extends PartialType(CreateElectronicDto) {}
