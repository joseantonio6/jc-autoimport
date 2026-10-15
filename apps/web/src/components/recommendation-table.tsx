import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Car,
  Leaf,
  Mountain,
  Rocket,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type Segment = {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  needs: string[];
  recommend: string[];
  budget: string;
  href: string;
};

/**
 * Recomendaciones por tipo de cliente. Cada fila traduce un perfil y sus
 * necesidades a una búsqueda concreta del catálogo (`href`), de forma que la
 * tabla no es solo informativa: enlaza a las unidades que encajan.
 */
export const SEGMENTS: Segment[] = [
  {
    id: 'familia',
    icon: Users,
    title: 'Familia',
    tagline: 'Espacio, seguridad y confort para todos',
    needs: ['6 a 7 puestos', 'Seguridad y airbags', 'Maletero amplio', 'Bajo costo de mantenimiento'],
    recommend: ['SUV', 'Minivan'],
    budget: '$25,000 – $48,000',
    href: '/catalogo?bodyType=SUV',
  },
  {
    id: 'ejecutivo',
    icon: Briefcase,
    title: 'Ejecutivo urbano',
    tagline: 'Imagen, confort y eficiencia diaria',
    needs: ['Uso mixto ciudad/carretera', 'Confort y acabados premium', 'Consumo contenido'],
    recommend: ['Sedán', 'Híbrido'],
    budget: '$28,000 – $70,000',
    href: '/catalogo?bodyType=SEDAN',
  },
  {
    id: 'eco',
    icon: Leaf,
    title: 'Eco-consciente',
    tagline: 'Cero emisiones y ahorro de combustible',
    needs: ['Bajo consumo o eléctrico', 'Incentivos y exenciones', 'Tecnología y conectividad'],
    recommend: ['Eléctrico', 'Híbrido enchufable'],
    budget: '$28,000 – $65,000',
    href: '/catalogo?fuelType=ELECTRIC',
  },
  {
    id: 'aventurero',
    icon: Mountain,
    title: 'Aventurero / 4x4',
    tagline: 'Terreno difícil, carga y capacidad de remolque',
    needs: ['Tracción 4x4 o integral', 'Altura al suelo y suspensión reforzada', 'Carga y remolque'],
    recommend: ['Pickup', 'SUV 4x4'],
    budget: '$30,000 – $68,000',
    href: '/catalogo?bodyType=PICKUP',
  },
  {
    id: 'deportivo',
    icon: Rocket,
    title: 'Entusiasta deportivo',
    tagline: 'Prestaciones, diseño y emoción al volante',
    needs: ['Alta potencia', 'Diseño y exclusividad', 'Buen valor de reventa'],
    recommend: ['Coupe', 'Deportivos'],
    budget: '$55,000 en adelante',
    href: '/catalogo?bodyType=COUPE',
  },
  {
    id: 'trabajo',
    icon: Truck,
    title: 'Emprendedor / trabajo',
    tagline: 'Herramienta de trabajo rentable y resistente',
    needs: ['Capacidad de carga', 'Robustez y bajo mantenimiento', 'Representación comercial'],
    recommend: ['Pickup', 'Van'],
    budget: '$20,000 – $45,000',
    href: '/catalogo?bodyType=VAN',
  },
  {
    id: 'primer-auto',
    icon: Car,
    title: 'Primer auto / presupuesto',
    tagline: 'Economía, fácil de manejar y mantener',
    needs: ['Precio de entrada bajo', 'Bajo kilometraje', 'Repuestos accesibles'],
    recommend: ['Hatchback', 'Sedán compacto'],
    budget: 'Hasta $25,000',
    href: '/catalogo?bodyType=HATCHBACK&priceMax=25000',
  },
];

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-6 py-4 text-[10px] font-semibold tracking-[0.24em] text-ash uppercase',
        className,
      )}
    >
      {children}
    </th>
  );
}

/** Tabla de recomendaciones. En pantallas pequeñas se desplaza en horizontal. */
export function RecommendationTable({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-x-auto border border-line', className)}>
      <table className="w-full min-w-[54rem] border-collapse text-left align-top">
        <thead>
          <tr className="border-b border-line bg-ink-2">
            <Th>Perfil de cliente</Th>
            <Th>Sus necesidades</Th>
            <Th>Recomendamos</Th>
            <Th>Presupuesto</Th>
            <Th className="text-right">Explorar</Th>
          </tr>
        </thead>
        <tbody>
          {SEGMENTS.map((s) => (
            <tr
              key={s.id}
              className="group border-b border-line transition-colors duration-300 last:border-b-0 hover:bg-ink-2"
            >
              <td className="px-6 py-6 align-top">
                <div className="flex items-start gap-4">
                  <s.icon className="mt-1 size-5 shrink-0 text-signal" strokeWidth={1.5} />
                  <div>
                    <div className="font-display text-lg leading-tight text-smoke">{s.title}</div>
                    <p className="mt-1.5 max-w-[22ch] text-xs leading-relaxed text-ash">
                      {s.tagline}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6 align-top">
                <ul className="space-y-2">
                  {s.needs.map((n) => (
                    <li key={n} className="flex items-start gap-2 text-[13px] leading-snug text-ash">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-signal" />
                      {n}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-6 py-6 align-top">
                <div className="flex flex-wrap gap-1.5">
                  {s.recommend.map((r) => (
                    <span
                      key={r}
                      className="border border-line px-2.5 py-1 text-[10px] tracking-[0.14em] text-smoke uppercase"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-6 align-top font-display text-sm whitespace-nowrap text-smoke">
                {s.budget}
              </td>
              <td className="px-6 py-6 text-right align-top">
                <Link
                  href={s.href}
                  data-cursor="Ver"
                  className="group/link inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-signal uppercase transition-colors hover:text-signal-light"
                >
                  Ver unidades
                  <ArrowRight
                    className="size-3.5 transition-transform duration-500 group-hover/link:translate-x-1"
                    strokeWidth={1.8}
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Versión resumida en tarjetas, para incrustar en la portada. */
export function RecommendationTeaser() {
  return (
    <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
      {SEGMENTS.slice(0, 4).map((s) => (
        <Link
          key={s.id}
          href={s.href}
          data-cursor="Ver"
          className="group flex flex-col justify-between gap-6 bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 lg:p-7"
        >
          <div>
            <s.icon
              className="size-6 text-signal transition-transform duration-500 group-hover:-translate-y-0.5"
              strokeWidth={1.4}
            />
            <h3 className="mt-6 font-display text-lg text-smoke">{s.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ash">{s.tagline}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-ash uppercase">
              {s.budget}
            </span>
            <ArrowRight
              className="size-4 text-signal transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.7}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
