'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import type { VehicleCard } from '@/lib/api';
import { useFavorites } from '@/lib/favorites';
import { cn } from '@/lib/utils';

/**
 * Botón de corazón para guardar un vehículo en favoritos.
 *
 * Se coloca siempre *fuera* del `<Link>` de la tarjeta (como hermano, no
 * anidado) para no meter un botón dentro de un enlace, que sería HTML
 * inválido y rompería la navegación.
 */
export function FavoriteButton({
  vehicle,
  variant = 'icon',
  className,
}: {
  vehicle: VehicleCard;
  variant?: 'icon' | 'full';
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // `mounted` evita el desajuste de hidratación: en el servidor no hay
  // localStorage, así que hasta que el cliente no monta el botón se muestra
  // en estado neutro.
  const active = mounted && isFavorite(vehicle.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      title={active ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(vehicle);
      }}
      className={cn(
        'group/fav z-20 flex items-center justify-center gap-2 border transition-colors duration-300 active:scale-95',
        variant === 'icon' ? 'size-9' : 'px-4 py-2.5',
        active
          ? 'border-signal bg-signal/15 text-signal'
          : 'border-line bg-ink/70 text-smoke backdrop-blur-sm hover:border-signal hover:text-signal',
        className,
      )}
    >
      <Heart
        className={cn('size-4 transition-transform duration-300', active && 'fill-current scale-110')}
        strokeWidth={1.9}
      />
      {variant === 'full' ? (
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
          {active ? 'En favoritos' : 'Guardar'}
        </span>
      ) : null}
    </button>
  );
}
