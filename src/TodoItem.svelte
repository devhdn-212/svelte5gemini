<script lang="ts">
  import { useTodoContext } from "./presentation/todo-context";
  import type { Todo } from "../../core/todo";

  let { todo } = $props<{ todo: Todo }>();
  const todoApp = useTodoContext();
</script>

<li>
  <span>{todo.title}</span>
  <div class="actions">
    <button onclick={() => todoApp.setEditMode(todo)}>Edit</button>
    <button onclick={() => todoApp.remove(todo.id)}>Hapus</button>
  </div>
</li>

<style>
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background: white;
    color: #888;
  }
  .completed { text-decoration: line-through; color: #888; }
  .actions { display: flex; gap: 8px; }
  button { cursor: pointer; border-radius: 4px; border: none; padding: 4px 8px; }
  .edit { background: #ffc107; }
  .delete { background: #ff4d4d; color: white; }
</style>