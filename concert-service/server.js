const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Мидлвар для парсинга JSON
app.use(express.json());

// Вспомогательные функции для работы с БД
const getFilePath = (resource) => path.join(__dirname, "data", `${resource}.json`);

const readDB = (resource) => {
  const filePath = getFilePath(resource);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeDB = (resource, data) => {
  fs.writeFileSync(getFilePath(resource), JSON.stringify(data, null, 2));
};

// --- Маршруты ---

// Валидация ресурса (concerts или venues)
app.param('resource', (req, res, next, resource) => {
  if (resource !== "concerts" && resource !== "venues") {
    return res.status(404).json({ error: "Маршрут не найден" });
  }
  next();
});

// GET ALL
app.get("/:resource", (req, res) => {
  const data = readDB(req.params.resource);
  res.json(data);
});

// GET BY ID
app.get("/:resource/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = readDB(req.params.resource);
  const item = data.find((i) => i.id === id);

  item ? res.json(item) : res.status(404).json({ error: "Не найдено" });
});

// POST (Создание)
app.post("/:resource", (req, res) => {
  const data = readDB(req.params.resource);
  const newItem = { id: Date.now(), ...req.body };
  
  data.push(newItem);
  writeDB(req.params.resource, data);
  
  res.status(201).json(newItem);
});

// PUT (Полное обновление)
app.put("/:resource/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = readDB(req.params.resource);
  const index = data.findIndex((i) => i.id === id);

  if (index !== -1) {
    data[index] = { id, ...req.body };
    writeDB(req.params.resource, data);
    res.json(data[index]);
  } else {
    res.status(404).json({ error: "Не найдено" });
  }
});

// PATCH (Частичное обновление + счетчик правок)
app.patch("/:resource/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = readDB(req.params.resource);
  const index = data.findIndex((i) => i.id === id);

  if (index !== -1) {
    const editCount = (data[index]._edits || 0) + 1;
    data[index] = { ...data[index], ...req.body, id, _edits: editCount };
    
    writeDB(req.params.resource, data);
    res.json(data[index]);
  } else {
    res.status(404).json({ error: "Не найдено" });
  }
});

// DELETE
app.delete("/:resource/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = readDB(req.params.resource);
  const filtered = data.filter((i) => i.id !== id);
  
  writeDB(req.params.resource, filtered);
  res.status(204).send();
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ошибка на сервере" });
});

app.listen(PORT, () =>
  console.log(`Сервер на Express запущен: http://localhost:${PORT}`)
);