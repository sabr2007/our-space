# Our Space — Визуальный дизайн

## Концепция: "Candlelight & Parchment"

Сайт ощущается как уютная комната, освещённая свечами в поздний вечер. Тёмный, тёплый фон создаёт ощущение приватности и интимности. Контентные области — тёплые кремовые поверхности, словно пергамент любовных писем, подсвеченный мягким золотым светом. Каждое взаимодействие нежное и осмысленное.

### Принципы дизайна

1. **Интимность, не публичность** — всё должно ощущаться личным и приватным
2. **Тепло, не холод** — никаких холодных синих тонов или стерильного белого
3. **Нежность, не агрессия** — плавные анимации, мягкие тени, спокойные переходы
4. **Осмысленность, не декоративность** — каждый визуальный элемент служит эмоциональному контексту
5. **Вневременность, не мода** — сайт должен быть красивым через годы, не только сейчас

---

## Цветовая система

### Тёмная оболочка (фоны, навигация)

```css
--bg-deep:       #161210;   /* самый глубокий фон — почти чёрный, но тёплый */
--bg-primary:    #1E1916;   /* основной тёмный фон */
--bg-secondary:  #28221E;   /* чуть светлее — панели, сайдбары */
--bg-elevated:   #332C26;   /* приподнятые поверхности на тёмном фоне */
```

### Светлые поверхности (карточки, области контента)

```css
--surface-primary:   #FAF5EF;   /* тёплый крем — основная поверхность карточек */
--surface-secondary: #F3ECE3;   /* чуть темнее — вложенные элементы */
--surface-hover:     #EDE4D9;   /* состояние hover для светлых поверхностей */
```

### Золото/Янтарь — основной акцент ("свет свечи")

```css
--accent-gold:       #C8943F;   /* насыщенное золото — основной интерактивный цвет */
--accent-gold-light: #D4A85C;   /* светлее — hover состояние */
--accent-gold-glow:  rgba(200, 148, 63, 0.15);   /* эффект свечения */
--accent-amber:      #E8C078;   /* тёплый янтарь для подсветки */
```

### Роза — вторичный акцент ("любовь/эмоции")

```css
--accent-rose:       #B66B68;   /* приглушённая пыльная роза */
--accent-rose-light: #D4908C;   /* светлая роза */
```

### Тёплые нейтральные

```css
--text-cream:        #F0E4D6;   /* светлый текст на тёмном фоне */
--text-dark:         #2D2420;   /* тёмный текст на светлом фоне */
--text-muted-light:  #A09080;   /* приглушённый текст на тёмном */
--text-muted-dark:   #8A7E74;   /* приглушённый текст на светлом */
```

### Границы

```css
--border-dark:  #3A322A;   /* границы на тёмных поверхностях */
--border-light: #E0D5C8;   /* границы на светлых поверхностях */
```

### Цвета настроений

```css
--mood-happy:     #D4A85C;   /* золотой — счастье */
--mood-love:      #B66B68;   /* роза — любовь */
--mood-miss:      #7B8CAA;   /* приглушённый синий — скучаю */
--mood-calm:      #7B917B;   /* шалфей — спокойствие */
--mood-excited:   #D49554;   /* тёплый оранжевый — восторг */
--mood-need-talk: #C47676;   /* глубокая роза — нужно поговорить */
```

### Тени

```css
--shadow-soft:    0 4px 20px rgba(20, 15, 10, 0.25);
--shadow-lifted:  0 8px 32px rgba(20, 15, 10, 0.35);
--shadow-glow:    0 0 40px rgba(200, 148, 63, 0.08);
--shadow-card:    0 2px 12px rgba(20, 15, 10, 0.15);
```

### Полная карта CSS-переменных

```css
:root {
  /* Backgrounds */
  --bg-deep: #161210;
  --bg-primary: #1E1916;
  --bg-secondary: #28221E;
  --bg-elevated: #332C26;

  /* Surfaces */
  --surface-primary: #FAF5EF;
  --surface-secondary: #F3ECE3;
  --surface-hover: #EDE4D9;

  /* Accents */
  --accent-gold: #C8943F;
  --accent-gold-light: #D4A85C;
  --accent-gold-glow: rgba(200, 148, 63, 0.15);
  --accent-amber: #E8C078;
  --accent-rose: #B66B68;
  --accent-rose-light: #D4908C;

  /* Text */
  --text-cream: #F0E4D6;
  --text-dark: #2D2420;
  --text-muted-light: #A09080;
  --text-muted-dark: #8A7E74;

  /* Borders */
  --border-dark: #3A322A;
  --border-light: #E0D5C8;

  /* Moods */
  --mood-happy: #D4A85C;
  --mood-love: #B66B68;
  --mood-miss: #7B8CAA;
  --mood-calm: #7B917B;
  --mood-excited: #D49554;
  --mood-need-talk: #C47676;

  /* Shadows */
  --shadow-soft: 0 4px 20px rgba(20, 15, 10, 0.25);
  --shadow-lifted: 0 8px 32px rgba(20, 15, 10, 0.35);
  --shadow-glow: 0 0 40px rgba(200, 148, 63, 0.08);
  --shadow-card: 0 2px 12px rgba(20, 15, 10, 0.15);

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  /* Easing */
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1.0);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}
```

