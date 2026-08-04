# Story 1.2 Testing Guide - WebSocket Connection Infrastructure

## Test This Story With Your Phones!

Story 1.2 adds real-time WebSocket communication. Follow these steps to verify it works correctly.

---

## Prerequisites
- Both servers running (see below)
- Two phones on same WiFi as your computer
- Your local IP address (from `ipconfig`)

---

## Start the Servers

**Option 1: Development Mode (Recommended for Testing)**
```powershell
# Terminal 1 - Backend
cd C:\Projects\drinkingGame\server
npm run dev

# Terminal 2 - Frontend
cd C:\Projects\drinkingGame\client
npm run dev
```

**Option 2: Docker**
```bash
cd C:\Projects\drinkingGame
docker-compose up
```

---

## Test Checklist

### ✓ Test 1: Local Connection (Laptop)

1. Open `http://localhost:3000` in your browser
2. **Expected Results:**
   - Green "Connected" indicator at top
   - "Test Ping/Pong" button visible (in dev mode)
   - Socket ID displayed (in dev mode)
   - Server console shows: `✓ Client connected: [socket-id]`

**Status:** [ ] PASS [ ] FAIL

---

### ✓ Test 2: Ping/Pong Test (Laptop)

1. Click "Test Ping/Pong" button
2. **Expected Results:**
   - Toast notification: "Ping successful! Latency: Xms"
   - Latency badge appears next to connection status
   - Latency should be <50ms on localhost
   - Server console shows: `⟳ Ping received from [socket-id]`

**Status:** [ ] PASS [ ] FAIL  
**Latency:** ______ ms

---

### ✓ Test 3: Phone 1 Connection

1. On Phone 1, open `http://YOUR-IP:3000` (replace YOUR-IP)
2. **Expected Results:**
   - Green "Connected" indicator
   - "Test Ping/Pong" button clickable
   - Server console shows 2 connections
   - Laptop page shows "Connected Clients: 2"

**Status:** [ ] PASS [ ] FAIL

---

### ✓ Test 4: Phone 1 Ping Test

1. On Phone 1, tap "Test Ping/Pong"
2. **Expected Results:**
   - Toast notification appears
   - Latency displayed (should be <100ms on local WiFi)
   - Server logs ping event

**Status:** [ ] PASS [ ] FAIL  
**Latency:** ______ ms

---

### ✓ Test 5: Phone 2 Connection

1. On Phone 2, open `http://YOUR-IP:3000`
2. **Expected Results:**
   - Green "Connected" indicator
   - Server console shows 3 connections
   - All devices show "Connected Clients: 3"

**Status:** [ ] PASS [ ] FAIL

---

### ✓ Test 6: Display Route Connection Status

1. Laptop: Open `http://localhost:3000/display`
2. **Expected Results:**
   - Connection status bar at top
   - Green indicator showing "Connected"
   - "Connected Clients: X" shown (should match server count)

**Status:** [ ] PASS [ ] FAIL

---

### ✓ Test 7: Controller Route Connection Status

1. Phone 1: Navigate to `http://YOUR-IP:3000/controller`
2. **Expected Results:**
   - Small connection indicator at top
   - Shows "Connected" in green
   - "Ready!" button is enabled (not grayed out)
   - Socket ID shown at bottom (in dev mode)

**Status:** [ ] PASS [ ] FAIL

---

### ✓ Test 8: Disconnect/Reconnect Test

1. On Phone 1, close the browser tab
2. **Expected Results:**
   - Server console: `✗ Client disconnected: [socket-id]`
   - Other devices: "Connected Clients" decreases by 1

3. On Phone 1, reopen `http://YOUR-IP:3000`
4. **Expected Results:**
   - Automatically reconnects
   - Green "Connected" indicator
   - Server console: `✓ Client connected: [new-socket-id]`
   - Client count increases again

**Status:** [ ] PASS [ ] FAIL

---

### ✓ Test 9: Connection Logs (Server)

Check server console for these logs:

**When client connects:**
```
✓ Client connected: [socket-id]
  Total clients: X
  Transport: websocket
```

**When client pings:**
```
⟳ Ping received from [socket-id]
```

**When client disconnects:**
```
✗ Client disconnected: [socket-id]
  Reason: [reason]
  Total clients: X
```

**Status:** [ ] PASS [ ] FAIL

---

### ✓ Test 10: Connection Logs (Client Browser Console)

Open browser console (F12) and check for these logs:

**On connect:**
```
✓ WebSocket connected: [socket-id]
  URL: http://[hostname]:3001
```

**On disconnect:**
```
✗ WebSocket disconnected: [reason]
```

**Status:** [ ] PASS [ ] FAIL

---

## Acceptance Criteria Verification

Review each criterion from stories.md:

- [ ] **AC1:** Socket.io installed and configured on server ✓
- [ ] **AC2:** Socket.io-client installed and configured on frontend ✓
- [ ] **AC3:** Client successfully connects to server via WebSocket
  - Test: Tests 1, 3, 5 pass
- [ ] **AC4:** Connection uses local IP when accessed from phones
  - Test: Phone browsers connect to `http://YOUR-IP:3000`
  - Check browser Network tab: WebSocket URL should be `ws://YOUR-IP:3001`
- [ ] **AC5:** Connection/disconnection events logged
  - Test: Tests 9 and 10 pass
- [ ] **AC6:** Basic ping/pong test working
  - Test: Tests 2 and 4 pass

---

## Troubleshooting

### Problem: "Disconnected" status on laptop

**Check:**
1. Is backend running? (`npm run dev` in `/server`)
2. Check port 3001: `netstat -an | findstr "3001"`
3. Check browser console for errors

---

### Problem: "Disconnected" status on phone

**Check:**
1. Phone on same WiFi network?
2. Firewall allows ports 3000 and 3001?
3. Using correct IP address?
4. Try opening `http://YOUR-IP:3001/health` on phone - should show JSON

---

### Problem: Ping test fails

**Check:**
1. Connection status is "Connected"?
2. Check browser console for errors
3. Check server logs for ping events
4. Try refreshing the page

---

### Problem: Client count doesn't update

**Check:**
1. All devices on same backend server?
2. Refresh all browser windows
3. Check server console - is it broadcasting `connectionStatus` events?

---

## Performance Benchmarks

**Expected Latencies:**
- Localhost: < 10ms
- Same WiFi (Phone): < 100ms
- If latency > 200ms, check WiFi signal strength

---

## Story 1.2 Complete! ✓

If all tests pass, Story 1.2 is complete!

**What Was Built:**
- TypeScript socket types (client & server)
- Socket.io client with auto-detection of URL
- Reconnection logic (5 attempts, exponential backoff)
- React hook for socket state management
- Connection status indicators on all routes
- Ping/pong latency testing
- Toast notifications (react-hot-toast)
- Development logging (dev mode only)
- Client count tracking and broadcasting

**Files Created/Modified:**
- `server/src/types/socket.ts` (new)
- `client/src/types/socket.ts` (new)
- `client/src/lib/socket.ts` (new)
- `client/src/hooks/useSocket.ts` (new)
- `client/src/vite-env.d.ts` (new)
- `client/.env` (new)
- `client/.env.example` (new)
- `server/src/server.ts` (enhanced)
- `client/src/routes/Home.tsx` (enhanced)
- `client/src/routes/Display.tsx` (enhanced)
- `client/src/routes/Controller.tsx` (enhanced)

**Next Story:**
- Story 1.3: Two-Route System enhancements (partially complete)
- Story 1.4: Lobby Creation & Room Code Generation
