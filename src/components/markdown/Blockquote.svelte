<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<blockquote class="my-4 border-l-4 border-primary bg-base-200 py-2 pl-4 pr-2 italic">
	{@render children()}
</blockquote>