---

## Типографика

### Шрифты

| Роль | Шрифт | Начертания | Применение |
|------|--------|-----------|------------|
| Display | **Cormorant Garamond** | 400, 500, 600, 700 | Заголовки, счётчик отношений, крупные числа |
| Body | **Crimson Pro** | 400, 500, 600 | Основной текст, описания, записки |
| Handwritten | **Caveat** | 500, 700 | Подписи настроений, подписи фото, "от кого" на записках |
| UI | **Alegreya Sans** | 400, 500, 600 | Кнопки, навигация, метки форм, мелкий текст |

### Подключение (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;600&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
```

### Tailwind config (расширение)

```js
fontFamily: {
  display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  body:    ['"Crimson Pro"', 'Georgia', 'serif'],
  hand:    ['"Caveat"', 'cursive'],
  ui:      ['"Alegreya Sans"', 'system-ui', 'sans-serif'],
},
```

### Типографическая шкала

```css
/* Display — Cormorant Garamond */
.text-display-xl  { font-size: 3.5rem;  line-height: 1.1; letter-spacing: -0.02em; }  /* 56px — счётчик */
.text-display-lg  { font-size: 2.5rem;  line-height: 1.15; letter-spacing: -0.01em; } /* 40px — заголовки страниц */
.text-display-md  { font-size: 1.75rem; line-height: 1.2; }  /* 28px — подзаголовки */
.text-display-sm  { font-size: 1.25rem; line-height: 1.3; }  /* 20px — заголовки карточек */

/* Body — Crimson Pro */
.text-body-lg     { font-size: 1.125rem; line-height: 1.7; }  /* 18px — основной текст записок */
.text-body-md     { font-size: 1rem;     line-height: 1.65; } /* 16px — обычный текст */
.text-body-sm     { font-size: 0.875rem; line-height: 1.6; }  /* 14px — мелкий текст */

/* UI — Alegreya Sans */
.text-ui-md       { font-size: 0.9375rem; line-height: 1.4; letter-spacing: 0.01em; } /* 15px */
.text-ui-sm       { font-size: 0.8125rem; line-height: 1.4; letter-spacing: 0.02em; } /* 13px */
.text-ui-xs       { font-size: 0.6875rem; line-height: 1.3; letter-spacing: 0.04em; text-transform: uppercase; } /* 11px — метки */

/* Hand — Caveat */
.text-hand-lg     { font-size: 1.5rem;  line-height: 1.3; } /* 24px — подписи */
.text-hand-md     { font-size: 1.125rem; line-height: 1.4; } /* 18px — комментарии */
```

---

## Текстуры и фоновые эффекты

### Шум/зернистость (Film Grain)

На тёмных фонах — тонкий шум, создающий ощущение плёнки и глубины. Реализуется через SVG-фильтр:

```css
.grain-overlay::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  z-index: 9999;
}
```

### Текстура бумаги на светлых карточках

Тонкая текстура, создающая ощущение бумаги/пергамента:

```css
.paper-texture {
  background-color: var(--surface-primary);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(200, 148, 63, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(182, 107, 104, 0.02) 0%, transparent 50%);
}
```

### Эффект свечения (Candlelight Glow)

Мягкое золотое свечение вокруг ключевых элементов:

```css
.candle-glow {
  box-shadow:
    0 0 60px rgba(200, 148, 63, 0.06),
    0 0 120px rgba(200, 148, 63, 0.03);
}
```

---

## Навигация

### Desktop — боковая панель (слева)

```
┌─────────────┐
│             │
│   🏠 logo   │ ← Логотип/название "Our Space" (Cormorant Garamond)
│             │
│─────────────│
│             │
│  ◈ Главная  │ ← Иконка + текст (Alegreya Sans 500)
│  ◈ Моменты  │    Активный: золотая иконка + subtle gold bg
│  ◈ Записки  │    Hover: текст становится cream
│  ◈ Музыка   │    Badge: золотой кружок с числом (непрочитанные)
│  ◈ Настройки│
│             │
│             │
│─────────────│
│  Аватарка   │ ← Внизу: аватарка текущего пользователя
│  Имя        │    + текущее настроение
│  😊 mood    │
└─────────────┘
```

**Параметры:**
- Ширина: 240px
- Фон: `--bg-secondary`
- Граница справа: 1px solid `--border-dark`
- Иконки: линейные, stroke-width: 1.5, цвет `--text-muted-light`
- Активный: иконка `--accent-gold`, фон `--accent-gold-glow`, текст `--text-cream`
- Hover: текст `--text-cream`, transition 200ms

### Mobile — нижняя панель табов

```
┌──────┬──────┬──────┬──────┬──────┐
│  🏠  │  📷  │  ✉️  │  🎵  │  ⚙️  │
│Главная│Моменты│Записки│Музыка │  ···  │
└──────┴──────┴──────┴──────┴──────┘
```

**Параметры:**
- Высота: 64px + safe-area-inset-bottom
- Фон: `--bg-secondary` с backdrop-blur(12px) и opacity 0.95
- Граница сверху: 1px solid `--border-dark`
- Активная иконка: `--accent-gold`
- Badge для непрочитанных: маленький gold dot

---

## Иконография

Линейные иконки с тёплым характером. Рекомендуемые наборы:
- **Lucide Icons** (основной) — чистые, минималистичные
- **Phosphor Icons** (альтернатива) — чуть более характерные

Параметры иконок:
- Размер: 20px (nav), 24px (действия), 16px (inline)
- Stroke width: 1.5px
- Цвет по умолчанию: `--text-muted-light` на тёмном, `--text-muted-dark` на светлом
- Активный/hover: `--accent-gold`

---

## Компоненты

### Кнопка — Primary

```
┌─────────────────────┐
│   Добавить момент    │  Фон: --accent-gold
│                     │  Текст: --bg-deep (тёмный на золотом)
└─────────────────────┘  Шрифт: Alegreya Sans 600, 15px
                         Padding: 12px 24px
                         Border-radius: --radius-md (12px)
                         Hover: --accent-gold-light + scale(1.02) + shadow-glow
                         Active: scale(0.98)
                         Transition: all 200ms var(--ease-smooth)
