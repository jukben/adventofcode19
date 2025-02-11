import {
  parseInstruction,
  run,
  maxThruster,
  maxThrusterWithFeedbackLoop
} from "./7";

test("#parseInstruction", () => {
  expect(parseInstruction(1002)).toEqual({
    code: 2,
    argModes: [0, 1, 0]
  });

  expect(parseInstruction(11005)).toEqual({
    code: 5,
    argModes: [0, 1, 1]
  });

  expect(parseInstruction(99)).toEqual({
    code: 99,
    argModes: [0, 0, 0]
  });

  expect(parseInstruction(11101)).toEqual({
    code: 1,
    argModes: [1, 1, 1]
  });

  expect(parseInstruction(10001)).toEqual({
    code: 1,
    argModes: [0, 0, 1]
  });
});

test("#run", () => {
  expect(run([1002, 4, 3, 4, 33], []).program).toEqual([1002, 4, 3, 4, 99]);
  expect(run([1002, 4, -3, 4, 33], []).program).toEqual([1002, 4, -3, 4, -99]);
});

test("#run; position - equal", () => {
  const { program, outputs } = run([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [8]);
  expect(outputs).toEqual([1]);
  expect(program).toMatchInlineSnapshot(`
    Array [
      3,
      9,
      8,
      9,
      10,
      9,
      4,
      9,
      99,
      1,
      8,
    ]
  `);
});

test("#run; immediate mode - equal", () => {
  const { program, outputs } = run([3, 3, 1108, -1, 8, 3, 4, 3, 99], [8]);
  expect(outputs).toEqual([1]);
  expect(program).toMatchInlineSnapshot(`
    Array [
      3,
      3,
      1108,
      1,
      8,
      3,
      4,
      3,
      99,
    ]
  `);
});

test("#run; position mode - less than", () => {
  const { program, outputs } = run([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [8]);
  expect(outputs).toEqual([0]);
  expect(program).toMatchInlineSnapshot(`
    Array [
      3,
      9,
      7,
      9,
      10,
      9,
      4,
      9,
      99,
      0,
      8,
    ]
  `);
});

test("#run; immediate mode - less than", () => {
  const { program, outputs } = run([3, 3, 1107, -1, 8, 3, 4, 3, 99], [8]);
  expect(outputs).toEqual([0]);
  expect(program).toMatchInlineSnapshot(`
    Array [
      3,
      3,
      1107,
      0,
      8,
      3,
      4,
      3,
      99,
    ]
  `);
});

test("#run; position mode - jump", () => {
  const { program, outputs } = run(
    [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
    [1]
  );

  expect(outputs).toEqual([1]);
  expect(program).toMatchInlineSnapshot(`
    Array [
      3,
      12,
      6,
      12,
      15,
      1,
      13,
      14,
      13,
      4,
      13,
      99,
      1,
      1,
      1,
      9,
    ]
  `);
});

test("#run; position mode - jump", () => {
  const { program, outputs } = run([1006, 0, 2, 99], [1]);

  expect(outputs).toEqual([]);
  expect(program).toMatchInlineSnapshot(`
    Array [
      1006,
      0,
      2,
      99,
    ]
  `);
});

test("#run; immediate mode - jump", () => {
  const { program, outputs } = run(
    [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1],
    [1]
  );

  expect(outputs).toEqual([1]);

  expect(program).toMatchInlineSnapshot(`
    Array [
      3,
      3,
      1105,
      1,
      9,
      1101,
      0,
      0,
      12,
      4,
      12,
      99,
      1,
    ]
  `);
});

test("more jumptests", () => {
  expect(
    run([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [0]).outputs
  ).toEqual([0]);
  expect(
    run([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], [1212])
      .outputs
  ).toEqual([1]);
});

test("#run; day 5 1/2", () => {
  const { program, outputs } = run(
    [
      3,
      225,
      1,
      225,
      6,
      6,
      1100,
      1,
      238,
      225,
      104,
      0,
      1002,
      92,
      42,
      224,
      1001,
      224,
      -3444,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      4,
      224,
      224,
      1,
      224,
      223,
      223,
      1102,
      24,
      81,
      225,
      1101,
      89,
      36,
      224,
      101,
      -125,
      224,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      5,
      224,
      224,
      1,
      224,
      223,
      223,
      2,
      118,
      191,
      224,
      101,
      -880,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      1001,
      224,
      7,
      224,
      1,
      224,
      223,
      223,
      1102,
      68,
      94,
      225,
      1101,
      85,
      91,
      225,
      1102,
      91,
      82,
      225,
      1102,
      85,
      77,
      224,
      101,
      -6545,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      101,
      7,
      224,
      224,
      1,
      223,
      224,
      223,
      1101,
      84,
      20,
      225,
      102,
      41,
      36,
      224,
      101,
      -3321,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      101,
      7,
      224,
      224,
      1,
      223,
      224,
      223,
      1,
      188,
      88,
      224,
      101,
      -183,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      1001,
      224,
      7,
      224,
      1,
      224,
      223,
      223,
      1001,
      84,
      43,
      224,
      1001,
      224,
      -137,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      4,
      224,
      224,
      1,
      224,
      223,
      223,
      1102,
      71,
      92,
      225,
      1101,
      44,
      50,
      225,
      1102,
      29,
      47,
      225,
      101,
      7,
      195,
      224,
      101,
      -36,
      224,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      6,
      224,
      224,
      1,
      223,
      224,
      223,
      4,
      223,
      99,
      0,
      0,
      0,
      677,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1105,
      0,
      99999,
      1105,
      227,
      247,
      1105,
      1,
      99999,
      1005,
      227,
      99999,
      1005,
      0,
      256,
      1105,
      1,
      99999,
      1106,
      227,
      99999,
      1106,
      0,
      265,
      1105,
      1,
      99999,
      1006,
      0,
      99999,
      1006,
      227,
      274,
      1105,
      1,
      99999,
      1105,
      1,
      280,
      1105,
      1,
      99999,
      1,
      225,
      225,
      225,
      1101,
      294,
      0,
      0,
      105,
      1,
      0,
      1105,
      1,
      99999,
      1106,
      0,
      300,
      1105,
      1,
      99999,
      1,
      225,
      225,
      225,
      1101,
      314,
      0,
      0,
      106,
      0,
      0,
      1105,
      1,
      99999,
      107,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      329,
      1001,
      223,
      1,
      223,
      1108,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      344,
      101,
      1,
      223,
      223,
      1107,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      359,
      101,
      1,
      223,
      223,
      8,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      374,
      1001,
      223,
      1,
      223,
      1107,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      389,
      1001,
      223,
      1,
      223,
      1008,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      404,
      1001,
      223,
      1,
      223,
      108,
      677,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      419,
      1001,
      223,
      1,
      223,
      1107,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      434,
      101,
      1,
      223,
      223,
      1008,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      449,
      1001,
      223,
      1,
      223,
      107,
      226,
      226,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      464,
      1001,
      223,
      1,
      223,
      1007,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      479,
      1001,
      223,
      1,
      223,
      1108,
      226,
      226,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      494,
      1001,
      223,
      1,
      223,
      8,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      509,
      1001,
      223,
      1,
      223,
      7,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      524,
      101,
      1,
      223,
      223,
      1008,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      539,
      101,
      1,
      223,
      223,
      107,
      226,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      554,
      1001,
      223,
      1,
      223,
      1108,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      569,
      101,
      1,
      223,
      223,
      108,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      584,
      1001,
      223,
      1,
      223,
      7,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      599,
      1001,
      223,
      1,
      223,
      108,
      226,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      614,
      101,
      1,
      223,
      223,
      1007,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      629,
      101,
      1,
      223,
      223,
      7,
      677,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      644,
      101,
      1,
      223,
      223,
      1007,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      659,
      1001,
      223,
      1,
      223,
      8,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      674,
      1001,
      223,
      1,
      223,
      4,
      223,
      99,
      226
    ],
    [5]
  );

  expect(outputs).toEqual([742621]);
  expect(program).toMatchInlineSnapshot(`
    Array [
      314,
      225,
      1,
      225,
      6,
      6,
      1105,
      1,
      238,
      225,
      104,
      0,
      1002,
      92,
      42,
      224,
      1001,
      224,
      -3444,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      4,
      224,
      224,
      1,
      224,
      223,
      223,
      1102,
      24,
      81,
      225,
      1101,
      89,
      36,
      224,
      101,
      -125,
      224,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      5,
      224,
      224,
      1,
      224,
      223,
      223,
      2,
      118,
      191,
      224,
      101,
      -880,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      1001,
      224,
      7,
      224,
      1,
      224,
      223,
      223,
      1102,
      68,
      94,
      225,
      1101,
      85,
      91,
      225,
      1102,
      91,
      82,
      225,
      1102,
      85,
      77,
      224,
      101,
      -6545,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      101,
      7,
      224,
      224,
      1,
      223,
      224,
      223,
      1101,
      84,
      20,
      225,
      102,
      41,
      36,
      224,
      101,
      -3321,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      101,
      7,
      224,
      224,
      1,
      223,
      224,
      223,
      1,
      188,
      88,
      224,
      101,
      -183,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      1001,
      224,
      7,
      224,
      1,
      224,
      223,
      223,
      1001,
      84,
      43,
      224,
      1001,
      224,
      -137,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      4,
      224,
      224,
      1,
      224,
      223,
      223,
      1102,
      71,
      92,
      225,
      1101,
      44,
      50,
      225,
      1102,
      29,
      47,
      225,
      101,
      7,
      195,
      224,
      101,
      -36,
      224,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      6,
      224,
      224,
      1,
      223,
      224,
      223,
      4,
      223,
      99,
      742621,
      0,
      20,
      677,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1105,
      0,
      99999,
      1105,
      227,
      247,
      1105,
      1,
      99999,
      1005,
      227,
      99999,
      1005,
      0,
      256,
      1105,
      1,
      99999,
      1106,
      227,
      99999,
      1106,
      0,
      265,
      1105,
      1,
      99999,
      1006,
      0,
      99999,
      1006,
      227,
      274,
      1105,
      1,
      99999,
      1105,
      1,
      280,
      1105,
      1,
      99999,
      1,
      225,
      225,
      225,
      1101,
      294,
      0,
      0,
      105,
      1,
      0,
      1105,
      1,
      99999,
      1106,
      0,
      300,
      1105,
      1,
      99999,
      1,
      225,
      225,
      225,
      1101,
      314,
      0,
      0,
      106,
      0,
      0,
      1105,
      1,
      99999,
      107,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      329,
      1001,
      223,
      1,
      223,
      1108,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      344,
      101,
      1,
      223,
      223,
      1107,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      359,
      101,
      1,
      223,
      223,
      8,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      374,
      1001,
      223,
      1,
      223,
      1107,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      389,
      1001,
      223,
      1,
      223,
      1008,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      404,
      1001,
      223,
      1,
      223,
      108,
      677,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      419,
      1001,
      223,
      1,
      223,
      1107,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      434,
      101,
      1,
      223,
      223,
      1008,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      449,
      1001,
      223,
      1,
      223,
      107,
      226,
      226,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      464,
      1001,
      223,
      1,
      223,
      1007,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      479,
      1001,
      223,
      1,
      223,
      1108,
      226,
      226,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      494,
      1001,
      223,
      1,
      223,
      8,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      509,
      1001,
      223,
      1,
      223,
      7,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      524,
      101,
      1,
      223,
      223,
      1008,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      539,
      101,
      1,
      223,
      223,
      107,
      226,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      554,
      1001,
      223,
      1,
      223,
      1108,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      569,
      101,
      1,
      223,
      223,
      108,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      584,
      1001,
      223,
      1,
      223,
      7,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      599,
      1001,
      223,
      1,
      223,
      108,
      226,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      614,
      101,
      1,
      223,
      223,
      1007,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      629,
      101,
      1,
      223,
      223,
      7,
      677,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      644,
      101,
      1,
      223,
      223,
      1007,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      659,
      1001,
      223,
      1,
      223,
      8,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      674,
      1001,
      223,
      1,
      223,
      4,
      223,
      99,
      226,
    ]
  `);
});

test("#run; day 5 2/2", () => {
  const { outputs, status } = run(
    [
      3,
      225,
      1,
      225,
      6,
      6,
      1100,
      1,
      238,
      225,
      104,
      0,
      1002,
      92,
      42,
      224,
      1001,
      224,
      -3444,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      4,
      224,
      224,
      1,
      224,
      223,
      223,
      1102,
      24,
      81,
      225,
      1101,
      89,
      36,
      224,
      101,
      -125,
      224,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      5,
      224,
      224,
      1,
      224,
      223,
      223,
      2,
      118,
      191,
      224,
      101,
      -880,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      1001,
      224,
      7,
      224,
      1,
      224,
      223,
      223,
      1102,
      68,
      94,
      225,
      1101,
      85,
      91,
      225,
      1102,
      91,
      82,
      225,
      1102,
      85,
      77,
      224,
      101,
      -6545,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      101,
      7,
      224,
      224,
      1,
      223,
      224,
      223,
      1101,
      84,
      20,
      225,
      102,
      41,
      36,
      224,
      101,
      -3321,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      101,
      7,
      224,
      224,
      1,
      223,
      224,
      223,
      1,
      188,
      88,
      224,
      101,
      -183,
      224,
      224,
      4,
      224,
      1002,
      223,
      8,
      223,
      1001,
      224,
      7,
      224,
      1,
      224,
      223,
      223,
      1001,
      84,
      43,
      224,
      1001,
      224,
      -137,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      4,
      224,
      224,
      1,
      224,
      223,
      223,
      1102,
      71,
      92,
      225,
      1101,
      44,
      50,
      225,
      1102,
      29,
      47,
      225,
      101,
      7,
      195,
      224,
      101,
      -36,
      224,
      224,
      4,
      224,
      102,
      8,
      223,
      223,
      101,
      6,
      224,
      224,
      1,
      223,
      224,
      223,
      4,
      223,
      99,
      0,
      0,
      0,
      677,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1105,
      0,
      99999,
      1105,
      227,
      247,
      1105,
      1,
      99999,
      1005,
      227,
      99999,
      1005,
      0,
      256,
      1105,
      1,
      99999,
      1106,
      227,
      99999,
      1106,
      0,
      265,
      1105,
      1,
      99999,
      1006,
      0,
      99999,
      1006,
      227,
      274,
      1105,
      1,
      99999,
      1105,
      1,
      280,
      1105,
      1,
      99999,
      1,
      225,
      225,
      225,
      1101,
      294,
      0,
      0,
      105,
      1,
      0,
      1105,
      1,
      99999,
      1106,
      0,
      300,
      1105,
      1,
      99999,
      1,
      225,
      225,
      225,
      1101,
      314,
      0,
      0,
      106,
      0,
      0,
      1105,
      1,
      99999,
      107,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      329,
      1001,
      223,
      1,
      223,
      1108,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      344,
      101,
      1,
      223,
      223,
      1107,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      359,
      101,
      1,
      223,
      223,
      8,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      374,
      1001,
      223,
      1,
      223,
      1107,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      389,
      1001,
      223,
      1,
      223,
      1008,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      404,
      1001,
      223,
      1,
      223,
      108,
      677,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      419,
      1001,
      223,
      1,
      223,
      1107,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      434,
      101,
      1,
      223,
      223,
      1008,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      449,
      1001,
      223,
      1,
      223,
      107,
      226,
      226,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      464,
      1001,
      223,
      1,
      223,
      1007,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      479,
      1001,
      223,
      1,
      223,
      1108,
      226,
      226,
      224,
      102,
      2,
      223,
      223,
      1006,
      224,
      494,
      1001,
      223,
      1,
      223,
      8,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      509,
      1001,
      223,
      1,
      223,
      7,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      524,
      101,
      1,
      223,
      223,
      1008,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      539,
      101,
      1,
      223,
      223,
      107,
      226,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      554,
      1001,
      223,
      1,
      223,
      1108,
      677,
      226,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      569,
      101,
      1,
      223,
      223,
      108,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      584,
      1001,
      223,
      1,
      223,
      7,
      677,
      226,
      224,
      1002,
      223,
      2,
      223,
      1005,
      224,
      599,
      1001,
      223,
      1,
      223,
      108,
      226,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      614,
      101,
      1,
      223,
      223,
      1007,
      677,
      677,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      629,
      101,
      1,
      223,
      223,
      7,
      677,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      644,
      101,
      1,
      223,
      223,
      1007,
      226,
      226,
      224,
      1002,
      223,
      2,
      223,
      1006,
      224,
      659,
      1001,
      223,
      1,
      223,
      8,
      226,
      677,
      224,
      102,
      2,
      223,
      223,
      1005,
      224,
      674,
      1001,
      223,
      1,
      223,
      4,
      223,
      99,
      226
    ],
    [1]
  );

  expect(outputs).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 9961446]);
  expect(status).toEqual(1);
});

test("#run - larger example", () => {
  const program = [
    3,
    21,
    1008,
    21,
    8,
    20,
    1005,
    20,
    22,
    107,
    8,
    21,
    20,
    1006,
    20,
    31,
    1106,
    0,
    36,
    98,
    0,
    0,
    1002,
    21,
    125,
    20,
    4,
    20,
    1105,
    1,
    46,
    104,
    999,
    1105,
    1,
    46,
    1101,
    1000,
    1,
    20,
    4,
    20,
    1105,
    1,
    46,
    98,
    99
  ];

  expect(run(program, [6]).outputs).toEqual([999]);
  expect(run(program, [8]).outputs).toEqual([1000]);
  expect(run(program, [9]).outputs).toEqual([1001]);
});

test("Max thruster should be 43210", () => {
  expect(
    maxThruster([
      3,
      15,
      3,
      16,
      1002,
      16,
      10,
      16,
      1,
      16,
      15,
      15,
      4,
      15,
      99,
      0,
      0
    ])
  ).toBe(43210);
});

test("Max thruster should be 54321", () => {
  expect(
    maxThruster([
      3,
      23,
      3,
      24,
      1002,
      24,
      10,
      24,
      1002,
      23,
      -1,
      23,
      101,
      5,
      23,
      23,
      1,
      24,
      23,
      23,
      4,
      23,
      99,
      0,
      0
    ])
  ).toBe(54321);
});

test("Max thruster should be 65210", () => {
  expect(
    maxThruster([
      3,
      31,
      3,
      32,
      1002,
      32,
      10,
      32,
      1001,
      31,
      -2,
      31,
      1007,
      31,
      0,
      33,
      1002,
      33,
      7,
      33,
      1,
      33,
      31,
      31,
      1,
      32,
      31,
      31,
      4,
      31,
      99,
      0,
      0,
      0
    ])
  ).toBe(65210);
});

test("Max thruster should be 437860", () => {
  expect(
    maxThruster([
      3,
      8,
      1001,
      8,
      10,
      8,
      105,
      1,
      0,
      0,
      21,
      46,
      55,
      72,
      85,
      110,
      191,
      272,
      353,
      434,
      99999,
      3,
      9,
      1002,
      9,
      5,
      9,
      1001,
      9,
      2,
      9,
      102,
      3,
      9,
      9,
      101,
      2,
      9,
      9,
      102,
      4,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      102,
      5,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      2,
      9,
      101,
      2,
      9,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      4,
      9,
      101,
      3,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      3,
      9,
      101,
      5,
      9,
      9,
      1002,
      9,
      3,
      9,
      101,
      3,
      9,
      9,
      1002,
      9,
      5,
      9,
      4,
      9,
      99,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      99,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      101,
      1,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      99,
      3,
      9,
      101,
      1,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      99
    ])
  ).toBe(437860);
});

test("Max thruster with feedback loop should be 139629729", () => {
  expect(
    maxThrusterWithFeedbackLoop([
      3,
      26,
      1001,
      26,
      -4,
      26,
      3,
      27,
      1002,
      27,
      2,
      27,
      1,
      27,
      26,
      27,
      4,
      27,
      1001,
      28,
      -1,
      28,
      1005,
      28,
      6,
      99,
      0,
      0,
      5
    ])
  ).toBe(139629729);
});

test("Max thruster with feedback loop should be 18216", () => {
  expect(
    maxThrusterWithFeedbackLoop([
      3,
      52,
      1001,
      52,
      -5,
      52,
      3,
      53,
      1,
      52,
      56,
      54,
      1007,
      54,
      5,
      55,
      1005,
      55,
      26,
      1001,
      54,
      -5,
      54,
      1105,
      1,
      12,
      1,
      53,
      54,
      53,
      1008,
      54,
      0,
      55,
      1001,
      55,
      1,
      55,
      2,
      53,
      55,
      53,
      4,
      53,
      1001,
      56,
      -1,
      56,
      1005,
      56,
      6,
      99,
      0,
      0,
      0,
      0,
      10
    ])
  ).toBe(18216);
});

test("Max thruster with feedback loop should be 18216", () => {
  expect(
    maxThrusterWithFeedbackLoop([
      3,
      8,
      1001,
      8,
      10,
      8,
      105,
      1,
      0,
      0,
      21,
      46,
      55,
      72,
      85,
      110,
      191,
      272,
      353,
      434,
      99999,
      3,
      9,
      1002,
      9,
      5,
      9,
      1001,
      9,
      2,
      9,
      102,
      3,
      9,
      9,
      101,
      2,
      9,
      9,
      102,
      4,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      102,
      5,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      2,
      9,
      101,
      2,
      9,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      4,
      9,
      101,
      3,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      3,
      9,
      101,
      5,
      9,
      9,
      1002,
      9,
      3,
      9,
      101,
      3,
      9,
      9,
      1002,
      9,
      5,
      9,
      4,
      9,
      99,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      99,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      101,
      1,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      99,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      101,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      1,
      9,
      4,
      9,
      99,
      3,
      9,
      101,
      1,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1002,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      102,
      2,
      9,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      3,
      9,
      1001,
      9,
      2,
      9,
      4,
      9,
      99
    ])
  ).toBe(49810599);
});
