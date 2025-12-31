<script lang="ts">
	import MarkdownContent from '$components/core/MarkdownContent.svelte';
	import type { MenuEntry } from '$types/menu.type';

	interface PageProps {
		menuEntries: MenuEntry[];
		activeEntry: MenuEntry | null;
		onSelect: (event: CustomEvent<MenuEntry>) => void;
	}

	let { menuEntries, activeEntry, onSelect }: PageProps = $props();
</script>

{#if activeEntry}
	<MarkdownContent content={activeEntry.content} />
{:else}
	<div class="flex h-full items-center justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{/if}
