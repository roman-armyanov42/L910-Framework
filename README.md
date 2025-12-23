Роутинг и данные

# Concerts

GET /concerts
GET /concerts/:id
POST /concerts
PUT /concerts/:id
PATCH /concerts/:id
DELETE /concerts/:id

- id (number) — уникальный идентификатор концерта
- artist (string) — исполнитель
- date (string) — дата концерта
- placeId (number) — id площадки
- price (number) — цена билета

# Venues

GET /venues
GET /venues/:id
POST /venues
PUT /venues/:id
PATCH /venues/:id
DELETE /venues/:id

- id (number) — уникальный идентификатор площадки
- name (string) — название площадки
- city (string) — город
- capacity (number) — вместимость
