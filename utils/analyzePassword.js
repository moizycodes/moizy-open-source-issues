/**
 * A short list of the most common, easily guessable passwords.
 * Any password matching one of these is treated as inherently weak.
 */
const COMMON_PASSWORDS = new Set([
  'password',
  'password1',
  'passw0rd',
  '123456',
  '1234567',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'qwertyuiop',
  'abc123',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  'iloveyou',
  'dragon',
  'sunshine',
  'princess',
  'football',
  'login',
  'master'
]);

/**
 * Common keyboard and alphabetical/numeric sequences used to detect
 * predictable patterns inside a password.
 */
const SEQUENCES = [
  'abcdefghijklmnopqrstuvwxyz',
  '01234567890',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm'
];

const STRENGTH_LEVELS = {
  WEAK: 'Weak',
  FAIR: 'Fair',
  GOOD: 'Good',
  STRONG: 'Strong'
};

const FEEDBACK = {
  EMPTY: 'Provide a password',
  LENGTH: 'Increase password length',
  UPPERCASE: 'Add uppercase letters',
  LOWERCASE: 'Add lowercase letters',
  NUMBERS: 'Add numbers',
  SPECIAL: 'Add special characters',
  REPEATED: 'Avoid repeated characters',
  SEQUENCE: 'Avoid predictable sequences',
  COMMON: 'This is a commonly used password'
};

/**
 * Analyzes the strength of a password and returns a score, a strength
 * classification and actionable feedback for improving it.
 *
 * Scoring is additive across length and character-diversity factors, with
 * penalties for repeated characters and predictable sequences. Known common
 * passwords are always classified as weak.
 *
 * @param {string} password - The password to analyze.
 * @returns {{score: number, strength: string, feedback: string[]}}
 */
const analyzePassword = (password) => {
  if (typeof password !== 'string' || password.length === 0) {
    return {
      score: 0,
      strength: STRENGTH_LEVELS.WEAK,
      feedback: [FEEDBACK.EMPTY]
    };
  }

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return {
      score: 0,
      strength: STRENGTH_LEVELS.WEAK,
      feedback: [FEEDBACK.COMMON]
    };
  }

  const feedback = [];
  let score = 0;

  score += scoreLength(password, feedback);
  score += scoreCharacterVariety(password, feedback);
  score -= penalizeRepeats(password, feedback);
  score -= penalizeSequences(password, feedback);

  const finalScore = clamp(score, 0, 100);

  return {
    score: finalScore,
    strength: classifyStrength(finalScore),
    feedback
  };
};

/**
 * Awards points based on password length and flags short passwords.
 *
 * @param {string} password
 * @param {string[]} feedback
 * @returns {number}
 */
const scoreLength = (password, feedback) => {
  const { length } = password;

  if (length >= 16) {
    return 40;
  }

  if (length >= 12) {
    return 35;
  }

  if (length >= 8) {
    return 25;
  }

  feedback.push(FEEDBACK.LENGTH);

  if (length >= 6) {
    return 15;
  }

  return 5;
};

/**
 * Awards points for each character class present and records feedback for
 * any class that is missing.
 *
 * @param {string} password
 * @param {string[]} feedback
 * @returns {number}
 */
const scoreCharacterVariety = (password, feedback) => {
  const checks = [
    { regex: /[a-z]/, points: 15, message: FEEDBACK.LOWERCASE },
    { regex: /[A-Z]/, points: 15, message: FEEDBACK.UPPERCASE },
    { regex: /[0-9]/, points: 15, message: FEEDBACK.NUMBERS },
    { regex: /[^A-Za-z0-9]/, points: 15, message: FEEDBACK.SPECIAL }
  ];

  return checks.reduce((points, check) => {
    if (check.regex.test(password)) {
      return points + check.points;
    }

    feedback.push(check.message);
    return points;
  }, 0);
};

/**
 * Penalizes runs of three or more identical characters (e.g. "aaaa").
 *
 * @param {string} password
 * @param {string[]} feedback
 * @returns {number}
 */
const penalizeRepeats = (password, feedback) => {
  if (/(.)\1\1/.test(password)) {
    feedback.push(FEEDBACK.REPEATED);
    return 20;
  }

  return 0;
};

/**
 * Penalizes predictable alphabetical, numeric or keyboard sequences of
 * length three or more (e.g. "abc", "123", "qwe").
 *
 * @param {string} password
 * @param {string[]} feedback
 * @returns {number}
 */
const penalizeSequences = (password, feedback) => {
  const lower = password.toLowerCase();

  const hasSequence = SEQUENCES.some((sequence) =>
    containsSequence(lower, sequence)
  );

  if (hasSequence) {
    feedback.push(FEEDBACK.SEQUENCE);
    return 15;
  }

  return 0;
};

/**
 * Checks whether the password contains any forward or reverse run of three
 * consecutive characters from the given reference sequence.
 *
 * @param {string} password
 * @param {string} sequence
 * @returns {boolean}
 */
const containsSequence = (password, sequence) => {
  const reversed = sequence.split('').reverse().join('');

  for (let i = 0; i <= sequence.length - 3; i += 1) {
    const forward = sequence.slice(i, i + 3);
    const backward = reversed.slice(i, i + 3);

    if (password.includes(forward) || password.includes(backward)) {
      return true;
    }
  }

  return false;
};

/**
 * Maps a numeric score to its strength label.
 *
 * @param {number} score
 * @returns {string}
 */
const classifyStrength = (score) => {
  if (score <= 30) {
    return STRENGTH_LEVELS.WEAK;
  }

  if (score <= 60) {
    return STRENGTH_LEVELS.FAIR;
  }

  if (score <= 80) {
    return STRENGTH_LEVELS.GOOD;
  }

  return STRENGTH_LEVELS.STRONG;
};

/**
 * Restricts a number to the inclusive range [min, max].
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

module.exports = analyzePassword;
