const REGEX_ADJACENT_DIGIT = /(\d)\1/;

const testPassword = (password: number) => {
  const stringifiedPassword = String(password);

  if (stringifiedPassword.length != 6) return false;

  if (!REGEX_ADJACENT_DIGIT.test(stringifiedPassword)) return false;

  let last = +stringifiedPassword[0];

  for (let i = 1; i < stringifiedPassword.length; i++) {
    const curr = +stringifiedPassword[i];

    if (curr < last) {
      return false;
    }

    last = curr;
  }

  return true;
};

const testPasswordBetter = (password: number) => {
  const stringifiedPassword = String(password);

  if (stringifiedPassword.length != 6) return false;

  let last = +stringifiedPassword[0];
  for (let i = 1; i < stringifiedPassword.length; i++) {
    const curr = +stringifiedPassword[i];

    if (curr < last) {
      return false;
    }

    last = curr;
  }

  let adjacent = {};
  for (let i = 0; i < stringifiedPassword.length; i++) {
    const curr = +stringifiedPassword[i];

    if (adjacent[curr]) {
      adjacent[curr]++;
    } else {
      adjacent[curr] = 1;
    }
  }

  return !!Object.values(adjacent).find(adjacentNumber => adjacentNumber === 2);
};

const bruteforcePassword = (
  from: number,
  to: number,
  fn: (n: number) => boolean
) => {
  let passToTry = from;
  let found = 0;
  while (passToTry < to) {
    if (fn(passToTry)) {
      found++;
    }
    passToTry++;
  }

  return found;
};

export { bruteforcePassword, testPassword, testPasswordBetter };
