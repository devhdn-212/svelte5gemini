<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import { ApiTodoRepository } from "./data/api-repository";
  import { createTodoStore } from "./presentation/todo-store.svelte";
  import Home from "./Home.svelte";

  // Inisialisasi Store (Logic Center)
  const repo = new ApiTodoRepository();
  const todoApp = createTodoStore(repo);

  let inputTitle = $state("");

  // Fungsi untuk refresh data (dipanggil dari Home)
  async function refreshData() {
    await todoApp.load();
  }

  // Handle Input
  async function handleAdd() {
    if (await todoApp.add(inputTitle)) {
      inputTitle = "";
    }
  }

  // Load awal
  $effect(() => {
    refreshData();
  });
</script>

<Toaster position="top-right" richColors />

<main style="max-width: 500px; margin: 2rem auto; font-family: sans-serif;">
  <h1>Todo App (Centralized)</h1>

  <section class="input-group">
    <input 
      bind:value={inputTitle} 
      placeholder="Ketik tugas baru (A-Z, 0-9)..." 
    />
    <button onclick={handleAdd}>Simpan</button>
  </section>

  <hr />

  <Home 
    items={todoApp.items} 
    isLoading={todoApp.loading} 
    onRefresh={refreshData} 
    onDelete={(id) => todoApp.remove(id)}
  />
</main>

<style>
  .input-group { display: flex; gap: 8px; margin-bottom: 20px; }
  input { flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #ccc; }
  button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>