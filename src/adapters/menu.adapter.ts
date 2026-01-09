import { AdapterClass } from './classes/adapter.class';
import type { MenuEntry } from '$types/menu.type';

class MenuAdapter extends AdapterClass {
	constructor() {
		super('menu');
	}

	extractTitle(content: string, filename: string): { title: string; sortOrder?: number } {
		const match = content.match(/^#\s+(.+)$/m);
		if (match) {
			const rawTitle = match[1].trim();
			return this.parseNumberedTitle(rawTitle);
		}
		return { title: this.formatFilename(filename) };
	}

	parseNumberedTitle(rawTitle: string): { title: string; sortOrder?: number } {
		// Match patterns like "0. Title", "1. Title", "10. Title"
		const numberedMatch = rawTitle.match(/^(\d+)\.\s+(.+)$/);
		if (numberedMatch) {
			const sortOrder = parseInt(numberedMatch[1], 10);
			const title = numberedMatch[2].trim();
			return { title, sortOrder };
		}
		return { title: rawTitle };
	}

	parseDateFromSortOrder(sortOrder: number): Date | null {
		// Parse date from DDMMYYYY format (e.g., 31122025 -> Dec 31, 2025)
		// Pad with leading zeros to handle dates like 01012026 which become 1012026 as a number
		const str = sortOrder.toString().padStart(8, '0');
		if (str.length !== 8) return null;

		const day = parseInt(str.substring(0, 2), 10);
		const month = parseInt(str.substring(2, 4), 10) - 1; // JS months are 0-indexed
		const year = parseInt(str.substring(4, 8), 10);

		// Validate the parsed date
		const date = new Date(year, month, day);
		if (
			date.getDate() !== day ||
			date.getMonth() !== month ||
			date.getFullYear() !== year
		) {
			return null;
		}

		return date;
	}

	isBlogEntry(relativePath: string): boolean {
		// Check if the entry is under a blog directory
		return relativePath.toLowerCase().startsWith('blog/');
	}

	formatFilename(filename: string): string {
		const name = filename.replace(/\.md$/, '');
		return name
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	createSlug(relativePath: string): string {
		// For index.md files, use the parent folder name as slug
		// e.g., "fanvel-comics/index.md" -> "fanvel-comics"
		// For regular files, just remove .md extension
		// e.g., "about.md" -> "about"
		const normalized = relativePath.replace(/\.md$/, '');
		if (normalized.endsWith('/index')) {
			return normalized.replace(/\/index$/, '').toLowerCase();
		}
		return normalized.toLowerCase();
	}

	getDisplayName(relativePath: string): string {
		// For index.md, use parent folder name for display
		// For regular files, use the filename
		const normalized = relativePath.replace(/\.md$/, '');
		if (normalized.endsWith('/index')) {
			const parts = normalized.split('/');
			return parts[parts.length - 2] || 'index';
		}
		const parts = normalized.split('/');
		return parts[parts.length - 1] || normalized;
	}

	parseMarkdownFile(relativePath: string, content: string): MenuEntry {
		const displayName = this.getDisplayName(relativePath);
		const { title, sortOrder } = this.extractTitle(content, displayName);
		const entry: MenuEntry = {
			id: this.createSlug(relativePath),
			title,
			slug: this.createSlug(relativePath),
			content
		};
		if (sortOrder !== undefined) {
			entry.sortOrder = sortOrder;

			// For blog entries, parse the sortOrder as a publication date
			if (this.isBlogEntry(relativePath)) {
				const publicationDate = this.parseDateFromSortOrder(sortOrder);
				if (publicationDate) {
					entry.publicationDate = publicationDate;
				}
			}
		}
		return entry;
	}

	getParentSlug(relativePath: string): string | null {
		// Get the parent folder slug for a given path
		// e.g., "pokemon-cat/pokemon-groc.md" -> "pokemon-cat"
		// e.g., "pokemon-cat/index.md" -> null (index.md IS the parent)
		// e.g., "about.md" -> null (top-level file)
		const normalized = relativePath.replace(/\.md$/, '');

		// index.md files represent the folder itself, no parent in menu
		if (normalized.endsWith('/index')) {
			return null;
		}

		const parts = normalized.split('/');
		if (parts.length > 1) {
			// Return the folder path (everything except the filename)
			return parts.slice(0, -1).join('/').toLowerCase();
		}

		return null;
	}

	buildMenuTree(flatEntries: MenuEntry[]): MenuEntry[] {
		// Build a map of all folders (entries that have children)
		const folderMap = new Map<string, MenuEntry>();
		const topLevelEntries: MenuEntry[] = [];

		// First pass: identify all folders (entries that have direct children)
		for (const entry of flatEntries) {
			const hasChildren = flatEntries.some((e) => {
				if (e === entry) return false;
				// Check if e is a direct child of entry
				if (!e.slug.startsWith(entry.slug + '/')) return false;
				const remainder = e.slug.slice(entry.slug.length + 1);
				// Direct child has no additional slashes in remainder
				return !remainder.includes('/');
			});

			if (hasChildren) {
				folderMap.set(entry.slug, { ...entry, children: [] });
			}
		}

		// Second pass: assign entries to their parent folders or top level
		for (const entry of flatEntries) {
			// Skip if this entry is already in folderMap (it's a folder with children)
			if (folderMap.has(entry.slug)) continue;

			if (!entry.slug.includes('/')) {
				// Top-level entry (no slashes)
				topLevelEntries.push(entry);
			} else {
				// Find the direct parent folder
				const parts = entry.slug.split('/');
				const parentSlug = parts.slice(0, -1).join('/');
				const folder = folderMap.get(parentSlug);
				if (folder && folder.children) {
					folder.children.push(entry);
				} else {
					// Orphan nested entry - should not happen with proper index.md files
					topLevelEntries.push(entry);
				}
			}
		}

		// Third pass: nest folders inside their parent folders
		const nestedFolderSlugs = new Set<string>();
		for (const [slug, folder] of folderMap) {
			if (slug.includes('/')) {
				const parts = slug.split('/');
				const parentSlug = parts.slice(0, -1).join('/');
				const parentFolder = folderMap.get(parentSlug);
				if (parentFolder && parentFolder.children) {
					parentFolder.children.push(folder);
					nestedFolderSlugs.add(slug);
				}
			}
		}

		// Combine top-level entries and top-level folders
		for (const [slug, folder] of folderMap) {
			if (!nestedFolderSlugs.has(slug)) {
				topLevelEntries.push(folder);
			}
		}

		// Sort recursively
		const sortRecursive = (entries: MenuEntry[]) => {
			entries.sort(this.sortEntries);
			for (const entry of entries) {
				if (entry.children && entry.children.length > 0) {
					sortRecursive(entry.children);
				}
			}
		};

		sortRecursive(topLevelEntries);

		return topLevelEntries;
	}

	sortEntries(a: MenuEntry, b: MenuEntry): number {
		const ALPHABETIC_THRESHOLD = 999;

		// Determine tier: 0 = numbered (< threshold), 1 = unnumbered (alphabetic), 2 = numbered (>= threshold)
		const getTier = (entry: MenuEntry): number => {
			if (entry.sortOrder === undefined) return 1;
			return entry.sortOrder < ALPHABETIC_THRESHOLD ? 0 : 2;
		};

		const aTier = getTier(a);
		const bTier = getTier(b);

		// Different tiers: sort by tier
		if (aTier !== bTier) {
			return aTier - bTier;
		}

		// Same tier
		if (aTier === 1) {
			// Both unnumbered: alphabetical
			return a.title.localeCompare(b.title);
		}

		// Both numbered (either tier 0 or tier 2): sort by sortOrder
		return a.sortOrder! - b.sortOrder!;
	}
}

export const menuAdapter = new MenuAdapter();
