import { create } from "zustand";
import { persist, devtools } from 'zustand/middleware'

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  getFilteredTodo: () => Todo[];
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      addTodo: (text: string) => {
        const newTodo: Todo = {
          id: Math.random().toString(36).substr(2, 9),
          text,
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