# Our Space — Дизайн-документ

Личный сайт для Сабыржана и Аиды: приватное пространство с фото-таймлайном, записками, статусами настроения и совместным плейлистом. Сайт сделан исключительно для двоих — имена, дата отношений и персональные детали зашиты в логику. Это не платформа для пар, а конкретное место для нас.

## Решения

| Вопрос | Решение |
|--------|---------|
| Фреймворк | Next.js 14+ (App Router + Server Actions) |
| БД | PostgreSQL (плагин Railway) |
| Кеш | Redis (плагин Railway) |
| ORM | Prisma |
| Аутентификация | NextAuth.js v5 (credentials provider) |
| Хранение фото | Cloudflare R2 (S3-совместимое) |
| Хостинг | Railway (один сервис) |
| Авторизация | Инвайт по одноразовой ссылке, 2 аккаунта |

## Архитектура

Один Next.js проект, всё в App Router. Server Actions для мутаций данных. Один деплой на Railway.

```
our-space/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Логин, регистрация по инвайту
│   │   │   ├── login/
│   │   │   └── invite/[token]/
│   │   ├── (main)/             # Защищённые страницы
│   │   │   ├── page.tsx        # Дашборд
│   │   │   ├── timeline/       # Фото-таймлайн
│   │   │   ├── notes/          # Записки
│   │   │   ├── playlist/       # Плейлист
│   │   │   └── settings/       # Настройки
│   │   ├── api/                # API routes (upload presigned URLs)
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/                    # db, auth, s3, redis клиенты
│   ├── actions/                # Server Actions
│   └── types/
├── prisma/
│   └── schema.prisma
└── public/
```

## Схема базы данных

### User

Два пользователя — Сабыржан (создатель) и Аида (приглашённый партнёр). Имена фиксированы в системе.

```prisma
model User {
  id          String   @id @default(cuid())
  name        String   // "Сабыржан" или "Аида" — задаётся при создании, не меняется
  email       String   @unique
  password    String   // bcrypt hash
  avatar      String?  // URL аватарки
  createdAt   DateTime @default(now())

  moods         Mood[]
  sentNotes     Note[]         @relation("author")
  receivedNotes Note[]         @relation("recipient")
  photos        Photo[]
  playlistItems PlaylistItem[]
}
```

### Couple

Одна запись на пару. Хранит дату начала отношений (27.06.2025) и одноразовый инвайт-токен.

```prisma
model Couple {
  id          String   @id @default(cuid())
  startDate   DateTime @default("2025-06-27T00:00:00Z") // 27 июня 2025
  inviteToken String?  @unique // UUID v4, null после использования
  user1Id     String
  user2Id     String?  // null пока партнёр не принял инвайт
  createdAt   DateTime @default(now())
}
```

### Photo

Фото для таймлайна. `eventDate` задаётся пользователем (дата события), отдельно от `createdAt` (дата загрузки). Это позволяет загружать старые фото и размещать их правильно на таймлайне.

```prisma
model Photo {
  id          String   @id @default(cuid())
  url         String   // URL в Cloudflare R2
  thumbnail   String?  // URL миниатюры
  description String?
  eventDate   DateTime // дата события (определяет позицию на таймлайне)
  createdAt   DateTime @default(now())

  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
}
```

### Mood

Настроение/статус. Не перезаписывается — каждая смена настроения создаёт новую запись. Текущее настроение = последняя запись по `createdAt`. Это даёт историю настроений.

