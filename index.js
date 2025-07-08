const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let todos = [];

app.get("/", (req, res) => {
  const { filter, error } = req.query;
  const filtered =
    filter && filter !== "all"
      ? todos.filter((t) => t.priority === filter)
      : todos;
  res.render("index", {
    todos: filtered,
    filter: filter || "all",
    error: error || "",
  });
});

app.post("/add", (req, res) => {
  const { title, priority } = req.body;
  const filter = req.query.filter || "all";

  const taskTitle = title.trim() || "Untitled Task";

  const showError = !title.trim();

  todos.push({ id: Date.now(), title: taskTitle, priority });

  res.redirect(`/?filter=${filter}${showError ? "&error=1" : ""}`);
});

app.post("/edit", (req, res) => {
  const { id, title, priority } = req.body;
  const filter = req.query.filter || "all";
  const todo = todos.find((t) => t.id == id);
  if (todo) {
    todo.title = title;
    todo.priority = priority;
  }
  res.redirect(`/?filter=${filter}`);
});

app.post("/delete", (req, res) => {
  todos = todos.filter((t) => t.id != req.body.id);
  const filter = req.query.filter || "all";
  res.redirect(`/?filter=${filter}`);
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
