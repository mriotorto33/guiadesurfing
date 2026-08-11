export type Direccion = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SO' | 'O' | 'NO';

export type Marea = 'baja' | 'media' | 'alta';

export type Spot = {
  slug: string;
  nombre: string;
  localidad: string;
  zona: 'montevideo' | 'costa-de-oro' | 'maldonado' | 'rocha';
  lat: number;
  lng: number;

  // Condiciones ideales
  swellIdeal: Direccion[];
  swellTolerable: Direccion[];
  vientoIdeal: Direccion[];
  tamanoMin: number;
  tamanoMax: number;
  periodoMin: number;
  mareaIdeal: Marea[];

  // Ficha
  tipoOla: string;
  fondo: 'arena' | 'roca' | 'mixto';
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  consistencia: 'baja' | 'media' | 'alta';
  descripcion: string;
  servicios: string[];
  galeria: any[]; // Se definirá luego

  camara?: {
    tipo: 'youtube' | 'hls' | 'iframe';
    url: string;
    estado: 'live' | 'offline';
    ultimaActualizacion?: string;
  };
};

export type Pronostico = {
  swellDireccion: Direccion;
  swellTamano: number; // en metros
  swellPeriodo: number; // en segundos
  vientoDireccion: Direccion;
  vientoVelocidad: number; // en km/h
};

export type ResultadoScoring = {
  valor: number; // 0 a 10
  etiqueta: string; // EXCELENTE, MUY BUENO, etc.
  frase: string; // Ej: "Entrando swell del SE..."
};