```

### Кнопка — Secondary

```
┌─────────────────────┐
│     Отменить        │  Фон: transparent
│                     │  Текст: --text-muted-light
└─────────────────────┘  Border: 1px solid --border-dark
                         Hover: border --accent-gold, text --text-cream
```

### Кнопка — Ghost

```
  Подробнее →            Фон: transparent
                         Текст: --accent-gold
                         Hover: text --accent-gold-light, underline
```

### Карточка контента (Card)

```
┌─────────────────────────────┐
│                             │  Фон: --surface-primary
│   Контент карточки          │  Border-radius: --radius-lg (20px)
│                             │  Border: 1px solid --border-light
│                             │  Shadow: --shadow-card
└─────────────────────────────┘  Hover: translateY(-4px) + --shadow-soft
                                 Transition: all 300ms var(--ease-smooth)
```

### Инпут (текстовое поле)

```
┌─────────────────────────────┐
│ Введите описание...         │  Фон: --surface-secondary
│                             │  Border: 1.5px solid --border-light
└─────────────────────────────┘  Border-radius: --radius-md
                                 Шрифт: Crimson Pro 400, 16px
                                 Placeholder: --text-muted-dark (italic)
                                 Focus: border --accent-gold + candle-glow
                                 Padding: 12px 16px
```

### Textarea (для записок)

```
┌─────────────────────────────┐
│                             │  Фон: --surface-primary
│  Текст записки...           │  Визуально — как лист бумаги
│                             │  Мин. высота: 200px
│                             │  Шрифт: Crimson Pro 400, 18px (body-lg)
│                             │  Line-height: 1.7
│                             │  Тонкие горизонтальные линии как в тетради
└─────────────────────────────┘  (background repeating-linear-gradient)
```

Линии тетради:
```css
.notebook-lines {
  background-image: repeating-linear-gradient(
    transparent,
    transparent 31px,
    var(--border-light) 31px,
    var(--border-light) 32px
  );
  background-position-y: 8px;
  line-height: 32px;
}
```

### Emoji Picker (выбор настроения)

```
┌───┬───┬───┬───┬───┬───┐
│ 😊│ 🥰│ 😢│ 😴│ 🤩│ 💬│  Сетка 3×2 или горизонтальная лента
│счас│люб│ску│спок│вост│пого│  Каждый: 48px × 48px, border-radius: 50%
└───┴───┴───┴───┴───┴───┘  Hover: scale(1.15) + mood-color glow
                            Selected: ring 2px mood-color + label видим
                            Подпись (Caveat 500): появляется под emoji при hover/select
```

### Badge (непрочитанные)

```
 ⓷   Фон: --accent-rose
     Текст: white
     Size: 18px × 18px (min)
     Font: Alegreya Sans 600, 11px
     Border-radius: 50%
     Animation: subtle pulse (2s infinite, opacity 0.8 → 1.0)
