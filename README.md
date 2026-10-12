# Saathi Desk

A task management dashboard built with vanilla JavaScript, Node.js, Express, and SQLite. Features a dark-mode interface, analytics charts with Chart.js, and a RESTful backend API.

Live Demo: [https://saathi-desk.onrender.com](https://saathi-desk.onrender.com)

## Features

- **Task Analytics**: Donut chart tracking completed and pending tasks, updated live from the database.
- **CRUD Operations**: Create, edit, delete, and cycle task statuses.
- **Search & Filters**: Search tasks by title or filter by status (Pending, In Progress, Completed).
- **Vanilla Frontend**: Built with semantic HTML5, CSS variables, and modern event delegation without heavy UI frameworks.
- **SQLite Database**: Local file-based persistence with foreign key constraints.
- **Responsive Layout**: Collapsible mobile sidebar and modal dialogs with keyboard support (`Esc` to close).

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Chart.js
- **Backend**: Node.js, Express
- **Database**: SQLite3 (`sqlite`, `sqlite3`)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Adityaaop/Saathi-Desk.git
   cd Saathi-Desk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

All endpoints are served under `/api/tasks`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a task (`title`, `description`, `priority`, `assigned_to`) |
| `PUT` | `/api/tasks/:id` | Update task details or status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## Project Structure

```
saathi-desk/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── routes/
│   └── tasks.js
├── db.js
├── schema.sql
├── server.js
├── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## License

This project is licensed under the [MIT License](LICENSE).
