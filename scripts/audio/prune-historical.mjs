import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
// Vite copies public/. Keep historical source untouched, exclude unlicensed
// historical music from the release. Never recurse or operate outside dist.
const path = resolve('dist/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3');
await unlink(path).catch(error => { if (error.code !== 'ENOENT') throw error; });
