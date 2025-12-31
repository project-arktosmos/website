<script lang="ts">
	import { marked } from 'marked';

	export let content: string = '';

	$: htmlContent = marked(content);
</script>

<article class="prose prose-lg max-w-none p-4">
	{@html htmlContent}
</article>
