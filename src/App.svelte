<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import { ApiTodoRepository } from "./data/api-repository";
  import { createTodoStore } from "./presentation/todo-store.svelte";
  import Home from "./Home.svelte";

  const repo = new ApiTodoRepository();
  const todoApp = createTodoStore(repo);

  let inputTitle = $state("");
  let editingId = $state<number | null>(null); // State untuk melacak mode edit

  async function handleSubmit() {
    if (editingId !== null) {
      // Mode Edit
      if (await todoApp.update(editingId, inputTitle)) {
        cancelEdit();
      }
    } else {
      // Mode Tambah
      if (await todoApp.add(inputTitle)) {
        inputTitle = "";
      }
    }
  }

  function startEdit(todo: {id: number, title: string}) {
    editingId = todo.id;
    inputTitle = todo.title;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Opsional: scroll ke atas
  }

  function cancelEdit() {
    editingId = null;
    inputTitle = "";
  }
</script>

<Toaster position="top-right" richColors />

<main>
  <h1>Todo Manager</h1>

  <section class="input-group">
    <input bind:value={inputTitle} placeholder="Nama tugas..." />
    <button onclick={handleSubmit} class:btn-update={editingId !== null}>
      {editingId !== null ? "Update" : "Simpan"}
    </button>
    {#if editingId !== null}
      <button onclick={cancelEdit} class="btn-cancel">Batal</button>
    {/if}
  </section>

  <hr />

  <Home 
    items={todoApp.items} 
    isLoading={todoApp.loading} 
    onRefresh={() => todoApp.load()} 
    onDelete={(id) => todoApp.remove(id)}
    onEdit={startEdit} 
  />
</main>

<style>
  .input-group { display: flex; gap: 8px; }
  .btn-update { background: #ffc107 !important; color: black !important; }
  .btn-cancel { background: #6c757d; color: white; border: none; padding: 10px; border-radius: 4px; }
  /* style lainnya tetap sama */
</style>