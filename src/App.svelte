<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import { ApiTodoRepository } from "./data/api-repository";
  import { createTodoStore } from "./presentation/todo-store.svelte";
  import { setTodoContext } from "./presentation/todo-context";
  import Home from "./Home.svelte";

  const repo = new ApiTodoRepository();
  const todoApp = createTodoStore(repo);
  setTodoContext(todoApp);

  $effect(() => {
    const handleFocus = () => todoApp.load(false);
    window.addEventListener('focus', handleFocus);
  
    // 1. Load data pertama kali
    todoApp.load();

    // 2. Jalankan Auto-Refresh setiap 30 detik
    const stopPolling = todoApp.startPolling(30000);

    // 3. Svelte 5 Cleanup: Otomatis berhenti jika user pindah halaman/tutup app
    return () => {
      stopPolling();
      window.removeEventListener('focus', handleFocus);
    };
  });
</script>

<Toaster richColors />

<main>
  <h1>Clean Arch Ultimate</h1>
  <h2>Todo Auto-Sync 🔄</h2>
  
  <div class="form">
    <input bind:value={todoApp.inputTitle} placeholder="Tugas baru..." />
    
    <button onclick={() => todoApp.handleSubmit()}>
      {todoApp.editingId ? 'Update' : 'Simpan'}
    </button>

    {#if todoApp.editingId}
      <button onclick={() => todoApp.cancelEdit()}>Batal</button>
    {/if}
  </div>

  <hr />
  <Home /> </main>