import { create } from "zustand";
import { persist } from 'zustand/middleware'

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface TodoStore {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  addTodo: (title: string, description?: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  clearAllTodos: () => Promise<void>;
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  getFilteredTodo: () => Todo[];
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      loadTodos: async () => {
        try {
          const res = await fetch('/api/todos');
          if (!res.ok) return;
          const data = await res.json();
          set(() => ({ todos: data.map((t: any) => ({ ...t, createdAt: t.createdAt })) }));
        } catch (err) {
          throw err;
        }
      },
      addTodo: async (title: string, description?: string) => {
        try {
          const res = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
          });
          if (!res.ok) return;
          const todo = await res.json();
          set((state) => ({ todos: [...state.todos, { ...todo, createdAt: todo.createdAt }] }));
        } catch (err) {
          const newTodo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            description,
            completed: false,
            createdAt: new Date().toISOString()
          }
          set((state) => ({ todos: [...state.todos, newTodo] }));
        }
      },
      removeTodo: async (id: string) => {
        try {
          await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        } catch (err) {
          throw err;
        }
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      clearAllTodos: async () => {
        try {
          await fetch('/api/todos', { method: 'DELETE' });
        } catch (err) {
          throw err;
        }
        set(() => ({ todos: [] }));
      },
      toggleTodo: async (id: string) => {
        const current = get().todos.find(t => t.id === id);
        const next = !current?.completed;
        try {
          await fetch(`/api/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: next }),
          });
        } catch (err) {
          throw err;
        }
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed }
              : todo
          ),
        }));
      },
      setFilter: (filter: 'all' | 'active' | 'completed') => {
        set(() => ({ filter }));
      },
      getFilteredTodo: () => {
        const { todos, filter } = get();
        if (filter === 'all') return todos;
        if (filter === 'active') return todos.filter(t => !t.completed);
        return todos.filter(t => t.completed);
      }
    }),
    { name: 'todo-store' }
  )
);