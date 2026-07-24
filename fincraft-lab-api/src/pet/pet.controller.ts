import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetEnvelopeDto } from './dto/pet-response.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import {
  ApiCreatePet,
  ApiGetMyPet,
  ApiUpdatePet,
} from './openapi/pet-openapi.decorators';
import { PetService } from './pet.service';

@ApiTags('Pets')
@ApiBearerAuth('access-token')
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get('me')
  @ApiGetMyPet()
  async getMyPet(
    @CurrentUser() user: AccessTokenPayload,
  ): Promise<PetEnvelopeDto> {
    const data = await this.petService.getMyPet(user.sub);
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatePet()
  async createPet(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreatePetDto,
  ): Promise<PetEnvelopeDto> {
    const data = await this.petService.createPet(user.sub, dto);
    return { data };
  }

  @Patch('me')
  @ApiUpdatePet()
  async updatePet(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: UpdatePetDto,
  ): Promise<PetEnvelopeDto> {
    const data = await this.petService.updatePet(user.sub, dto);
    return { data };
  }
}
