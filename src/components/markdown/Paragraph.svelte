<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<p class="my-4 leading-relaxed text-base-content/90">
	{@render children()}
</p>
