export type Locale = 'en' | 'ca' | 'es' | 'qq';

export interface Translations {
	site: {
		title: string;
	};
}

export const DEFAULT_LOCALE: Locale = 'en';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ca', 'es', 'qq'];

export const LOCALE_NAMES: Record<Locale, string> = {
	en: 'English',
	ca: 'Catalan',
	es: 'Spanish',
	qq: 'QQQQQ (Debug)'
};