```

### Аватарка

```
 ┌───┐
 │ 🙂│  Size: 40px (nav), 56px (dashboard), 32px (inline)
 └───┘  Border-radius: 50%
        Border: 2px solid --border-dark (на тёмном) / --border-light (на светлом)
        Hover: border --accent-gold
        Fallback: инициалы на фоне --bg-elevated
```

### Модальное окно

```
     ╔═══════════════════════════╗
     ║                           ║  Overlay: --bg-deep с opacity 0.85 + backdrop-blur(8px)
     ║    Содержимое модала      ║  Модал: --surface-primary
     ║                           ║  Border-radius: --radius-xl (28px)
     ║                           ║  Shadow: --shadow-lifted
     ║                           ║  Max-width: 560px
     ╚═══════════════════════════╝  Animation: fade-in + scale(0.95→1.0) 300ms
```

### Toast / Уведомление

```
┌──────────────────────────────┐
│ ✓ Записка отправлена         │  Позиция: bottom-center (mobile) / bottom-right (desktop)
└──────────────────────────────┘  Фон: --bg-elevated
                                  Border: 1px solid --border-dark
                                  Border-left: 3px solid --accent-gold (success)
                                  Текст: --text-cream
                                  Animation: slideUp + fadeIn 300ms
                                  Auto-dismiss: 4 секунды с fadeOut
```

---

## Страницы — Детальный дизайн

### 1. Дашборд (Главная)

Эмоциональный центр сайта. При входе — ощущение тепла и связи с партнёром.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│               👋 Привет, Аида              │  ← Cormorant 500, 20px
│                                                      │     --text-muted-light
│                                                      │
│           ┌──────────────────────┐                   │
│           │                      │                   │
│           │   Вместе             │                   │  ← Cormorant 400, 16px, --text-muted-light
│           │   2 года, 3 месяца   │                   │  ← Cormorant 700, 56px, --text-cream
│           │   и 15 дней          │                   │     с candle-glow эффектом
│           │                      │                   │     Числа анимируются при загрузке
│           │   с 14 февраля 2023  │                   │  ← Caveat 500, 16px, --text-muted-light
│           │                      │                   │
│           └──────────────────────┘                   │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │                                             │     │
│  │   Настроение Бориса:    😊 Счастлив         │     │  ← Карточка --surface-primary
│  │                          2 часа назад       │     │     Emoji увеличен (32px)
│  │                                             │     │     Glow цвета настроения
│  │   Твоё настроение:      [😊][🥰][😢][😴]   │     │  ← Ряд emoji для выбора
│  │                                             │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  ┌────────────────────┐  ┌──────────────────────┐    │
│  │                    │  │                      │    │
│  │  ✉️ 2 новых записки │  │  📷 Последние фото   │    │  ← Две карточки в ряд
│  │                    │  │                      │    │     Hover: lift + shadow
│  │  Нажми, чтобы      │  │  ┌──┐ ┌──┐ ┌──┐     │    │     Фото — мини-превью
│  │  прочитать →       │  │  │📷│ │📷│ │📷│     │    │     с лёгким наклоном
│  │                    │  │  └──┘ └──┘ └──┘     │    │     (polaroid-стиль)
│  └────────────────────┘  └──────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Детали:**
- Фон страницы: `--bg-primary`
- Счётчик отношений — центральный элемент, крупная типографика Cormorant Garamond 700
- Числа в счётчике анимируются при загрузке (count-up эффект, 800ms, staggered)
- Золотое свечение (`candle-glow`) вокруг блока счётчика
- Карточка настроения — `--surface-primary`, `--radius-lg`
- Emoji текущего настроения партнёра — крупный (32px), с мягким glow цвета настроения
- Карточки-ссылки (записки + фото) — hover поднимает карточку (`translateY(-4px)`)
- Превью фото — 3 миниатюры с лёгким случайным наклоном (rotate от -3deg до 3deg)
- Staggered animation при загрузке: приветствие → счётчик → настроение → карточки (каждый +100ms)

### 2. Таймлайн (Моменты)

Хронологическая лента совместных фото — визуальная история отношений.

#### Desktop

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Наши моменты                              [+ Добавить момент]  │
│                                                                  │
│   ────────────●────────────●────────────●────────────●─────►     │
│              2023         2023          2024         2024         │
│                                                                  │
│      ┌──────────┐    ┌──────────┐    ┌──────────┐                │
│      │          │    │          │    │          │                │
│      │   📷     │    │   📷     │    │   📷     │                │
│      │          │    │          │    │          │                │
│      │──────────│    │──────────│    │──────────│                │
│      │14 фев    │    │ 3 мая    │    │22 июн    │                │
│      │Первое    │    │Прогулка  │    │Море!     │                │
│      │свидание  │    │в парке   │    │          │                │
│      │      — А.│    │      — Б.│    │      — А.│                │
│      └──────────┘    └──────────┘    └──────────┘                │
│                                                                  │
│   ◄ Scroll ►                                                     │
└──────────────────────────────────────────────────────────────────┘
```

