// Define 10 unique colors (one for each X)
export const colors = [
  { color: '#96beff', name: 'Blue' },
  { color: '#b3dfa0', name: 'Green' },
  { color: '#dfdfdf', name: 'Grey' },
  { color: '#dfa0bf', name: 'Pink' },
  { color: '#ff7b60', name: 'Red' },
  { color: '#e6f388', name: 'Yellow' },
  { color: '#b9b29e', name: 'Dark grey' },
  { color: '#a3d2d8', name: 'Turquoise' },
  { color: '#ffc992', name: 'Salmon' },
  { color: '#bba3e2', name: 'Purple' }
];

export const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1],
];


// Function to create an empty board
export const createEmptyBeansBoard = () =>
  Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({
      color: colors[Math.floor(Math.random() * colors.length)].color,
      hasCross: false,
      hasBean: false,
    }))
  );