```prisma
model Mood {
  id        String   @id @default(cuid())
  emoji     String   // эмодзи
  label     String   // "скучаю", "счастлив", "нужно поговорить"
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

### Note

Записки/письма партнёру. Флаг `isRead` позволяет показывать непрочитанные при входе.

```prisma
model Note {
  id          String   @id @default(cuid())
  content     String
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())

  authorId    String
  author      User     @relation("author", fields: [authorId], references: [id])
  recipientId String
  recipient   User     @relation("recipient", fields: [recipientId], references: [id])
}
```

### PlaylistItem

Совместный плейлист. Каждый элемент — песня со ссылкой и комментарием почему она важна.

```prisma
model PlaylistItem {
  id        String   @id @default(cuid())
  title     String
  artist    String?
  url       String   // ссылка на Spotify/YouTube
  comment   String?  // "наша первая песня", "под эту гуляли"
  createdAt DateTime @default(now())

  addedById String
  addedBy   User     @relation(fields: [addedById], references: [id])
}
```

## Функционал по страницам

### Дашборд (главная)

- Счётчик отношений: "Вместе X лет, Y месяцев и Z дней" (считается от `Couple.startDate`)
- Текущее настроение партнёра (последний `Mood` партнёра)
- Кнопка смены своего настроения (выбор из предустановленных + кастомный)
- Счётчик непрочитанных записок (Note с `isRead=false`)
- Превью последних 3-4 фото из таймлайна

### Таймлайн

- Горизонтальный скролл карточек по датам (слева — старые, справа — новые)
- Карточка: фото (thumbnail), дата, описание, автор
- Клик на карточку — полноразмерное фото с описанием
- Кнопка "+" — загрузка нового момента (фото + дата + описание)

### Записки

- Форма написания записки партнёру
- Список всех записок: отправленные / полученные
- Непрочитанные записки выделены визуально
- Записка помечается прочитанной при открытии

### Плейлист

- Список песен: название, артист, ссылка, комментарий, кто добавил, когда
- Кнопка "+" — добавить песню (название, артист, URL, комментарий)
- Клик по ссылке открывает Spotify/YouTube

### Настройки

- Аватарки (загрузка/смена)
- Управление предустановленными настроениями (добавить/удалить)
- Генерация инвайт-ссылки (одноразовой, если партнёр ещё не присоединился)

## Флоу авторизации

1. Сабыржан регистрируется на сайте (email + пароль, имя "Сабыржан" задаётся автоматически) — создаётся `User` + `Couple` (с `user2Id = null`, `startDate = 27.06.2025`)
2. В настройках генерирует инвайт-ссылку (`/invite/[token]`)
3. Отправляет ссылку Аиде
4. Аида переходит по ссылке → персональное приветствие "Добро пожаловать, Аида!" → форма с email и паролем (без ввода имени — оно уже известно) → создаётся `User(name: "Аида")`, привязывается к `Couple` как `user2Id`
5. `inviteToken` обнуляется — больше никто не может зарегистрироваться
6. При попытке зайти на `/invite/[token]` с невалидным токеном — ошибка "Ссылка недействительна"

> **Персонализация:** Имена захардкожены в системе. Сабыржан = user1, Аида = user2. Это не универсальная платформа — сайт знает, для кого он сделан, и использует имена в интерфейсе (приветствия, подписи записок, заголовки форм).

## Загрузка фото

Прямая загрузка в Cloudflare R2 через presigned URL, чтобы не нагружать сервер Next.js:

1. Клиент выбирает фото, заполняет дату и описание
2. Клиент запрашивает presigned URL через Server Action
3. Server Action генерирует presigned PUT URL для R2 (время жизни 15 минут)
4. Клиент загружает файл напрямую в R2 по presigned URL
5. После успешной загрузки — Server Action сохраняет запись `Photo` в БД
6. Генерация thumbnail через `sharp` на сервере (отдельный API route или Server Action)

## Настроение/статус — обновление в реальном времени

- При смене настроения: запись создаётся в PostgreSQL + текущее состояние кешируется в Redis (ключ: `mood:{userId}`)
- Партнёр получает актуальное настроение через polling каждые 30 секунд (чтение из Redis)
- WebSocket избыточен для 2 пользователей, polling из Redis минимально нагружает систему

## Безопасность

- Все роуты в группе `(main)/` защищены через Next.js middleware — без авторизации редирект на `/login`
- Пароли хешируются bcrypt (salt rounds = 12)
- Инвайт-токен — UUID v4, одноразовый
- Presigned URL для R2 — время жизни 15 минут
- CSRF защита встроена в Server Actions (Next.js)
- Все данные привязаны к `Couple` — даже если кто-то получит доступ к API, он не увидит данные чужой пары

## Деплой на Railway

- **Next.js** — один сервис
- **PostgreSQL** — плагин Railway
- **Redis** — плагин Railway
- **Cloudflare R2** — внешний сервис, подключается через env переменные (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`)

Env переменные:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_ENDPOINT=...
```

---

> **Визуальный дизайн** описан в отдельном документе: `docs/plans/2025-02-13-visual-design.md` (концепция "Candlelight & Parchment", цветовая палитра, типографика, компоновка страниц, анимации, адаптивность).
