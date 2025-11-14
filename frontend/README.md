# Frontend - YouTube Live Stream Tracker

This is the frontend application for the YouTube GTA-RP Live Stream Tracker.

## Quick Start

1. Make sure the backend is running (see main README.md)
2. Open `index.html` in a browser, or use a local server:
   ```bash
   python3 -m http.server 8000
   # Then open http://localhost:8000
   ```
3. Update `script.js` if your backend is on a different URL

## Features

- Real-time stream updates (auto-refresh every 10 seconds)
- Search and filter streams
- Sort by viewers, time, or channel
- Responsive design
- Click to open streams in YouTube

## Customization

Edit `script.js` to customize:
- `API_URL`: Backend API endpoint
- `REFRESH_INTERVAL`: Auto-refresh frequency

Edit `styles.css` to customize the appearance.



