import { quizAsset } from './quizAssets';

export const categoryThemes = {
  geografia: { label: 'Geografía', accent: '#00C2FF', deep: '#085BD9', icon: 'icono_categoria_geografia', bar: 'barra_categoria_geografia' },
  ciencias: { label: 'Ciencias', accent: '#8B5CF6', deep: '#542DCE', icon: 'icono_categoria_ciencias', bar: 'barra_categoria_ciencias' },
  historia: { label: 'Historia', accent: '#FFB33D', deep: '#A35408', icon: 'icono_categoria_historia', bar: 'barra_categoria_historia' },
  arte_cultura: { label: 'Arte y cultura', accent: '#FF5CA8', deep: '#B81766', icon: 'icono_categoria_arte_cultura', bar: 'barra_categoria_arte_cultura' },
  deportes: { label: 'Deportes', accent: '#4AD3B3', deep: '#077D6A', icon: 'icono_categoria_deportes', bar: 'barra_categoria_deportes' },
  entretenimiento: { label: 'Entretenimiento', accent: '#3B82F6', deep: '#1853AA', icon: 'icono_categoria_entretenimiento', bar: 'barra_categoria_entretenimiento' },
} as const;

export type QuizCategory = keyof typeof categoryThemes;
export const quizCategories = Object.keys(categoryThemes) as QuizCategory[];
export function categoryBackdrop(category: QuizCategory, format: 'pc_16x9' | 'movil_9x16'): string {
  return quizAsset(`arena_${category}_${format}`);
}
