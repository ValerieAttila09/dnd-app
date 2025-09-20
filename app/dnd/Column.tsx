"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "./Task";
import { Key } from "react";

export function Column({ tasks }: { tasks: any }) {
  return (
    <div className="p-4 bg-neutral-800 rounded-lg shadow-md">
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((task: { id: Key | null | undefined; title: any; }) => (
            <Task key={task.id} id={task.id} title={task.title} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
