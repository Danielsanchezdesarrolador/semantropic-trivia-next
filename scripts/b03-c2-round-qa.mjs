import assert from 'node:assert/strict';

// Independent expected sequence: six correct answers followed by four errors.
const sequence = [
  ['geografia', 'Geografía', '#00C2FF', 'C'],
  ['ciencias', 'Ciencias', '#8B5CF6', 'B'],
  ['historia', 'Historia', '#FFB33D', 'A'],
  ['arte_cultura', 'Arte y cultura', '#FF5CA8', 'D'],
  ['deportes', 'Deportes', '#4AD3B3', 'C'],
  ['entretenimiento', 'Entretenimiento', '#3B82F6', 'B'],
  ['geografia', 'Geografía', '#00C2FF', 'A'],
  ['ciencias', 'Ciencias', '#8B5CF6', 'B'],
  ['historia', 'Historia', '#FFB33D', 'A'],
  ['arte_cultura', 'Arte y cultura', '#FF5CA8', 'A'],
];

export async function verifyLocalRound(page, name) {
  assert.equal(await page.locator('.b03-category-pill').count(), 0, 'Selector manual solo en QA');
  assert.equal(await page.locator('.b03-state-rows').count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Siguiente pregunta' }).count(), 0);
  assert.match(await page.locator('.b03-preview-heading').innerText(), /Práctica local.*20 segundos por pregunta/s);
  assert.match(await page.locator('.b03-timer').getAttribute('aria-label'), /Tiempo restante/);
  assert.ok(Number(await page.locator('.b03-timer span').textContent()) > 0);

  for (const [index, [category, label, accent, selected]] of sequence.entries()) {
    assert.equal((await page.locator('.b03-category-title').textContent()).trim(), label);
    assert.equal((await page.locator('.b03-category-count').textContent()).trim(), `${index + 1} / 10`);
    assert.equal(await page.locator('.b03-category-icon').getAttribute('src'), `/assets/quiz/b03-b01/icono_categoria_${category}.svg`);
    assert.equal(await page.locator('.b03-category-header-skin').getAttribute('src'), `/assets/quiz/b03-b01/barra_categoria_${category}.svg`);
    const visual = await page.locator('.b03-arena').evaluate(element => ({
      accent: element.style.getPropertyValue('--quiz-accent'),
      desktop: element.style.getPropertyValue('--quiz-background-desktop'),
      mobile: element.style.getPropertyValue('--quiz-background-mobile'),
      painted: getComputedStyle(element, '::before').backgroundImage,
      mobileViewport: innerWidth <= 600,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert.equal(visual.accent, accent);
    assert.ok(visual.desktop.includes(`arena_${category}_pc_16x9.svg`));
    assert.ok(visual.mobile.includes(`arena_${category}_movil_9x16.svg`));
    assert.ok(visual.painted.includes(`arena_${category}_${visual.mobileViewport ? 'movil_9x16' : 'pc_16x9'}.svg`));
    assert.equal(visual.overflow, false, `Sin overflow: ${name}, pregunta ${index + 1}`);
    const contained = await page.locator('.b03-question').evaluate(element => {
      const panel = element.querySelector('.b03-question-skin').getBoundingClientRect();
      const content = [...element.querySelectorAll('.b03-question-content > *')].map(child => child.getBoundingClientRect());
      // Original white paper in panel_pregunta.svg: (49,43)..(1451,448), viewBox 1500x520.
      const scale = Math.min(panel.width / 1500, panel.height / 520);
      const x = panel.left + (panel.width - 1500 * scale) / 2;
      const y = panel.top + (panel.height - 520 * scale) / 2;
      return { fits: content.every(rect => rect.top >= y + 43 * scale - 1 && rect.bottom <= y + 448 * scale + 1
        && rect.left >= x + 49 * scale - 1 && rect.right <= x + 1451 * scale + 1),
        content: content.map(rect => ({top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right})),
        paper: {top:y+43*scale,bottom:y+448*scale,left:x+49*scale,right:x+1451*scale} };
    });
    assert.ok(contained.fits, `Texto dentro del panel SVG aprobado: ${name}, pregunta ${index + 1}: ${JSON.stringify(contained)}`);
    await page.waitForFunction(() => [...document.querySelectorAll('.b03-arena img')].every(image => image.complete && image.naturalWidth > 0));
    assert.equal(await page.locator('.b03-progress img').count(), 10);
    assert.equal(await page.locator('button.b03-answer:enabled').count(), 4);

    // Capture the real question and verify next question changes its content.
    const question = await page.locator('.b03-question h2').textContent();
    if (index === 0) assert.equal(question, '¿Cuál es la capital de Australia?');
    const choice = page.locator('button.b03-answer').filter({ has: page.locator('.b03-answer-letter', { hasText: selected }) });
    if (page.viewportSize().width <= 600) await choice.tap();
    else await choice.click();
    assert.equal(await page.locator('button.b03-answer:disabled').count(), 4);
    assert.equal(await page.locator('button.b03-answer[aria-pressed=true]').count(), 1);
    assert.equal(await page.locator('.b03-answer--correct').count(), 1);
    assert.equal(await page.locator('.b03-answer--incorrect').count(), index < 6 ? 0 : 1);
    assert.equal(await page.locator('.b03-answer--correct .b03-answer-skin').getAttribute('src'), '/assets/quiz/b03-b01/boton_respuesta_correcta.svg');
    if (index >= 6) assert.equal(await page.locator('.b03-answer--incorrect .b03-answer-skin').getAttribute('src'), '/assets/quiz/b03-b01/boton_respuesta_incorrecta.svg');
    const status = await page.locator('.b03-visual-status').innerText();
    // Force DOM events even on disabled controls: React + engine must still reject duplicates.
    await page.locator('button.b03-answer').evaluateAll(buttons => buttons.forEach(button => button.dispatchEvent(new MouseEvent('click', { bubbles: true }))));
    assert.equal(await page.locator('.b03-visual-status').innerText(), status);
    assert.equal(await page.locator('.b03-progress img[src$="progreso_completada.svg"]').count(), index + 1);
    await page.screenshot({ path: `artifacts/b02-official/${name}-local-${category}-${index + 1}.png`, fullPage: true });
    if (index < 9) {
      await page.getByRole('button', { name: 'Siguiente pregunta' }).click();
      assert.notEqual(await page.locator('.b03-question h2').textContent(), question);
      assert.equal(await page.locator('.b03-answer--correct').count(), 0);
      assert.equal(await page.locator('.b03-answer--incorrect').count(), 0);
    }
  }
  assert.match(await page.getByRole('status').innerText(), /Ronda finalizada · Aciertos: 6 de 10 · Errores: 4 · Puntuación: 6 puntos/);
  assert.equal(await page.getByRole('button', { name: 'Siguiente pregunta' }).count(), 0);
  await page.getByRole('button', { name: 'Volver a jugar' }).click();
  assert.equal((await page.locator('.b03-category-count').textContent()).trim(), '1 / 10');
  assert.equal(await page.locator('button.b03-answer:enabled').count(), 4);
  assert.equal(await page.locator('.b03-progress img[src$="progreso_completada.svg"]').count(), 0);
  console.log('PASS B03-C2', name, '10 preguntas, seis categorías, duplicados bloqueados, resultado 6/10 y reinicio');
}
