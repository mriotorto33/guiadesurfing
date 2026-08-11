import { mockPronostico } from '@/lib/mocks';
import { getAllSpots } from '@/lib/wp';
import { puntaje } from '@/lib/scoring';
import { Compass, Wind, Navigation, MapPin, Camera, Star, Share, Map, Info, Waves } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const spots = await getAllSpots();
  return spots.map((spot) => ({
    slug: spot.slug,
  }));
}

export default async function SpotPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const spots = await getAllSpots();
  const spot = spots.find(s => s.slug === resolvedParams.slug);
  
  if (!spot) notFound();

  // En producción esto viene de la API de clima en base a lat/lng
  const result = puntaje(spot, mockPronostico);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans pb-24">
      {/* HERO SECTION */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex flex-col justify-end overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 md:p-12 md:max-w-6xl mx-auto w-full text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="uppercase tracking-[0.2em] text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {spot.localidad}, {spot.zona.replace('-', ' ')}
              </p>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
                {spot.nombre}
              </h1>
              <div className="flex items-center gap-4 text-sm md:text-base font-medium opacity-90">
                <span className="flex items-center gap-1"><Waves className="w-4 h-4"/> Swell {mockPronostico.swellDireccion} {mockPronostico.swellTamano}m</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Wind className="w-4 h-4"/> Viento {mockPronostico.vientoDireccion} {mockPronostico.vientoVelocidad}km/h</span>
              </div>
            </div>

            {/* Score Diamond */}
            <div className="flex flex-col items-center md:items-end">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-white rotate-45 shadow-2xl" />
                <div className="relative z-10 text-center">
                  <span className="block text-5xl md:text-6xl font-black text-gray-900 leading-none tracking-tighter">
                    {result.valor}
                  </span>
                  <span className="block text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">
                    / 10
                  </span>
                </div>
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-center w-full md:text-right" 
                 style={{ color: result.valor >= 7 ? '#34D399' : '#FBBF24' }}>
                {result.etiqueta}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="bg-white text-black px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Star className="w-4 h-4" /> Guardar
            </button>
            <button className="border border-white text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Cómo llegar
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="md:col-span-2 space-y-12">
          
          {/* Interpretación */}
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
              <Info className="w-6 h-6" /> Condición Actual
            </h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-700">
              "{result.frase}"
            </p>
          </section>

          {/* Cómo Funciona */}
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2 inline-block">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-serif">
              {spot.descripcion}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-gray-100 px-4 py-2 text-sm font-bold uppercase tracking-wide">Fondo: {spot.fondo}</div>
              <div className="bg-gray-100 px-4 py-2 text-sm font-bold uppercase tracking-wide">Nivel: {spot.nivel}</div>
              <div className="bg-gray-100 px-4 py-2 text-sm font-bold uppercase tracking-wide">Olas: {spot.tipoOla}</div>
            </div>
          </section>

          {/* Galería con filtros */}
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Galería</h2>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button className="bg-black text-white px-4 py-1 text-sm font-bold uppercase">Todos</button>
              <button className="border border-gray-300 px-4 py-1 text-sm font-bold uppercase hover:bg-gray-100">Clásico</button>
              <button className="border border-gray-300 px-4 py-1 text-sm font-bold uppercase hover:bg-gray-100">Tubos</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {spot.galeria.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-200 overflow-hidden relative group">
                  <img src={img.url} alt="Surf" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>

          {/* Servicios */}
          <section>
             <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Servicios</h2>
             <div className="flex flex-wrap gap-4">
               {spot.servicios.map(srv => (
                 <div key={srv} className="flex items-center gap-2 border border-gray-200 px-4 py-3 bg-gray-50">
                    <span className="font-semibold text-sm uppercase tracking-wide">{srv}</span>
                 </div>
               ))}
             </div>
          </section>

        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="space-y-12">
          
          {/* Condiciones Ideales */}
          <section className="bg-gray-900 text-white p-6 relative overflow-hidden">
            {/* Diamond decorative */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rotate-45" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Condiciones Ideales</h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 uppercase tracking-widest text-xs">Swell</span>
                <span>{spot.swellIdeal.join(', ')}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 uppercase tracking-widest text-xs">Viento</span>
                <span>{spot.vientoIdeal.join(', ')}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400 uppercase tracking-widest text-xs">Tamaño</span>
                <span>{spot.tamanoMin}m - {spot.tamanoMax}m</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-400 uppercase tracking-widest text-xs">Marea</span>
                <span className="capitalize">{spot.mareaIdeal.join(', ')}</span>
              </div>
            </div>
          </section>

          {/* Cámara */}
          <section className="border-4 border-gray-900 p-1">
            <div className="bg-gray-100 aspect-video relative flex items-center justify-center">
               <Camera className="w-12 h-12 text-gray-300" />
               <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 flex items-center gap-1 animate-pulse">
                 <div className="w-1.5 h-1.5 bg-white rounded-full" /> EN VIVO
               </div>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Última act. {spot.camara?.ultimaActualizacion}</p>
            </div>
          </section>
          
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="border-t-8 border-black w-full mt-12 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
           <h2 className="text-3xl font-black uppercase tracking-tight mb-6">¿No está bueno acá?</h2>
           <Link href="/encontra-tu-spot" className="inline-block bg-black text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
             Ver otros spots
           </Link>
        </div>
      </div>
    </main>
  );
}
