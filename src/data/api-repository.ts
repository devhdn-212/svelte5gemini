import type { Todo, TodoRepository } from "../core/todo";

export class ApiTodoRepository implements TodoRepository {
  private baseUrl = "https://jsonplaceholder.typicode.com/todos";

  async getAll(): Promise<Todo[]> {
    const res = await fetch(`${this.baseUrl}?_limit=5`);
    if (!res.ok) throw new Error("Gagal mengambil data");
    return res.json();
  }

  async create(title: string): Promise<Todo> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify({ title, completed: false, userId: 1 }),
      headers: { 'Content-type': 'application/json' }
    });
    return res.json();
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Gagal menghapus");
  }
}