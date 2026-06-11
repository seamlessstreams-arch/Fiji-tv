# Fiji TV

A lightweight, browser-based TV streaming guide for Fijian channels. No build step required — just open `index.html`.

## Features

- **Live channel grid** — 12 channels across General, News, Sports, Movies, Kids, Music, and Documentaries categories
- **Category filter** — one-click filtering by genre
- **Search** — real-time channel/programme search with debouncing
- **TV Guide (EPG)** — today's schedule table with "Now Playing" highlight
- **Live clock** — updates every second in the header and hero bar
- **Responsive design** — works on desktop, tablet, and mobile

## Getting Started

```bash
# Clone the repository
git clone https://github.com/seamlessstreams-arch/Fiji-tv.git
cd Fiji-tv

# Open in your browser
open index.html        # macOS
xdg-open index.html   # Linux
start index.html       # Windows
```

No dependencies, no build tools — it's plain HTML, CSS, and JavaScript.

## Project Structure

```
Fiji-tv/
├── index.html   # Main page (layout & markup)
├── style.css    # All styles (dark theme, responsive)
└── app.js       # Channel data, EPG, filtering & search logic
```

## Customisation

- **Add channels** — edit the `channels` array in `app.js`
- **Update the schedule** — edit the `epgSchedule` array in `app.js`
- **Change colours** — adjust the CSS custom properties in `:root` inside `style.css`
