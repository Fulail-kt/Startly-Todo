"use client";

import { Check, Edit2, Trash, Undo2 } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import Modal from "./modal";
import { useTodoApi } from "../../lib/toDoApi";
import toast from "react-hot-toast";

export function Todo() {
  const { createTodo, updateTodo, deleteTodo, completeTodo } = useTodoApi();
  const [getAllTodo] = api.todo.getAll.useSuspenseQuery();
  const utils = api.useUtils();

  const [todo, setTodo] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const handleEdit = (todoId: number, title: string) => {
    setTodo(title);
    setEditId(todoId);
  };

  const handleDelete = (todoId: number) => {
    setSelectedTodoId(todoId);
    setIsModalOpen(true);
  };

  const handleComplete = (todoId: number, status: boolean) => {
    setSelectedTodoId(todoId);
    completeTodo.mutate({
      id: todoId,
      completed: status,
    });
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (editId) {
  //     updateTodo.mutate({ id: editId, title: todo });
  //   } else {
  //     createTodo.mutate({ title: todo });
  //     setTodo("");
  //   }
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTodo = todo.trim();
    if (trimmedTodo === "") {
      toast.error("Todo cannot be empty or whitespace.");
      return;
    }
    const todoExists = getAllTodo.some(
      (item: { title: string | unknown | undefined | any }) =>
        item?.title.trim().toLowerCase() === trimmedTodo.toLowerCase(),
    );

    if (editId) {
      const existingTodo = getAllTodo.find((item) => item.id === editId);
      if (!todoExists || (existingTodo && existingTodo.title === trimmedTodo)) {
        updateTodo.mutate({ id: editId, title: trimmedTodo });
        setEditId(null);
        setTodo("");
      } else {
        toast.error("Todo already exists.");
      }
    } else {
      if (!todoExists) {
        createTodo.mutate({ title: trimmedTodo });
        setTodo("");
      } else {
        toast.error("Todo already exists.");
      }
    }
  };

  return (
    <div className="border-0.5 max-h-[560px] w-full max-w-md rounded-md border border-violet-900 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center justify-around gap-x-6">
          <input
            type="text"
            placeholder="Title"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="w-96 rounded-md px-4 py-3 text-black"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-md bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20"
            disabled={createTodo?.isPending || updateTodo?.isPending}
          >
            {createTodo?.isPending || updateTodo?.isPending ? (
              <span className="loader"></span>
            ) : editId ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>
      <div>
        {getAllTodo?.map((todo) => (
          <div
            className="text-break-full mt-4 flex w-full items-center justify-between gap-3 rounded bg-gray-400/50 px-3"
            key={todo?.id}
          >
            <span className="w-full rounded-md py-3">
              <h2
                className={` ${todo?.completed ? "text-green-500" : ""} text-lg`}
              >
                {todo?.title}
              </h2>
            </span>
            <span className="w-30 flex justify-center gap-2">
              <span
                className="rounded-md bg-gray-300 p-2"
                onClick={() => handleEdit(todo?.id, todo?.title!)}
              >
                <Edit2 color="blue" size={18} />
              </span>
              <span
                className="rounded-md bg-gray-300 p-2"
                onClick={() => handleDelete(todo?.id)}
              >
                <Trash color="red" size={18} />
              </span>
              {todo?.completed ? (
                <span
                  className="rounded-md bg-gray-300 p-2"
                  onClick={() => handleComplete(todo?.id, false)}
                >
                  <Undo2 color="orange" size={18} />
                </span>
              ) : (
                <span
                  className="rounded-md bg-gray-300 p-2"
                  onClick={() => handleComplete(todo?.id, true)}
                >
                  <Check color="green" size={18} />
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Modal for confirmation */}
      {isModalOpen && (
        <Modal
          title={"Confirm Deletion"}
          content={"Are you sure you want to delete this todo?"}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => {
            deleteTodo.mutate({ id: selectedTodoId! }), setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
