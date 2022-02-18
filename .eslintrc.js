// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2021: true,
        'jest/globals': true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/jsx-runtime'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
        'react-hooks',
        'jest'
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error', // Проверяем правила хуков
        'react-hooks/exhaustive-deps': 'warn', // Проверяем зависимости эффекта
        // note you must disable the base rule as it can report incorrect errors
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', {functions: false}],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'comma-dangle': ['error', {
            arrays: 'never',
            objects: 'always-multiline',
            imports: 'never',
            exports: 'never',
            functions: 'never',
        }],
        'no-cond-assign': ['error', 'always'],
        'no-console': 'error',
        'no-debugger': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty-character-class': 'error',
        'no-ex-assign': 'error',
        'no-extra-semi': 'error',
        'no-func-assign': 'error',
        'no-inner-declarations': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-unsafe-negation': 'error',
        'no-obj-calls': 'error',
        'no-sparse-arrays': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'error',
        'no-empty-pattern': 'error',
        'no-class-assign': 'error',
        'no-const-assign': 'error',
        'arrow-spacing': ['error', {before: true, after: true}],
        'arrow-parens': ['error', 'always'],
        'no-useless-constructor': 'error',
        'prefer-arrow-callback': ['error', {allowNamedFunctions: true}],
        'prefer-const': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'rest-spread-spacing': ['error', 'never'],
        'template-curly-spacing': ['error', 'never'],
        'yield-star-spacing': ['error', 'after'],
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        curly: 'error',
        'dot-location': ['error', 'property'],
        'dot-notation': 'error',
        eqeqeq: 'error',
        'no-extend-native': 'error',
        'no-alert': 'error',
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-eq-null': 'error',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-floating-decimal': 'error',
        'no-implicit-coercion': 'error',
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-invalid-this': 'error',
        'no-iterator': 'error',
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-multi-spaces': ['error', {ignoreEOLComments: true}],
        'no-multi-str': 'error',
        'no-global-assign': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-redeclare': 'error',
        'no-return-assign': ['error', 'always'],
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'no-useless-call': 'error',
        'no-useless-concat': 'error',
        'no-void': 'error',
        'no-with': 'error',
        radix: 'error',
        'wrap-iife': ['error', 'inside'],
        yoda: ['error', 'never'],

        // http://eslint.org/docs/rules/#strict-mode
        strict: ['error', 'safe'],

        // http://eslint.org/docs/rules/#variables
        'no-delete-var': 'error',
        'no-undef': 'error',
        'no-undef-init': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',

        // http://eslint.org/docs/rules/#stylistic-issues
        'array-bracket-spacing': ['error', 'never'],
        'brace-style': ['error', '1tbs'],
        camelcase: 'error',
        'comma-spacing': ['error', {before: false, after: true}],
        'comma-style': ['error', 'last'],
        'computed-property-spacing': ['error', 'never'],
        'consistent-this': ['error', '_this'],
        'eol-last': 'error',

        // Non-ASCII characters are not allowed in identifiers for variables.
        'id-match': ['error', '^[a-zA-Z0-9_$]*$', {properties: true}],
        indent: ['error', 4, {SwitchCase: 1}],
        'key-spacing': ['error', {beforeColon: false, afterColon: true}],
        'keyword-spacing': ['error', {before: true, after: true}],
        'max-len': ['error', {code: 120, ignoreUrls: true}],
        'new-cap': ['error', {capIsNew: false}],
        'new-parens': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 0}],
        'func-call-spacing': ['error', 'never'],
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-whitespace-before-property': 'error',
        'object-curly-spacing': ['error', 'never'],
        'one-var': ['error', 'never'],
        'one-var-declaration-per-line': ['error', 'always'],
        // 'operator-linebreak': ['error', 'after'],
        'padded-blocks': ['error', 'never'],
        'quote-props': ['error', 'as-needed'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'semi-style': ['error', 'last'],
        'space-before-blocks': ['error', 'always'],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
        }],
        'space-in-parens': ['error', 'never'],
        'space-infix-ops': 'error',
        'space-unary-ops': ['error', {words: true, nonwords: false}],
        'switch-colon-spacing': ['error', {after: true, before: false}],
        'unicode-bom': 'error',

        'no-return-await': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',

        '@typescript-eslint/ban-ts-comment': 'off',
    },
};
