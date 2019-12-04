import { bruteforcePassword, testPassword, testPasswordBetter } from "./4";

test("#testPassword", () => {
  expect(testPassword(111111)).toBe(true);
  expect(testPassword(223450)).toBe(false);
  expect(testPassword(123789)).toBe(false);
  expect(testPassword(123788)).toBe(true);
  expect(testPassword(1)).toBe(false);
});

test("#testPasswordBetter", () => {
  expect(testPasswordBetter(112233)).toBe(true);
  expect(testPasswordBetter(123444)).toBe(false);
  expect(testPasswordBetter(123456)).toBe(false);
  expect(testPasswordBetter(111122)).toBe(true);
});

test("#bruteforcePassword", () => {
  expect(bruteforcePassword(145852, 616942, testPassword)).toBe(1767);
  expect(bruteforcePassword(145852, 616942, testPasswordBetter)).toBe(1192);
});
