<script lang="ts">
  import { useTodoContext } from "./presentation/todo-context";

  // Ambil store dari context
  const todoApp = useTodoContext();
  
  // Ambil prop onEdit saja (karena ini interaksi antar UI)
  let { onEdit } = $props<{ onEdit: (todo: any) => void }>();

  $effect(() => {
    // Load data saat komponen pertama kali muncul
    todoApp.load();
  });
</script>

<div class="home">
  <div class="header">
    <h2>Daftar Tugas</h2>
    <button onclick={() => todoApp.load()}>Refresh</button>
  </div>

  {#if todoApp.loading}
    <p>Loading...</p>
  {:else}
    <ul>
      {#each todoApp.items as todo (todo.id)}
        <li>
          <span>{todo.title}</span>
          <div class="btns">
            <button onclick={() => onEdit(todo)}>Edit</button>
            <button onclick={() => todoApp.remove(todo.id)}>Hapus</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  li { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
  .actions { display: flex; gap: 5px; }
  .btn-edit { background: #ffc107; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px; }
  .btn-delete { background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px; }
</style>