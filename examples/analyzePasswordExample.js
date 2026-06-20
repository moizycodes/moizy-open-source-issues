const analyzePassword = require('../utils/analyzePassword');

const samples = [
  'Password123',
  'abc',
  'aaaaaaa',
  'password',
  '123456789',
  '@@@@@@@',
  'VeryLongPassword123!@#'
];

samples.forEach((password) => {
  const result = analyzePassword(password);

  console.log(`Password: ${JSON.stringify(password)}`);
  console.log(`  Score:    ${result.score}`);
  console.log(`  Strength: ${result.strength}`);
  console.log(`  Feedback: ${result.feedback.join(', ') || 'None'}`);
  console.log('');
});
