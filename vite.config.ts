import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { cpSync, existsSync, mkdirSync, watch } from 'fs';
import { resolve } from 'path';

function copyMarkdownPlugin() {
	const dataDir = resolve(__dirname, 'data');
	const destDir = resolve(__dirname, 'src/data');

	function copyFiles() {
		if (!existsSync(dataDir)) return;
		if (!existsSync(destDir)) {
			mkdirSync(destDir, { recursive: true });
		}
		cpSync(dataDir, destDir, { recursive: true });
		console.log('[markdown-copy] Copied data files to src/data');
	}

	return {
		name: 'copy-markdown',
		buildStart() {
			copyFiles();
		},
		configureServer(server: { watcher: { add: (path: string) => void } }) {
			copyFiles();
			if (existsSync(dataDir)) {
				const watcher = watch(dataDir, { recursive: true }, () => {
					copyFiles();
				});
				server.watcher.add(dataDir);
				process.on('exit', () => watcher.close());
			}
		}
	};
}

export default defineConfig({
	plugins: [copyMarkdownPlugin(), tailwindcss(), sveltekit()]
});
