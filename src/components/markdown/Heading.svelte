<script lang="ts">
	import classNames from 'classnames';
	import type { Snippet } from 'svelte';

	interface Props {
		level: 1 | 2 | 3 | 4 | 5 | 6;
		id?: string;
		children: Snippet;
	}

	let { level, id, children }: Props = $props();

	const baseClasses = 'font-bold text-base-content';

	const levelClasses: Record<number, string> = {
		1: 'text-4xl mt-8 mb-4 pb-2 border-b border-base-300',
		2: 'text-3xl mt-6 mb-3 pb-2 border-b border-base-300',
		3: 'text-2xl mt-5 mb-2',
		4: 'text-xl mt-4 mb-2',
		5: 'text-lg mt-3 mb-1',
		6: 'text-base mt-2 mb-1'
	};

	let headingClass = $derived(classNames(baseClasses, levelClasses[level]));

	async function copyUrlToClipboard() {
		try {
			await navigator.clipboard.writeText(window.location.href);
		} catch (err) {
			console.error('Failed to copy URL to clipboard:', err);
		}
	}
</script>

{#if level === 1}
	<h1 class={headingClass} {id}>
		<button
			type="button"
			class="group inline-flex cursor-pointer items-center gap-2 hover:underline"
			onclick={copyUrlToClipboard}
		>
			{@render children()}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-70"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
				/>
			</svg>
		</button>
	</h1>
{:else if level === 2}
	<h2 class={headingClass} {id}>{@render children()}</h2>
{:else if level === 3}
	<h3 class={headingClass} {id}>{@render children()}</h3>
{:else if level === 4}
	<h4 class={headingClass} {id}>{@render children()}</h4>
{:else if level === 5}
	<h5 class={headingClass} {id}>{@render children()}</h5>
{:else}
	<h6 class={headingClass} {id}>{@render children()}</h6>
{/if}
