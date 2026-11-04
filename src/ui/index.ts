/** Biblioteca visual B02-C1 (opt-in). No importa desde App.tsx todavía. */
export { GameFrame, GamePanel, ActionTile, StatusChip, ArtworkLayer } from './components/visual-primitives';
export { artAssets, referenceMockup, getApprovedAsset } from './assets/assetRegistry';
export type { ArtAsset, ArtAssetId, AssetState, AssetKind, ImageFormat } from './assets/assetRegistry';

export { officialArtAssets, getOfficialAsset, embeddedPortal } from './assets/assetRegistry';
export type { OfficialArtAsset, OfficialArtAssetId } from './assets/assetRegistry';
