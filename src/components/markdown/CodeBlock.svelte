<script lang="ts">
	interface Props {
		code: string;
		language?: string;
	}

	let { code, language }: Props = $props();
</script>

<div class="mockup-code my-4 bg-neutral text-neutral-content">
	{#if language}
		<div class="absolute right-4 top-2 text-xs text-neutral-content/50">{language}</div>
	{/if}
	{#each code.split('\n') as line, i}
		<pre data-prefix={i + 1}><code>{line}</code></pre>
	{/each}
</div>
