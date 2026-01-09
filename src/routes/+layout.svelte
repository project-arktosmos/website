<script lang="ts">
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import '../css/app.css';
	import Sidebar from '$components/core/Sidebar.svelte';
	import type { MenuEntry } from '$types/menu.type';
	import { menuAdapter } from '$adapters/menu.adapter';
	import { menuEntries, menuTree, activeEntry } from '../stores/menu.store';
	import { i18n, SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from '../i18n';

	const { t } = i18n;

	let { children } = $props();

	let drawerOpen = $state(false);
	let entriesLoaded = $state(false);

	let contentReady = $derived(entriesLoaded && $activeEntry !== null);

	function getUrlParams(): URLSearchParams {
		if (!browser) return new URLSearchParams();
		return new URLSearchParams(window.location.search);
	}

	function getPageSlug(): string {
		return getUrlParams().get('page') || '';
	}

	function getLangParam(): string {
		return getUrlParams().get('lang') || '';
	}

	function detectBrowserLocale(): Locale {
		if (!browser) return DEFAULT_LOCALE;
		const browserLang = navigator.language.split('-')[0];
		if (SUPPORTED_LOCALES.includes(browserLang as Locale)) {
			return browserLang as Locale;
		}
		return DEFAULT_LOCALE;
	}

	function updateUrlParams(page?: string, lang?: string) {
		if (!browser) return;
		const params = new URLSearchParams(window.location.search);

		if (page !== undefined) {
			params.set('page', page);
		}
		if (lang !== undefined) {
			params.set('lang', lang);
		}

		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.replaceState(null, '', newUrl);
	}

	function selectEntryBySlug(slug: string, entries: MenuEntry[]) {
		const entry = entries.find((e) => e.slug === slug);
		if (entry) {
			activeEntry.set(entry);
		}
	}

	function initializeLocale() {
		const langParam = getLangParam();
		if (langParam && SUPPORTED_LOCALES.includes(langParam as Locale)) {
			i18n.setLocale(langParam as Locale);
		} else {
			const detectedLocale = detectBrowserLocale();
			i18n.setLocale(detectedLocale);
			updateUrlParams(undefined, detectedLocale);
		}
	}

	function extractRelativePath(fullPath: string, locale: string): string {
		// Extract path relative to locale folder
		// e.g., "../data/en/fanvel-comics/index.md" -> "fanvel-comics/index.md"
		const localeMarker = `/${locale}/`;
		const idx = fullPath.indexOf(localeMarker);
		if (idx !== -1) {
			return fullPath.slice(idx + localeMarker.length);
		}
		return fullPath.split('/').pop() || '';
	}

	async function loadMarkdownFiles(locale: Locale) {
		const regularModules = import.meta.glob('$data/**/*.md', { query: '?raw', import: 'default' });
		const dotModules = import.meta.glob('$data/**/.*.md', { query: '?raw', import: 'default' });
		const dotFolderModules = import.meta.glob('$data/**/.*/*.md', {
			query: '?raw',
			import: 'default'
		});
		const dotFilesInDotFolders = import.meta.glob('$data/**/.*/.*.md', {
			query: '?raw',
			import: 'default'
		});
		const allModules = {
			...regularModules,
			...dotModules,
			...dotFolderModules,
			...dotFilesInDotFolders
		};
		const entries: MenuEntry[] = [];
		const localePrefix = `/${locale}/`;
		const fallbackPrefix = `/${DEFAULT_LOCALE}/`;

		// Load files for current locale
		for (const path in allModules) {
			if (path.includes(localePrefix)) {
				const content = (await allModules[path]()) as string;
				const relativePath = extractRelativePath(path, locale);
				entries.push(menuAdapter.parseMarkdownFile(relativePath, content));
			}
		}

		// Fallback: load missing files from default locale
		for (const path in allModules) {
			if (path.includes(fallbackPrefix)) {
				const relativePath = extractRelativePath(path, DEFAULT_LOCALE);
				const slug = menuAdapter.createSlug(relativePath);
				if (!entries.some((e) => e.slug === slug)) {
					const content = (await allModules[path]()) as string;
					entries.push(menuAdapter.parseMarkdownFile(relativePath, content));
				}
			}
		}

		// Store flat list for lookups
		menuEntries.set(entries);

		// Build and store tree structure for sidebar
		const tree = menuAdapter.buildMenuTree(entries);
		menuTree.set(tree);

		const pageSlug = getPageSlug();
		if (pageSlug) {
			selectEntryBySlug(pageSlug, entries);
		} else if (entries.length > 0) {
			// Select first entry from tree (could be a folder or top-level item)
			const firstEntry = tree[0];
			activeEntry.set(firstEntry);
			updateUrlParams(firstEntry.slug, undefined);
		}

		entriesLoaded = true;
	}

	function handleMenuToggle() {
		drawerOpen = !drawerOpen;
	}

	function handleSelect(event: CustomEvent<MenuEntry>) {
		activeEntry.set(event.detail);
		updateUrlParams(event.detail.slug, undefined);
		drawerOpen = false;
	}

	async function handleLocaleChange(event: CustomEvent<Locale>) {
		i18n.setLocale(event.detail);
		updateUrlParams(undefined, event.detail);
		const currentSlug = $activeEntry?.slug || '';
		await loadMarkdownFiles(event.detail);
		// Restore selection to same page in new locale
		if (currentSlug) {
			const entries = $menuEntries;
			selectEntryBySlug(currentSlug, entries);
		}
	}

	function handlePopState() {
		const slug = getPageSlug();
		if (slug && entriesLoaded) {
			const entries = $menuEntries;
			selectEntryBySlug(slug, entries);
		}

		const lang = getLangParam();
		if (lang && SUPPORTED_LOCALES.includes(lang as Locale)) {
			i18n.setLocale(lang as Locale);
		}
	}

	$effect(() => {
		initializeLocale();
		loadMarkdownFiles(i18n.getLocale());
	});

	$effect(() => {
		if (browser) {
			window.addEventListener('popstate', handlePopState);
			return () => {
				window.removeEventListener('popstate', handlePopState);
			};
		}
	});
</script>

<svelte:head>
	<title>{$t.site.title}</title>
</svelte:head>

<div class="min-h-screen lg:bg-base-300">
<div class="mx-auto flex h-screen max-w-[1200px] flex-col bg-base-100">
	<!-- Desktop: sidebar layout -->
	<div class="hidden h-full lg:flex">
		<Sidebar
			title={$t.site.title}
			entries={$menuTree}
			activeSlug={$activeEntry?.slug || ''}
			on:select={handleSelect}
			on:localeChange={handleLocaleChange}
		/>
		<main class="scrollbar-hidden flex-1 overflow-y-auto">
			{#if !contentReady}
				<div class="flex h-full items-center justify-center">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{:else}
				<div in:fade={{ duration: 200 }}>
					{@render children?.()}
				</div>
			{/if}
		</main>
	</div>

	<!-- Mobile layout -->
	<div class="relative flex h-full flex-col lg:hidden">
		<!-- Mobile header -->
		<div class="z-50 flex items-center justify-between bg-base-200 p-2">
			<button
				class="btn btn-square btn-ghost"
				aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
				on:click={handleMenuToggle}
			>
				{#if drawerOpen}
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
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
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
				{/if}
			</button>
			<span class="mr-2 text-lg font-bold">{$t.site.title}</span>
		</div>

		<!-- Mobile content -->
		<main class="scrollbar-hidden flex-1 overflow-y-auto">
			{#if !contentReady}
				<div class="flex h-full items-center justify-center">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{:else}
				<div in:fade={{ duration: 200 }}>
					{@render children?.()}
				</div>
			{/if}
		</main>

		<!-- Mobile menu overlay (slides down from top) -->
		<div
			class="absolute inset-0 top-0 z-40 flex flex-col bg-base-200 transition-transform duration-300 ease-in-out"
			class:-translate-y-full={!drawerOpen}
			class:translate-y-0={drawerOpen}
		>
			<!-- Spacer for header -->
			<div class="h-14 shrink-0"></div>
			<!-- Menu content -->
			<div class="flex-1 overflow-y-auto">
				<Sidebar
					compact={true}
					title={$t.site.title}
					entries={$menuTree}
					activeSlug={$activeEntry?.slug || ''}
					on:select={handleSelect}
					on:localeChange={handleLocaleChange}
				/>
			</div>
		</div>
	</div>
</div>
</div>
