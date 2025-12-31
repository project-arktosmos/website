<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<code class="rounded bg-base-300 px-1.5 py-0.5 font-mono text-sm text-secondary">
	{@render children()}
</code>
