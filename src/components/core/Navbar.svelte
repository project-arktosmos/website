<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string = 'Project Arktosmos';

	const dispatch = createEventDispatcher();

	function handleMenuClick() {
		dispatch('menuToggle');
	}
</script>

<div class="navbar bg-base-100 shadow-lg">
	<div class="flex-none lg:hidden">
		<button
			class="btn btn-square btn-ghost"
			aria-label="Open menu"
			on:click={handleMenuClick}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-6 w-6 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>
	</div>
	<div class="flex-1">
		<span class="text-xl font-bold">{title}</span>
	</div>
</div>
