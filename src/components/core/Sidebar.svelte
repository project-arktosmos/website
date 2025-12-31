<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import classNames from 'classnames';
	import type { MenuEntry } from '$types/menu.type';

	export let entries: MenuEntry[] = [];
	export let activeSlug: string = '';

	const dispatch = createEventDispatcher();

	function handleClick(entry: MenuEntry) {
		dispatch('select', entry);
	}
</script>

<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
	<li class="menu-title">Pages</li>
	{#each entries as entry (entry.id)}
		{@const itemClass = classNames('', {
			'active': entry.slug === activeSlug
		})}
		<li>
			<button class={itemClass} on:click={() => handleClick(entry)}>
				{entry.title}
			</button>
		</li>
	{/each}
</ul>
