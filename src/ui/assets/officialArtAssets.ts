import type { ArtAsset } from './assetRegistry';

/** Canon ART-CP01. Reutilizar estos IDs; no reinterpretar personajes sin nueva aprobación. */
export interface OfficialArtAsset extends ArtAsset {
  readonly state: 'approved';
  readonly classification: 'official/approved';
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly sha256: string;
  readonly approvedOn: string;
  readonly approvedBy: string;
  readonly decision: string;
  readonly source: string;
  readonly sourceManifest: string;
  readonly sourcePackage: string;
  readonly sourcePackageSha256: string;
  readonly sourceSha256: string;
}
export const officialArtAssets = {
  "brand/logo": {
    "kind": "brand",
    "role": "logo-canonical-1.0",
    "format": "png",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/official/brand/semantropic-trivia-logo-1_0-v2.png",
    "width": 1536,
    "height": 1024,
    "transparent": true,
    "sha256": "6b01ec51cfb357d588b53e3cae6669ec605cad1d43b1bb76c4d03dd5f927ee8f",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "ART-CP01: nuevas fuentes oficiales aportadas; integración pendiente de revisión visual",
    "source": "art/official/masters/brand/semantropic-trivia-logo-1_0-v2.png",
    "sourceSha256": "6b01ec51cfb357d588b53e3cae6669ec605cad1d43b1bb76c4d03dd5f927ee8f",
    "sourceManifest": "docs/art/ASSET_MANIFEST.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip",
    "sourcePackageSha256": "bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a"
  },
  "protagonist-male-v1": {
    "kind": "character",
    "role": "male-character",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/official/characters/protagonist-male-v1.webp",
    "width": 1122,
    "height": 1402,
    "transparent": true,
    "sha256": "99c30bcc792a318477dd0ea42f49ee1b4a11d203a1fcb80b27fc060f291a1bf7",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "ART-CP01: nuevas fuentes oficiales aportadas; integración pendiente de revisión visual",
    "source": "art/official/masters/characters/protagonist-male-v1.png",
    "sourceSha256": "8f1e44c0e9c84abafc150ab311ca15b5faef7161a4cdf9fb0ef130e8e40bc035",
    "sourceManifest": "docs/art/ASSET_MANIFEST.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip",
    "sourcePackageSha256": "bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a"
  },
  "protagonist-female-v1": {
    "kind": "character",
    "role": "female-character",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/official/characters/protagonist-female-v1.webp",
    "width": 1122,
    "height": 1402,
    "transparent": true,
    "sha256": "966e2fdeaa68e2993be4f4383aeeb1d7f27f76b41cda5e9fd4a90efb8604173d",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "ART-CP01: nuevas fuentes oficiales aportadas; integración pendiente de revisión visual",
    "source": "art/official/masters/characters/protagonist-female-v1.png",
    "sourceSha256": "c5e4b3d22c739fd883ed146bd046ccf731de4243c99dc5b03355c4a8bc9ad9bc",
    "sourceManifest": "docs/art/ASSET_MANIFEST.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip",
    "sourcePackageSha256": "bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a"
  },
  "mascot-robot-v1": {
    "kind": "character",
    "role": "robot-character",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/official/characters/mascot-robot-v1.webp",
    "width": 1254,
    "height": 1254,
    "transparent": true,
    "sha256": "1639b841e655e30207493db308939e16759954659039b87490e6c41aa51165a5",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "ART-CP01: nuevas fuentes oficiales aportadas; integración pendiente de revisión visual",
    "source": "art/official/masters/characters/mascot-robot-v1.png",
    "sourceSha256": "7ed693661a60b96db335795ad4fe5f3d392c09e6bb6054adc080fe40cc76c73b",
    "sourceManifest": "docs/art/ASSET_MANIFEST.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip",
    "sourcePackageSha256": "bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a"
  },
  "lobby-option-c-desktop-v2": {
    "kind": "environment",
    "role": "desktop-clean-portal-baked",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/official/environment/lobby-option-c-desktop-v2.webp",
    "width": 1672,
    "height": 941,
    "transparent": false,
    "sha256": "65aa8333fb9c424ce3a87f6a3a6a8978b729547b0d36f2b6670b9552a4293b0e",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "ART-CP01: nuevas fuentes oficiales aportadas; integración pendiente de revisión visual",
    "source": "art/official/masters/environment/lobby-option-c-desktop-v2.png",
    "sourceSha256": "18c9576783511dcc86d7e8b32fc0448dea721b932a29b9726530da44bc84739f",
    "sourceManifest": "docs/art/ASSET_MANIFEST.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip",
    "sourcePackageSha256": "bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a"
  },
  "lobby-option-c-mobile-v2": {
    "kind": "environment",
    "role": "mobile-clean-portal-baked",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/official/environment/lobby-option-c-mobile-v2.webp",
    "width": 941,
    "height": 1672,
    "transparent": false,
    "sha256": "575fe496f5f85ec6fa60a204ffac8f670f9c62b1b800a44cbe2f51f3bebfa701",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "ART-CP01: nuevas fuentes oficiales aportadas; integración pendiente de revisión visual",
    "source": "art/official/masters/environment/lobby-option-c-mobile-v2.png",
    "sourceSha256": "4b88bc2addde368d095d704b461e95c09f2f8ea5120eb5714070dd58f3d63a06",
    "sourceManifest": "docs/art/ASSET_MANIFEST.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip",
    "sourcePackageSha256": "bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a"
  }
} as const satisfies Record<string, OfficialArtAsset>;
export type OfficialArtAssetId = keyof typeof officialArtAssets;
export function getOfficialAsset(id: OfficialArtAssetId): OfficialArtAsset { return officialArtAssets[id]; }
/** El portal ya está ilustrado en ambos fondos CP01; no renderizar otra capa. */
export const embeddedPortal = {
 id: 'portal-option-c-v1', state: 'approved', representation: 'embedded-in-background',
 backgrounds: ['lobby-option-c-desktop-v2', 'lobby-option-c-mobile-v2'],
 approvedOn: '2026-11-04', decision: 'ART-CP01 / Director General', sourceManifest: 'docs/art/ASSET_MANIFEST.json',
} as const;
