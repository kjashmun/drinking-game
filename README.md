# Drinking Game App

A party-style multiplayer web app for TV + phone gameplay with real-time synchronization.

## Quick Start

### Prerequisites
- Docker Desktop installed
- Two phones with browser access
- All devices on the same WiFi network

### Setup

1. **Find your local IP address:**
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.100`)

2. **Start the application:**
   ```bash
   docker-compose up
   ```

3. **Access from devices:**
   - **Laptop (TV Simulator):** `http://localhost:3000/display?room=XXXX`
   - **Phone 1 (Host):** `http://YOUR-LOCAL-IP:3000`
   - **Phone 2 (Player):** `http://YOUR-LOCAL-IP:3000`

   Replace `YOUR-LOCAL-IP` with your actual IP (e.g., `192.168.1.100`)

### Windows Firewall Configuration

If phones can't connect, allow Docker through Windows Firewall:

1. Open **Windows Defender Firewall**
2. Click **"Allow an app or feature through Windows Defender Firewall"**
3. Click **"Change settings"**
4. Find **"Docker Desktop"** and check both **Private** and **Public**
5. Click **OK**

Alternatively, create inbound rules for ports 3000 and 3001.

See `DOCKER_SETUP.md` for detailed troubleshooting.

## Development (Without Docker)

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Access at `http://localhost:3000` (frontend) and backend runs on `http://localhost:3001`

## Project Structure

```
drinkingGame/
├── client/          # React + TypeScript frontend
├── server/          # Node.js + TypeScript backend
├── idea.md          # Product concept and game ideas
├── stories.md       # User stories and development roadmap
└── DOCKER_SETUP.md  # Detailed Docker setup guide
```

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router
- TailwindCSS
- Socket.io Client

**Backend:**
- Node.js 18
- TypeScript
- Express
- Socket.io
- CORS

**DevOps:**
- Docker & Docker Compose
- Non-root user security practices

## Testing

See `stories.md` for detailed testing scenarios and acceptance criteria.

## Documentation

- `idea.md` - Product vision and game mode designs
- `stories.md` - User stories and implementation plan
- `DOCKER_SETUP.md` - Comprehensive Docker setup and troubleshooting

## License

MIT
