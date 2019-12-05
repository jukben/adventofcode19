type Program = ReadonlyArray<number>;
type Instruction = string;
type OpcodeFunction = (a: number, b: number) => number;

const parseInstruction = (instruction: Instruction) => {
  const [opCode2, opCode1, arg1, arg2, arg3] = instruction.split("").reverse();
  return {
    code: Number((opCode1 || "0") + opCode2),
    argModes: [+arg1 || 0, +arg2 || 0, +arg3 | 0]
  };
};

const interpret = (
  instructionIndex: number,
  program: Program,
  userInput: number
) => {
  const { code, argModes } = parseInstruction(
    String(program[instructionIndex])
  );

  const getValuePositionMode = (value: number) => program[value];
  const getValueImmediateMode = (value: number) => value;

  const positionsFn = [getValuePositionMode, getValueImmediateMode] as const;

  const getParameter = (
    index: number,
    getter = positionsFn[argModes[index]]
  ) => {
    return getter(+program[instructionIndex + index + 1]);
  };

  const add = ({ program }) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a + b;

    return instructionIndex + 1 + 3;
  };

  const multiply = ({ program }) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a * b;

    return instructionIndex + 1 + 3;
  };

  const equals = ({ program }) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a === b ? 1 : 0;

    return instructionIndex + 1 + 3;
  };

  const lessThan = ({ program }) => {
    const a = getParameter(0);
    const b = getParameter(1);
    const targetIndex = getParameter(2, getValueImmediateMode);

    program[targetIndex] = a < b ? 1 : 0;

    return instructionIndex + 1 + 3;
  };

  const jumpFalse = ({ program }) => {
    const a = getParameter(0);
    const b = getParameter(1);

    return a === 0 ? b : instructionIndex + 1 + 2;
  };

  const jumpTrue = ({ program }) => {
    const a = getParameter(0);
    const b = getParameter(1);

    return a !== 0 ? b : instructionIndex + 1 + 2;
  };

  const input = ({ program }) => {
    const value = getParameter(0, getValueImmediateMode);

    program[value] = userInput;

    return instructionIndex + 1 + 1;
  };

  const output = ({ program }) => {
    const value = getParameter(0, getValueImmediateMode);

    console.log("output", program[value]);

    return instructionIndex + 1 + 1;
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

  const performFunction = fn => {
    const newProgram = [...program];

    const nextPointer = fn({ program: newProgram });

    return { nextProgram: newProgram, nextPointer };
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
    return { halt: true };
  }

  throw Error(`Error in program, expected valid "opcode". Got ${code}`);
};

const run = (program: Program, input: number = 0) => {
  let program_ = [...program];

  let instruction = 0;
  while (instruction < program_.length) {
    const { nextProgram, halt, nextPointer } = interpret(
      +instruction,
      program_,
      input
    );

    if (halt) {
      return program_;
    }

    instruction = nextPointer;
    program_ = nextProgram;
  }

  return program_;
};

export { parseInstruction, run };