#### Mobile — вертикальный scroll

```
┌─────────────────────┐
│  Наши моменты    [+]│
│                     │
│  │ 2024             │  ← Год — Cormorant 600, gold
│  │                  │
│  ●──┌───────────┐   │  ← Точка на линии + карточка
│  │  │  📷       │   │
│  │  │           │   │
│  │  │  22 июня  │   │
│  │  │  Море!    │   │
│  │  │       — А.│   │
│  │  └───────────┘   │
│  │                  │
│  ●──┌───────────┐   │
│  │  │  📷       │   │
│  │  │           │   │
│  │  │  3 мая    │   │
│  │  │  Прогулка │   │
│  │  │       — Б.│   │
│  │  └───────────┘   │
│  │                  │
│  │ 2023             │
│  │                  │
│  ●──┌───────────┐   │
│     │  ...      │   │
│     └───────────┘   │
└─────────────────────┘
```

**Детали:**
- Линия таймлайна: 2px, `--accent-gold` с gradient fade на концах
- Точки-маркеры: 10px круги, `--accent-gold`, с `candle-glow`
- Карточки фото: `--surface-primary`, `--radius-lg`, shadow-card
- Фото внутри карточки: border-radius: 12px (чуть меньше карточки)
- Дата: Caveat 700, `--accent-gold` (на светлом фоне карточки)
- Описание: Crimson Pro 400, `--text-dark`
- Автор: Caveat 500, `--text-muted-dark`, выравнен вправо
- Desktop: горизонтальный scroll, карточки чередуются выше/ниже линии
- Mobile: вертикальный scroll, линия слева, карточки справа
- Hover карточки: lift + shadow-soft + slight rotation correction (если был наклон)
- Клик: модальное окно с полноразмерным фото на тёмном overlay
- Кнопка "+": золотой круг 56px, иконка Plus, `candle-glow` на hover
- Появление карточек при скролле: fadeIn + translateY(20px→0), staggered

#### Модальное окно просмотра фото

```
╔════════════════════════════════════════════╗
║                                            ║
║     ┌────────────────────────────────┐     ║
║     │                                │     ║  Overlay: --bg-deep, opacity 0.9
║     │                                │     ║  Фото: max-width 90vw, max-height 80vh
║     │         Полноразмерное         │     ║  object-fit: contain
║     │             фото               │     ║  border-radius: --radius-md
║     │                                │     ║
║     │                                │     ║
║     └────────────────────────────────┘     ║
║                                            ║
║     22 июня 2024                           ║  ← Caveat 700, --accent-amber
║     Наше первое море вместе! 🌊            ║  ← Crimson Pro 400, --text-cream
║                                  — Алиса   ║  ← Caveat 500, --text-muted-light
║                                            ║
║                                    [✕]     ║  ← Кнопка закрытия: ghost, --text-muted-light
╚════════════════════════════════════════════╝
```

### 3. Записки

Страница записок — ощущение переписки любовными письмами.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Записки                           [✏️ Написать]    │
│                                                      │
│   ┌─── Отправленные ───┬─── Полученные ───┐         │  ← Табы (Alegreya Sans 500)
│   │  ════════════       │                  │         │     Активный: gold underline
│                                                      │
│   ┌──────────────────────────────────────────┐       │
│   │                                          │       │  ← Непрочитанная записка:
│   │  ✉️  От Бориса              14 фев 20:35 │       │     border-left: 3px --accent-gold
│   │                                          │       │     Мягкий gold glow по левому краю
│   │  Привет, любимая! Хочу сказать тебе...   │       │     Фон: --surface-primary
│   │                                          │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
│   ┌──────────────────────────────────────────┐       │
│   │                                          │       │  ← Прочитанная записка:
│   │  ✉️  От Бориса              10 фев 15:12 │       │     Без gold glow
│   │                                          │       │     Чуть приглушённее
│   │  Сегодня вспомнил наш первый...          │       │
│   │                                          │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Открытая записка (развёрнутый вид)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   ← Назад к запискам                                 │
│                                                      │
│   ┌──────────────────────────────────────────┐       │
│   │                                          │       │
│   │                                          │       │  ← Карточка-"письмо"
│   │                                          │       │     --surface-primary
│   │   Привет, любимая!                       │       │     Paper texture
│   │                                          │       │     Crimson Pro 400, 18px
│   │   Хочу сказать тебе, что ты             │       │     Line-height: 1.7
│   │   делаешь каждый мой день лучше.         │       │     Notebook lines (опционально)
│   │   Скучаю по тебе и жду вечера,          │       │
│   │   когда увидимся.                        │       │
│   │                                          │       │
│   │                                          │       │
│   │                     С любовью,           │       │  ← Caveat 700, --accent-rose
│   │                     Борис 💌             │       │
│   │                                          │       │
│   │   ─────────────────────────              │       │
│   │   14 февраля 2024, 20:35                 │       │  ← Alegreya Sans 400, --text-muted-dark
│   │                                          │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Форма написания записки

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Новая записка для Бориса                           │  ← Cormorant 600, 28px
│                                                      │
│   ┌──────────────────────────────────────────┐       │
│   │                                          │       │  ← Textarea с notebook-lines
│   │  Напиши что-нибудь тёплое...             │       │     --surface-primary
│   │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │       │     Crimson Pro italic placeholder
│   │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │       │     Мин. высота: 240px
│   │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │       │
│   │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │       │
│   │                                          │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
│                              [Отправить записку 💌]  │  ← Primary button
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 4. Плейлист (Музыка)

