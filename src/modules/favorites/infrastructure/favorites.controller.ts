import 'reflect-metadata';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from '../domain/favorites.service.js';
import { AddFavoriteDto } from './dto/favorite.dto.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller('api/v1/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los vehículos favoritos del usuario autenticado' })
  list(@CurrentUser('sub') userId: string) {
    return this.favoritesService.list(userId);
  }

  @Get('ids')
  @ApiOperation({ summary: 'Lista solo los ids favoritos (comprobación rápida)' })
  listIds(@CurrentUser('sub') userId: string) {
    return this.favoritesService.listIds(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Añade un vehículo a favoritos (idempotente)' })
  add(@CurrentUser('sub') userId: string, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.add(userId, dto.vehicleId);
  }

  @Delete()
  @ApiOperation({ summary: 'Vacía todos los favoritos del usuario autenticado' })
  clear(@CurrentUser('sub') userId: string) {
    return this.favoritesService.clear(userId);
  }

  @Delete(':vehicleId')
  @ApiOperation({ summary: 'Quita un vehículo de favoritos' })
  remove(@CurrentUser('sub') userId: string, @Param('vehicleId') vehicleId: string) {
    return this.favoritesService.remove(userId, vehicleId);
  }
}
