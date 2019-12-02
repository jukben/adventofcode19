type Program = ReadonlyArray<number>;
type OpcodeFunction = (a: number, b: number) => number;

const add: OpcodeFunction = (a, b) => a + b;

const multiply: OpcodeFunction = (a, b) => a * b;

const interpret = (start: number, program: Program) => {
  const [ADD, MULTIPLY, HALT] = [1, 2, 99];

  const instruction = program[start];

  const getValueAtAddress = (address: number) => program[address];

  const getParameters = () => ({
    a: getValueAtAddress(getValueAtAddress(start + 1)),
    b: getValueAtAddress(getValueAtAddress(start + 2)),
    targetIndex: getValueAtAddress(start + 3)
  });

  const performFunction = (fn: OpcodeFunction) => {
    const newProgram = [...program];

    const { a, b, targetIndex } = getParameters();

    newProgram[targetIndex] = fn(a, b);

    return newProgram;
  };

  if (instruction === ADD) {
    return performFunction(add);
  }

  if (instruction === MULTIPLY) {
    return performFunction(multiply);
  }

  if (instruction === HALT) {
    return false;
  }

  throw Error(`Error in program, expected valid "opcode"`);
};

const run = (program: Program) => {
  let program_ = [...program];

  let instruction = 0;
  while (instruction < program_.length) {
    const result = interpret(instruction, program_);

    if (!result) {
      return program_;
    }

    instruction += 4;
    program_ = result;
  }

  return program_;
};

const findNounAndVerb = (program: Program): [number, number] => {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      let _program = [...program];
      _program[1] = noun;
      _program[2] = verb;

      const [output] = run(_program);

      if (output === 19690720) {
        return [noun, verb];
      }
    }
  }
};

export { run, findNounAndVerb };
