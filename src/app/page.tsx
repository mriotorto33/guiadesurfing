import { mockPronostico } from '@/lib/mocks';
import { getAllSpots } from '@/lib/wp';
import { puntaje } from '@/lib/scoring';
import { Search, Map as MapIcon, ChevronRight, Waves, Wind } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const allSpots = await getAllSpots();

  // 1. Correr el motor de scoring sobre todos los spots
  const spotsConPuntaje = allSpots.map(spot => {
    return {
      spot,
      resultado: puntaje(spot, mockPronostico)
    };
  });

  // 2. Ordenar por puntaje (Ranking)
  const ranking = [...spotsConPuntaje].sort((a, b) => b.resultado.valor - a.resultado.valor);
  const top3 = ranking.slice(0, 3);

  // 3. Mejor spot por zona
  const zonas = ['montevideo', 'costa-de-oro', 'maldonado', 'rocha'] as const;
  const topPorZona = zonas.map(zona => {
    const spotsZona = ranking.filter(s => s.spot.zona === zona);
    return spotsZona.length > 0 ? spotsZona[0] : null;
  }).filter(Boolean);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans pb-24">
      {/* HEADER / LIVE BAR */}
      <div className="bg-black text-white py-2 px-6 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
         <span className="flex items-center gap-4">
           <img 
             src="https://nuevo.guiadesurfing.com/wp-content/uploads/2026/07/cropped-logo_png.png" 
             alt="Guiadesurfing" 
             className="h-8 w-auto invert" 
           />
           <span className="hidden sm:inline">{new Date().toLocaleDateString('es-UY')}</span>
         </span>
         <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Condiciones Actualizadas
         </span>
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex flex-col justify-center items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1600')` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-6 w-full max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6">
            Dónde. <br className="md:hidden"/> Cuándo. <br className="md:hidden"/> Cómo.
          </h1>
          
          <div className="bg-white p-2 rounded-none flex items-center mb-8 max-w-xl mx-auto shadow-2xl">
            <Search className="w-6 h-6 text-gray-400 ml-3" />
            <input 
              type="text" 
              placeholder="Encontrá tu spot ideal hoy..." 
              className="w-full bg-transparent border-none focus:outline-none px-4 py-3 text-lg font-medium"
            />
            <button className="bg-black text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
              Buscar
            </button>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="#ranking" className="bg-white text-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">
              Ver Condiciones
            </Link>
            <Link href="/spots" className="border-2 border-white text-white px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
              <MapIcon className="w-4 h-4" /> Ver Spots
            </Link>
          </div>
        </div>
      </section>

      {/* ¿DÓNDE SURFEAR HOY? (RANKING) */}
      <section id="ranking" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-12 text-center">
          ¿Dónde surfear hoy?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {top3.map((item, index) => (
            <Link key={item.spot.slug} href={`/spots/${item.spot.slug}`} className="group block">
              <div className="relative bg-gray-100 p-8 pt-12 border-4 border-transparent hover:border-black transition-all h-full">
                {/* Badge Posición */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white w-12 h-12 flex items-center justify-center font-black text-xl rotate-45 group-hover:rotate-0 transition-transform">
                  <span className={index === 0 ? "" : "-rotate-45 group-hover:rotate-0"}>#{index + 1}</span>
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-center">{item.spot.nombre}</h3>
                <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">{item.spot.zona.replace('-', ' ')}</p>
                
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 bg-white shadow-lg flex items-center justify-center rotate-45">
                    <span className="text-4xl font-black -rotate-45" style={{ color: item.resultado.valor >= 7 ? '#34D399' : '#FBBF24' }}>
                      {item.resultado.valor}
                    </span>
                  </div>
                </div>
                
                <p className="text-center font-medium text-gray-700 italic">"{item.resultado.frase}"</p>
              </div>
            </Link>
          ))}
        </div>

        {/* MEJOR POR ZONA */}
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8 border-b-4 border-black pb-2 inline-block">El mejor spot por zona</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {topPorZona.map((item) => (
            item && (
              <Link key={item.spot.slug} href={`/spots/${item.spot.slug}`} className="bg-gray-50 border border-gray-200 p-4 hover:border-black transition-colors flex justify-between items-center group">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.spot.zona.replace('-', ' ')}</p>
                  <p className="font-black uppercase text-lg">{item.spot.nombre}</p>
                </div>
                <div className="font-black text-xl flex items-center gap-1">
                  {item.resultado.valor} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            )
          ))}
        </div>
      </section>

      {/* EXPLORA URUGUAY */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-12">Explorá Uruguay</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {zonas.map(zona => (
              <div key={zona} className="relative aspect-[4/5] bg-gray-800 overflow-hidden group cursor-pointer">
                <img src={`https://images.unsplash.com/photo-1520116468816-95b69f847357?w=600`} alt={zona} className="object-cover w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-black uppercase">{zona.replace('-', ' ')}</h3>
                  <p className="text-sm font-bold tracking-widest text-gray-300 mt-2">VER SPOTS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 text-center">
        <div className="w-16 h-16 bg-white mx-auto rotate-45 mb-12 flex items-center justify-center">
          <Waves className="w-8 h-8 text-black -rotate-45" />
        </div>
        <img 
           src="https://nuevo.guiadesurfing.com/wp-content/uploads/2026/07/cropped-logo_png.png" 
           alt="Guiadesurfing" 
           className="h-12 w-auto invert mx-auto mb-4" 
        />
        <p className="text-gray-500 font-medium text-sm tracking-widest uppercase mt-4">Desde 2011</p>
      </footer>
    </main>
  );
}
