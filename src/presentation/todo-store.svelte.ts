import { z } from "zod";
import { toast } from "svelte-sonner";
import type { Todo, TodoRepository } from "../core/todo";

const todoSchema = z.string()
  .min(1, "Input tidak boleh kosong")
  .regex(/^[a-zA-Z0-9 ]+$/, "Hanya boleh huruf, angka, dan spasi");

export function createTodoStore(repo: TodoRepository) {
  let items = $state<Todo[]>([]);
  let loading = $state(true); // Default true untuk skeleton

  // --- CARA 3: PERSISTENCE (LocalStorage) ---
  // Load dari localStorage saat pertama kali store dibuat
  const saved = localStorage.getItem('todos-cache');
  if (saved) items = JSON.parse(saved);

  // Helper untuk simpan ke storage tiap ada perubahan items
  $effect(() => {
    localStorage.setItem('todos-cache', JSON.stringify(items));
  });

  return {
    get items() { return items; },
    get loading() { return loading; },

    async load() {
      loading = true;
      try {
        const data = await repo.getAll();
        items = data;
      } catch (e) {
        toast.error("Gagal sinkronisasi dengan server");
      } finally {
        loading = false;
      }
    },

    async add(title: string) {
      const result = todoSchema.safeParse(title);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return false;
      }

      try {
        const newTodo = await repo.create(title);
        // Tambahkan ke state
        items = [...items, { ...newTodo, id: Date.now() }];
        toast.success("Data berhasil disimpan");
        return true;
      } catch (e) {
        toast.error("Gagal simpan ke server");
        return false;
      }
    },

    // --- CARA 2: OPTIMISTIC UI (Delete) ---
    async remove(id: number) {
      const previousItems = [...items]; // Backup data jika gagal
      
      // Hapus langsung di UI (Optimistic)
      items = items.filter(t => t.id !== id);
      
      try {
        await repo.delete(id);
        toast.success("Data berhasil didelete");
      } catch (e) {
        // Jika API Gagal, kembalikan data yang dihapus (Rollback)
        items = previousItems;
        toast.error("Gagal menghapus di server, data dikembalikan");
      }
    }
  };
}