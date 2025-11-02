"use client";

import { useCounterStore } from "@/lib/store"

export default function Test() {

  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="w-full flex flex-col items-center gap-2 p-6">
      <h1 className="text-2xl font-semibold">Count : {count}</h1>

      <div className="flex items-center gap-2">
        <button onClick={decrement} className="px-4 py-1 text-lg rounded-md border border-[#d7d7d7]">-</button>
        <button onClick={increment} className="px-4 py-1 text-lg rounded-md border border-[#d7d7d7]">+</button>
      </div>
    </div>
  )
}