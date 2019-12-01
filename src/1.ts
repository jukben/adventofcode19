type Mass = number;

const calculateFuel = (mass: Mass) => Math.floor(mass / 3) - 2;

export { calculateFuel };
