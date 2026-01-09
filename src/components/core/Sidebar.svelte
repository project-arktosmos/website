<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import classNames from 'classnames';
	import type { MenuEntry } from '$types/menu.type';
	import { i18n, SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from '../../i18n';
	import { socialAdapter } from '$adapters/social.adapter';

	export let entries: MenuEntry[] = [];
	export let activeSlug: string = '';
	export let title: string = '';
	export let compact: boolean = false;

	const dispatch = createEventDispatcher();
	const { locale } = i18n;
	const socials = socialAdapter.all();

	function handleClick(entry: MenuEntry) {
		dispatch('select', entry);
	}

	function handleLocaleChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const newLocale = select.value as Locale;
		i18n.setLocale(newLocale);
		dispatch('localeChange', newLocale);
	}
</script>

<div class="relative flex h-full w-full flex-col bg-base-200 text-base-content lg:min-h-full lg:w-80">
	<!-- Social links (shown first on mobile, after logo on desktop) -->
	{#if compact}
		<div class="flex justify-center gap-4 p-4 pb-2">
			{#each socials as social (social.id)}
				<a
					href={social.url}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost btn-lg btn-circle"
					aria-label={social.name}
				>
					{#if social.icon === 'github'}
						<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
					{:else if social.icon === 'bluesky'}
						<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
						</svg>
					{:else if social.icon === 'instagram'}
						<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
						</svg>
					{/if}
				</a>
			{/each}
		</div>
	{/if}

	<!-- Logo -->
	<div class="p-4" class:pt-0={compact} class:pb-2={!compact}>
		<div class="flex justify-center">
			<img src="/logo.png" alt="Logo" class="mb-2 rounded-full" class:w-full={!compact} class:w-[50vw]={compact} />
		</div>
		<!-- Social links (desktop only, shown after logo) -->
		{#if !compact}
			<div class="flex justify-center gap-3">
				{#each socials as social (social.id)}
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-ghost btn-sm btn-circle"
						aria-label={social.name}
					>
						{#if social.icon === 'github'}
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
						{:else if social.icon === 'bluesky'}
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
							</svg>
						{:else if social.icon === 'instagram'}
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Menu entries -->
	<ul class="menu w-full flex-1 overflow-y-auto p-4 pt-2 pb-16" class:menu-lg={compact}>
		{#each entries as entry (entry.id)}
			{@const isActive = entry.slug === activeSlug}
			{@const hasChildren = entry.children && entry.children.length > 0}
			{@const itemClass = classNames({
				'bg-primary text-primary-content rounded-btn': isActive
			})}

			{#if hasChildren}
				<li>
					<button class={itemClass} on:click={() => handleClick(entry)}>
						{entry.title}
					</button>
					<ul>
						{#each entry.children ?? [] as child (child.id)}
							{@const isChildActive = child.slug === activeSlug}
							{@const childHasChildren = child.children && child.children.length > 0}
							{@const childClass = classNames({
								'bg-primary text-primary-content rounded-btn': isChildActive
							})}
							{#if childHasChildren}
								<li>
									<button class={childClass} on:click={() => handleClick(child)}>
										{child.title}
									</button>
									<ul>
										{#each child.children ?? [] as grandchild (grandchild.id)}
											{@const isGrandchildActive = grandchild.slug === activeSlug}
											{@const grandchildClass = classNames({
												'bg-primary text-primary-content rounded-btn': isGrandchildActive
											})}
											<li>
												<button class={grandchildClass} on:click={() => handleClick(grandchild)}>
													{grandchild.title}
												</button>
											</li>
										{/each}
									</ul>
								</li>
							{:else}
								<li>
									<button class={childClass} on:click={() => handleClick(child)}>
										{child.title}
									</button>
								</li>
							{/if}
						{/each}
					</ul>
				</li>
			{:else}
				<li>
					<button class={itemClass} on:click={() => handleClick(entry)}>
						{entry.title}
					</button>
				</li>
			{/if}
		{/each}
	</ul>

	<!-- Language selector (always absolute at bottom) -->
	<div class="absolute bottom-0 left-0 right-0 bg-base-200 p-4">
		<select
			class="select select-bordered select-sm w-full"
			value={$locale}
			on:change={handleLocaleChange}
		>
			{#each SUPPORTED_LOCALES as loc}
				<option value={loc}>{LOCALE_NAMES[loc]}</option>
			{/each}
		</select>
	</div>
</div>
