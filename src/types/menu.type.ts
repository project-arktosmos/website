import type { ID } from './core.type';

export interface MenuEntry {
	id: ID;
	title: string;
	slug: string;
	content: string;
	sortOrder?: number;
	publicationDate?: Date;
	children?: MenuEntry[];
}
