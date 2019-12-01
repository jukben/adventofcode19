type Mass = number;

type FuelCalculation = (mass: Mass) => number;

const calculateFuel: FuelCalculation = mass => {
  const fuel = Math.floor(mass / 3) - 2;
  return fuel > 0 ? fuel : 0;
};

const computeFuelForSpacecraft = (
  modules: Array<Mass>,
  calculateFn: FuelCalculation
) => modules.map(calculateFn).reduce((sum, v) => sum + v, 0);

/**
 * Fuel itself requires fuel just like a module - take its mass, divide by
 * three, round down, and subtract 2. However, that fuel also requires fuel,
 * and that fuel requires fuel, and so on. Any mass that would require negative
 * fuel should instead be treated as if it requires zero fuel; the remaining
 * mass, if any, is instead handled by wishing really hard, which has no mass
 * and is outside the scope of this calculation.
 */
const calculateFuelPrecisely: FuelCalculation = mass => {
  let completeFuel = 0;
  let fuel: number;
  while ((fuel = calculateFuel(mass))) {
    completeFuel += fuel;
    mass = fuel;
  }

  return completeFuel;
};

export { calculateFuel, computeFuelForSpacecraft, calculateFuelPrecisely };
