# Todo Application

## Project Overview

This project is a simple Todo application built using the **create-t3-app** framework. The application allows users to manage their tasks effectively by providing features to add, edit, remove, and toggle the completion state of todo items. The project leverages

## Features

- **Add Todo:** Users can add new tasks to their todo list.
- **Edit Todo:** Users can edit existing tasks.
- **Remove Todo:** Users can remove tasks from the list.
- **Toggle Completion:** Users can mark tasks as completed or uncompleted.
- **Persistent Storage:** Uses SQLite for data persistence.
- **Responsive Design:** Styled using Tailwind CSS for a modern and responsive UI.
- **API Integration:** Uses tRPC for handling API calls.
- **Type Safety:** TypeScript is used throughout the project to ensure type safety.
- **ORM:** Managed with Drizzle ORM for efficient database operations.

## Tech Stack

- **Framework:** create-t3-app
- **Database:** SQLite
- **API:** tRPC
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- SQLite

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Fulail-kt/Startly-Todo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Startly-Todo
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the database:

   ```bash
   npx drizzle-kit generate
   ```

   This command will generate the necessary migrations and set up your SQLite database.

5. Apply the migrations:

   ```bash
   npx drizzle-kit migrate
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```


7. Open your browser and go to `http://localhost:3000` to view the application.

## Project Structure

- **/pages** - Contains the main pages of the application.
- **/components** - Contains reusable components like the TodoItem.
- **/server** - Contains server-side logic, including tRPC routers.
- **/styles** - Contains global styles and Tailwind configuration.
- **/db** - Contains database schema and ORM configuration.



For any questions or inquiries, please reach out via email at [Muhamed Fulail](mailto:fulailkt.dev@gmail.com).