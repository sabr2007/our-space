# Gemini SVG Prompts для Our Space

Все SVG должны быть в стиле "Noir Rose" — тёмный романтичный film noir с приглушёнными розовыми акцентами.

---

## 1. Счётчик дней — Animated Particles

**Описание:** SVG анимация где число "547" собирается из маленьких розовых частиц/точек. Частицы плавно движутся и формируют цифры.

**Prompt для Gemini 3.1:**

```
Create an animated SVG for a romantic website "days counter". The number "547" should be formed by small particles/dots that float and gradually assemble into the digits.

Style requirements:
- Color palette: muted rose/pink (#e85d75, #ff6b88) on very dark warm background (#0f0a0d)
- Particles should be small circles (2-4px radius)
- Animation should be smooth, elegant, and loop seamlessly
- Use CSS animations or SMIL animations
- The assembled number should be large (around 200-300px height)
- Particles start scattered randomly and smoothly move into position
- Add subtle glow effect on particles (use filter: blur)
- Font style: elegant serif-like when particles form the number
- Animation duration: 3-4 seconds
- After forming, particles should gently pulse/breathe

Make it feel romantic, mysterious, and premium. Output a complete SVG file with inline animations.
```

**Размер:** ~800x400px  
**Формат:** SVG с CSS animations или SMIL  
**Сохранить как:** `public/svg/counter-particles.svg`

---

## 2. Timeline Thread — Organic Flowing Line

**Описание:** Органическая волнистая линия которая соединяет события на таймлайне. Должна "рисоваться" при скролле (через GSAP), но сам SVG path нужен.

**Prompt для Gemini 3.1:**

```
Create an SVG path for a timeline thread/line on a romantic couple website. This line connects timeline events horizontally.

Style requirements:
- The line should be organic and flowing (not perfectly straight), like a hand-drawn thread
- Color: muted rose (#e85d75)
- Width: 2-3px stroke
- Add subtle glow effect (use SVG filter with feGaussianBlur)
- Length: approximately 2000-3000px horizontal
- The path should have gentle waves/curves, not sharp angles
- Add small decorative nodes/dots at regular intervals (every ~400px) where events would connect
- Each node should be a small circle (8-10px) with subtle glow
- The overall feel should be romantic, elegant, hand-crafted

Output the SVG with:
1. Main path element (with id="thread-path" for GSAP animation)
2. Node circles along the path
3. Glow filter definition
4. ViewBox sized appropriately

The path will be animated with GSAP DrawSVG plugin, so it should be a single continuous path.
```

**Размер:** ~3000x100px  
**Формат:** SVG path  
**Сохранить как:** `public/svg/timeline-thread.svg`

---

## 3. Decorative Elements — Between Events

**Описание:** Маленькие декоративные SVG элементы которые размещаются между событиями на таймлайне. Романтичные, минималистичные.

**Prompt для Gemini 3.1:**

```
Create 5 different small decorative SVG elements for a romantic dark-themed timeline. These will be placed between timeline events.

Theme: Noir Rose (dark romantic film noir with muted pink accents)
Colors: #e85d75 (rose), #ff6b88 (warm rose), #f5e8ec (light pink)

Create these 5 elements (each as separate SVG, 100x100px):

1. **Delicate rose** — minimalist line-art style rose, single bloom
2. **Shooting star** — small star with trailing line
3. **Heart constellation** — small dots/stars forming a subtle heart shape
4. **Infinity symbol** — elegant, thin line with subtle sparkles
5. **Two intertwined lines** — representing two lives coming together

Each element should:
- Be simple and elegant (line-art style)
- Use 1-2px stroke width
- Have subtle glow effect where appropriate
- Be monochrome or use the rose color palette
- Feel hand-drawn and organic, not geometric
- Include very subtle animation (like gentle floating or pulsing)

Output 5 separate SVG files with inline CSS animations.
```

**Размер:** 100x100px каждый  
**Формат:** 5 отдельных SVG файлов  
**Сохранить как:** 
- `public/svg/decor-rose.svg`
- `public/svg/decor-star.svg`
- `public/svg/decor-heart.svg`
- `public/svg/decor-infinity.svg`
- `public/svg/decor-lines.svg`

---

## 4. "Первый раз когда..." Line Art Icons

**Описание:** Маленькие line-art иллюстрации для каждого пункта в секции "Первый раз когда...". Минималистичные иконки.

**Prompt для Gemini 3.1:**

```
Create 6 minimalist line-art SVG icons for a romantic couple's "first times" section on a dark-themed website.

Theme: Noir Rose — dark romantic with rose accents (#e85d75)
Size: 80x80px each
Style: Clean line-art, 1.5-2px stroke, organic not geometric

Icons needed:
1. **Coffee cup** — for "first date at a cafe"
2. **Moon and stars** — for "first night together"
3. **Clasped hands** — for "first time holding hands"
4. **Heart with pulse line** — for "first time saying I love you"
5. **Open book** — for "first deep conversation"
6. **Airplane** — for "first trip together"

Each icon should:
- Be simple and recognizable
- Use stroke-only (no fills), except small accent details
- Have subtle glow effect on key elements (use SVG filter)
- Feel hand-drawn and warm, not corporate
- Use rose color (#e85d75) with slight variations
- Include very subtle animation (optional gentle rotation or pulse)

Output 6 separate SVG files.
```

**Размер:** 80x80px каждый  
**Формат:** 6 отдельных SVG  
**Сохранить как:**
- `public/svg/icon-coffee.svg`
- `public/svg/icon-moon.svg`
- `public/svg/icon-hands.svg`
- `public/svg/icon-heart-pulse.svg`
- `public/svg/icon-book.svg`
- `public/svg/icon-airplane.svg`

---

## 5. Background Ambient Elements (опционально)

**Описание:** Тонкие движущиеся линии/волны для фона. Очень subtle, почти невидимые.

**Prompt для Gemini 3.1:**

```
Create a subtle animated SVG background element for a dark romantic website.

Theme: Very dark warm background (#0f0a0d) with subtle rose accents
Purpose: Ambient movement in the background, barely noticeable

Create wavy flowing lines that:
- Are very thin (1px or less)
- Use very low opacity rose color (rgba(232, 93, 117, 0.1))
- Slowly drift/flow across the screen
- Create a subtle "living" feeling
- Don't distract from content
- Loop seamlessly

The SVG should be:
- Large enough to cover viewport (1920x1080px)
- Have 3-5 flowing lines at different angles
- Animate very slowly (20-30 second loop)
- Use subtle blur for softness

Output a single SVG with CSS animations.
```

**Размер:** 1920x1080px  
**Формат:** SVG с CSS animation  
**Сохранить как:** `public/svg/bg-ambient.svg`

---

## Workflow

1. Сабыржан копирует промпты в Gemini 3.1
2. Получает SVG файлы
3. Сохраняет в `public/svg/` в нужной структуре
4. Я интегрирую их в компоненты
5. Итеративно правим если нужны изменения

**Примечание:** Все SVG должны быть оптимизированы (remove unnecessary attributes, minimize file size), но сохранить читаемость для возможных правок.
