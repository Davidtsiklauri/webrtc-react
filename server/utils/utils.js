module.exports = class Utils {
  getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  getRandomByArrayIndex(target, index) {
    return target[index];
  }
};
