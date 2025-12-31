import type { ID } from './core.type';

export interface MenuEntry {
	id: ID;
	title: string;
	slug: string;
	content: string;
}
