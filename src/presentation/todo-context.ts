import { setContext, getContext } from 'svelte';
import type { createTodoStore } from './todo-store.svelte';

// Simbol unik agar tidak bentrok dengan context lain
const TODO_KEY = Symbol('TODO_CONTEXT');

export function setTodoContext(store: ReturnType<typeof createTodoStore>) {
    setContext(TODO_KEY, store);
}

export function useTodoContext() {
    return getContext<ReturnType<typeof createTodoStore>>(TODO_KEY);
}