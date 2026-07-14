import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // React Compiler advisory that fires on a deliberate one-shot setState
      // inside effects in the hand-tuned animation components (Reveal,
      // NumberTicker). Kept visible as a warning rather than a build blocker;
      // revisit in a dedicated animation refactor, not an SEO pass.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
