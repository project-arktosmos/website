import { AdapterClass } from './classes/adapter.class';
import type { MenuEntry } from '$types/menu.type';

class MenuAdapter extends AdapterClass {
	constructor() {
		super('menu');
	}

	extractTitle(content: string, filename: string): string {
		const match = content.match(/^#\s+(.+)$/m);
		if (match) {
			return match[1].trim();
		}
		return this.formatFilename(filename);
	}

	formatFilename(filename: string): string {
		const name = filename.replace(/\.md$/, '');
		return name
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	createSlug(filename: string): string {
		return filename.replace(/\.md$/, '').toLowerCase();
	}

	parseMarkdownFile(filename: string, content: string): MenuEntry {
		return {
			id: this.createSlug(filename),
			title: this.extractTitle(content, filename),
			slug: this.createSlug(filename),
			content
		};
	}
}

export const menuAdapter = new MenuAdapter();
