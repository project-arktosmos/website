<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { i18n, SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from '../../i18n';

	export let title: string = 'Project Arktosmos';

	const dispatch = createEventDispatcher();
	const { locale } = i18n;

	function handleMenuClick() {
		dispatch('menuToggle');
	}

	function handleLocaleChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const newLocale = select.value as Locale;
		i18n.setLocale(newLocale);
		dispatch('localeChange', newLocale);
	}
</script>

<div class="navbar bg-base-200 shadow-lg">
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
	<div class="flex flex-1 justify-center">
		<span class="text-xl font-bold">{title}</span>
	</div>
	<div class="flex-none">
		<select
			class="select select-bordered select-sm"
			value={$locale}
			on:change={handleLocaleChange}
		>
			{#each SUPPORTED_LOCALES as locale}
				<option value={locale}>{LOCALE_NAMES[locale]}</option>
			{/each}
		</select>
	</div>
</div>
