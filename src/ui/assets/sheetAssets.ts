/** B02-C2: ilustraciones extraídas directamente de la lámina del Director.
 * Las transparencias fueron reconstruidas y son CANDIDATAS, no arte final aprobado.
 * Los rótulos de botones y paneles están impresos en los PNG; no son datos reales.
 */
export type SheetCategory = 'Marca y personajes' | 'Cristales y objetos' | 'Botones de referencia' | 'Paneles de referencia' | 'Capas de referencia';
export type SheetState = 'candidato' | 'referencia';
export type SheetAsset = Readonly<{
  id: string;
  title: string;
  path: string;
  category: SheetCategory;
  state: SheetState;
  note?: string;
}>;
const base = '/assets/home/sheet/';
export const sheetAssets: readonly SheetAsset[] = [
  { id:'logo', title:'Logotipo de la lámina', path:base+'logo-lamina.png', category:'Marca y personajes', state:'candidato',note:'Extracción transparente reconstruida; validar bordes antes de sustituir el logo final.' },
  { id:'boy',title:'Protagonista 01',path:base+'character-boy.png',category:'Marca y personajes',state:'candidato',note:'Recorte pequeño; la ilustración fuente no incluye cuerpo completo.' },
  { id:'girl',title:'Protagonista 02',path:base+'character-girl.png',category:'Marca y personajes',state:'candidato',note:'Recorte pequeño; revisar bordes y pelo.' },
  { id:'robot',title:'Robot asistente',path:base+'robot.png',category:'Marca y personajes',state:'candidato',note:'Mascota ilustrativa; no implica modo CPU.' },
  { id:'crystal-blue',title:'Cristal azul',path:base+'crystal-blue.png',category:'Cristales y objetos',state:'candidato' },
  { id:'crystal-violet',title:'Cristal violeta',path:base+'crystal-violet.png',category:'Cristales y objetos',state:'candidato' },
  { id:'crystal-gold',title:'Cristal dorado',path:base+'crystal-gold.png',category:'Cristales y objetos',state:'candidato' },
  { id:'flowers',title:'Vegetación',path:base+'flowers.png',category:'Cristales y objetos',state:'candidato' },
  { id:'lantern',title:'Linterna',path:base+'lantern.png',category:'Cristales y objetos',state:'candidato' },
  { id:'banner',title:'Bandera',path:base+'banner.png',category:'Cristales y objetos',state:'candidato' },
  { id:'online',title:'Jugar Online',path:base+'button-online.png',category:'Botones de referencia',state:'referencia',note:'Imagen de botón con letras incorporadas; sin funcionalidad todavía.' },
  { id:'friends',title:'Jugar con Amigos',path:base+'button-friends.png',category:'Botones de referencia',state:'referencia',note:'Imagen de botón con letras incorporadas; sin funcionalidad todavía.' },
  { id:'cpu',title:'Torneo CPU (no autorizado)',path:base+'button-cpu-reference.png',category:'Botones de referencia',state:'referencia',note:'No forma parte de los modos oficiales. Solo inventario artístico.' },
  { id:'ranked',title:'Ranked (opción de Online)',path:base+'button-ranked-reference.png',category:'Botones de referencia',state:'referencia',note:'Ranked es submodo 1v1 online humano, no menú principal independiente.' },
  { id:'season',title:'Pase de temporada (referencia)',path:base+'panel-season-reference.png',category:'Paneles de referencia',state:'referencia',note:'Cifras ficticias impresas: no sistema aprobado.' },
  { id:'events',title:'Eventos (referencia)',path:base+'panel-events-reference.png',category:'Paneles de referencia',state:'referencia',note:'Sin eventos reales ni acciones.' },
  { id:'collection',title:'Colección (referencia)',path:base+'panel-collection-reference.png',category:'Paneles de referencia',state:'referencia',note:'Sin inventario ni cosméticos reales.' },
  { id:'map-sheet',title:'Mapa de la lámina (miniatura)',path:base+'map-sheet-reference.webp',category:'Capas de referencia',state:'referencia',note:'La versión de mapa aplanada no sustituye el fondo panorámico aprobado.' },
  { id:'sky',title:'Cielo y galaxia (miniatura)',path:base+'layer-sky-reference.png',category:'Capas de referencia',state:'referencia' },
  { id:'islands',title:'Islas flotantes (miniatura)',path:base+'layer-islands-reference.png',category:'Capas de referencia',state:'referencia' },
  { id:'city',title:'Ciudades y estructuras (miniatura)',path:base+'layer-city-reference.png',category:'Capas de referencia',state:'referencia' },
  { id:'plaza',title:'Plataforma principal (miniatura)',path:base+'layer-plaza-reference.png',category:'Capas de referencia',state:'referencia' },
  { id:'vegetation',title:'Vegetación y detalles (miniatura)',path:base+'layer-vegetation-reference.png',category:'Capas de referencia',state:'referencia' },
] as const;

export const sheetPalette = [
  {name:'Azul',hex:'#3B82F6'},{name:'Cian',hex:'#00D1FF'},
  {name:'Violeta',hex:'#8B5CF6'},{name:'Rosa',hex:'#FF5CA8'},
  {name:'Naranja',hex:'#FFB33D'},{name:'Amarillo',hex:'#FFE066'},
  {name:'Turquesa',hex:'#4AD3B3'},{name:'Azul marino',hex:'#1E2A4A'},
  {name:'Crema',hex:'#FFF6E9'},
] as const;
export const sheetById = (id: string) => {
  const asset = sheetAssets.find(asset => asset.id===id);
  if (!asset) throw new Error(`Falta referencia ${id}`);
  return asset;
};