Совместная коллекция песен — каждая со своей историей.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Наша музыка                       [+ Добавить]     │
│                                                      │
│   42 песни в коллекции                               │  ← Alegreya Sans, --text-muted-light
│                                                      │
│   ┌──────────────────────────────────────────┐       │
│   │                                          │       │
│   │  ♫  Пока ты со мной                     │       │  ← Название: Crimson Pro 500, 18px
│   │     Три дня дождя                        │       │  ← Артист: Crimson Pro 400, --text-muted-dark
│   │                                          │       │
│   │     "Под эту песню мы танцевали           │       │  ← Комментарий: Caveat 500, italic
│   │      на кухне в 3 часа ночи"             │       │     --accent-rose (цвет любви)
│   │                                          │       │
│   │     Добавила Алиса · 3 дня назад    ▶ →  │       │  ← Meta: Alegreya Sans, muted
│   │                                          │       │     ▶ → ссылка на Spotify/YouTube
│   └──────────────────────────────────────────┘       │
│                                                      │
│   ┌──────────────────────────────────────────┐       │
│   │                                          │       │
│   │  ♫  Perfect                              │       │
│   │     Ed Sheeran                           │       │
│   │                                          │       │
│   │     "Наша первая песня 💕"               │       │
│   │                                          │       │
│   │     Добавил Борис · 2 недели назад  ▶ →  │       │
│   │                                          │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Детали:**
- Карточки: `--surface-primary`, `--radius-lg`
- Иконка "♫": `--accent-gold`, 24px
- Название: Crimson Pro 500
- Артист: Crimson Pro 400, `--text-muted-dark`
- Комментарий: Caveat 500, italic, `--accent-rose` — выделяется как личная история
- Кавычки вокруг комментария — крупные декоративные, `--accent-rose`, opacity 0.3
- Ссылка "▶ →": `--accent-gold`, hover → `--accent-gold-light`
- Мета-информация: Alegreya Sans 400, `--text-muted-dark`
- Карточки разделены gap 12px
- Hover: lift + shadow

### 5. Настройки

Чистая, функциональная страница.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Настройки                                          │
│                                                      │
│   ┌──── Профиль ─────────────────────────────┐       │
│   │                                          │       │
│   │  Аватарка: [🙂] [Изменить]               │       │
│   │                                          │       │
│   │  Имя:     ┌────────────────────┐         │       │Вариант 2: Установите xdotool для X11 fallback

│   │           │ Аида                │         │       │
│   │           └────────────────────┘         │       │
│   │                                          │       │
│   │                         [Сохранить]      │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
│   ┌──── Отношения ───────────────────────────┐       │
│   │                                          │       │
│   │  Дата начала:  ┌────────────────────┐    │       │
│   │                │ 14 февраля 2023    │    │       │
│   │                └────────────────────┘    │       │
│   │                                          │       │
│   │                         [Сохранить]      │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
│   ┌──── Пригласить партнёра ─────────────────┐       │
│   │                                          │       │
│   │  Статус: Партнёр подключён ✓             │       │
│   │                                          │       │
│   │  или                                     │       │
│   │                                          │       │
│   │  [Создать ссылку-приглашение]             │       │  ← Primary button
│   │                                          │       │
│   │  https://our.space/invite/abc123         │       │  ← Моно, copyable
│   │  Ссылка одноразовая                      │       │
│   │                                          │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
│   ┌──── Настроения ──────────────────────────┐       │
│   │                                          │       │
│   │  Предустановленные:                      │       │
│   │  [😊 Счастлив] [🥰 Влюблён] [😢 Скучаю] │       │  ← Chips, deletable
│   │  [😴 Спокоен] [🤩 Восторг] [💬 Поговорим]│       │
│   │                                          │       │
│   │  [+ Добавить настроение]                 │       │
│   │                                          │       │
│   └──────────────────────────────────────────┘       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Детали:**
- Секции: `--surface-primary` карточки с `--radius-lg`
- Заголовки секций: Cormorant 600, 20px, `--text-dark`
- Поля ввода: `--surface-secondary`, border `--border-light`
- Chips настроений: `--surface-secondary`, border `--border-light`, `--radius-md`
- Chip hover: border `--accent-gold`
- Chip delete: маленький "×", `--text-muted-dark`, hover `--accent-rose`

