<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<strong class="font-bold text-base-content">
	{@render children()}
</strong>
