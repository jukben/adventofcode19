type Program = Array<number>;

const IntCodeState = {
  RUNNING: 0,
  HALT: 1,
  WAITING: 2
} as const;

const parseInstruction = (instruction: number) => {
  const [opCode2, opCode1, arg1, arg2, arg3] = String(instruction)
    .split("")
    .reverse();

  return {
    code: Number((opCode1 || "0") + opCode2),
    argModes: [+arg1 || 0, +arg2 || 0, +arg3 | 0]
  };
};

const interpret = (
  instructionIndex: number,
  program: Program,
  userInputs: Array<number>
) => {
  const { code, argModes } = parseInstruction(program[instructionIndex]);

  const getValuePositionMode = (value: number) => program[value];
  const getValueImmediateMode = (value: number) => value;

  const positionsFn = [getValuePositionMode, getValueImmediateMode] as const;

  let programOutput: number | null = null;
  let nextPointer = instructionIndex + 1;

  const getParameter = (
    index: number,
    getter = positionsFn[argModes[index]]
  ) => {
    nextPointer++;
    return getter(+program[instructionIndex + index + 1]);
  };

  const add = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a + b;

    return { nextPointer };
  };

  const multiply = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a * b;

    return { nextPointer };
  };

  const equals = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a === b ? 1 : 0;

    return { nextPointer };
  };

  const lessThan = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a < b ? 1 : 0;

    return { nextPointer };
  };

  const jumpFalse = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);

    return { nextPointer: a === 0 ? b : nextPointer };
  };

  const jumpTrue = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);

    return { nextPointer: a !== 0 ? b : nextPointer };
  };

  const input = (program: Program) => {
    const value = getParameter(0, getValueImmediateMode);

    const input = userInputs.shift();

    if (input === undefined) {
      return { nextPointer: instructionIndex, status: IntCodeState.WAITING };
    }

    program[value] = input;

    return { nextPointer };
  };

  const output = (program: Program) => {
    const value = getParameter(0);

    programOutput = value;

    return { nextPointer };
  };

  const [
    ADD,
    MULTIPLY,
    INPUT,
    OUTPUT,
    JUMP_TRUE,
    JUMP_FALSE,
    LESS_THAN,
    EQUALS,
    HALT
  ] = [1, 2, 3, 4, 5, 6, 7, 8, 99];

  const performFunction = (
    fn: (program: Program) => { nextPointer: number; status?: number }
  ) => {
    const memory = [...program];

    const { nextPointer, status = IntCodeState.RUNNING } = fn(memory);

    return {
      memory: memory,
      nextPointer,
      output: programOutput,
      status
    };
  };

  if (code === INPUT) {
    return performFunction(input);
  }

  if (code === OUTPUT) {
    return performFunction(output);
  }

  if (code === ADD) {
    return performFunction(add);
  }

  if (code === MULTIPLY) {
    return performFunction(multiply);
  }

  if (code === EQUALS) {
    return performFunction(equals);
  }

  if (code === LESS_THAN) {
    return performFunction(lessThan);
  }

  if (code === JUMP_FALSE) {
    return performFunction(jumpFalse);
  }

  if (code === JUMP_TRUE) {
    return performFunction(jumpTrue);
  }

  if (code === HALT) {
    return {
      memory: program,
      nextPointer: instructionIndex,
      output: programOutput,
      status: IntCodeState.HALT
    };
  }

  throw Error(
    `Error in program, expected valid "opcode". Got ${code} at ${instructionIndex}`
  );
};

const run = (program: Program, userInput: Array<number>, pointer = 0) => {
  const outputs = [];

  const input = [...userInput];

  while (pointer < program.length) {
    const { memory, status, nextPointer, output } = interpret(
      pointer,
      program,
      input
    );

    if (status === IntCodeState.HALT || status === IntCodeState.WAITING) {
      return { program, outputs, status, pointer: nextPointer };
    }

    if (output !== null) {
      outputs.push(output);
    }

    pointer = nextPointer;
    program = memory;
  }

  throw Error(`Program not halted correctly!`);
};

const getConfigurations = (from: number, to: number) => {
  const configurations: Array<Array<number>> = [];

  // generate possible configurations
  for (let i = from; i <= to; i++) {
    const configuration = String(i)
      .padStart(5, String(from)[0])
      .split("")
      .map(Number);

    const unique = new Set(configuration).size === 5;

    if (!unique) {
      continue;
    }

    const isInvalid = configuration.findIndex(
      setting => setting > +String(to)[0] || setting < +String(from)[0]
    );

    if (isInvalid !== -1) {
      continue;
    }

    configurations.push(configuration);
  }

  return configurations;
};

const maxThruster = (program: Program) => {
  const configurations = getConfigurations(0, 43210);

  const maxThrusterSignalPerConfiguration = configurations.reduce(
    (acc, configuration) => {
      const maxThrusterSignal = configuration.reduce((max, amplification) => {
        const { outputs } = run(program, [amplification, max]);
        return outputs[0];
      }, 0);

      return [maxThrusterSignal, ...acc];
    },
    []
  );

  return Math.max(...maxThrusterSignalPerConfiguration);
};

/**
 */
const maxThrusterWithFeedbackLoop = (program: Program) => {
  const configurations = getConfigurations(56789, 98765);

  const maxThrusterSignalPerConfiguration = configurations.reduce(
    (acc, configuration, i) => {
      let ampIndex = 0;
      let lastSignal = 0;
      const ampMemory: Array<{ program: Program; pointer: number }> = [];

      while (true) {
        const { outputs, program: _program, status, pointer } = run(
          ampMemory[ampIndex] ? ampMemory[ampIndex].program : program,
          ampMemory[ampIndex]
            ? [lastSignal]
            : [configuration[ampIndex], lastSignal],
          ampMemory[ampIndex] ? ampMemory[ampIndex].pointer : 0
        );

        if (status === IntCodeState.HALT && ampIndex === 4) {
          return [outputs[0], ...acc];
        }

        if (status === IntCodeState.WAITING) {
          ampMemory[ampIndex] = {
            program: _program,
            pointer
          };
        }

        lastSignal = outputs[0];
        ampIndex = (ampIndex + 1) % 5;
      }
    },
    []
  );

  return Math.max(...maxThrusterSignalPerConfiguration);
};

export { parseInstruction, run, maxThruster, maxThrusterWithFeedbackLoop };
