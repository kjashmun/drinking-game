# Testing Guide - Story 1.1

## Prerequisites Checklist
- [ ] Docker Desktop installed and running
- [ ] Two phones available
- [ ] All devices on same WiFi network
- [ ] Windows Firewall configured (see below)

## Step 1: Find Your Local IP Address

**On Windows:**
```powershell
ipconfig
```

Look for "IPv4 Address" under your WiFi adapter. Example: `192.168.1.100`

**Save this IP - you'll use it throughout testing!**

## Step 2: Configure Windows Firewall

### Quick Method (Recommended):
1. Open **Windows Defender Firewall**
2. Click **"Allow an app or feature through Windows Defender Firewall"**
3. Click **"Change settings"**
4. Find **"Docker Desktop"** and check both **Private** and **Public**
5. Click **OK**

### Alternative Method (Manual Port Rules):
1. Open **Windows Defender Firewall** → **Advanced Settings**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → Next
4. Select **TCP** and enter `3000,3001` → Next
5. Select **Allow the connection** → Next
6. Check all profiles → Next
7. Name it "Drinking Game App" → Finish

## Step 3: Start the Application

### Option A: Using Docker (Recommended)
```bash
cd C:\Projects\drinkingGame
docker-compose up
```

Wait for these messages:
```
✓ Server running on http://0.0.0.0:3001
✓ Frontend running on http://0.0.0.0:3000
```

### Option B: Without Docker (Development)
**Terminal 1 - Backend:**
```powershell
cd C:\Projects\drinkingGame\server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Projects\drinkingGame\client
npm run dev
```

## Step 4: Test Access

### Test 1: Local Access (Your Computer)
Open browser to: `http://localhost:3000`

**Expected Result:** Home page with "🍻 Party Games" header

### Test 2: Display Route
Open browser to: `http://localhost:3000/display`

**Expected Result:** TV-optimized display with large "Room Code: DEMO"

### Test 3: Controller Route
Open browser to: `http://localhost:3000/controller`

**Expected Result:** Phone-optimized controller with player info

### Test 4: Phone 1 Access
On Phone 1, open browser to: `http://YOUR-IP:3000`
(Replace YOUR-IP with the IP from Step 1, e.g., `http://192.168.1.100:3000`)

**Expected Result:** Same home page as on computer

### Test 5: Phone 2 Access
On Phone 2, open browser to: `http://YOUR-IP:3000`

**Expected Result:** Same home page

### Test 6: Multiple Devices Simultaneously
- **Laptop:** Open `http://localhost:3000/display`
- **Phone 1:** Open `http://YOUR-IP:3000/controller`
- **Phone 2:** Open `http://YOUR-IP:3000/controller`

**Expected Result:** All three screens load without errors

## Step 5: Verify Backend Health

Open browser to: `http://localhost:3001/health`

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-08-03T..."
}
```

## Troubleshooting

### Problem: Phones can't access the app

**Check 1: Same WiFi Network**
Verify all devices are on the same WiFi network (not guest network).

**Check 2: Correct IP Address**
Re-run `ipconfig` and verify you're using the correct IPv4 address.

**Check 3: Firewall**
Make sure Windows Firewall is configured (see Step 2).

**Check 4: Docker Ports**
Run this command:
```powershell
netstat -an | findstr "3000"
netstat -an | findstr "3001"
```

Should show:
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING
```

**Check 5: Docker Container Running**
```bash
docker ps
```

Should show `drinking-game-app` with status "Up".

### Problem: Port already in use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
Find and kill the process:
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with the actual number)
taskkill /PID <PID> /F
```

### Problem: Docker build fails

**Solution:**
Clean rebuild:
```bash
docker-compose down
docker-compose up --build
```

### Problem: Hot reload not working

**Solution:**
This is normal in Docker. Changes require restart:
```bash
# Press Ctrl+C to stop
docker-compose up
```

## Acceptance Criteria Verification

Check off each criterion:

- [ ] **AC1:** React + Vite frontend scaffolded in `/client`
- [ ] **AC2:** Node.js + Express backend scaffolded in `/server`
- [ ] **AC3:** Docker and docker-compose files created
- [ ] **AC4:** Single container runs both frontend and backend
- [ ] **AC5:** App accessible from phones via local IP
- [ ] **AC6:** README includes local IP instructions
- [ ] **AC7:** Ports 3000 and 3001 exposed and accessible

## Story 1.1 Complete! ✓

If all acceptance criteria pass, Story 1.1 is complete.

**Next Steps:**
- Story 1.2: WebSocket connection infrastructure
- Story 1.3: Two-route system (already partially complete!)

## Docker Commands Reference

```bash
# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Shell into container
docker exec -it drinking-game-app sh

# Clean everything
docker-compose down -v
```

## Port Reference

| Port | Service | Access |
|------|---------|--------|
| 3000 | Frontend (Vite) | `http://localhost:3000` or `http://YOUR-IP:3000` |
| 3001 | Backend (Express + Socket.io) | `http://localhost:3001` or `http://YOUR-IP:3001` |

## Security Notes

This Docker setup includes security best practices:
- ✓ Non-root user (nodejs:nodejs, UID 1001)
- ✓ Read-only filesystem where possible
- ✓ Dropped unnecessary capabilities
- ✓ No new privileges
- ✓ Health checks enabled
- ✓ Specific Node.js version pinned
- ✓ .dockerignore to prevent sensitive file leaks
