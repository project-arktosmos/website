<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		start?: number;
		children: Snippet;
	}

	let { start = 1, children }: Props = $props();
</script>

<ol class="my-4 list-inside list-decimal space-y-1 pl-4 text-base-content/90" {start}>
	{@render children()}
</ol>
