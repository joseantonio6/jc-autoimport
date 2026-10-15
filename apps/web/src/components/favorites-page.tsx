'use client';

import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { useFavorites } from '@/lib/favorites';
import { VehicleCardItem } from './vehicle-card';
import { Button, Eyebrow } from './ui';

/**
 * Selección de favoritos. Con sesión se leen y guardan en el servidor (API);
 * sin sesión se usa el respaldo local del navegador. El proveedor decide.
 */
export function FavoritesPage() {
  const { items, ready, count, clear, mode } = useFavorites();

  return (
    <>
      {/* ============================== HEADER ============================== */}
      <section className="relative overflow-hidden border-b border-line pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-2 to-ink" />
        <div className="container-x relative">
          <Eyebrow index="Favoritos">Tu selección guardada</Eyebrow>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-[clamp(2.2rem,6vw,5rem)] leading-[0.9] text-smoke">
              Favoritos<span className="text-signal">.</span>
            </h1>
            {ready && count > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-ash uppercase transition-colors hover:border-signal hover:text-signal"
              >
                <Trash2 className="size-3.5" strokeWidth={1.7} />
                Vaciar selección
              </button>
            ) : null}
          </div>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">
            {mode === 'server'
              ? 'Los vehículos que marcas con el corazón quedan guardados en tu cuenta, disponibles en cualquier dispositivo. Guárdalos, compáralos y solicita una cotización cuando estés listo.'
              : 'Los vehículos que marcas con el corazón quedan guardados en este navegador. Inicia sesión para conservarlos en tu cuenta y verlos en cualquier dispositivo.'}
          </p>
        </div>
      </section>

      {/* ============================== RESULTS ============================== */}
      <section className="container-x py-12 lg:py-16">
        {!ready ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-ink-3" />
                <div className="space-y-2.5 pt-5">
                  <div className="h-2.5 w-16 bg-ink-3" />
                  <div className="h-6 w-40 bg-ink-3" />
                  <div className="h-5 w-28 bg-ink-3" />
                </div>
              </div>
            ))}
          </div>
        ) : count === 0 ? (
          <div className="border border-line px-6 py-24 text-center">
            <div className="mx-auto flex size-14 items-center justify-center border border-signal/40 text-signal">
              <Heart className="size-6" strokeWidth={1.5} />
            </div>
            <h2 className="mt-8 font-display text-2xl text-smoke">Aún no tienes favoritos</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ash">
              Explora el catálogo y toca el corazón de los vehículos que te interesen. Se guardarán
              en tu selección para que los compares con calma.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/catalogo">Explorar catálogo</Button>
              <Button href="/recomendaciones" variant="outline">
                Ver recomendaciones
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-10 text-[10px] tracking-[0.24em] text-ash uppercase">
              {count} {count === 1 ? 'vehículo guardado' : 'vehículos guardados'}
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((v, i) => (
                <VehicleCardItem key={v.id} vehicle={v} index={i % 12} priority={i < 3} />
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link
                href="/catalogo"
                className="text-[11px] font-semibold tracking-[0.24em] text-smoke uppercase transition-colors hover:text-signal"
              >
                Seguir explorando el catálogo
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
