export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  create(title: string): Promise<Todo>;
  delete(id: number): Promise<void>;
}