import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export function useTodoApi() {
  const utils = api.useUtils();

  // Create todo
  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
      toast.success("Todo created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create todo: ${error?.message}`);
    },
  });

  // Update todo
  const updateTodo = api.todo.update.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
      toast.success("Todo updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update todo: ${error?.message}`);
    },
  });

  // Delete todo
  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
      toast.success("Todo Deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete todo: ${error?.message}`);
    },
  });

  // Complete/undo todo
  const completeTodo = api.todo.complete.useMutation({
    onSuccess: async (data: { id: number; completed: boolean }|any) => {
      await utils.todo.invalidate();
      console.log({data});
      toast.success(`Todo marked as completed/uncompleted`);
    },
    onError: (error) => {
      toast.error(`Failed to complete todo: ${error?.message}`);
    },
  });

  return {
    createTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
  };
}
