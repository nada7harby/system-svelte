import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

/**
 * Vite Configuration
 * Configures SvelteKit plugin and SCSS path aliases
 */
export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// Alias for SCSS styles directory
			$styles: path.resolve('./src/styles')
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				// Make variables and mixins available globally (optional)
				// additionalData: `@use '$styles/variables' as *; @use '$styles/mixins' as *;`
			}
		}
	}
});
