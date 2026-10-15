import 'reflect-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';

/**
 * Campos que la tarjeta de vehículo necesita. Se mantiene alineado con el
 * `summarySelect` de `VehiclesRepository` para que un favorito se pinte igual
 * que un vehículo del catálogo (misma forma de `VehicleCard` en la web).
 */
const favoriteVehicleSelect = {
  id: true,
  slug: true,
  brand: true,
  model: true,
  year: true,
  price: true,
  mileage: true,
  fuelType: true,
  bodyType: true,
  transmission: true,
  driveType: true,
  horsepower: true,
  color: true,
  status: true,
  isFeatured: true,
  createdAt: true,
  primaryImageUrl: true,
  thumbnailUrl: true,
} as const;

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Favoritos del usuario, del más reciente al más antiguo. */
  async list(userId: string) {
    const rows = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        vehicle: { select: favoriteVehicleSelect },
      },
    });

    return rows.map((row) => ({
      ...row.vehicle,
      price: Number(row.vehicle.price),
      favoritedAt: row.createdAt,
    }));
  }

  /** Solo los ids, para comprobar pertenencia sin traer los vehículos. */
  async listIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { vehicleId: true },
    });
    return rows.map((row) => row.vehicleId);
  }

  /** Idempotente: guardar dos veces el mismo vehículo no duplica ni falla. */
  async add(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return this.prisma.favorite.upsert({
      where: { userId_vehicleId: { userId, vehicleId } },
      create: { userId, vehicleId },
      update: {},
      select: { id: true, vehicleId: true, createdAt: true },
    });
  }

  async remove(userId: string, vehicleId: string) {
    await this.prisma.favorite.deleteMany({ where: { userId, vehicleId } });
    return { success: true };
  }

  async clear(userId: string) {
    const result = await this.prisma.favorite.deleteMany({ where: { userId } });
    return { success: true, removed: result.count };
  }
}
