import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
	pluginJs.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylistic,
	{
		plugins: {
			'@stylistic': stylistic
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		// Stylistic rules
		rules: {
			/**
			* Stylistic rules
			* @see https://eslint.style/packages/default#rules
			*/
			'@stylistic/array-bracket-newline': ['error', 'consistent'],
			'@stylistic/array-bracket-spacing': ['error', 'never'],
			'@stylistic/array-element-newline': ['error', 'consistent'],
			'@stylistic/arrow-parens': ['error', 'always'],
			'@stylistic/arrow-spacing': 'error',
			'@stylistic/block-spacing': 'error',
			'@stylistic/brace-style': 'error', // style 1tbs
			'@stylistic/comma-dangle': ['error', 'never'],
			'@stylistic/comma-spacing': ['error', {
				before: false,
				after: true
			}],
			'@stylistic/comma-style': ['error', 'last'],
			'@stylistic/curly-newline': ['error', { consistent: true }],
			'@stylistic/function-call-spacing': ['error', 'never'],
			'@stylistic/function-paren-newline': ['error', 'consistent'],
			'@stylistic/generator-star-spacing': ['error', {
				before: true,
				after: false
			}],
			'@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/indent-binary-ops': ['error', 'tab'],
			'@stylistic/key-spacing': ['error', { beforeColon: false }],
			'@stylistic/keyword-spacing': ['error', { before: true }],
			'@stylistic/lines-between-class-members': ['error', 'always'],
			'@stylistic/multiline-ternary': ['error', 'always-multiline'],
			'@stylistic/new-parens': 'error',
			'@stylistic/no-confusing-arrow': 'error',
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/no-floating-decimal': 'error',
			'@stylistic/no-mixed-operators': 'error',
			'@stylistic/no-mixed-spaces-and-tabs': 'error',
			'@stylistic/no-multi-spaces': 'error',
			'@stylistic/no-tabs': ['error', { allowIndentationTabs: true }],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/no-whitespace-before-property': 'error',
			'@stylistic/operator-linebreak': ['error', 'before'],
			'@stylistic/padded-blocks': ['error', 'never'],
			'@stylistic/quote-props': ['error', 'as-needed'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/rest-spread-spacing': ['error', 'never'],
			'@stylistic/semi': 'error',
			'@stylistic/semi-spacing': 'error',
			'@stylistic/semi-style': ['error', 'last'],
			'@stylistic/space-before-blocks': 'error',
			'@stylistic/space-in-parens': ['error', 'never'],
			'@stylistic/space-unary-ops': 'error',
			'@stylistic/spaced-comment': ['error', 'always'],
			'@stylistic/template-curly-spacing': 'error',
			'@stylistic/template-tag-spacing': 'error',
			'@stylistic/type-annotation-spacing': 'error', // create issue because on doc is stylistic/ts/type-annotation-spacing
			'@stylistic/type-generic-spacing': ['error'],
			'@stylistic/type-named-tuple-spacing': ['error']
		}
	},
	{
		// ESLint rules
		rules: {
			/**
			* EsLint rules not included in recommended
			* @see https://eslint.org/docs/rules/
			*/
			'array-callback-return': 'error',
			'no-constructor-return': 'error',
			'no-duplicate-imports': 'error',
			'no-self-compare': 'error',
			'no-template-curly-in-string': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-unreachable-loop': 'error',
			'no-use-before-define': 'error',
			// 'no-useless-assignement': 'error',
			'arrow-body-style': ['error', 'as-needed'],
			'block-scoped-var': 'error',
			camelcase: 'error',
			complexity: ['error', 25],
			'consistent-return': 'error',
			curly: ['error', 'multi', 'consistent'],
			'default-param-last': 'error',
			'max-classes-per-file': ['error', 1],
			'max-depth': ['error', 4],
			'no-else-return': 'error',
			'no-empty-function': 'error',
			'no-invalid-this': 'error',
			'no-lonely-if': 'error',
			'no-unused-expressions': 'error',
			'no-useless-concat': 'error',
			'no-useless-computed-key': 'error',
			'no-useless-constructor': 'off',
			'no-useless-rename': 'error',
			'no-useless-return': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'operator-assignment': 'error',
			'prefer-arrow-callback': 'error',
			'prefer-const': 'error',
			'prefer-destructuring': 'error',
			'prefer-exponentiation-operator': 'error',
			'prefer-object-has-own': 'error',
			'prefer-object-spread': 'error',
			'require-await': 'error',
			'object-curly-spacing': ['error', 'always'],
			'new-cap': 'off'
		}
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: { allowDefaultProject: ['*.js', '*.mjs'] },
				parser: tseslint.parser,
				tsconfigRootDir: import.meta.dirname
			}
		},
		// TypeScript rules
		rules: {
			/**
			* TypeScript rules not included in strictTypeChecked and stylistic
			* @see https://typescript-eslint.io/rules/
			*/
			'consistent-return': 'off',
			'@typescript-eslint/consistent-type-exports': 'error',
			'@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'separate-type-imports' }],
			'default-param-last': 'off',
			'@typescript-eslint/default-param-last': 'error',
			'@typescript-eslint/explicit-member-accessibility': [
				'error', { accessibility: 'explicit' }
			],
			'max-params': 'off',
			'@typescript-eslint/max-params': [
				'error', { max: 6 }
			],
			'@typescript-eslint/no-empty-interface': 'error',
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': 'error',
			'@typescript-eslint/no-useless-empty-export': 'error',
			'prefer-destructuring': 'off',
			'@typescript-eslint/prefer-destructuring': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/prefer-readonly-parameter-types': 'off', // error is not working
			'require-await': 'off',
			'@typescript-eslint/require-await': 'error',
			
			/**
			* TypeScript disabled rules in strictTypeChecked and stylistic
			*/
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/no-invalid-void-type': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unnecessary-type-parameters': 'off',
			'@typescript-eslint/no-dynamic-delete': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/consistent-return': 'warn',
			'@typescript-eslint/prefer-for-of': 'off',
			'@typescript-eslint/no-empty-object-type': 'off'
		}
	}
];
