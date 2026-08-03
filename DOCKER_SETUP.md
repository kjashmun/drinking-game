# Docker Setup Guide - Local Testing with Multiple Phones

This guide explains how to set up Docker for local development and test the drinking game app with multiple phones on your WiFi network.

---

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Two phones with internet access
- All devices (computer + phones) on the same WiFi network
- Basic understanding of command line

---

## Quick Start

### 1. Find Your Local IP Address

**On Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.1.100`)

**On Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Linux:**
```bash
hostname -I
```

**Save this IP address** - you'll use it to access the app from your phones.

---

### 2. Start the Docker Container

From the project root:
```bash
docker-compose up
```

Wait for the output:
```
✓ Server running on http://0.0.0.0:3001
✓ Frontend running on http://0.0.0.0:3000
```

---

### 3. Access from Your Devices

**Laptop (TV Simulator):**
- Open browser to `http://localhost:3000/display?room=XXXX` (replace XXXX with room code)

**Phone 1 (Host):**
- Open browser to `http://192.168.1.100:3000` (use YOUR local IP)
- Create a lobby

**Phone 2 (Player):**
- Open browser to `http://192.168.1.100:3000` (use YOUR local IP)
- Join the lobby with the room code

---

## Detailed Setup

### Docker Configuration Files

The project uses a single container with both frontend and backend.

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"  # Frontend
      - "3001:3001"  # Backend WebSocket server
    environment:
      - NODE_ENV=development
      - HOST=0.0.0.0
      - PORT=3001
      - FRONTEND_PORT=3000
    volumes:
      - ./client:/app/client
      - ./server:/app/server
      - /app/client/node_modules
      - /app/server/node_modules
    networks:
      - party-game-network
    command: npm run dev

networks:
  party-game-network:
    driver: bridge
```

**File: `Dockerfile`**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000 3001

# Default command (overridden by docker-compose)
CMD ["npm", "run", "dev"]
```

**File: `package.json` (root)**
```json
{
  "name": "drinking-game-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

---

## Windows Firewall Configuration

Docker may be blocked by Windows Firewall. If phones can't connect:

### Option 1: Allow Docker in Firewall (Recommended)
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change settings"
4. Find "Docker Desktop" and check both Private and Public
5. Click OK

### Option 2: Create Inbound Rules for Ports
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter "3000, 3001" → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name it "Drinking Game App" → Finish

---

## Testing Workflow

### Initial Connection Test

**Step 1: Verify Docker is Running**
```bash
docker ps
```
You should see the `drinkingGame-app-1` container running.

**Step 2: Test Localhost Access**
Open `http://localhost:3000` in your computer's browser. You should see the app home page.

**Step 3: Test Local IP Access**
Open `http://192.168.1.100:3000` (your local IP) in your computer's browser. Should work the same.

**Step 4: Test Phone Access**
On your phone's browser, navigate to `http://192.168.1.100:3000`. If this doesn't work:
- Verify phone is on the same WiFi
- Check firewall settings
- Try restarting Docker Desktop

---

### Full Game Test Scenario

**Setup:**
1. Laptop: Open `http://localhost:3000/display?room=TEST` in fullscreen mode
2. Phone 1 (Host): Open `http://192.168.1.100:3000`, create lobby with code "TEST"
3. Phone 2 (Player): Open `http://192.168.1.100:3000`, join lobby with code "TEST"

**Test Flow:**
1. Verify both players appear on laptop display
2. Host selects games on Phone 1
3. Host starts first round
4. Play through game on both phones
5. Verify results appear on display
6. Check scoreboard updates
7. Host starts next round

---

## Troubleshooting

### Problem: Phones Can't Access the App

**Possible Causes:**
1. **Not on same WiFi**: Verify all devices on the same network
2. **Firewall blocking**: Follow firewall configuration above
3. **Wrong IP**: Double-check your local IP with `ipconfig`
4. **Docker not exposing ports**: Check `docker ps` shows ports `0.0.0.0:3000->3000` and `0.0.0.0:3001->3001`

**Debug Steps:**
```bash
# Check if ports are listening
netstat -an | findstr "3000"
netstat -an | findstr "3001"

# Should show:
# TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
# TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING
```

---

### Problem: WebSocket Connection Failing

**Symptoms:**
- Players can load the page but don't sync
- Console shows WebSocket errors

**Solution:**
Check that frontend is using the correct WebSocket URL:

**File: `client/src/lib/socket.js`**
```javascript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  `http://${window.location.hostname}:3001`;

export const socket = io(SOCKET_URL);
```

This ensures phones use `http://192.168.1.100:3001` instead of `http://localhost:3001`.

---

### Problem: Hot Reload Not Working

**Cause:** Volumes not mounted correctly in Docker

**Solution:** Rebuild container:
```bash
docker-compose down
docker-compose up --build
```

---

### Problem: "Cannot connect to the Docker daemon"

**Cause:** Docker Desktop not running

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon should be steady, not animated)
3. Retry `docker-compose up`

---

## Alternative: Without Docker (Direct Node)

If Docker is causing issues, you can run the app directly:

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

Then access the same way:
- Laptop: `http://localhost:5173` (Vite default port)
- Phones: `http://192.168.1.100:5173`

---

## Network Requirements

### WiFi Network Compatibility

**Works:**
- Home WiFi networks
- Personal hotspot from phone
- Most office networks

**May NOT Work:**
- Guest WiFi networks (often isolate devices)
- Corporate networks with strict firewalls
- Public WiFi (Starbucks, airports, etc.) - devices may be isolated

**Test Your Network:**
```bash
# From your computer, ping your phone's IP
ping <phone-ip-address>

# If ping succeeds, your network allows device-to-device communication
```

---

## Using ngrok as Fallback

If local network testing is problematic, use ngrok:

**Setup:**
1. Install ngrok: https://ngrok.com/download
2. Run your app: `docker-compose up`
3. In another terminal: `ngrok http 3000`
4. ngrok gives you a public URL like `https://abc123.ngrok.io`
5. Access from any device using that URL

**Pros:**
- Works from any network
- Phones don't need to be on same WiFi
- Can share with remote testers

**Cons:**
- Requires internet connection
- Slightly higher latency
- Free tier has connection limits

---

## Production Considerations (Future)

For deploying to production:

**Hosting Options:**
- **Vercel/Netlify**: Frontend static hosting
- **Render/Railway/Fly.io**: Backend WebSocket server
- **AWS/Google Cloud**: Full control, more complex

**Requirements:**
- HTTPS for Chromecast support
- Persistent WebSocket connections
- Consider Redis for multi-instance lobby state (if scaling)

**Environment Variables:**
```bash
VITE_SOCKET_URL=https://api.yourdomain.com
NODE_ENV=production
```

---

## Docker Commands Reference

```bash
# Start containers
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild containers (after Dockerfile changes)
docker-compose up --build

# View logs
docker-compose logs -f

# View running containers
docker ps

# Shell into container (for debugging)
docker exec -it drinkingGame-app-1 sh

# Remove all containers and volumes (clean slate)
docker-compose down -v
```

---

## Next Steps

After Docker setup is working:
1. Complete Story 1.1 (Project Setup)
2. Test WebSocket connection (Story 1.2)
3. Build two-route system (Story 1.3)
4. Create lobby system (Story 1.4-1.6)

See `stories.md` for detailed implementation stories.
