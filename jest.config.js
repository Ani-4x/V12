module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|@unimodules)/)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|gif|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
