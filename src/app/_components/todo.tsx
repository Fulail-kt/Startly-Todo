"use client";

import { Check, Edit2, Trash, Undo2 } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import Modal from "./modal";
import { useTodoApi } from "../../lib/todoApi";
import toast from "react-hot-toast";
import Tooltip from "./tooltip";

interface Todo {
  id: number;
  title: string | null;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
interface TodoInput {
  title: string;
  description: string;
}

export function Todo() {

  // custom hook for all api
  const { createTodo, updateTodo, deleteTodo, completeTodo } = useTodoApi();
  const [getAllTodo] = api.todo.getAll.useSuspenseQuery();

  const [todo, setTodo] = useState<TodoInput>({ title: "", description: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);


  //edit function
  const handleEdit = (
    todoId: number,
    todoTitle: string,
    todoDescription: string,
  ) => {
    setTodo({ title: todoTitle, description: todoDescription });
    setEditId(todoId);
  };

  // delete function
  const handleDelete = (todoId: number) => {
    setSelectedTodoId(todoId);
    setIsModalOpen(true);
  };


  // complete function
    const handleComplete = (todoId: number, status: boolean) => {
    setSelectedTodoId(todoId);
    completeTodo.mutate({
      id: todoId,
      completed: status,
    });
  };


  // storing the value to todo state
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTodo((prevTodo: { title: string; description: string }) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = todo.title.trim();
    const trimmedDescription = todo.description.trim();

    // trimming the string to remove unwanted white space
    if (trimmedTitle === "") {
      toast.error("Title cannot be empty.");
      return;
    }
    if (trimmedDescription === "") {
      toast.error("Description cannot be empty.");
      return;
    }

    const todoExists = getAllTodo.some(
      (item: Todo) =>
        item.title !== null &&
        item.title.trim().toLowerCase() === trimmedTitle.toLowerCase(),
    );

    if (editId) {
      const existingTodo = getAllTodo.find((item: Todo) => item?.id === editId);
      if (
        !todoExists ||
        (existingTodo && existingTodo.title === trimmedTitle)
      ) {
        updateTodo.mutate({
          id: editId,
          title: trimmedTitle,
          description: trimmedDescription,
        });
        setEditId(null);
        setTodo({ title: "", description: "" });
      } else {
        toast.error("Todo with this title already exists.");
      }
    } else {
      if (!todoExists) {
        createTodo.mutate({
          title: trimmedTitle,
          description: trimmedDescription,
        });
        setTodo({ title: "", description: "" });
      } else {
        toast.error("Todo with this title already exists.");
      }
    }
  };
  return (
    <div className="border-1 max-h-[560px] w-full max-w-md rounded-md border border-violet-900 p-6 shadow-2xl shadow-violet-900">
      {/* form for adding todo */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center justify-around gap-x-6">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={todo.title}
              onChange={handleInputChange}
              className="w-full rounded-md px-4 py-3 text-black"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={todo.description}
              onChange={handleInputChange}
              className="w-full rounded-md px-4 py-3 text-black"
              rows={1}
            />
          </div>
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
      <div className="no-scroll mt-2 max-h-80 w-full overflow-y-auto">
        {/* Display todos */}
        {!getAllTodo?.length ? (
          <div className="mt-4 flex w-full items-center justify-center gap-3 rounded bg-gray-400/50 px-3">
            <h2 className="py-2.5 text-lg italic">Add Some Todos</h2>
          </div>
        ) : (
          getAllTodo?.map((todo: Todo) => (
            <div
              className="text-break-full mt-4 flex w-full items-center justify-between gap-3 rounded bg-gray-400/50 px-3"
              key={todo?.id}
            >
              <span className="w-full rounded-md py-3">
                <div className="flex items-center justify-between">
                  <h2
                    className={` ${todo?.completed ? "text-green-500" : ""} break-all text-lg`}
                  >
                    {todo?.title}
                  </h2>
                  {/* tool tip for the description */}
                  <span className="w-[10%] cursor-pointer">
                    <Tooltip
                      content={
                        <div className="flex flex-col justify-between gap-3">
                          <span className="text-xs">
                            {" "}
                            {todo?.createdAt.toLocaleDateString()}
                          </span>
                          <span>Description : {todo?.description}</span>
                        </div>
                      }
                    >
                      <span className="flex items-center rounded-full border bg-transparent px-1.5 text-xs font-light text-white">
                        i
                      </span>
                    </Tooltip>
                  </span>
                </div>
              </span>
              {/* Action buttons */}
              <span className="w-30 flex justify-center gap-2">
                <span
                  className="rounded-md bg-gray-300 p-2"
                  onClick={() =>
                    handleEdit(todo?.id, todo?.title!, todo?.description!)
                  }
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
          ))
        )}
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