### 6. Логин

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              ╔══════════════════════╗                 │
│              ║                      ║                 │
│              ║    Our Space         ║                 │  ← Cormorant 700, 40px, --text-cream
│              ║    ─── ♡ ───         ║                 │  ← Декоративная линия с сердцем
│              ║                      ║                 │     --accent-gold, opacity 0.6
│              ║  ┌────────────────┐  ║                 │
│              ║  │ Email          │  ║                 │
│              ║  └────────────────┘  ║                 │
│              ║                      ║                 │
│              ║  ┌────────────────┐  ║                 │
│              ║  │ Пароль         │  ║                 │
│              ║  └────────────────┘  ║                 │
│              ║                      ║                 │
│              ║  [     Войти      ]  ║                 │  ← Primary button, full width
│              ║                      ║                 │
│              ╚══════════════════════╝                 │
│                                                      │
│              Фон: --bg-deep                          │
│              Карточка: --bg-secondary, candle-glow    │
│              Инпуты: --bg-elevated                    │
│              Всё по центру экрана                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Детали:**
- Страница логина полностью тёмная (без светлых поверхностей)
- Карточка формы: `--bg-secondary`, `--radius-xl`, мягкий `candle-glow`
- Инпуты на тёмном фоне: `--bg-elevated`, border `--border-dark`
- Текст в инпутах: `--text-cream`
- Placeholder: `--text-muted-light`
- Focus: border `--accent-gold`
- Логотип "Our Space" — Cormorant 700, `--text-cream`
- Декоративная линия-разделитель с маленьким сердцем по центру — `--accent-gold`, opacity 0.6
- Кнопка "Войти" — gold, полная ширина
- Ошибка: текст `--accent-rose`, появляется с fade-in
- Subtle ambient animation: мягкое мерцание candle-glow (3s infinite, opacity колеблется)

### 7. Регистрация по инвайту

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              ╔══════════════════════╗                 │
│              ║                      ║                 │
│              ║    Our Space         ║                 │
│              ║    ─── ♡ ───         ║                 │
│              ║                      ║                 │
│              ║  Сабыржан приглашает    ║                 │  ← Crimson Pro 400, --text-cream
│              ║  тебя в совместное   ║                 │
│              ║  пространство        ║                 │
│              ║                      ║                 │
│              ║  ┌────────────────┐  ║                 │
│              ║  │ Твоё имя       │  ║                 │
│              ║  └────────────────┘  ║                 │
│              ║  ┌────────────────┐  ║                 │
│              ║  │ Email          │  ║                 │
│              ║  └────────────────┘  ║                 │
│              ║  ┌────────────────┐  ║                 │
│              ║  │ Пароль         │  ║                 │
│              ║  └────────────────┘  ║                 │
│              ║                      ║                 │
│              ║  [ Присоединиться ]  ║                 │
│              ║                      ║                 │
│              ╚══════════════════════╝                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Анимации и Motion Language

### Принципы

- Все анимации — **плавные и нежные**, никогда резкие
- Основной easing: `cubic-bezier(0.25, 0.1, 0.25, 1.0)` — smooth
- Для "живых" элементов (emoji, glow): `cubic-bezier(0.34, 1.56, 0.64, 1.0)` — мягкий bounce
- Длительности: fast (150ms), normal (250ms), slow (400ms), dramatic (600ms)

### Загрузка страницы (Staggered Reveal)

При загрузке любой страницы — элементы появляются каскадом:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-1 { animation: fadeInUp 500ms var(--ease-smooth) 0ms both; }
.stagger-2 { animation: fadeInUp 500ms var(--ease-smooth) 80ms both; }
.stagger-3 { animation: fadeInUp 500ms var(--ease-smooth) 160ms both; }
.stagger-4 { animation: fadeInUp 500ms var(--ease-smooth) 240ms both; }
.stagger-5 { animation: fadeInUp 500ms var(--ease-smooth) 320ms both; }
```

### Счётчик отношений (Count Up)

Числа в счётчике анимируются при загрузке — считают вверх до текущего значения за 800ms.

```
0 → 2 года     (800ms, ease-out)
0 → 3 месяца   (800ms, ease-out, delay 100ms)
0 → 15 дней    (800ms, ease-out, delay 200ms)
```

### Candle Glow (мерцание свечи)

```css
@keyframes candleFlicker {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.85; }
}

.candle-glow {
  animation: candleFlicker 3s ease-in-out infinite;
}
```

### Hover карточки

```css
.card {
  transition: transform 300ms var(--ease-smooth),
              box-shadow 300ms var(--ease-smooth);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-soft);
}
```

### Выбор настроения

```css
@keyframes moodSelect {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.3); }
  100% { transform: scale(1.1); }
}

