import { describe, it, expect } from 'vitest';
import { puntaje } from './index';
import { Spot, Pronostico } from '../../types/scoring';

const mockSpot: Spot = {
  slug: 'montoya',
  nombre: 'Montoya',
  localidad: 'La Barra',
  zona: 'maldonado',
  lat: -34.91,
  lng: -54.86,
  swellIdeal: ['SE', 'E'],
  swellTolerable: ['S'],
  vientoIdeal: ['NO', 'N'],
  tamanoMin: 0.8,
  tamanoMax: 2.0,
  periodoMin: 8,
  mareaIdeal: ['baja', 'media'],
  tipoOla: 'Derechas e izquierdas',
  fondo: 'arena',
  nivel: 'intermedio',
  consistencia: 'alta',
  descripcion: '...',
  servicios: [],
  galeria: [],
};

describe('Motor de Scoring', () => {
  it('Debe calcular un día perfecto como EXCELENTE', () => {
    const pronostico: Pronostico = {
      swellDireccion: 'SE',
      swellTamano: 1.5,
      swellPeriodo: 10,
      vientoDireccion: 'NO',
      vientoVelocidad: 15,
    };
    
    const resultado = puntaje(mockSpot, pronostico);
    
    expect(resultado.valor).toBeGreaterThanOrEqual(9.0);
    expect(resultado.etiqueta).toBe('EXCELENTE');
    expect(resultado.frase).toContain('ideal del SE');
    expect(resultado.frase).toContain('offshore divino del NO');
  });

  it('Debe calcular un día plano como MALO', () => {
    const pronostico: Pronostico = {
      swellDireccion: 'SE',
      swellTamano: 0.1, // muy chico
      swellPeriodo: 5,
      vientoDireccion: 'NO',
      vientoVelocidad: 10,
    };
    
    const resultado = puntaje(mockSpot, pronostico);
    
    expect(resultado.valor).toBeLessThan(3.0);
    expect(resultado.etiqueta).toBe('MALO');
  });

  it('Debe penalizar un swell correcto con viento arruinado', () => {
    const pronostico: Pronostico = {
      swellDireccion: 'SE', // Swell perfecto
      swellTamano: 1.5,
      swellPeriodo: 10,
      vientoDireccion: 'SE', // Viento onshore directo
      vientoVelocidad: 22, // Fuerte
    };
    
    const resultado = puntaje(mockSpot, pronostico);
    
    expect(resultado.valor).toBeLessThan(6.0); // Penalización global
    expect(resultado.frase).toContain('viento pega de frente del SE');
  });

  it('Debe calcular un swell de dirección incorrecta como REGULAR o MALO', () => {
    const pronostico: Pronostico = {
      swellDireccion: 'NO', // Opuesto
      swellTamano: 1.5,
      swellPeriodo: 9,
      vientoDireccion: 'NO',
      vientoVelocidad: 10,
    };
    
    const resultado = puntaje(mockSpot, pronostico);
    
    expect(resultado.valor).toBeLessThan(6.0);
    expect(resultado.frase).toContain('cruzado del NO');
  });
  
  it('Debe asignar MALO sin importar la dirección si el viento es mayor a 25km/h', () => {
    const pronostico: Pronostico = {
      swellDireccion: 'SE', // Perfecto
      swellTamano: 1.5,
      swellPeriodo: 10,
      vientoDireccion: 'NO', // Perfecto
      vientoVelocidad: 30, // Vendaval
    };
    
    const resultado = puntaje(mockSpot, pronostico);
    
    expect(resultado.valor).toBeLessThan(7.5);
    expect(resultado.frase).toContain('inmanejable');
  });
});
