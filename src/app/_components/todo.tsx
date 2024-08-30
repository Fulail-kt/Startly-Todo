"use client";

import { Check, Edit2, Edit2Icon, Edit3Icon, LucideTrash, Trash, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { api } from "~/trpc/react";

export function Todo() {
  const [getAllTodo] = api.todo.getAll.useSuspenseQuery();

  const utils = api.useUtils();
  const [todo, setTodo] = useState("");
  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
      setTodo("");
    },
  });

  return (
    <div className="w-full max-w-xs h-80 border border-0.5 border-violet-900 rounded-md  p-4">
      {/* {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )} */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo.mutate({ title:todo });
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-around gap-2 items-center">
          <input
            type="text"
            placeholder="Title"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="w-full rounded-full px-4 py-2 text-black"
          />
          <button
            type="submit"
            className="rounded-full bg-white/10 px-6 py-2.5 font-semibold transition hover:bg-white/20"
            disabled={createTodo?.isPending}
          >
            {createTodo.isPending ? <span className="loader"></span> : "Add"}
          </button>
        </div>
      </form>
      <div>
        {getAllTodo?.map((todo) => (
          <div className="w-full flex justify-center gap-1 items-center text-break-full py-2" key={todo.id}>
            <span className="w-4/5 bg-gray-400/50 px-2 rounded-md ">
              <h2 className="text-lg  ">{todo?.title}</h2>
            </span>
            <span className="w-1/5 flex gap-2">
              <span> <Edit2 color="blue" size={18}/> </span>
              <span><Trash color="red" size={18}/> </span>
              <span><Check color="green" size={18}/> </span>
            </span>
            </div>
        ))}
      </div>
    </div>
  );
}
