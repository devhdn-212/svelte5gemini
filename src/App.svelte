<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import { ApiTodoRepository } from "./data/api-repository";
  import { createTodoStore } from "./presentation/todo-store.svelte";
  import { setTodoContext } from "./presentation/todo-context";
  import Home from "./Home.svelte";

  const repo = new ApiTodoRepository();
  const todoApp = createTodoStore(repo);

  // Bagikan store ke seluruh anak komponen
  setTodoContext(todoApp);

  let inputTitle = $state("");
  let editingId = $state<number | null>(null);

  // Logic input tetap di sini karena ini urusan Form di App.svelte
  async function handleSubmit() {
    const success = editingId !== null 
      ? await todoApp.update(editingId, inputTitle)
      : await todoApp.add(inputTitle);
      
    if (success) {
      inputTitle = "";
      editingId = null;
    }
  }

  function startEdit(todo: any) {
    editingId = todo.id;
    inputTitle = todo.title;
  }
</script>

<Toaster richColors />

<main>
  <h1>Clean Arch + Context API</h1>
  
  <div class="form">
    <input bind:value={inputTitle} placeholder="Tugas baru..." />
    <button onclick={handleSubmit}>{editingId ? 'Update' : 'Simpan'}</button>
  </div>

  <hr />

  <Home onEdit={startEdit} /> 
</main>

<style>
  .input-group { display: flex; gap: 8px; }
  .btn-update { background: #ffc107 !important; color: black !important; }
  .btn-cancel { background: #6c757d; color: white; border: none; padding: 10px; border-radius: 4px; }
  /* style lainnya tetap sama */
</style>