<script lang="ts">
  import { useTodoContext } from "./presentation/todo-context";
  import TodoItem from "./TodoItem.svelte";
  const todoApp = useTodoContext();
</script>

<div class="home">
  <h2>Daftar Tugas</h2>
  <ul>
    {#each todoApp.items as item (item.id)}
      <TodoItem todo={item} /> 
    {/each}
  </ul>
</div>

<style>
  ul { list-style: none; padding: 0; margin-top: 1rem; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; }
</style>