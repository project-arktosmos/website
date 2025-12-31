import { AdapterClass } from './classes/adapter.class';
import type { Social } from '$types/social.type';
import { socialsData } from '$data/socials';

class SocialAdapter extends AdapterClass {
	constructor() {
		super('social');
	}

	all(): Social[] {
		return socialsData.socials;
	}

	find(id: string): Social | undefined {
		return socialsData.socials.find((social) => social.id === id);
	}
}

export const socialAdapter = new SocialAdapter();
