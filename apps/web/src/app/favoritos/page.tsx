import type { Metadata } from 'next';
import { FavoritesPage } from '@/components/favorites-page';

export const metadata: Metadata = {
  title: 'Mis favoritos',
  description:
    'Tu selección de vehículos guardados. Compáralos y solicita una cotización cuando estés listo.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FavoritesPage />;
}
