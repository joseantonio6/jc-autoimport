'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api, type VehicleCard } from './api';

/**
 * Selección de favoritos.
 *
 * La fuente de verdad es el **servidor** (tabla `favorites`, vía la API): así la
 * selección sigue al usuario entre dispositivos y navegadores. Para visitantes
 * sin sesión se mantiene un respaldo en `localStorage`; al iniciar sesión esos
 * favoritos de invitado se fusionan con los de la cuenta y el respaldo se borra.
 */
const STORAGE_KEY = 'jca_favorites';

/** Evento que disparan login/logout para que el proveedor se re-sincronice. */
export const AUTH_CHANGED_EVENT = 'jca:auth-changed';

export function notifyAuthChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

/** Recorta un vehículo a los campos que la tarjeta necesita, para no llenar
 *  `localStorage` con galerías y especificaciones completas. */
export function toFavorite(v: VehicleCard): VehicleCard {
  return {
    id: v.id,
    slug: v.slug,
    brand: v.brand,
    model: v.model,
    year: v.year,
    price: v.price,
    originalPrice: v.originalPrice ?? null,
    mileage: v.mileage,
    fuelType: v.fuelType,
    bodyType: v.bodyType,
    transmission: v.transmission,
    driveType: v.driveType,
    horsepower: v.horsepower,
    color: v.color,
    status: v.status,
    isFeatured: v.isFeatured,
    countryOfOrigin: v.countryOfOrigin ?? null,
    primaryImageUrl: v.primaryImageUrl ?? null,
    thumbnailUrl: v.thumbnailUrl ?? null,
    primaryImage: v.primaryImage ?? null,
  };
}

type Mode = 'guest' | 'server';

type FavoritesValue = {
  items: VehicleCard[];
  count: number;
  ready: boolean;
  /** `server` = guardado en la cuenta; `guest` = solo en este navegador. */
  mode: Mode;
  isFavorite: (id: string) => boolean;
  toggle: (vehicle: VehicleCard) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

function readStored(): VehicleCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is VehicleCard =>
        Boolean(
          v &&
            typeof v === 'object' &&
            typeof (v as VehicleCard).id === 'string' &&
            typeof (v as VehicleCard).slug === 'string',
        ),
    );
  } catch {
    return [];
  }
}

function writeStored(items: VehicleCard[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* almacenamiento no disponible */
  }
}

function clearStored(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<VehicleCard[]>([]);
  const [mode, setMode] = useState<Mode>('guest');
  const [ready, setReady] = useState(false);

  // Refs para que `toggle`/`remove`/`clear` no dependan del render actual.
  const itemsRef = useRef<VehicleCard[]>([]);
  const modeRef = useRef<Mode>('guest');
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const load = useCallback(async () => {
    try {
      const serverItems = await api.favorites();
      const guest = readStored();
      if (guest.length > 0) {
        // Fusionar los favoritos de invitado con los de la cuenta (idempotente).
        await Promise.allSettled(guest.map((g) => api.addFavorite(g.id)));
        clearStored();
        setItems(await api.favorites());
      } else {
        setItems(serverItems);
      }
      setMode('server');
    } catch {
      // Sin sesión (o API caída): modo invitado con respaldo local.
      setItems(readStored());
      setMode('guest');
    } finally {
      setReady(true);
    }
  }, []);

  // Carga inicial (solo en el cliente: `localStorage` no existe en el servidor).
  useEffect(() => {
    void load();
  }, [load]);

  // Re-sincronizar cuando el usuario inicia o cierra sesión.
  useEffect(() => {
    const onChange = () => {
      void load();
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
  }, [load]);

  // Persistir en `localStorage` solo en modo invitado.
  useEffect(() => {
    if (!ready || mode !== 'guest') return;
    writeStored(items);
  }, [items, mode, ready]);

  // Mantener sincronizadas las demás pestañas (solo invitado).
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && modeRef.current === 'guest') setItems(readStored());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const toggle = useCallback((vehicle: VehicleCard) => {
    const favorite = toFavorite(vehicle);
    const exists = itemsRef.current.some((v) => v.id === favorite.id);

    // Actualización optimista.
    setItems((prev) =>
      exists ? prev.filter((v) => v.id !== favorite.id) : [favorite, ...prev],
    );

    if (modeRef.current === 'server') {
      const call = exists ? api.removeFavorite(favorite.id) : api.addFavorite(favorite.id);
      void call.catch(() => {
        // Revertir si el servidor rechaza (p. ej. sesión expirada).
        setItems((prev) =>
          exists
            ? [favorite, ...prev.filter((v) => v.id !== favorite.id)]
            : prev.filter((v) => v.id !== favorite.id),
        );
      });
    }
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((v) => v.id !== id));
    if (modeRef.current === 'server') {
      void api.removeFavorite(id).catch(() => {
        /* se re-sincroniza al recargar */
      });
    }
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    if (modeRef.current === 'server') {
      void api.clearFavorites().catch(() => {
        /* se re-sincroniza al recargar */
      });
    } else {
      clearStored();
    }
  }, []);

  const value = useMemo<FavoritesValue>(() => {
    const set = new Set(items.map((v) => v.id));
    return {
      items,
      count: items.length,
      ready,
      mode,
      isFavorite: (id: string) => set.has(id),
      toggle,
      remove,
      clear,
    };
  }, [items, ready, mode, toggle, remove, clear]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>');
  return ctx;
}
