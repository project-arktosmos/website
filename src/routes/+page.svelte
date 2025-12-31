<script lang="ts">
	import MarkdownContent from '$components/core/MarkdownContent.svelte';
	import { activeEntry } from '../stores/menu.store';
</script>

{#if $activeEntry}
	<MarkdownContent
		content={$activeEntry.content}
		slug={$activeEntry.slug}
		publicationDate={$activeEntry.publicationDate}
	/>
{:else}
	<div class="flex h-full items-center justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{/if}
