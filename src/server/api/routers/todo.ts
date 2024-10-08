import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TodoTable } from "~/server/db/schema";

const todoInput = z.object({
  title: z.string().min(1),
  description:z.string().min(2)
});

const todoIdInput = z.object({
  id: z.number(),
});

const todoUpdateInput = todoIdInput.extend({
  title: z.string().min(1),
  description:z.string().min(2)
});

const todoCompleteInput = todoIdInput.extend({
  completed: z.boolean(),
});

export const todoRouter = createTRPCRouter({
 
    // to create todo 
  create: publicProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(TodoTable).values({
        title: input.title,description:input.description
      });
    }),

    // to update todo
  update: publicProcedure
    .input(todoUpdateInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(TodoTable)
        .set({
          title: input.title,
          description:input.description,
        })
        .where(eq(TodoTable.id, input.id));
     }),

    // to mark as completed
  complete: publicProcedure
    .input(todoCompleteInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(TodoTable)
        .set({
          completed:input?.completed,
        })
        .where(eq(TodoTable.id, input.id));
    }),

    // to delete todo
  delete: publicProcedure
    .input(todoIdInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(TodoTable).where(eq(TodoTable.id, input.id));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const todo = await ctx.db.query.TodoTable.findMany({});
    return todo ?? [];
  }),
});
