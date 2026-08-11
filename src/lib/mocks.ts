import { Spot, Pronostico } from '@/types/scoring';

export const mockSpots: Record<string, Spot> = {
  montoya: {
    slug: 'montoya',
    nombre: 'Montoya',
    localidad: 'La Barra',
    zona: 'maldonado',
    lat: -34.9189,
    lng: -54.8569,
    swellIdeal: ['S', 'SE'],
    swellTolerable: ['E'],
    vientoIdeal: ['NO', 'N'],
    tamanoMin: 0.8,
    tamanoMax: 2.5,
    periodoMin: 9,
    mareaIdeal: ['baja', 'media'],
    tipoOla: 'Derechas e izquierdas tuberas',
    fondo: 'arena',
    nivel: 'avanzado',
    consistencia: 'alta',
    descripcion: 'Una de las olas más potentes de La Barra. Rompe cerca de la orilla sobre un banco de arena firme, ideal para tubos rápidos cuando entra swell del sur. Funciona mejor con marea baja a media subiendo.',
    servicios: ['Parador', 'Estacionamiento', 'Salvavidas'],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', tags: ['clásico', 'derecha'] },
      { url: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?w=800', tags: ['grande'] }
    ],
    camara: {
      tipo: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      estado: 'live',
      ultimaActualizacion: 'hace 5 min'
    }
  },
  'la-aguada': {
    slug: 'la-aguada',
    nombre: 'La Aguada',
    localidad: 'La Paloma',
    zona: 'rocha',
    lat: -34.65,
    lng: -54.15,
    swellIdeal: ['S', 'SO'],
    swellTolerable: ['SE'],
    vientoIdeal: ['N', 'NE'],
    tamanoMin: 0.5,
    tamanoMax: 2.0,
    periodoMin: 7,
    mareaIdeal: ['baja', 'media'],
    tipoOla: 'Derechas largas y suaves',
    fondo: 'arena',
    nivel: 'principiante',
    consistencia: 'media',
    descripcion: 'Punto clásico de Rocha, reparado del viento sur. Ideal para longboard o cuando el mar está muy grande en mar abierto.',
    servicios: ['Baños', 'Escuela de surf'],
    galeria: []
  },
  'honda': {
    slug: 'honda',
    nombre: 'La Honda',
    localidad: 'Malvín',
    zona: 'montevideo',
    lat: -34.89,
    lng: -56.10,
    swellIdeal: ['S', 'SO'],
    swellTolerable: ['SE'],
    vientoIdeal: ['N', 'NE', 'NO'],
    tamanoMin: 1.0,
    tamanoMax: 2.5,
    periodoMin: 8,
    mareaIdeal: ['media', 'alta'],
    tipoOla: 'Izquierdas y derechas',
    fondo: 'arena',
    nivel: 'intermedio',
    consistencia: 'baja',
    descripcion: 'Spot urbano en Montevideo que despierta solo con grandes tormentas del sur. Rompe con fuerza.',
    servicios: ['Duchas', 'Estacionamiento'],
    galeria: []
  }
};

export const mockPronostico: Pronostico = {
  swellDireccion: 'SE',
  swellTamano: 1.5,
  swellPeriodo: 12,
  vientoDireccion: 'NO',
  vientoVelocidad: 15
};
