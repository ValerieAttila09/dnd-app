"use client";

import { Todo, useTodoStore } from "@/lib/todoStore"
import { Trash2Icon, XIcon } from 'lucide-react';
import { useRef, useState, useEffect } from "react";
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

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

  const updateTodoStatus = useTodoStore((s) => s.updateTodoStatus);

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const sensors = useSensors(sensor);

  function DraggableCard({ todo }: { todo: Todo }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: todo.id });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
    return (
      <div ref={setNodeRef as any} style={style} {...listeners} {...attributes} className="rounded-md border border-[#d7d7d7] p-4 hover:shadow-md transition-all bg-white">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-lg outfit-medium text-neutral-800">{todo.title}</h3>
          <button onClick={() => removeTodo(todo.id)} className="rounded-full p-2 border border-[#d7d7d7] hover:bg-red-50 hover:border-red-200 transition-all">
            <Trash2Icon className="size-5" color="#898989" />
          </button>
        </div>
        <span className={`${todo.completed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-sm text-sm outfit-regular px-2 py-[2px]`}>{todo.completed ? 'Done' : 'Unfinished'}</span>
        <div className="mt-4">
          <p className="text-sm text-neutral-600 outfit-regular">{todo.description}</p>
          <p className="text-xs text-neutral-500 mt-2">{new Date(todo.createdAt).toLocaleString()}</p>
        </div>
      </div>
    );
  }

  function DroppableColumn({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({ id });
    return (
      <div ref={setNodeRef as any} className="col-span-1 flex flex-col gap-2 p-2 border rounded min-h-[6rem]">
        <h4 className="text-sm font-medium mb-2">{title}</h4>
        {children}
      </div>
    );
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const draggedId = String(active.id);
    const dest = String(over.id);
    if (dest === draggedId) return;
    // dest is expected to be one of 'unfinished' | 'on-progress' | 'completed'
    if (dest === 'unfinished' || dest === 'on-progress' || dest === 'completed') {
      await updateTodoStatus(draggedId, dest as any);
    }
  };

  useEffect(() => {
    (async () => {
      if (typeof window === 'undefined') return;
      try {
        await (useTodoStore.getState().loadTodos());
      } catch (err) {
        throw err;
      }
    })();
  }, []);

  const modalTodo = useRef<HTMLDivElement>(null);
  const darkLayer = useRef<HTMLDivElement>(null);
  const [isShowedUp, setIsShowedUp] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useGSAP(() => {
    gsap.set(modalTodo.current, {
      zIndex: -1,
      opacity: 0,
      y: -50
    });
    gsap.set(darkLayer.current, {
      zIndex: -1,
      opacity: 0,
    });
  });

  const toggleModal = (): void => {
    if (!isShowedUp) {
      gsap.fromTo(modalTodo.current, {
        zIndex: -1,
        opacity: 0,
        y: -50
      }, {
        opacity: 1,
        y: 0,
        onStart: () => {
          gsap.to(modalTodo.current, {
            zIndex: 10,
            duration: 0.3,
            ease: 'power2.out'
          });
        },
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.fromTo(darkLayer.current, {
        opacity: 0,
        zIndex: -1,
      }, {
        opacity: 1,
        onStart: () => {
          gsap.to(darkLayer.current, {
            zIndex: 5,
            duration: 0.3,
            ease: 'power2.out'
          });
        },
        duration: 0.3,
        ease: 'power2.out'
      });
      setIsShowedUp(!isShowedUp);
    } else {
      gsap.fromTo(modalTodo.current, {
        zIndex: 10,
        opacity: 1,
        y: 0
      }, {
        opacity: 0,
        y: -50,
        onComplete: () => {
          gsap.to(modalTodo.current, {
            zIndex: -1,
            duration: 0.3,
            ease: 'power2.out'
          });
        },
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.fromTo(darkLayer.current, {
        opacity: 1,
        zIndex: 5,
      }, {
        opacity: 0,
        onComplete: () => {
          gsap.to(darkLayer.current, {
            zIndex: -1,
            duration: 0.3,
            ease: 'power2.out'
          });
        },
        duration: 0.3,
        ease: 'power2.out'
      });
      setIsShowedUp(!isShowedUp);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <button onClick={toggleModal} className="cursor-pointer rounded-sm outfit-regular text-neutral-600 border border-[#d7d7d7] px-4 py-1 hover:bg-[#fafafa] hover:text-neutral-900 hover:border-neutral-300 transition-all">Add Todo</button>
        <button onClick={() => {
          if (todos.length === 0) return;
          if (confirm('Are you sure you want to clear all todos?')) {
            clearAllTodos();
            alert('All todos cleared');
          }
        }} disabled={todos.length === 0} className="rounded-sm outfit-regular text-neutral-600 border border-[#d7d7d7] px-4 py-1 hover:bg-[#fafafa] hover:text-neutral-900 hover:border-neutral-300 transition-all disabled:opacity-50">Clear All</button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          <DroppableColumn id="unfinished" title="Unfinished">
            {todos.filter(t => t.status === 'unfinished').map((todo: Todo) => (
              <DraggableCard key={todo.id} todo={todo} />
            ))}
          </DroppableColumn>
          <DroppableColumn id="on-progress" title="On Progress">
            {todos.filter(t => t.status === 'on-progress').map((todo: Todo) => (
              <DraggableCard key={todo.id} todo={todo} />
            ))}
          </DroppableColumn>
          <DroppableColumn id="completed" title="Completed">
            {todos.filter(t => t.status === 'completed').map((todo: Todo) => (
              <DraggableCard key={todo.id} todo={todo} />
            ))}
          </DroppableColumn>
        </div>
      </DndContext>

      <div ref={darkLayer} className="absolute inset-0 z-5 bg-black/35 m-0" />
      <div ref={modalTodo} className="overflow-hidden fixed inset-x-[30%] top-20 z-10 h-auto rounded-lg border border-[#d7d7d7] shadow-xl bg-white">
        <div className="bg-[#fafafa] border-b border-[#d7d7d7] w-full py-2 px-4 flex items-center justify-between">
          <div className="">
            <h1 className="text-lg outfit-regular text-neutral-800">Add new todo</h1>
          </div>
          <button onClick={toggleModal} className="p-1 rounded-full cursor-pointer">
            <XIcon className="size-5" color="#898989" />
          </button>
        </div>
        <div className="border-b border-[#d7d7d7] p-6">
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col">
              <label htmlFor="title">Todo Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} id="title" type="text" className="px-2 py-1 outline-none ring-2 ring-transparent border border-[#d7d7d7] rounded-md focus:ring-indigo-300 focus:border-indigo-400 transition-all" name="title" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">Todo Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" className="max-h-[6rem] px-2 py-1 outline-none ring-2 ring-transparent border border-[#d7d7d7] rounded-md focus:ring-indigo-300 focus:border-indigo-400 transition-all" name="description"></textarea>
            </div>
          </form>
        </div>
        <div className="bg-[#fafafa] flex p-2 items-center justify-end gap-4">
          <button onClick={toggleModal} className="cursor-pointer px-4 py-1 rounded-md border border-transparent hover:border-[#d7d7d7] transition-all text-md text-neutral-700 outfit-regular">Back</button>
          <button onClick={() => {
            const trimmedTitle = title.trim();
            const trimmedDesc = description.trim();
            if (!trimmedTitle) {
              alert('Please enter a title for the todo');
              return;
            }
            addTodo(trimmedTitle, trimmedDesc);
            setTitle('');
            setDescription('');
            toggleModal();
            alert('Todo added');
          }} className="rounded-md bg-indigo-500 hover:bg-indigo-600 transition-all px-4 py-1 text-md text-white outfit-regular">Save</button>
        </div>
      </div>
    </div>
  )
}