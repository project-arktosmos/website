<script lang="ts">
	import MarkdownRenderer from '$components/markdown/MarkdownRenderer.svelte';

	export let content: string = '';
	export let slug: string = '';
	export let publicationDate: Date | undefined = undefined;

	function isBlogPost(slug: string): boolean {
		return slug.startsWith('blog/');
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
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
			{formatDate(publicationDate!)}
		</time>
	{/if}
	<MarkdownRenderer {content} />
</div>
