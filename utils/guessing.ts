import Fuse from "fuse.js";

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildShortForms(answers: string[]) {
  const abbreviations = answers
    .map((answer) => {
      const parts = normalizeAnswer(answer).split(" ").filter(Boolean);

      if (parts.length < 2) {
        return "";
      }

      return parts.map((part) => part[0]).join("");
    })
    .filter(Boolean);

  return Array.from(new Set(abbreviations));
}

export function buildAcceptedAnswers(answers: string[]) {
  const normalizedAnswers = answers.map(normalizeAnswer).filter(Boolean);
  return Array.from(
    new Set([...normalizedAnswers, ...buildShortForms(normalizedAnswers)]),
  );
}

export function isGuessCorrect(guess: string, acceptedAnswers: string[]) {
  const normalizedGuess = normalizeAnswer(guess);

  if (!normalizedGuess) {
    return false;
  }

  if (acceptedAnswers.includes(normalizedGuess)) {
    return true;
  }

  const fuse = new Fuse(
    acceptedAnswers.map((value) => ({ value })),
    {
      includeScore: true,
      threshold: 0.28,
      keys: ["value"],
      ignoreLocation: true,
    },
  );

  const bestMatch = fuse.search(normalizedGuess)[0];
  return (bestMatch?.score ?? 1) <= 0.28;
}
