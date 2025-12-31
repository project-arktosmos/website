<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<ul class="my-4 list-inside list-disc space-y-1 pl-4 text-base-content/90">
	{@render children()}
</ul>
