import type { Sentence } from '@/types';
import type { GrammarFeedback, GrammarTopic } from '@/types';

interface ValidationResult {
  isCorrect: boolean;
  feedback: GrammarFeedback[];
  correctAnswer: string;
}

function normalizeForComparison(text: string): string {
  return text.toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
}

function detectGrammarIssue(
  userWords: string[],
  correctWords: string[],
): GrammarFeedback[] {
  const feedback: GrammarFeedback[] = [];

  // Check verb position (V2 rule)
  if (correctWords.length >= 2 && userWords.length >= 2) {
    const correctVerbIndex = 1; // In main clauses, verb is typically at position 2
    const correctVerb = correctWords[correctVerbIndex];
    if (correctVerb) {
      const userVerbIndex = userWords.indexOf(correctVerb);
      if (userVerbIndex !== -1 && userVerbIndex !== correctVerbIndex) {
        feedback.push({
          topic: 'word-order' as GrammarTopic,
          message: 'Check the verb position',
          correct: correctWords.join(' '),
          userAttempt: userWords.join(' '),
          explanation:
            'In German main clauses, the conjugated verb must be in the second position (V2 rule).',
        });
      }
    }
  }

  // Check if words are correct but order is wrong
  const sortedUser = [...userWords].sort();
  const sortedCorrect = [...correctWords].sort();
  if (
    sortedUser.join(' ') === sortedCorrect.join(' ') &&
    userWords.join(' ') !== correctWords.join(' ')
  ) {
    if (feedback.length === 0) {
      feedback.push({
        topic: 'word-order' as GrammarTopic,
        message: 'The words are correct, but the order needs adjustment',
        correct: correctWords.join(' '),
        userAttempt: userWords.join(' '),
        explanation:
          'German word order follows specific rules. Pay attention to the position of the verb and other sentence elements.',
      });
    }
  }

  return feedback;
}

export function validateSentence(
  userInput: string,
  sentence: Sentence,
): ValidationResult {
  const normalizedInput = normalizeForComparison(userInput);
  const normalizedCorrect = normalizeForComparison(sentence.de);

  // Exact match
  if (normalizedInput === normalizedCorrect) {
    return { isCorrect: true, feedback: [], correctAnswer: sentence.de };
  }

  // Check alternatives
  if (sentence.alternatives) {
    for (const alt of sentence.alternatives) {
      if (normalizeForComparison(alt) === normalizedInput) {
        return { isCorrect: true, feedback: [], correctAnswer: sentence.de };
      }
    }
  }

  // Analyze what went wrong
  const userWords = normalizedInput.split(' ');
  const correctWords = normalizedCorrect.split(' ');
  const grammarFeedback = detectGrammarIssue(userWords, correctWords);

  if (grammarFeedback.length === 0) {
    grammarFeedback.push({
      topic: 'word-order',
      message: 'Not quite right — compare your answer with the correct one',
      correct: sentence.de,
      userAttempt: userInput,
      explanation: sentence.grammarPoints.join('. ') || 'Review the sentence structure carefully.',
    });
  }

  return {
    isCorrect: false,
    feedback: grammarFeedback,
    correctAnswer: sentence.de,
  };
}
