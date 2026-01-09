<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		title?: string;
	}

	let { src, alt, title }: Props = $props();

	// Parse title for size and badge: "300px", "badge:/path.svg", or "300px|badge:/path.svg"
	const sizePattern = /^(\d+(?:\.\d+)?)(px|vw|vh|%|em|rem)$/;
	const badgePattern = /badge:([^\s|]+)/;

	let parsedTitle = $derived.by(() => {
		if (!title) return { maxWidth: undefined, badge: undefined, caption: undefined };

		const parts = title.split('|').map((p) => p.trim());
		let maxWidth: string | undefined;
		let badge: string | undefined;
		let caption: string | undefined;

		for (const part of parts) {
			if (sizePattern.test(part)) {
				maxWidth = part;
			} else if (badgePattern.test(part)) {
				const match = part.match(badgePattern);
				if (match) badge = match[1];
			} else if (part) {
				caption = part;
			}
		}

		return { maxWidth, badge, caption };
	});
</script>

<figure class="relative my-4" style={parsedTitle.maxWidth ? `max-width: ${parsedTitle.maxWidth}` : undefined}>
	<img {src} {alt} title={parsedTitle.caption} class="rounded-lg shadow-md" />
	{#if parsedTitle.badge}
		<img
			src={parsedTitle.badge}
			alt="badge"
			class="absolute bottom-2 right-2 h-6 w-auto rounded shadow-md"
		/>
	{/if}
	{#if parsedTitle.caption}
		<figcaption class="mt-2 text-center text-sm text-base-content/60">{parsedTitle.caption}</figcaption>
	{/if}
</figure>
