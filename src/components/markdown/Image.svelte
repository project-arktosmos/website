<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		title?: string;
	}

	let { src, alt, title }: Props = $props();
</script>

<figure class="my-4">
	<img {src} {alt} {title} class="rounded-lg shadow-md" />
	{#if title}
		<figcaption class="mt-2 text-center text-sm text-base-content/60">{title}</figcaption>
	{/if}
</figure>
