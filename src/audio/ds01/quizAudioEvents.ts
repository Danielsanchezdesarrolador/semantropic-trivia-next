import type { LocalRoundState } from '../../game/local/contracts';
import type { SoundEvent } from './catalog';

/** Consume only committed answers, keyed by the immutable session snapshot.
 * React effects may run twice; state updater functions never have audio effects. */
export class QuizAudioEvents {
  private seen = new WeakMap<LocalRoundState['questions'], Set<string>>();
  collect(round: LocalRoundState): SoundEvent[][] {
    let seen = this.seen.get(round.questions);
    if (!seen) { seen = new Set(); this.seen.set(round.questions, seen); }
    return round.answers.flatMap(answer => {
      if (seen!.has(answer.questionId)) return [];
      seen!.add(answer.questionId);
      return [answer.alternativeId === null ? ['timeout'] as SoundEvent[]
        : ['selection', answer.correct ? 'correct' : 'incorrect'] as SoundEvent[]];
    });
  }
}
