<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="my-4 overflow-x-auto">
	<table class="table table-zebra w-full">
		{@render children()}
	</table>
</div>
