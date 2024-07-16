module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "extends": ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
        ],
        '@typescript-eslint/no-magic-numbers': [
          'warn',
          {
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            // 往下两个是 ts 类型的扩展，减少正常使用的误报
            ignoreEnums: true,
            ignoreNumericLiteralTypes: true,
            enforceConst: true,
            ignore: [-1, 0, 1],
            ignoreTypeIndexes: true,
            ignoreReadonlyClassProperties: true,
            ignoreClassFieldInitialValues: true,
          },
        ],
        // 解决项目中前端的数据兜底,例如a?.b?.c不被eslint格式
        '@typescript-eslint/no-unnecessary-condition': 'off',
        // 非空断言运算符向类型系统断言表达式不可为空
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/naming-convention': [
          'warn',
          {
            selector: ['default', 'variableLike'],
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: ['class', 'interface', 'typeLike'],
            format: ['PascalCase'],
          },
          {
            selector: ['variable'],
            format: ['UPPER_CASE', 'camelCase', 'PascalCase'],
            modifiers: ['global', 'exported'],
          },
          {
            selector: 'objectLiteralProperty',
            format: null,
          },
          {
            selector: 'enumMember',
            format: ['UPPER_CASE', 'PascalCase'],
          },
          {
            selector: 'typeProperty',
            format: ['camelCase', 'snake_case'],
          },
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'forbid',
          },
          {
            selector: 'variable',
            modifiers: ['destructured'],
            format: ['camelCase', 'PascalCase', 'snake_case', 'strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
          },
        ],

        'react-hooks/exhaustive-deps': 'off',
        'react/jsx-no-target-blank': ['warn', { enforceDynamicLinks: 'always' }],
        "max-lines": ["warn", 600],
        "max-lines-per-function": ["warn", { max: 500, IIFEs: true }],
        'react/no-danger': 'warn',
        "no-undef": process.env.NODE_ENV === 'development' ? 'warn' : "error",
        "no-console": process.env.NODE_ENV === 'development' ? 'warn' : "error",
      }
    }
  ]
}