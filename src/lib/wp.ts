import { Spot, Direccion, Marea } from '../types/scoring';

const API_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://new.guiadesurfing.com/graphql';

export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 1800 } // ISR cada 30 minutos, como pidio el usuario
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch WP GraphQL API');
  }

  return json.data;
}

export async function getAllSpots(): Promise<Spot[]> {
  // Aca va la query de GraphQL. 
  // Nota: Esto asume que existe un CPT "spots" y campos ACF configurados.
  // Como WPGraphQL todavía no está activo en el sitio, devolvemos mock data
  // de forma temporal si la API falla o devuelve nulo.
  const query = `
    query GetAllSpots {
      spots(first: 100) {
        nodes {
          slug
          title
          spot_meta {
            localidad
            zona
            latitud
            longitud
            swellIdeal
            swellTolerable
            vientoIdeal
            tamanoMin
            tamanoMax
            periodoMin
            mareaIdeal
            tipoOla
            fondo
            nivel
            consistencia
            descripcion
          }
        }
      }
    }
  `;

  try {
    const data = await fetchAPI(query);
    if (!data || !data.spots || !data.spots.nodes || data.spots.nodes.length === 0) {
       console.log('No spots returned from WP, falling back to mock data...');
       throw new Error("No spots in WP");
    }
    
    return data.spots.nodes.map((node: any) => {
      const meta = node.spot_meta || {};
      return {
        slug: node.slug,
        nombre: node.title,
        localidad: meta.localidad || '',
        zona: meta.zona || 'rocha',
        lat: parseFloat(meta.latitud) || 0,
        lng: parseFloat(meta.longitud) || 0,
        swellIdeal: meta.swellIdeal ? meta.swellIdeal.split(',') : [],
        swellTolerable: meta.swellTolerable ? meta.swellTolerable.split(',') : [],
        vientoIdeal: meta.vientoIdeal ? meta.vientoIdeal.split(',') : [],
        tamanoMin: parseFloat(meta.tamanoMin) || 0,
        tamanoMax: parseFloat(meta.tamanoMax) || 3,
        periodoMin: parseInt(meta.periodoMin) || 8,
        mareaIdeal: meta.mareaIdeal ? meta.mareaIdeal.split(',') : [],
        tipoOla: meta.tipoOla || '',
        fondo: meta.fondo || 'arena',
        nivel: meta.nivel || 'intermedio',
        consistencia: meta.consistencia || 'media',
        descripcion: meta.descripcion || '',
        servicios: [],
        galeria: []
      } as Spot;
    });
  } catch (err) {
    // Fallback temporal a los mocks si el backend no está configurado aún
    const { mockSpots } = await import('./mocks');
    return Object.values(mockSpots);
  }
}
