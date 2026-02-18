<script lang="ts">
  import type { Todo } from "../../core/todo";

  let { items, isLoading, onRefresh, onDelete, onEdit } = $props<{
    items: Todo[],
    isLoading: boolean,
    onRefresh: () => void,
    onDelete: (id: number) => void,
    onEdit: (todo: Todo) => void
  }>();
</script>

<div class="home-container">
  <div class="header">
    <h2>Daftar Tugas</h2>
    <button onclick={onRefresh}>Refresh</button>
  </div>

  <ul>
    {#each items as todo (todo.id)}
      <li>
        <span>{todo.title}</span>
        <div class="actions">
          <button class="btn-edit" onclick={() => onEdit(todo)}>Edit</button>
          <button class="btn-delete" onclick={() => onDelete(todo.id)}>Delete</button>
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  li { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
  .actions { display: flex; gap: 5px; }
  .btn-edit { background: #ffc107; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px; }
  .btn-delete { background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px; }
</style>