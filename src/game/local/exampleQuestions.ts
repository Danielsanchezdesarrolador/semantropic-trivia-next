import type { AlternativeId, LocalCategory, LocalPracticeQuestion } from './contracts.ts';

function example(id: string, category: LocalCategory, text: string, options: readonly [string, string, string, string],
  correctAlternativeId: AlternativeId, explanation: string): LocalPracticeQuestion {
  return { id, category, text, alternatives: [
    { id: 'A', text: options[0] }, { id: 'B', text: options[1] },
    { id: 'C', text: options[2] }, { id: 'D', text: options[3] },
  ], correctAlternativeId, explanation };
}

/** Reviewable examples, fixed order. Local practice only; editorial approval pending. */
export const exampleQuestions: readonly LocalPracticeQuestion[] = [
  example('geo-01', 'geografia', '¿Cuál es la capital de Australia?',
    ['Sídney', 'Melbourne', 'Canberra', 'Perth'], 'C', 'Canberra es la capital de Australia.'),
  example('sci-01', 'ciencias', '¿Cuál es el planeta rojo?',
    ['Venus', 'Marte', 'Júpiter', 'Saturno'], 'B', 'Marte recibe ese nombre por su aspecto rojizo.'),
  example('his-01', 'historia', '¿Quién hizo las pirámides de Guiza?',
    ['Antiguo Egipto', 'Imperio inca', 'Antigua Roma', 'Civilización maya'], 'A', 'Las pirámides de Guiza fueron construidas en el Antiguo Egipto.'),
  example('art-01', 'arte_cultura', '¿Quién escribió Don Quijote?',
    ['Pablo Neruda', 'Gabriela Mistral', 'Federico García Lorca', 'Miguel de Cervantes'], 'D', 'Miguel de Cervantes es el autor de Don Quijote de la Mancha.'),
  example('spo-01', 'deportes', 'Fútbol once: ¿jugadores por equipo?',
    ['Cinco', 'Siete', 'Once', 'Quince'], 'C', 'En fútbol once cada equipo comienza con once jugadores, incluido el portero.'),
  example('ent-01', 'entretenimiento', 'Ajedrez: ¿qué pieza se mueve en L?',
    ['Torre', 'Caballo', 'Alfil', 'Rey'], 'B', 'El caballo se desplaza dos casillas en una dirección y una perpendicular.'),
  example('geo-02', 'geografia', '¿En qué continente se encuentra Chile?',
    ['África', 'Europa', 'Oceanía', 'América'], 'D', 'Chile se encuentra en América del Sur.'),
  example('sci-02', 'ciencias', '¿Cuántos lados tiene un triángulo?',
    ['Tres', 'Cuatro', 'Cinco', 'Seis'], 'A', 'Un triángulo es un polígono de tres lados.'),
  example('his-02', 'historia', '¿En qué año pisamos la Luna?',
    ['1945', '1957', '1969', '1989'], 'C', 'La misión Apolo 11 llevó a los primeros seres humanos a la Luna en 1969.'),
  example('art-02', 'arte_cultura', '¿Qué instrumento tiene teclas?',
    ['Violín', 'Piano', 'Flauta', 'Trompeta'], 'B', 'El piano se toca mediante un teclado.'),
];
