import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['dist/**', 'node_modules/**', '.netlify/**', 'design/**'] },

  // Code applicatif (navigateur)
  {
    files: ['src/**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks, react },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Marque comme utilisés les identifiants qui n'apparaissent que dans du JSX.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
      // Les fichiers générés utilisent le style du design d'origine.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },

  // Fonctions serverless + outillage (Node)
  {
    files: ['netlify/**/*.js', 'tools/**/*.mjs', 'tests/**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, Response: 'readonly', Request: 'readonly', fetch: 'readonly' },
    },
  },
];
