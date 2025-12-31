import type { ID } from './core.type';

export interface Social {
	id: ID;
	name: string;
	url: string;
	icon: string;
}

export interface SocialsData {
	socials: Social[];
}
