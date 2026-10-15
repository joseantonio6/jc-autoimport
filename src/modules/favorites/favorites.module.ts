import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { FavoritesService } from './domain/favorites.service.js';
import { FavoritesController } from './infrastructure/favorites.controller.js';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
