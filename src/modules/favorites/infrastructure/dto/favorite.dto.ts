import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AddFavoriteDto {
  @ApiProperty({ description: 'Id del vehículo que se guarda en favoritos' })
  @IsString()
  @MinLength(1)
  vehicleId!: string;
}
