import { Spot, Pronostico, ResultadoScoring, Direccion } from "../../types/scoring";

const RUMBOS: Direccion[] = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

function getDistanciaDireccion(dir1: Direccion, dir2: Direccion): number {
  const i1 = RUMBOS.indexOf(dir1);
  const i2 = RUMBOS.indexOf(dir2);
  const dist = Math.abs(i1 - i2);
  return Math.min(dist, 8 - dist);
}

function esAdyacente(dir1: Direccion, dir2: Direccion): boolean {
  return getDistanciaDireccion(dir1, dir2) === 1;
}

export function puntaje(spot: Spot, pronostico: Pronostico): ResultadoScoring {
  // 1. Swell (Peso 35%)
  let subSwell = 0;
  
  if (spot.swellIdeal.includes(pronostico.swellDireccion)) {
    subSwell = 10;
  } else if (
    spot.swellTolerable.includes(pronostico.swellDireccion) ||
    spot.swellIdeal.some(ideal => esAdyacente(ideal, pronostico.swellDireccion))
  ) {
    subSwell = 6;
  } else {
    // Calculamos la distancia mínima a los ideales
    const minDist = Math.min(...spot.swellIdeal.map(ideal => getDistanciaDireccion(ideal, pronostico.swellDireccion)));
    if (minDist === 2) subSwell = 4;
    else if (minDist === 3) subSwell = 2;
    else subSwell = 0; // Opuesto (minDist === 4)
  }

  // 2. Viento (Peso 30%)
  let subViento = 0;
  if (pronostico.vientoVelocidad < 5) {
    subViento = 10; // Glass, no importa la dirección
  } else if (pronostico.vientoVelocidad > 25) {
    subViento = 0; // Demasiado viento, arruina todo
  } else {
    // Puntuación base por dirección
    let windDirScore = 0;
    if (spot.vientoIdeal.includes(pronostico.vientoDireccion)) {
      windDirScore = 10;
    } else {
      const minDist = Math.min(...spot.vientoIdeal.map(ideal => getDistanciaDireccion(ideal, pronostico.vientoDireccion)));
      if (minDist === 1) windDirScore = 8;
      else if (minDist === 2) windDirScore = 4;
      else if (minDist === 3) windDirScore = 2;
      else windDirScore = 0; // Onshore directo
    }

    // A medida que el viento sube de 5 a 25, los defectos de dirección se notan más
    // Si es offshore (10), se mantiene en 10. Si es onshore (0), sigue siendo 0.
    // Esto lo simplificamos manteniendo el windDirScore como base.
    subViento = windDirScore;
  }

  // 3. Tamaño (Peso 20%)
  let subTamano = 0;
  if (pronostico.swellTamano >= spot.tamanoMin && pronostico.swellTamano <= spot.tamanoMax) {
    subTamano = 10;
  } else if (pronostico.swellTamano < spot.tamanoMin) {
    // Cae linealmente hacia 0
    subTamano = (pronostico.swellTamano / spot.tamanoMin) * 10;
  } else {
    // Pasado de tamaño max. Cae linealmente (ej: el doble del maximo = 0)
    const exceso = pronostico.swellTamano - spot.tamanoMax;
    subTamano = Math.max(0, 10 - (exceso / spot.tamanoMax) * 10);
  }

  // 4. Período (Peso 15%)
  let subPeriodo = 0;
  if (pronostico.swellPeriodo >= spot.periodoMin) {
    subPeriodo = 10 + Math.min(2, (pronostico.swellPeriodo - spot.periodoMin)); // Bonus por periodo largo, capeado a +2 extra (pero sobre el subscore base)
    subPeriodo = Math.min(10, subPeriodo); // Mantenemos max 10
  } else {
    // Penaliza fuerte si es menor al mínimo
    subPeriodo = Math.max(0, 10 - ((spot.periodoMin - pronostico.swellPeriodo) * 3));
  }

  // Calculo Final
  let valor = (subSwell * 0.35) + (subViento * 0.30) + (subTamano * 0.20) + (subPeriodo * 0.15);
  
  // Penalizaciones globales para reflejar la realidad del surf
  if (subSwell <= 2) valor -= 2; // Si el swell es casi opuesto, arruina todo
  if (subViento <= 2 && pronostico.vientoVelocidad > 15) valor -= 2; // Onshore fuerte arruina
  
  // Si no hay olas (casi flat) o el viento es > 25, no puede ser un buen score.
  if (pronostico.swellTamano < 0.3) valor = Math.min(valor, 2);
  if (pronostico.vientoVelocidad > 25) valor = Math.min(valor, 2);
  
  // Redondear a 1 decimal
  valor = Math.round(valor * 10) / 10;
  valor = Math.max(0, Math.min(10, valor)); // Clamp entre 0 y 10

  // Determinar Etiqueta
  let etiqueta = 'MALO';
  if (valor >= 9) etiqueta = 'EXCELENTE';
  else if (valor >= 7) etiqueta = 'MUY BUENO';
  else if (valor >= 5) etiqueta = 'BUENO';
  else if (valor >= 3) etiqueta = 'REGULAR';

  // Generar frase interpretada (Rioplatense)
  const frases = [];
  if (subSwell === 10) frases.push(`Entrando swell ideal del ${pronostico.swellDireccion}`);
  else if (subSwell >= 6) frases.push(`Swell zafable del ${pronostico.swellDireccion}`);
  else frases.push(`Swell cruzado del ${pronostico.swellDireccion}`);

  if (pronostico.vientoVelocidad < 5) frases.push("el mar está un espejo (glass).");
  else if (pronostico.vientoVelocidad > 25) frases.push("pero el viento está inmanejable.");
  else if (subViento >= 8) frases.push(`con un viento offshore divino del ${pronostico.vientoDireccion}.`);
  else if (subViento <= 3) frases.push(`y encima el viento pega de frente del ${pronostico.vientoDireccion}.`);
  else frases.push(`con viento moderado del ${pronostico.vientoDireccion}.`);

  const frase = frases.join(" ");

  return {
    valor,
    etiqueta,
    frase
  };
}
