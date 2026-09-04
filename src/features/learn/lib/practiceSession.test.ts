import { advance, answerQuestion, initSession, isDone } from "./practiceSession";

describe("initSession", () => {
  it("starts at question 0 with no score", () => {
    expect(initSession()).toEqual({ index: 0, score: 0, answered: false, selectedIndex: null });
  });
});

describe("answerQuestion", () => {
  it("increments score on a correct answer", () => {
    const s = answerQuestion(initSession(), 2, 2);
    expect(s).toEqual({ index: 0, score: 1, answered: true, selectedIndex: 2 });
  });

  it("does not increment score on a wrong answer", () => {
    const s = answerQuestion(initSession(), 2, 0);
    expect(s.score).toBe(0);
    expect(s.answered).toBe(true);
    expect(s.selectedIndex).toBe(0);
  });

  it("is a no-op once the question is already answered", () => {
    const first = answerQuestion(initSession(), 2, 2);
    const second = answerQuestion(first, 2, 0);
    expect(second).toEqual(first);
  });
});

describe("advance", () => {
  it("does nothing until the question is answered", () => {
    const s = initSession();
    expect(advance(s, 5)).toEqual(s);
  });

  it("moves to the next question and resets answer state", () => {
    const answered = answerQuestion(initSession(), 1, 1);
    const next = advance(answered, 5);
    expect(next).toEqual({ index: 1, score: 1, answered: false, selectedIndex: null });
  });

  it("stays on the last question once the deck is exhausted", () => {
    const answered = { index: 4, score: 3, answered: true, selectedIndex: 1 };
    expect(advance(answered, 5)).toEqual(answered);
  });
});

describe("isDone", () => {
  it("is true only on the last question after answering", () => {
    expect(isDone({ index: 4, score: 0, answered: true, selectedIndex: 0 }, 5)).toBe(true);
    expect(isDone({ index: 4, score: 0, answered: false, selectedIndex: null }, 5)).toBe(false);
    expect(isDone({ index: 2, score: 0, answered: true, selectedIndex: 0 }, 5)).toBe(false);
  });

  it("is false for an empty deck", () => {
    expect(isDone({ index: 0, score: 0, answered: true, selectedIndex: 0 }, 0)).toBe(false);
  });
});
