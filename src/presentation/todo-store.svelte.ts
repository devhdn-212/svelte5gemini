import { z } from "zod";
import { toast } from "svelte-sonner";
import type { Todo, TodoRepository } from "../core/todo";

const todoSchema = z.string()
  .min(1, "Input tidak boleh kosong")
  .regex(/^[a-zA-Z0-9 ]+$/, "Hanya boleh huruf, angka, dan spasi");

export function createTodoStore(repo: TodoRepository) {
  let items = $state<Todo[]>([]);
  let loading = $state(false);
  let inputTitle = $state("");
  let editingId = $state<number | null>(null);

  // Helper untuk ambil data lokal (agar tidak hilang saat refresh)
  const getLocalData = (): Todo[] => {
    const saved = localStorage.getItem('local_todos');
    return saved ? JSON.parse(saved) : [];
  };

  const saveLocalData = (data: Todo[]) => {
    localStorage.setItem('local_todos', JSON.stringify(data));
  };

  return {
    get items() { return items; },
    get loading() { return loading; },
    get inputTitle() { return inputTitle; },
    set inputTitle(val: string) { inputTitle = val; },
    get editingId() { return editingId; },

    async load(showLoading = true) {
      if (showLoading) loading = true;
      try {
        // 1. Ambil data dari API
        const apiData = await repo.getAll();
        
        // 2. Ambil data dari LocalStorage (buah apel yang kamu input tadi)
        const localData = getLocalData();

        // 3. Gabungkan keduanya (Lokal di atas agar terlihat baru)
        items = [...localData, ...apiData];
      } catch (e) {
        console.error("Sync failed");
      } finally {
        if (showLoading) loading = false;
      }
    },

    async handleSubmit() {
      if (!inputTitle.trim()) return;

      try {
        if (editingId !== null) {
          // --- LOGIKA UPDATE ---
          items = items.map(t => t.id === editingId ? { ...t, title: inputTitle } : t);
          
          // Update juga di lokal jika itu data lokal
          const localData = getLocalData().map(t => t.id === editingId ? { ...t, title: inputTitle } : t);
          saveLocalData(localData);
          
          toast.success("Berhasil diupdate");
        } else {
          // --- LOGIKA ADD ---
          // Kita tetap panggil API (simulasi)
          const newTodo = await repo.create(inputTitle);
          
          // Buat ID unik agar tidak bentrok
          const localTodo = { ...newTodo, id: Date.now(), title: inputTitle };
          
          // Simpan ke LocalStorage agar tidak hilang saat refresh
          const updatedLocal = [localTodo, ...getLocalData()];
          saveLocalData(updatedLocal);

          // Update State UI
          items = [localTodo, ...items];
          toast.success("Berhasil disimpan ke lokal & API");
        }
        this.cancelEdit();
      } catch (e) {
        toast.error("Gagal menyimpan");
      }
    },

    async remove(id: number) {
      // Hapus dari state UI
      items = items.filter(t => t.id !== id);
      
      // Hapus dari LocalStorage
      const updatedLocal = getLocalData().filter(t => t.id !== id);
      saveLocalData(updatedLocal);

      try {
        await repo.delete(id);
        toast.success("Berhasil dihapus");
      } catch (e) {
        // Kita biarkan terhapus di lokal saja karena API cuma simulasi
      }
    },

    setEditMode(todo: Todo) {
      editingId = todo.id;
      inputTitle = todo.title;
    },

    cancelEdit() {
      editingId = null;
      inputTitle = "";
    },

    startPolling(ms: number) {
      const interval = setInterval(() => this.load(false), ms);
      return () => clearInterval(interval);
    }
  };
}