export const transformIgnorePatterns = [
    "/node_modules/(?!formidable)"
];
export const preset = 'ts-jest';
export const transform = {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
};

// module.exports = {
//     transformIgnorePatterns: [
//         "/node_modules/(?!formidable)"
//     ],
//     preset: 'ts-jest',
//     transform: {
//       '^.+\\.(ts|tsx)?$': 'ts-jest',
//       '^.+\\.(js|jsx)$': 'babel-jest',
//     }
// };