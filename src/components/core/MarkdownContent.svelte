<script lang="ts">
	import MarkdownRenderer from '$components/markdown/MarkdownRenderer.svelte';
	import { i18n, type Locale } from '../../i18n';

	export let content: string = '';
	export let slug: string = '';
	export let publicationDate: Date | undefined = undefined;

	const { locale } = i18n;

	// Map i18n locale codes to BCP 47 language tags for date formatting
	const localeMap: Record<Locale, string> = {
		en: 'en-US',
		es: 'es-ES',
		ca: 'ca-ES'
	};

	function isBlogPost(slug: string): boolean {
		return slug.startsWith('blog/');
	}

	function formatDate(date: Date, loc: Locale): string {
		return date.toLocaleDateString(localeMap[loc], {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	$: showPublicationDate = isBlogPost(slug) && publicationDate !== undefined;
</script>

<div class="relative">
	{#if showPublicationDate}
		<time
			datetime={publicationDate?.toISOString()}
			class="absolute -top-8 left-1/2 -translate-x-1/2 italic text-base-content md:left-auto md:right-6 md:top-0 md:translate-x-0"
		>
			{formatDate(publicationDate!, $locale)}
		</time>
	{/if}
	<MarkdownRenderer {content} />
</div>
