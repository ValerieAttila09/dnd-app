"use client";

import { Todo, useTodoStore } from "@/lib/todoStore"
import { Trash2Icon } from 'lucide-react';

export default function TestTodo() {
  const {
    todos,
    filter,
    addTodo,
    removeTodo,
    toggleTodo,
    setFilter,
    getFilteredTodo,
    clearAllTodos
  } = useTodoStore();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <button onClick={() => {
          addTodo("Test");
          alert("Data sukses");
        }} className="rounded-sm outfit-regular text-neutral-600 border border-[#d7d7d7] px-4 py-1 hover:bg-[#fafafa] hover:text-neutral-900 hover:border-neutral-300 transition-all">Add Todo</button>
        <button onClick={() => {
          if (todos.length === 0) return;
          if (confirm('Are you sure you want to clear all todos?')) {
            clearAllTodos();
            alert('All todos cleared');
          }
        }} disabled={todos.length === 0} className="rounded-sm outfit-regular text-neutral-600 border border-[#d7d7d7] px-4 py-1 hover:bg-[#fafafa] hover:text-neutral-900 hover:border-neutral-300 transition-all disabled:opacity-50">Clear All</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-2">
          {todos.map((todo: Todo) => {
            const isComplete = todo.completed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
            return (
              <div key={todo.id} className="rounded-md border border-[#d7d7d7] p-4 hover:shadow-md transition-all">
                <div className="w-full flex items-center justify-between">
                  <h3 className="text-lg outfit-medium text-neutral-800">{todo.title}</h3>
                  <button onClick={() => {
                    removeTodo(todo.id);
                  }} className="rounded-full p-2 border border-[#d7d7d7] hover:bg-red-50 hover:border-red-200 transition-all">
                    <Trash2Icon className="size-5" color="#898989" />
                  </button>
                </div>
                <span className={`${isComplete} rounded-sm text-sm outfit-regular px-2 py-[2px]`}>{todo.completed ? "Done" : "Unfinished"}</span>
                <p className="text-xs text-neutral-500 mt-6">{todo.createdAt.toLocaleString()}</p>
                <p className="py-3 text-sm text-neutral-600 outfit-regular">{todo.id}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}