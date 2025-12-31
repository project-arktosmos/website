<script lang="ts">
	import '../css/app.css';
	import Navbar from '$components/core/Navbar.svelte';
	import Sidebar from '$components/core/Sidebar.svelte';
	import type { MenuEntry } from '$types/menu.type';
	import { menuAdapter } from '$adapters/menu.adapter';

	let { children } = $props();

	let drawerOpen = $state(false);
	let menuEntries = $state<MenuEntry[]>([]);
	let activeEntry = $state<MenuEntry | null>(null);

	async function loadMarkdownFiles() {
		const modules = import.meta.glob('$data/*.md', { query: '?raw', import: 'default' });
		const entries: MenuEntry[] = [];

		for (const path in modules) {
			const content = (await modules[path]()) as string;
			const filename = path.split('/').pop() || '';
			const entry = menuAdapter.parseMarkdownFile(filename, content);
			entries.push(entry);
		}

		menuEntries = entries.sort((a, b) => a.title.localeCompare(b.title));

		if (menuEntries.length > 0 && !activeEntry) {
			activeEntry = menuEntries[0];
		}
	}

	function handleMenuToggle() {
		drawerOpen = !drawerOpen;
	}

	function handleSelect(event: CustomEvent<MenuEntry>) {
		activeEntry = event.detail;
		drawerOpen = false;
	}

	function closeDrawer() {
		drawerOpen = false;
	}

	$effect(() => {
		loadMarkdownFiles();
	});
</script>

<div class="drawer lg:drawer-open">
	<input
		id="main-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={drawerOpen}
	/>

	<div class="drawer-content flex flex-col">
		<Navbar title="Project Arktosmos" on:menuToggle={handleMenuToggle} />

		<main class="flex-1 overflow-auto">
			{@render children?.({ menuEntries, activeEntry, onSelect: handleSelect })}
		</main>
	</div>

	<div class="drawer-side z-40">
		<label for="main-drawer" class="drawer-overlay" aria-label="Close menu"></label>
		<Sidebar
			entries={menuEntries}
			activeSlug={activeEntry?.slug || ''}
			on:select={handleSelect}
		/>
	</div>
</div>
