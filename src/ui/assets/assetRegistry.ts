/**
 * B02-C1: catálogo de capas del mockup aprobado.
 * Ningún asset está disponible todavía: nunca fingir que un PNG está integrado.
 * La captura completa del mockup es REFERENCIA, no fondo de interfaz.
 */
export type AssetState = 'pending-art' | 'approved';
export type AssetKind = 'environment' | 'brand' | 'character' | 'decoration';
export type ImageFormat = 'png' | 'webp' | 'svg';

export interface ArtAsset {
  readonly kind: AssetKind;
  readonly role: string;
  readonly format: ImageFormat;
  readonly state: AssetState;
  readonly src: string | null;
  readonly transparent: boolean;
}

export const referenceMockup = {
  name: 'SEMANTROPIC POP — Fantasía Social',
  approvedBy: 'Director del juego',
  approvedOn: '2026-10-28',
  nativeWidth: 1024,
  nativeHeight: 1536,
  use: 'visual-reference-only',
} as const;

export const artAssets = {
  'environment/plaza-day': {
    kind: 'environment', role: 'Arquitectura cálida, cascadas y plaza diurna sin UI',
    format: 'webp', state: 'pending-art', src: null, transparent: false,
  },
  'environment/sky-night': {
    kind: 'environment', role: 'Cielo galáctico, estrellas y planeta; capa de ambiente',
    format: 'webp', state: 'pending-art', src: null, transparent: true,
  },
  'environment/islands': {
    kind: 'environment', role: 'Islas flotantes y torres, capa de parallax opcional',
    format: 'png', state: 'pending-art', src: null, transparent: true,
  },
  'brand/logo': {
    kind: 'brand', role: 'Logotipo original SEMANTROPIC TRIVIA, separado de escenario',
    format: 'png', state: 'pending-art', src: null, transparent: true,
  },
  'characters/left-hero': {
    kind: 'character', role: 'Figura protagonista izquierda; identidad final por validar',
    format: 'png', state: 'pending-art', src: null, transparent: true,
  },
  'characters/right-hero': {
    kind: 'character', role: 'Figura protagonista derecha; identidad final por validar',
    format: 'png', state: 'pending-art', src: null, transparent: true,
  },
  'characters/robot': {
    kind: 'character', role: 'Robot ilustrativo; no implica modo Torneo CPU',
    format: 'png', state: 'pending-art', src: null, transparent: true,
  },
  'decorations/crystal-cyan': {
    kind: 'decoration', role: 'Cristal cian original aislado para ornamentación',
    format: 'png', state: 'pending-art', src: null, transparent: true,
  },
  'decorations/crystal-warm': {
    kind: 'decoration', role: 'Cristales cálidos sin texto ni acciones',
    format: 'png', state: 'pending-art', src: null, transparent: true,
  },
} as const satisfies Record<string, ArtAsset>;

export type ArtAssetId = keyof typeof artAssets;

/** Devuelve null cuando la ilustración sigue pendiente o falta su ruta. */
export function getApprovedAsset(id: ArtAssetId): string | null {
  const asset: ArtAsset = artAssets[id];
  return asset.state === 'approved' ? asset.src : null;
}
