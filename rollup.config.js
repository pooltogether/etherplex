import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: '.',
    format: 'cjs',
  },
  preserveModules: true,
  external: [
    'apollo-client',
    'apollo-cache-inmemory',
    'apollo-link',
    'graphql-tag',
    'graphql',
    'graphql-anywhere',
    'ethers',
    'date-fns',
    'lodash',
    'zen-observable-ts'
  ],
  plugins: [
    typescript()
  ]
}
