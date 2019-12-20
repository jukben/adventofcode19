type Program = Array<string>;

const IntCodeState = {
  RUNNING: 0,
  HALT: 1,
  WAITING: 2
} as const;

const parseInstruction = (instruction: string) => {
  const [opCode2, opCode1, arg1, arg2, arg3] = instruction.split("").reverse();

  return {
    code: (opCode1 || "0") + opCode2,
    argModes: [+arg1 || 0, +arg2 || 0, +arg3 | 0]
  };
};

const interpret = (
  instructionIndex: number,
  program: Program,
  userInputs: Array<string>,
  relativeAddressBase: number
) => {
  const { code, argModes } = parseInstruction(program[instructionIndex]);

  const getValuePositionMode = (value: number) => program[value] || 0;
  const getValueImmediateMode = (value: number) => value;
  const getRelativeMode = (value: number) =>
    getValuePositionMode(relativeAddressBase + value);

  const positionsFn = [
    getValuePositionMode,
    getValueImmediateMode,
    getRelativeMode
  ] as const;

  let programOutput: number | null = null;
  let nextPointer = instructionIndex + 1;

  const getParameter = (
    index: number,
    getter = positionsFn[argModes[index]]
  ) => {
    nextPointer++;
    return +getter(+program[instructionIndex + index + 1]);
  };

  const getAddress = (index: number) => {
    nextPointer++;
    return (
      (argModes[index] === 2 ? relativeAddressBase : 0) +
      +program[instructionIndex + 1 + index]
    );
  };

  const add = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getAddress(2);

    program[targetIndex] = BigInt(a + b).toString();

    return { nextPointer };
  };

  const multiply = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getAddress(2);

    program[targetIndex] = BigInt(a * b).toString();

    return { nextPointer };
  };

  const equals = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getAddress(2);

    program[targetIndex] = a === b ? "1" : "0";

    return { nextPointer };
  };

  const lessThan = (program: Program) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getAddress(2);

    program[targetIndex] = a < b ? "1" : "0";

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
    const targetIndex = getAddress(0);

    const input = userInputs.shift();

    if (input === undefined) {
      return { nextPointer: instructionIndex, status: IntCodeState.WAITING };
    }

    program[targetIndex] = input;

    return { nextPointer };
  };

  const output = (program: Program) => {
    const value = getParameter(0);

    programOutput = value;

    return { nextPointer };
  };

  const adjustRelativeBase = (program: Program) => {
    const value = getParameter(0);

    relativeAddressBase = relativeAddressBase + value;

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
    ADJUST_RELATIVE_BASE,
    HALT
  ] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "99"];

  const performFunction = (
    fn: (program: Program) => { nextPointer: number; status?: number }
  ) => {
    const memory = [...program];

    const { nextPointer, status = IntCodeState.RUNNING } = fn(memory);

    return {
      memory,
      nextPointer,
      output: programOutput,
      status,
      relativeAddressBase
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

  if (code === ADJUST_RELATIVE_BASE) {
    return performFunction(adjustRelativeBase);
  }

  if (code === HALT) {
    return {
      memory: program,
      nextPointer: instructionIndex,
      output: programOutput,
      status: IntCodeState.HALT,
      relativeAddressBase
    };
  }

  throw Error(
    `Error in program, expected valid "opcode". Got ${code} at ${instructionIndex}`
  );
};

const run = (
  program: Array<number | string>,
  input: Array<number>,
  pointer = 0
) => {
  const outputs = [];

  const input_ = [...input].map(String);
  let program_ = [...program].map(String);
  let pointer_ = pointer;

  let relativeAddressBaseHolder = 0;

  while (pointer < program.length) {
    const {
      memory,
      status,
      nextPointer,
      output,
      relativeAddressBase
    } = interpret(pointer_, program_, input_, relativeAddressBaseHolder);

    if (status === IntCodeState.HALT || status === IntCodeState.WAITING) {
      return {
        program: program_,
        outputs,
        status,
        pointer: nextPointer
      };
    }

    if (output !== null) {
      outputs.push(output);
    }

    pointer_ = nextPointer;
    program_ = memory;
    relativeAddressBaseHolder = relativeAddressBase;
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

const maxThruster = (program: Array<number | string>) => {
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
const maxThrusterWithFeedbackLoop = (program: Array<number | string>) => {
  const configurations = getConfigurations(56789, 98765);

  const maxThrusterSignalPerConfiguration = configurations.reduce(
    (acc, configuration) => {
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
