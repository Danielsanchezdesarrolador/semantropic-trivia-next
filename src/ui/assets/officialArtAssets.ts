import type { ArtAsset } from './assetRegistry';

/** Canon B04-C3. Reutilizar estos IDs; no reinterpretar personajes sin nueva aprobación. */
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
}
export const officialArtAssets = {
  "mascot-robot-v1": {
    "kind": "character",
    "role": "Robot mascota oficial",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/access/b04-option-c/mascot-robot-v1-web.webp",
    "width": 1100,
    "height": 1044,
    "transparent": true,
    "sha256": "0f739713da23a632589d6ffc6eb4e7aff89bbf90fe7f02b71b0d01aafecddc58",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "B04-C3: aprobación de Opción C y canon tras revisión Android físico y web declarada por el Director",
    "source": "assets/characters/mascot-robot-v1-web.webp",
    "sourceManifest": "docs/design/B04/B04_C2_ASSETS.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip",
    "sourcePackageSha256": "5cb9ddc146274dc96c582be85f47e870124464ace1b2cfdd2a0694329e9eb63f"
  },
  "protagonist-female-v1": {
    "kind": "character",
    "role": "Protagonista femenina oficial",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/access/b04-option-c/protagonist-female-v1-web.webp",
    "width": 653,
    "height": 1100,
    "transparent": true,
    "sha256": "e7562cbf1512c5a51cbdb7f2ca01446bb01c5689dc364601d742d35334c1d160",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "B04-C3: aprobación de Opción C y canon tras revisión Android físico y web declarada por el Director",
    "source": "assets/characters/protagonist-female-v1-web.webp",
    "sourceManifest": "docs/design/B04/B04_C2_ASSETS.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip",
    "sourcePackageSha256": "5cb9ddc146274dc96c582be85f47e870124464ace1b2cfdd2a0694329e9eb63f"
  },
  "protagonist-male-v1": {
    "kind": "character",
    "role": "Protagonista masculino oficial",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/access/b04-option-c/protagonist-male-v1-web.webp",
    "width": 704,
    "height": 1100,
    "transparent": true,
    "sha256": "38c8f594a33cae63cc7b84c3c98d7ddf5e1e8208923184a1b8b60c512b03e115",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "B04-C3: aprobación de Opción C y canon tras revisión Android físico y web declarada por el Director",
    "source": "assets/characters/protagonist-male-v1-web.webp",
    "sourceManifest": "docs/design/B04/B04_C2_ASSETS.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip",
    "sourcePackageSha256": "5cb9ddc146274dc96c582be85f47e870124464ace1b2cfdd2a0694329e9eb63f"
  },
  "lobby-option-c-desktop-v1": {
    "kind": "environment",
    "role": "Fondo Opción C con portal integrado",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/access/b04-option-c/lobby-option-c-desktop-2560x1440.webp",
    "width": 2560,
    "height": 1440,
    "transparent": false,
    "sha256": "36e13c1af4a129c46d5090f9e4ec0b1b10f3fc1ddeec400c2296b470c8826d9c",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "B04-C3: aprobación de Opción C y canon tras revisión Android físico y web declarada por el Director",
    "source": "assets/environment/lobby-option-c-desktop-2560x1440.webp",
    "sourceManifest": "docs/design/B04/B04_C2_ASSETS.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip",
    "sourcePackageSha256": "5cb9ddc146274dc96c582be85f47e870124464ace1b2cfdd2a0694329e9eb63f"
  },
  "lobby-option-c-mobile-v1": {
    "kind": "environment",
    "role": "Fondo Opción C con portal integrado",
    "format": "webp",
    "state": "approved",
    "classification": "official/approved",
    "src": "/assets/access/b04-option-c/lobby-option-c-mobile-1080x1920.webp",
    "width": 1080,
    "height": 1920,
    "transparent": false,
    "sha256": "b57d0c968ca95a7c0a6f5d7e71ebc39b0a1aacc6436e181f5d4a220c443c1db3",
    "approvedOn": "2026-11-04",
    "approvedBy": "Director General",
    "decision": "B04-C3: aprobación de Opción C y canon tras revisión Android físico y web declarada por el Director",
    "source": "assets/environment/lobby-option-c-mobile-1080x1920.webp",
    "sourceManifest": "docs/design/B04/B04_C2_ASSETS.json",
    "sourcePackage": "SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip",
    "sourcePackageSha256": "5cb9ddc146274dc96c582be85f47e870124464ace1b2cfdd2a0694329e9eb63f"
  }
} as const satisfies Record<string, OfficialArtAsset>;
export type OfficialArtAssetId = keyof typeof officialArtAssets;
export function getOfficialAsset(id: OfficialArtAssetId): OfficialArtAsset { return officialArtAssets[id]; }

/** El portal forma parte del arte de ambos fondos. Nunca renderizar otra capa de portal. */
export const embeddedPortal = {
  id: 'portal-option-c-v1', state: 'approved', representation: 'embedded-in-background',
  backgrounds: ['lobby-option-c-desktop-v1', 'lobby-option-c-mobile-v1'],
  approvedOn: '2026-11-04', decision: 'B04-C3 / Director General',
  sourceManifest: 'docs/design/B04/B04_C2_ASSETS.json',
} as const;
