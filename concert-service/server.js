const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

// Чтение и запись
const readDB = (file) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, "data", file), "utf-8"));
const writeDB = (file, data) =>
  fs.writeFileSync(
    path.join(__dirname, "data", file),
    JSON.stringify(data, null, 2)
  );

// Аналог body-parser
const getBody = (req) =>
  new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => resolve(JSON.parse(body || "{}")));
  });

const server = http.createServer(async (req, res) => {
  const parts = req.url.split("/").filter(Boolean);
  const resource = parts[0]; // concerts или venues
  const id = parseInt(parts[1]);

  console.log("Запрос пришел на url:", req.url); // ДОБАВЬ ЭТО
  console.log("Определенный ресурс:", resource); // И ЭТО

  res.setHeader("Content-Type", "application/json");

  try {
    if (resource !== "concerts" && resource !== "venues") {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "Маршрут не найден" }));
    }

    const fileName = `${resource}.json`;
    let data = readDB(fileName);

    // GET ALL
    if (req.method === "GET" && !id) {
      res.end(JSON.stringify(data));
    }
    // GET BY ID
    else if (req.method === "GET" && id) {
      const item = data.find((i) => i.id === id);
      item
        ? res.end(JSON.stringify(item))
        : ((res.statusCode = 404),
          res.end(JSON.stringify({ error: "Не найдено" })));
    }
    // POST (Создание)
    else if (req.method === "POST") {
      const body = await getBody(req);
      const newItem = { id: Date.now(), ...body };
      data.push(newItem);
      writeDB(fileName, data);
      res.statusCode = 201;
      res.end(JSON.stringify(newItem));
    }
    // PUT (Полное обновление)
    else if (req.method === "PUT" && id) {
      const body = await getBody(req);
      const index = data.findIndex((i) => i.id === id);
      if (index !== -1) {
        data[index] = { id, ...body };
        writeDB(fileName, data);
        res.end(JSON.stringify(data[index]));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Не найдено" }));
      }
    }
    // PATCH (Частичное обновление + неидемпотентность)
    else if (req.method === "PATCH" && id) {
      const body = await getBody(req);
      const index = data.findIndex((i) => i.id === id);
      if (index !== -1) {
        // Добавляем счетчик правок (неидемпотентность)
        const editCount = (data[index]._edits || 0) + 1;
        data[index] = { ...data[index], ...body, _edits: editCount };
        writeDB(fileName, data);
        res.end(JSON.stringify(data[index]));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Не найдено" }));
      }
    }
    // DELETE
    else if (req.method === "DELETE" && id) {
      const filtered = data.filter((i) => i.id !== id);
      writeDB(fileName, filtered);
      res.statusCode = 204;
      res.end();
    }
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Ошибка на сервере" }));
  }
});

server.listen(PORT, () =>
  console.log(`Сервер расписания запущен: http://localhost:${PORT}`)
);
