import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { cpSync, existsSync, mkdirSync, rmSync, watch } from 'fs';
import { resolve, basename } from 'path';

function copyMarkdownPlugin() {
	const dataDir = resolve(__dirname, 'data');
	const destDir = resolve(__dirname, 'src/data');
	const isCI = process.env.CI === 'true';

	function copyFiles() {
		if (!existsSync(dataDir)) return;
		if (existsSync(destDir)) {
			rmSync(destDir, { recursive: true });
		}
		mkdirSync(destDir, { recursive: true });
		cpSync(dataDir, destDir, {
			recursive: true,
			filter: (src) => {
				const filename = basename(src);
				if (isCI && filename.startsWith('.')) {
					console.log(`[markdown-copy] Skipping dotfile in CI: ${filename}`);
					return false;
				}
				return true;
			}
		});
		console.log(`[markdown-copy] Copied data files to src/data${isCI ? ' (CI mode: dotfiles excluded)' : ''}`);
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
