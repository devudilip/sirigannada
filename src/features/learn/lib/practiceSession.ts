/**
 * Pure scoring/progress state for a multiple-choice practice session (word↔meaning match,
 * ಕಾಗುಣಿತ drill). Components hold this in `useState`/`useReducer` and call these functions —
 * no side effects, no timers, easy to unit test.
 */
export interface SessionState {
  index: number;
  score: number;
  answered: boolean;
  selectedIndex: number | null;
}

export function initSession(): SessionState {
  return { index: 0, score: 0, answered: false, selectedIndex: null };
}

/** Records an answer for the current question. No-op if this question was already answered. */
export function answerQuestion(state: SessionState, correctIndex: number, choiceIndex: number): SessionState {
  if (state.answered) return state;
  const correct = choiceIndex === correctIndex;
  return { ...state, answered: true, selectedIndex: choiceIndex, score: correct ? state.score + 1 : state.score };
}

/** Moves to the next question, or stays put (caller checks `isDone`) once the deck is exhausted. */
export function advance(state: SessionState, deckLength: number): SessionState {
  if (!state.answered) return state;
  const next = state.index + 1;
  if (next >= deckLength) return state;
  return { ...state, index: next, answered: false, selectedIndex: null };
}

export function isDone(state: SessionState, deckLength: number): boolean {
  return deckLength > 0 && state.answered && state.index === deckLength - 1;
}
