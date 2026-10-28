import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('B02-NAV: botones principales habilitados exclusivamente en portada oficial', () => {
  const home = read('src/ui/home/HomePreview.tsx');
  assert.match(home, /onOpen=\{official \? \(\) => navigate\('online'\)/);
  assert.match(home, /onOpen=\{official \? \(\) => navigate\('friends'\)/);
  assert.match(home, /disabled=\{!onOpen\}/);
  assert.match(home, /onClick=\{onOpen\}/);
  assert.match(home, /showLibrary \? <ResourceLibrary \/>/);
});

test('B02-NAV: barra lateral son botones y mantiene ruta inicio accesible', () => {
  const home = read('src/ui/home/HomePreview.tsx');
  for (const page of ['home', 'collection', 'shop', 'friends', 'ranking']) {
    assert.match(home, new RegExp("screen: '" + page + "'"));
  }
  assert.match(home, /onClick=\{\(\) => navigate\(n\.screen\)\}/);
  assert.match(home, /aria-current=\{selected \? 'page' : undefined\}/);
  assert.match(home, /aria-label=\{official \? 'Navegación principal'/);
});

test('B02-NAV: modalidades oficiales visibles sin ofrecer partidas falsas', () => {
  const source = read('src/ui/home/LobbySection.tsx');
  const navigation = read('src/ui/home/lobbyNavigation.ts');
  for (const name of ['Normal 1v1','Clasificatoria 1v1','1v1','2v2','3v3','Todos contra todos']) {
    assert.ok(source.includes(name), 'Falta ' + name);
  }
  assert.match(source, /No se permiten bots en clasificatorias/);
  assert.match(source, /No existe una búsqueda activa/);
  assert.match(source, /Todavía no se ha creado ninguna sala/);
  assert.doesNotMatch(source, /emparejando ahora|jugadores conectados|partida iniciada/i);
  assert.match(navigation, /hashchange/);
  assert.match(navigation, /VALID_SCREENS/);
});

test('B02-NAV: se conserva estética original y controles accesibles', () => {
  const css=read('src/ui/home/home-preview.css');
  assert.match(css,/st-lobby-panel__option:focus-visible/);
  assert.match(css,/st-lobby-panel__back:focus-visible/);
  assert.match(css,/st-preview-page--official \.st-sheet-action:not\(:disabled\)/);
  assert.match(css,/st-home__approved-background \{[^}]*height:100%;object-fit:cover/);
  assert.match(css,/prefers-reduced-motion/);
});
