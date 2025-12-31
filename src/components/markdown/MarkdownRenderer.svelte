<script lang="ts">
	import { marked, type Token, type Tokens } from 'marked';
	import Heading from './Heading.svelte';
	import Paragraph from './Paragraph.svelte';
	import Strong from './Strong.svelte';
	import Emphasis from './Emphasis.svelte';
	import CodeBlock from './CodeBlock.svelte';
	import InlineCode from './InlineCode.svelte';
	import Link from './Link.svelte';
	import Blockquote from './Blockquote.svelte';
	import HorizontalRule from './HorizontalRule.svelte';
	import UnorderedList from './UnorderedList.svelte';
	import OrderedList from './OrderedList.svelte';
	import ListItem from './ListItem.svelte';
	import Image from './Image.svelte';
	import Table from './Table.svelte';

	interface Props {
		content: string;
	}

	let { content }: Props = $props();

	let tokens = $derived(marked.lexer(content));

	/**
	 * Strips numbered prefix (e.g., "0. ", "1. ") from h1 heading tokens.
	 * Modifies the first text token if it starts with a number and dot pattern.
	 */
	function stripNumberedPrefix(headingTokens: Token[]): Token[] {
		if (headingTokens.length === 0) return headingTokens;

		const firstToken = headingTokens[0];
		if (firstToken.type === 'text') {
			const match = firstToken.text.match(/^(\d+)\.\s+(.*)$/);
			if (match) {
				return [{ ...firstToken, text: match[2] }, ...headingTokens.slice(1)];
			}
		}
		return headingTokens;
	}
</script>

{#snippet renderInline(tokens: Token[])}
	{#each tokens as token}
		{#if token.type === 'text'}
			{token.text}
		{:else if token.type === 'strong'}
			<Strong>{@render renderInline((token as Tokens.Strong).tokens)}</Strong>
		{:else if token.type === 'em'}
			<Emphasis>{@render renderInline((token as Tokens.Em).tokens)}</Emphasis>
		{:else if token.type === 'codespan'}
			<InlineCode>{(token as Tokens.Codespan).text}</InlineCode>
		{:else if token.type === 'link'}
			<Link href={(token as Tokens.Link).href} title={(token as Tokens.Link).title || undefined}>
				{@render renderInline((token as Tokens.Link).tokens)}
			</Link>
		{:else if token.type === 'image'}
			<Image
				src={(token as Tokens.Image).href}
				alt={(token as Tokens.Image).text}
				title={(token as Tokens.Image).title || undefined}
			/>
		{:else if token.type === 'br'}
			<br />
		{:else if token.type === 'escape'}
			{(token as Tokens.Escape).text}
		{/if}
	{/each}
{/snippet}

{#snippet renderBlock(tokens: Token[])}
	{#each tokens as token}
		{#if token.type === 'heading'}
			{@const headingToken = token as Tokens.Heading}
			{@const headingTokens =
				headingToken.depth === 1
					? stripNumberedPrefix(headingToken.tokens)
					: headingToken.tokens}
			<Heading level={headingToken.depth as 1 | 2 | 3 | 4 | 5 | 6}>
				{@render renderInline(headingTokens)}
			</Heading>
		{:else if token.type === 'paragraph'}
			<Paragraph>
				{@render renderInline((token as Tokens.Paragraph).tokens)}
			</Paragraph>
		{:else if token.type === 'code'}
			<CodeBlock
				code={(token as Tokens.Code).text}
				language={(token as Tokens.Code).lang || undefined}
			/>
		{:else if token.type === 'blockquote'}
			<Blockquote>
				{@render renderBlock((token as Tokens.Blockquote).tokens)}
			</Blockquote>
		{:else if token.type === 'list'}
			{#if (token as Tokens.List).ordered}
				<OrderedList start={(token as Tokens.List).start || 1}>
					{@render renderListItems((token as Tokens.List).items)}
				</OrderedList>
			{:else}
				<UnorderedList>
					{@render renderListItems((token as Tokens.List).items)}
				</UnorderedList>
			{/if}
		{:else if token.type === 'hr'}
			<HorizontalRule />
		{:else if token.type === 'table'}
			{@const tableToken = token as Tokens.Table}
			<Table>
				<thead>
					<tr>
						{#each tableToken.header as cell, i}
							<th class={tableToken.align[i] ? `text-${tableToken.align[i]}` : ''}>
								{@render renderInline(cell.tokens)}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each tableToken.rows as row}
						<tr>
							{#each row as cell, i}
								<td class={tableToken.align[i] ? `text-${tableToken.align[i]}` : ''}>
									{@render renderInline(cell.tokens)}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</Table>
		{:else if token.type === 'space'}
			<!-- skip -->
		{/if}
	{/each}
{/snippet}

{#snippet renderListItems(items: Tokens.ListItem[])}
	{#each items as item}
		<ListItem>
			{#each item.tokens as itemToken}
				{#if itemToken.type === 'text' && 'tokens' in itemToken && itemToken.tokens}
					{@render renderInline(itemToken.tokens)}
				{:else if itemToken.type === 'text'}
					{itemToken.text}
				{:else if itemToken.type === 'list'}
					{#if (itemToken as Tokens.List).ordered}
						<OrderedList start={(itemToken as Tokens.List).start || 1}>
							{@render renderListItems((itemToken as Tokens.List).items)}
						</OrderedList>
					{:else}
						<UnorderedList>
							{@render renderListItems((itemToken as Tokens.List).items)}
						</UnorderedList>
					{/if}
				{/if}
			{/each}
		</ListItem>
	{/each}
{/snippet}

<article class="px-6 pb-6">
	{@render renderBlock(tokens)}
</article>
