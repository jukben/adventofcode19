const parseOrbits = (orbits: string) => {
  return orbits
    .split("\n")
    .map(o => o.trim())
    .reduce((acc, val) => {
      const [orbit, orbiter] = val.split(")");
      const orbiters = acc[orbit];

      acc[orbit] = [orbiter, ...(orbiters || [])];

      return acc;
    }, {} as Record<string, Array<string>>);
};

const getOrbit = (orbit: string, orbits: Record<string, Array<string>>) => {
  if (!orbits[orbit]) return [];

  const otherOrbits = orbits[orbit].reduce((acc, v) => {
    acc = [...getOrbit(v, orbits), ...acc];
    return acc;
  }, [] as Array<string>);

  return [...orbits[orbit], ...otherOrbits];
};

const getOrbitChecksum = (orbits: string) => {
  const parsedOrbits = parseOrbits(orbits);
  return Object.keys(parsedOrbits)
    .map(orbit => getOrbit(orbit, parsedOrbits).length)
    .reduce((acc, v) => acc + v, 0);
};

const getPathFor = (
  find: string,
  parsedOrbits: Record<string, Array<string>>
) => {
  return Object.entries(parsedOrbits).reduce((acc, [orbit, orbiter]) => {
    if (orbiter.includes(find)) {
      acc = [find, ...getPathFor(orbit, parsedOrbits)];
    }

    return acc;
  }, [] as Array<string>);
};

const getPath = (orbits: string) => {
  const parsedOrbits = parseOrbits(orbits);

  const steps = ["YOU", "SAN"]
    .map(target => getPathFor(target, parsedOrbits))
    .reduce((acc, v, i, arr) => {
      if (!arr[i + 1]) return acc;

      const path1 = v;
      const path2 = arr[i + 1];

      const intersectionPoint = path1.filter(x => path2.includes(x))[0];

      return (
        path1.indexOf(intersectionPoint) + path2.indexOf(intersectionPoint) - 2
      );
    }, 0);

  return steps;
};

export { getOrbitChecksum, getPath };
