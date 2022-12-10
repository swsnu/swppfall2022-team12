module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['airbnb', 'airbnb-typescript'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.ts', '.tsx', '.js'],
      },
    },
  },
  overrides: [
    {
      files: ['*.tsx', '*.ts', '*.js', '*.jsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: [
        'plugin:import/recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
      ],
      rules: {
        'import/prefer-default-export': 'off',
        'import/no-cycle': 'off',
        'no-multi-str': 'off',
        'no-new': 'off',
        'no-underscore-dangle': 'off',
        'no-alert':'off',
        'no-return-assign': 'off',
        'no-restricted-syntax': 'off',
        'guard-for-in': 'off',
        'new-cap': 'off',
        'consistent-return': 'off',
        'react/jsx-uses-react': 'off',
        'react/button-has-type': 'off',
        'react/destructuring-assignment': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'react/jsx-props-no-spreading': 'off',
        'func-names': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
            usePrettierrc: true,
          },
        ],
        'jsx-a11y/label-has-associated-control': [
          'warn',
          {
            required: {
              some: ['nesting', 'id'],
            },
          },
        ],
        'react/require-default-props': 'off',
        'no-constant-condition': [
          'error',
          {
            checkLoops: false,
          },
        ],
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object'],
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            'newlines-between': 'always',
          },
        ],
        'no-param-reassign': [
          'error',
          {
            props: true,
            ignorePropertyModificationsFor: ['state'],
          },
        ],
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],
      },
    },
  ],
};
