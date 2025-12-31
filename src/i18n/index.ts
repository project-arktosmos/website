import { writable, derived, get } from 'svelte/store';
import type { Locale, Translations } from './types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './types';

import en from './locales/en.json';
import ca from './locales/ca.json';
import es from './locales/es.json';

const translations: Record<Locale, Translations> = {
	en: en as Translations,
	ca: ca as Translations,
	es: es as Translations
};

function createI18nStore() {
	const locale = writable<Locale>(DEFAULT_LOCALE);

	const t = derived(locale, ($locale) => {
		return translations[$locale] || translations[DEFAULT_LOCALE];
	});

	function setLocale(newLocale: Locale) {
		if (SUPPORTED_LOCALES.includes(newLocale)) {
			locale.set(newLocale);
		}
	}

	function getLocale(): Locale {
		return get(locale);
	}

	function translate(key: string): string {
		const currentTranslations = get(t);
		const keys = key.split('.');
		let value: unknown = currentTranslations;

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = (value as Record<string, unknown>)[k];
			} else {
				return `[MISSING: ${key}]`;
			}
		}

		return typeof value === 'string' ? value : `[INVALID: ${key}]`;
	}

	return {
		locale,
		t,
		setLocale,
		getLocale,
		translate
	};
}

export const i18n = createI18nStore();
export { type Locale, type Translations, SUPPORTED_LOCALES, LOCALE_NAMES, DEFAULT_LOCALE } from './types';
