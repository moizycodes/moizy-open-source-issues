const deepEqual = require('../utils/deepEqual');

const firstUser = {
  id: 1,
  profile: {
    name: 'Naveen',
    skills: ['JavaScript', 'Git']
  }
};

const secondUser = {
  id: 1,
  profile: {
    name: 'Naveen',
    skills: ['JavaScript', 'Git']
  }
};

const thirdUser = {
  id: 1,
  profile: {
    name: 'Naveen',
    skills: ['Git', 'JavaScript']
  }
};

console.log(deepEqual(firstUser, secondUser));
console.log(deepEqual(firstUser, thirdUser));