.mood-emoji:active {
  animation: moodSelect 400ms var(--ease-bounce);
}
```

### Появление записки (Unfold)

```css
@keyframes noteUnfold {
  from {
    opacity: 0;
    transform: scaleY(0.8) translateY(10px);
    transform-origin: top center;
  }
  to {
    opacity: 1;
    transform: scaleY(1) translateY(0);
    transform-origin: top center;
  }
}
```

### Scroll-triggered появление (таймлайн)

Карточки таймлайна появляются при попадании во viewport:

```css
.timeline-card {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms var(--ease-smooth),
              transform 500ms var(--ease-smooth);
}

.timeline-card.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Использовать `IntersectionObserver` для trigger'а класса `.visible`.

### Пульс непрочитанных

```css
@keyframes unreadPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--accent-gold-glow); }
  50%      { box-shadow: 0 0 0 6px transparent; }
}

.badge-unread {
  animation: unreadPulse 2s ease-in-out infinite;
}
```

---

## Адаптивность (Responsive)

### Breakpoints

```css
--bp-mobile:  480px;   /* до 480px — мобильный */
--bp-tablet:  768px;   /* 481-768px — планшет */
--bp-desktop: 1024px;  /* 769-1024px — малый десктоп */
--bp-wide:    1280px;  /* 1025px+ — широкий десктоп */
```

### Layout по breakpoints

| Breakpoint | Навигация | Контент | Таймлайн |
|-----------|-----------|---------|----------|
| Mobile (<480) | Нижние табы, 64px | 1 колонка, padding 16px | Вертикальный |
| Tablet (481-768) | Нижние табы, 64px | 1 колонка, padding 24px, max-w 640px | Вертикальный |
| Desktop (769-1024) | Сайдбар 200px | padding 32px, max-w 800px | Горизонтальный |
| Wide (1025+) | Сайдбар 240px | padding 48px, max-w 960px | Горизонтальный |

### Dashboard responsive

- **Wide**: 2 колонки для карточек (записки + фото в ряд)
- **Desktop**: 2 колонки для карточек
- **Tablet**: 1 колонка, карточки стеком
- **Mobile**: 1 колонка, компактный счётчик (меньше font-size), карточки стеком

### Фото-карточки responsive

- **Wide**: 3 фото в ряд (превью на дашборде)
- **Desktop**: 3 фото
- **Tablet**: 2 фото
- **Mobile**: 1 фото + стрелки навигации

---

## Специальные элементы

### Логотип "Our Space"

Текстовый логотип (без графики):

```
Our Space
─── ♡ ───
```

- Шрифт: Cormorant Garamond 700
- Размер: 28px (навигация), 40px (логин), 20px (мобильная шапка)
- Цвет: `--text-cream`
- Декоративная линия с сердцем: `--accent-gold`, opacity 0.6
- Сердце (♡): `--accent-rose`

### Пустые состояния (Empty States)

Когда нет контента — мягкое, вдохновляющее сообщение:

```
┌──────────────────────────────┐
│                              │
│       📷                     │
│                              │
│   Пока нет моментов          │  ← Cormorant 500, 24px, --text-muted-light
│                              │
│   Загрузите первое фото,     │  ← Crimson Pro 400, 16px, --text-muted-light
│   чтобы начать вашу          │
│   историю                    │
│                              │
│   [+ Добавить момент]        │  ← Primary button
│                              │
└──────────────────────────────┘
```

### Состояние загрузки (Loading)

Скелетон с мягкой анимацией пульса:

```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--border-dark) 50%,
    var(--bg-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}
```

---

## Итоговые характеристики стиля

| Аспект | Решение |
|--------|---------|
| Тема | Тёмная оболочка + кремовые карточки ("Candlelight & Parchment") |
| Основной фон | Тёплый тёмный (`#1E1916`) |
| Карточки | Тёплый крем (`#FAF5EF`) |
| Главный акцент | Золото (`#C8943F`) — интерактивные элементы, подсветка |
| Вторичный акцент | Пыльная роза (`#B66B68`) — любовь, эмоции |
| Display шрифт | Cormorant Garamond — элегантный, романтичный |
| Body шрифт | Crimson Pro — тёплый, читаемый |
| Handwritten | Caveat — личные подписи, даты |
| UI шрифт | Alegreya Sans — навигация, кнопки |
| Радиусы | Крупные (12-28px) — мягкие, дружелюбные |
| Анимации | Плавные, нежные, staggered загрузка |
| Текстуры | Film grain (тёмный фон), бумага (карточки) |
| Иконки | Lucide, stroke 1.5px |
| Навигация | Сайдбар (desktop) / нижние табы (mobile) |
