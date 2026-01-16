import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

/**
 * ESLint configuration for SvelteKit project
 * Uses TypeScript ESLint and Svelte ESLint plugin
 * Prettier integration to avoid conflicts
 */
export default ts.config(
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			parserOptions: {
				svelteConfig: import.meta.resolve('./svelte.config.js')
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
);
