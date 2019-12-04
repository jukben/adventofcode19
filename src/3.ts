type Path = Array<string>;
type World = Record<string, Record<string, number>>;

const getDirection = (step: string) => {
  const [direction, ...length] = step;

  return ({ direction, length: +length.join("") } as unknown) as {
    direction: "R" | "L" | "D" | "U";
    length: number;
  };
};

const drawLine = ({
  world,
  onIntersection
}: {
  world: World;
  onIntersection?: (x: number, y: number) => void;
}) => (path: Path, lineId: number) => {
  const origin = [0, 0];
  let intersectionSteps = {};
  let steps = 0;

  const drawPixel = (x: number, y: number) => {
    steps++;

    if (!world[x]) {
      world[x] = { [y]: lineId };
      return;
    }

    if (world[x][y] !== undefined && world[x][y] !== lineId) {
      onIntersection && onIntersection(x, y);
      intersectionSteps[`${x}${y}`] = steps;
      world[x][y] = steps;
      return;
    }

    world[x][y] = lineId;
  };

  for (const step of path) {
    let { direction, length } = getDirection(step);
    while (length--) {
      if (direction === "D") {
        drawPixel(origin[0], --origin[1]);
      }

      if (direction === "U") {
        drawPixel(origin[0], ++origin[1]);
      }

      if (direction === "R") {
        drawPixel(++origin[0], origin[1]);
      }

      if (direction === "L") {
        drawPixel(--origin[0], origin[1]);
      }
    }
  }

  return intersectionSteps;
};

const getDistance = (a: Path, b: Path) => {
  const world = {};
  const intersection = [];

  const onIntersection = (x: number, y: number) =>
    intersection.push(Math.abs(x) + Math.abs(y));

  [a, b].forEach(drawLine({ world, onIntersection }));

  return Math.min(...intersection);
};

const getSteps = (a: Path, b: Path) => {
  const world1 = {};
  const [, stepsA] = [b, a].map(drawLine({ world: world1 }));

  const world2 = {};
  const [, stepsB] = [a, b].map(drawLine({ world: world2 }));

  const steps = [];
  for (const cords of Object.keys(stepsA)) {
    steps.push(stepsA[cords] + stepsB[cords]);
  }

  return Math.min(...steps);
};

export { getDistance, getSteps };
