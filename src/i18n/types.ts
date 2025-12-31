export type Locale = 'en' | 'ca' | 'es';

export interface Translations {
	site: {
		title: string;
	};
}

export const DEFAULT_LOCALE: Locale = 'en';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ca', 'es'];

export const LOCALE_NAMES: Record<Locale, string> = {
	en: 'English',
	ca: 'Catalan',
	es: 'Spanish'
};
