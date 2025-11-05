import { create } from "zustand";
import { persist, devtools } from 'zustand/middleware'

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (title: string, description: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  clearAllTodos: () => void;
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  getFilteredTodo: () => Todo[];
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      addTodo: (title: string, description: string) => {
        const newTodo: Todo = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          description,
          completed: false,
          createdAt: new Date()
        }
        set((state) => ({
          todos: [...state.todos, newTodo]
        }));
      },
      removeTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      clearAllTodos: () => {
        set(() => ({ todos: [] }));
      },
      toggleTodo: (id: string) => {
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