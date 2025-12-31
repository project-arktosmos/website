import { writable } from 'svelte/store';
import type { MenuEntry } from '$types/menu.type';

export const menuEntries = writable<MenuEntry[]>([]);
export const menuTree = writable<MenuEntry[]>([]);
export const activeEntry = writable<MenuEntry | null>(null);
