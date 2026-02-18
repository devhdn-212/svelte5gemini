<script lang="ts">
  import type { Todo } from "../../core/todo";

  // Menerima props dari App.svelte
  let { items, isLoading, onRefresh, onDelete } = $props<{
    items: Todo[],
    isLoading: boolean,
    onRefresh: () => Promise<void>,
    onDelete: (id: number) => void
  }>();
</script>

<div class="home-container">
  <div class="header">
    <h2>Daftar Tugas</h2>
    <button class="refresh-btn" onclick={onRefresh} disabled={isLoading}>
      {isLoading ? "Memuat..." : "Refresh Data"}
    </button>
  </div>

  {#if isLoading && items.length === 0}
    <div class="skeleton">Memperbarui data...</div>
  {:else}
    <ul>
      {#each items as todo (todo.id)}
        <li>
          <span style="color:black;">{todo.title}</span>
          <button class="btn-delete" onclick={() => onDelete(todo.id)}>
            Delete
          </button>
        </li>
      {/each}
    </ul>
    
    {#if items.length === 0}
      <p class="empty">Tidak ada data untuk ditampilkan.</p>
    {/if}
  {/if}
</div>

<style>
  .header { display: flex; justify-content: space-between; align-items: center; }
  .refresh-btn { background: #28a745; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; }
  .refresh-btn:disabled { background: #ccc; }
  
  ul { list-style: none; padding: 0; margin-top: 20px; }
  li { 
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 8px;
    background: #f9f9f9;
  }
  .btn-delete { background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; }
  .empty { text-align: center; color: #888; margin-top: 20px; }
  
  .skeleton { padding: 20px; text-align: center; background: #eee; border-radius: 8px; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>