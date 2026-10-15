import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Search, ShieldCheck, Wallet } from 'lucide-react';
import { Button, Eyebrow } from '@/components/ui';
import { Reveal, SectionLabel } from '@/components/motion';
import { RecommendationTable } from '@/components/recommendation-table';

export const metadata: Metadata = {
  title: 'Recomendaciones por tipo de cliente',
  description:
    '¿No sabes qué auto importar? Encuentra la recomendación según tu perfil: familia, ejecutivo, eco-consciente, aventurero, deportivo, trabajo o primer auto. Con presupuesto orientativo y acceso directo al catálogo.',
};

const PILLARS = [
  {
    icon: Compass,
    title: 'Partimos del uso real',
    text: 'No vendemos el auto de moda: cruzamos tu día a día, la cantidad de pasajeros y las vías que usas con lo que el mercado de origen tiene disponible.',
  },
  {
    icon: Wallet,
    title: 'Encajamos el presupuesto',
    text: 'El rango de cada perfil ya incluye importación, nacionalización, taller y matrícula, para que no haya sorpresas al final del proceso.',
  },
  {
    icon: ShieldCheck,
    title: 'Filtramos por fiabilidad',
    text: 'Priorizamos unidades con historial verificado y repuestos accesibles en el país, no solo la ficha más llamativa del catálogo.',
  },
];

export default function Page() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="relative flex min-h-[64svh] items-end overflow-hidden pt-18">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(/media/backgrounds/bg-photo-1502877338535-766e1452684a.webp)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/50 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/10 to-transparent" />
        <div className="container-x relative w-full py-16 lg:py-24">
          <Eyebrow index="Guía de compra">Recomendaciones por perfil</Eyebrow>
          <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.4rem,7.5vw,6.5rem)] leading-[0.88] text-smoke">
            El auto correcto
            <br />
            <span className="text-signal">para ti.</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-relaxed text-ash md:text-base">
            Cada cliente tiene una necesidad distinta. Esta tabla traduce los perfiles más comunes a
            una recomendación concreta, con el presupuesto en destino y un acceso directo a las
            unidades que encajan.
          </p>
        </div>
      </section>

      {/* ============================== TABLE ============================== */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index="01">Tipos de cliente</SectionLabel>
              <h2 className="mt-5 max-w-[16ch] font-display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-[0.95] text-smoke">
                Encuentra tu <span className="text-signal">perfil</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ash">
              Los presupuestos son orientativos y de venta final en destino. Si tu caso no encaja en
              ninguno, lo buscamos por encargo.
            </p>
          </div>

          <Reveal className="mt-12">
            <RecommendationTable />
          </Reveal>
        </div>
      </section>

      {/* ============================== HOW WE CHOOSE ============================== */}
      <section className="border-y border-line bg-ink-2 py-20 lg:py-24">
        <div className="container-x">
          <SectionLabel index="02">Cómo armamos cada recomendación</SectionLabel>
          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full bg-ink-2 p-8 transition-colors duration-500 hover:bg-ink-3 lg:p-10">
                  <p.icon className="size-6 text-signal" strokeWidth={1.4} />
                  <h3 className="mt-6 font-display text-lg text-smoke">{p.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ash">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(/media/backgrounds/bg-photo-1511919884226-fd3cad34687c.webp)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink" />
        <div className="container-x relative text-center">
          <Reveal>
            <Eyebrow className="justify-center">¿Aún con dudas?</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(1.8rem,5vw,3.6rem)] leading-[0.95] text-smoke">
              Te ayudamos a elegir <span className="text-signal">sin compromiso.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-ash">
              Cuéntanos cómo usas el auto y tu presupuesto: te proponemos las mejores opciones y las
              conseguimos en el mercado de origen.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/contacto" cursor="Hablar">
                Solicitar asesoría
              </Button>
              <Button href="/catalogo" variant="outline" cursor="Ver">
                Ver catálogo completo
              </Button>
            </div>
            <p className="mt-8 text-[11px] tracking-[0.18em] text-ash/70 uppercase">
              ¿Ya sabes qué te gusta?{' '}
              <Link href="/favoritos" className="text-signal hover:text-signal-light">
                Revisa tus favoritos
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
