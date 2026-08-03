# User Stories - Drinking Game App

## Story Format
Each story follows this structure:
- **Story ID**: Unique identifier for tracking
- **Title**: Brief description
- **User Story**: As a [role], I want [feature] so that [benefit]
- **Acceptance Criteria**: Testable conditions that must be met
- **Technical Notes**: Implementation hints and considerations
- **Dependencies**: Stories that must be completed first

---

## Epic 1: Core Infrastructure & Local Testing Setup

### Story 1.1: Project Setup with Docker
**As a** developer  
**I want** a working project structure with Docker configuration  
**So that** I can develop and test locally with multiple devices

**Acceptance Criteria:**
- [ ] React + Vite frontend scaffolded in `/client` directory
- [ ] Node.js + Express backend scaffolded in `/server` directory
- [ ] Docker and docker-compose configuration files created
- [ ] Single container runs both frontend and backend
- [ ] App accessible from phones on same WiFi network via local IP
- [ ] README includes instructions for finding local IP and accessing from phones
- [ ] Ports 3000 (frontend) and 3001 (backend WebSocket) exposed

**Technical Notes:**
- Use `node:18-alpine` base image
- Frontend should proxy API/WebSocket requests to backend
- Include hot-reload support for development
- Document firewall configuration for Windows

**Dependencies:** None

---

### Story 1.2: WebSocket Connection Infrastructure
**As a** developer  
**I want** real-time communication between clients and server  
**So that** game state can sync instantly across all devices

**Acceptance Criteria:**
- [ ] Socket.io installed and configured on server
- [ ] Socket.io-client installed and configured on frontend
- [ ] Client successfully connects to server via WebSocket
- [ ] Connection uses local IP address (not localhost) when accessed from phones
- [ ] Connection/disconnection events logged on both client and server
- [ ] Basic ping/pong test working to verify real-time communication

**Technical Notes:**
- Server should use room-based channels for lobby isolation
- Include reconnection logic with exponential backoff
- Handle CORS properly for cross-origin WebSocket connections
- Log all WebSocket events during development

**Dependencies:** Story 1.1

---

### Story 1.3: Two-Route System (Display & Controller)
**As a** user  
**I want** separate views for TV display and phone controllers  
**So that** each device shows the appropriate interface

**Acceptance Criteria:**
- [ ] `/display` route exists with TV-optimized layout (large text, high contrast)
- [ ] `/controller` route exists with phone-optimized layout (touch-friendly buttons)
- [ ] React Router configured with these two routes
- [ ] Both routes accessible from different devices simultaneously
- [ ] Basic styling differentiates the two views clearly
- [ ] Routes accept query parameters for room code and player info

**Technical Notes:**
- Use React Router for client-side routing
- Display view should be landscape-optimized
- Controller view should be portrait-optimized
- Consider using different color schemes for easy visual distinction

**Dependencies:** Story 1.1

---

### Story 1.4: Lobby Creation & Room Code Generation
**As a** host  
**I want** to create a lobby with a unique room code  
**So that** players can join my game session

**Acceptance Criteria:**
- [ ] "Create Lobby" button on home page
- [ ] Backend generates unique 4-6 character room code
- [ ] Room code displayed prominently on host's screen
- [ ] Lobby stored in server memory with room code as key
- [ ] Lobby includes: room code, host info, player list, game state
- [ ] Host automatically joins their own lobby as first player
- [ ] Display route shows room code in large, readable format

**Technical Notes:**
- Use uppercase alphanumeric codes (avoid ambiguous characters like 0/O, 1/I)
- Store lobbies in a Map: `lobbies = new Map()`
- Include timestamp for automatic cleanup later
- Room code should be 4-6 characters for easy entry

**Dependencies:** Story 1.2, Story 1.3

---

### Story 1.5: Player Join Flow
**As a** player  
**I want** to join a lobby with a room code and player name  
**So that** I can participate in the game

**Acceptance Criteria:**
- [ ] Join page with room code input field
- [ ] After valid room code entered, player name input appears
- [ ] Server validates room code exists before allowing join
- [ ] Player added to lobby's player list with unique ID
- [ ] Player redirected to `/controller?room=XXXX&player=NAME` after joining
- [ ] Error message shown if room code is invalid
- [ ] Error message shown if player name is already taken in that lobby

**Technical Notes:**
- Generate unique player ID (UUID) on backend
- Validate room code format before checking existence
- Sanitize player names (trim whitespace, limit length to 20 chars)
- Store player socket ID for real-time communication

**Dependencies:** Story 1.4

---

### Story 1.6: Real-Time Player List Sync
**As a** player or host  
**I want** to see all players in the lobby update in real-time  
**So that** I know who has joined the game

**Acceptance Criteria:**
- [ ] When a player joins, all clients in that lobby receive updated player list
- [ ] Display route shows all player names in a visible list
- [ ] Controller route shows all player names (or count)
- [ ] When a player disconnects, they are removed from the list in real-time
- [ ] Player list updates without page refresh
- [ ] Host can see total player count

**Technical Notes:**
- Use Socket.io room broadcasts: `io.to(roomCode).emit('playerListUpdate', players)`
- Include player join/leave animations for better UX
- Store player list in lobby state: `{ players: [{ id, name, socketId }] }`
- Handle edge case: what if host disconnects? (For MVP, lobby can close)

**Dependencies:** Story 1.5

---

## Epic 2: Display Casting (Browser-Based Initially)

### Story 2.1: Display Route as TV Simulator
**As a** developer  
**I want** to open the display route in a laptop browser as a TV simulator  
**So that** I can test the two-screen experience without Chromecast initially

**Acceptance Criteria:**
- [ ] Host can open `/display?room=XXXX` in a separate browser window/tab
- [ ] Display route shows lobby information (room code, player list)
- [ ] Display route receives real-time updates via WebSocket
- [ ] Display is read-only (no interactive elements)
- [ ] Display has fullscreen button for immersive testing
- [ ] Instructions in README for testing with laptop as TV + phones as controllers

**Technical Notes:**
- This is a temporary solution for early development
- Display route should accept room code via query parameter
- Display should auto-connect to WebSocket room on mount
- Later, this will be replaced/enhanced with actual Chromecast receiver

**Dependencies:** Story 1.6

---

### Story 2.2: QR Code for Easy Joining
**As a** player  
**I want** to scan a QR code to join the lobby  
**So that** I don't have to manually type the room code

**Acceptance Criteria:**
- [ ] Display route shows a QR code containing the join URL
- [ ] QR code encodes: `http://[LOCAL_IP]:3000/join?room=XXXX`
- [ ] Scanning QR code on phone opens the app with room code pre-filled
- [ ] Player only needs to enter their name after scanning
- [ ] QR code is large and centered on display for easy scanning

**Technical Notes:**
- Use `qrcode.react` or similar library
- QR code should encode the full join URL with room code
- Server should inject local IP address into the URL (or use environment variable)
- Consider adding a short URL service later for production

**Dependencies:** Story 2.1

---

## Epic 3: Game Selection & Flow Control

### Story 3.1: Game Registry System
**As a** developer  
**I want** a centralized game registry  
**So that** games can be easily added and configured

**Acceptance Criteria:**
- [ ] Game registry file/module created with list of available games
- [ ] Each game has metadata: id, name, description, min/max players, icon
- [ ] Games export a standard interface: `{ id, name, init, tick, handleInput, calculateResults }`
- [ ] Registry is imported by both frontend and backend
- [ ] At least 3 placeholder games registered (Circle Pong, Secret Button, Guess Who Wrote It)

**Technical Notes:**
- Create `/server/games/registry.js` and `/client/src/lib/gameRegistry.js`
- Use a common game interface/contract
- Each game should be its own module in `/server/games/` and `/client/src/components/games/`
- Games should be self-contained and not tightly coupled to the app

**Dependencies:** Story 1.6

---

### Story 3.2: Pre-Game Selection UI
**As a** host  
**I want** to select which games to include in the session  
**So that** we only play games our group enjoys

**Acceptance Criteria:**
- [ ] After creating lobby, host sees game selection screen on controller
- [ ] All available games shown as checkboxes with name and description
- [ ] "Select All" and "Deselect All" buttons available
- [ ] At least one game must be selected to proceed
- [ ] Host taps "Start Session" to confirm game selection
- [ ] Selected games sent to backend and stored in lobby state

**Technical Notes:**
- Use checkbox list component with game metadata from registry
- Default to all games selected
- Consider adding preset playlists later: "Quick Party", "Comedy Mix", "Reflex Games"
- Display selected game count: "5 games selected"

**Dependencies:** Story 3.1

---

### Story 3.3: Playlist Generation & Round Progression
**As a** host  
**I want** games to auto-rotate through my selected playlist  
**So that** I don't have to manually pick each game

**Acceptance Criteria:**
- [ ] Backend generates shuffled playlist from host's game selection
- [ ] Current game index tracked in lobby state
- [ ] "Next Round" increments the index and loads next game
- [ ] Display shows which game is next: "Up next: Circle Pong (Round 2 of 5)"
- [ ] After playlist exhausted, final scoreboard shows with option to play again

**Technical Notes:**
- Shuffle algorithm: Fisher-Yates shuffle
- Playlist stored in lobby: `{ playlist: ['circle-pong', 'secret-button', ...], currentGameIndex: 0 }`
- Consider allowing host to skip a game or restart playlist

**Dependencies:** Story 3.2

---

### Story 3.4: Host "Start Round" Control
**As a** host  
**I want** to manually start each round when everyone is ready  
**So that** players have time to prepare between games

**Acceptance Criteria:**
- [ ] Before each round, display shows game instructions/rules
- [ ] Host's controller shows a large "Start Round" button
- [ ] Only the host sees the start button (other players see "Waiting for host...")
- [ ] Tapping "Start Round" broadcasts game start event to all clients
- [ ] Display transitions from instructions to active game view
- [ ] All players' controllers transition to game input view

**Technical Notes:**
- Backend validates that only host can start rounds
- Include 3-2-1 countdown after "Start Round" pressed for better UX
- Consider adding a "Ready" system where players confirm readiness first (optional for later)

**Dependencies:** Story 3.3

---

### Story 3.5: Round Completion & Transition
**As a** player  
**I want** to see results after each round  
**So that** I know how I performed

**Acceptance Criteria:**
- [ ] When game ends, backend calculates results (winners/losers)
- [ ] Display shows round results with winner/loser highlighted
- [ ] Points awarded/deducted based on results
- [ ] Scoreboard appears after results
- [ ] Host sees "Next Round" button after scoreboard displayed
- [ ] Tapping "Next Round" loads the next game in playlist

**Technical Notes:**
- Each game's `calculateResults()` function returns: `{ winners: [], losers: [], points: {} }`
- Results screen should show for at least 3-5 seconds before allowing next round
- Consider adding celebratory animations for winners

**Dependencies:** Story 3.4

---

## Epic 4: Scoring System

### Story 4.1: Basic Scoreboard Data Structure
**As a** developer  
**I want** a scoreboard that tracks scores across rounds  
**So that** we can determine who's winning the session

**Acceptance Criteria:**
- [ ] Scoreboard stored in lobby state
- [ ] Each player has: totalScore, roundScores array, drinkCount
- [ ] Scoreboard initialized when game selection is confirmed
- [ ] Scoreboard updated after each round
- [ ] Scoreboard persists across all games in the session

**Technical Notes:**
- Structure: `{ [playerId]: { name, totalScore, roundScores: [], drinkCount: 0 } }`
- Round scores can be positive or negative
- Include timestamp for each round score (optional, useful for debugging)

**Dependencies:** Story 3.5

---

### Story 4.2: Scoreboard Display on TV
**As a** player  
**I want** to see the scoreboard on the TV after each round  
**So that** everyone knows the current standings

**Acceptance Criteria:**
- [ ] Scoreboard component created for display route
- [ ] Shows all players ranked by total score (highest to lowest)
- [ ] Displays: player name, total score, this round's score, drink count
- [ ] Highlights who won/lost the previous round
- [ ] Visually appealing with large, readable text
- [ ] Updates automatically when scores change

**Technical Notes:**
- Use table or card layout for player scores
- Highlight winner in green, losers in red (or similar)
- Include medal icons for top 3 players (optional)
- Sort players by total score descending

**Dependencies:** Story 4.1

---

### Story 4.3: Penalty Modal on Controller
**As a** losing player  
**I want** to choose whether to drink or keep negative points  
**So that** I have control over my score and drink count

**Acceptance Criteria:**
- [ ] After a round, players with negative points see a modal on their controller
- [ ] Modal shows: "You lost X points this round"
- [ ] Two buttons: "Drink to clear penalty" and "Keep the negative"
- [ ] "Drink to clear" sets round score to 0 and increments drink count
- [ ] "Keep the negative" adds the negative points to total score
- [ ] Modal is private (only visible to losing players)
- [ ] Other players see "Waiting for penalty choices..." while modal is open

**Technical Notes:**
- Modal component in `/client/src/components/DrinkPenaltyModal.jsx`
- Backend tracks which players have pending penalty choices
- Use Socket.io to emit penalty choice event: `{ playerId, choice: 'drink' | 'keep' }`
- Disable background interaction while modal is open

**Dependencies:** Story 4.2

---

### Story 4.4: Penalty Choice Processing
**As the** system  
**I want** to wait for all penalty choices before showing final scoreboard  
**So that** scores are accurate

**Acceptance Criteria:**
- [ ] Backend tracks pending penalty choices per round
- [ ] Once all losing players make their choice, scoreboard updates
- [ ] Display shows loading state while waiting: "Waiting for penalty choices..."
- [ ] After all choices made, updated scoreboard appears
- [ ] Host can then proceed to next round

**Technical Notes:**
- Track state: `{ pendingPenalties: [playerId1, playerId2], penaltyChoices: {} }`
- When all choices received, broadcast `penaltyChoicesComplete` event
- Handle timeout: if player doesn't choose within 30 seconds, default to "keep negative"

**Dependencies:** Story 4.3

---

### Story 4.5: Score History & Drink Count Tracking
**As a** player  
**I want** to see my score history across all rounds  
**So that** I can track my performance throughout the session

**Acceptance Criteria:**
- [ ] Controller shows player's own total score at all times (in header or footer)
- [ ] Player can tap score to see round-by-round breakdown
- [ ] Drink count visible on player's controller
- [ ] Final scoreboard at end of session shows complete history

**Technical Notes:**
- Create a "My Stats" section on controller
- Round-by-round breakdown: "Round 1: +10, Round 2: -5 → 0 (drank), Round 3: +15"
- Consider adding a graph or chart for visual history (optional)

**Dependencies:** Story 4.4

---

## Epic 5: Wake Lock & Polish

### Story 5.1: Wake Lock Implementation
**As a** player  
**I want** my phone screen to stay awake during gameplay  
**So that** I don't miss my turn

**Acceptance Criteria:**
- [ ] Wake lock requested when player enters controller route
- [ ] Wake lock released when player leaves controller route or session ends
- [ ] Fallback behavior if wake lock not supported (show warning to user)
- [ ] Wake lock re-requested if it's released due to system events

**Technical Notes:**
- Use `navigator.wakeLock.request('screen')`
- Wrap in try-catch (not supported in all browsers)
- Handle visibility change events to re-acquire lock
- Test on actual phones (may not work in desktop browsers)

**Dependencies:** Story 1.3

---

### Story 5.2: Disconnection Handling
**As a** player  
**I want** to know if I've been disconnected  
**So that** I can rejoin if needed

**Acceptance Criteria:**
- [ ] If player's WebSocket disconnects, show "Connection lost..." message
- [ ] Attempt automatic reconnection with exponential backoff
- [ ] After 3 failed reconnection attempts, show manual reconnect button
- [ ] If reconnection successful, sync player back into current game state
- [ ] If player disconnects mid-game, they are marked as "disconnected" but stay in lobby

**Technical Notes:**
- Use Socket.io's built-in reconnection logic
- Display connection status indicator (green dot = connected, red = disconnected)
- For MVP, disconnected players can't interact but can reconnect later
- Consider implementing a "rejoin" feature where player re-enters same lobby

**Dependencies:** Story 1.2

---

### Story 5.3: Lobby Cleanup & Timeout
**As the** system  
**I want** to automatically clean up inactive lobbies  
**So that** server memory doesn't fill up

**Acceptance Criteria:**
- [ ] Lobbies have a "lastActivity" timestamp
- [ ] Background job checks for lobbies with no activity for 2+ hours
- [ ] Inactive lobbies are deleted from memory
- [ ] If all players disconnect, lobby is marked for deletion after 10 minutes
- [ ] Lobby cleanup logged to server console

**Technical Notes:**
- Use `setInterval` to check lobbies every 10 minutes
- Update `lastActivity` on any WebSocket event in that lobby
- Delete lobby from Map: `lobbies.delete(roomCode)`
- Consider notifying players before deletion (optional)

**Dependencies:** Story 1.4

---

## Epic 6: Game - Circle Pong

### Story 6.1: Circle Pong - Game Logic & State Management
**As a** developer  
**I want** Circle Pong game logic implemented on the backend  
**So that** the game can run with server-authoritative state

**Acceptance Criteria:**
- [ ] Game state includes: player order, ball position, ball speed, current player index
- [ ] On game start, players assigned random order
- [ ] Ball moves from player to player based on order
- [ ] Each player has a time window to respond (e.g., 1-2 seconds)
- [ ] If player responds in time, ball moves to next player
- [ ] If player fails to respond, round ends and that player is marked as loser
- [ ] Ball speed increases every 5 successful passes
- [ ] After 15 successful passes, player order reshuffles randomly

**Technical Notes:**
- Use game tick loop (e.g., 60 ticks per second)
- Ball position represented as index in player array
- Track time since ball reached current player
- Emit state updates to all clients every tick
- Game ends when: a player misses, or 3 minutes elapsed (timeout)

**Dependencies:** Story 3.1

---

### Story 6.2: Circle Pong - Display View
**As a** spectator  
**I want** to see the circle, ball, and player positions on the TV  
**So that** I can follow the game action

**Acceptance Criteria:**
- [ ] Display shows a circle with all player names positioned around it
- [ ] Ball animates smoothly moving from player to player
- [ ] Current active player highlighted (e.g., glowing border)
- [ ] Ball speed increase visually noticeable
- [ ] When order reshuffles, players visually rearrange around circle with animation
- [ ] Timer shows time remaining for current player to respond

**Technical Notes:**
- Use HTML Canvas or SVG for circle and ball rendering
- Player positions calculated based on angle: `(360 / playerCount) * index`
- Ball moves with linear interpolation between positions
- Consider adding sound effects for ball bounce (optional)

**Dependencies:** Story 6.1

---

### Story 6.3: Circle Pong - Controller View
**As a** player  
**I want** a simple button to hit the ball when it's my turn  
**So that** I can participate in the game

**Acceptance Criteria:**
- [ ] Controller shows player's position number in the circle
- [ ] Large "HIT" button appears when ball is approaching or has reached the player
- [ ] Button is disabled when it's not the player's turn
- [ ] Visual countdown shows time remaining to respond
- [ ] Haptic feedback when button is tapped (if supported)
- [ ] Immediate visual feedback on tap (optimistic UI)

**Technical Notes:**
- Button should be large and touch-friendly (minimum 60px height)
- Show "Your turn!" message when ball reaches player
- Consider adding vibration feedback: `navigator.vibrate(100)`
- Button state: enabled only when `currentPlayerIndex === myPlayerIndex`

**Dependencies:** Story 6.2

---

### Story 6.4: Circle Pong - Speed & Shuffle Mechanics
**As a** player  
**I want** the game to get progressively harder  
**So that** it remains challenging and exciting

**Acceptance Criteria:**
- [ ] Ball speed starts at 1 second per player (comfortable pace)
- [ ] Every 5 successful passes, ball speed increases by 15%
- [ ] After 15 successful passes, player order randomly reshuffles
- [ ] Display shows visual/audio cue when reshuffle happens
- [ ] Players have 1 second to see new positions before ball resumes
- [ ] Maximum speed cap at 0.3 seconds per player

**Technical Notes:**
- Speed formula: `initialSpeed * (0.85 ^ (successCount / 5))`
- Reshuffle: Fisher-Yates shuffle on player order array
- Pause ball movement for 1 second during reshuffle to let players adjust
- Emit shuffle event with new order to all clients

**Dependencies:** Story 6.3

---

### Story 6.5: Circle Pong - Results & Scoring
**As the** system  
**I want** to calculate winners and losers for Circle Pong  
**So that** scores can be updated

**Acceptance Criteria:**
- [ ] Player who missed the ball is marked as loser
- [ ] All other players are marked as winners
- [ ] Winners receive +10 points each
- [ ] Loser receives -10 points
- [ ] Results object returned: `{ winners: [...], losers: [playerId], points: { [playerId]: score } }`
- [ ] Results sent to scoreboard system

**Technical Notes:**
- Winner/loser calculation in `/server/games/circle-pong.js`
- If timeout occurs (3 minutes), all players draw (0 points)
- Edge case: if only 1 player in lobby, they can't lose (no game starts)

**Dependencies:** Story 6.4

---

## Epic 7: Game - Secret Button

### Story 7.1: Secret Button - Game Logic
**As a** developer  
**I want** Secret Button game logic implemented  
**So that** players must follow changing button rules

**Acceptance Criteria:**
- [ ] Game state includes: current rule, rule history, player responses
- [ ] Rules change every 3-5 seconds
- [ ] Rules include: "Tap blue", "Don't tap red", "Tap largest shape", "Tap the circle"
- [ ] Each player's controller shows 4 buttons (colors or shapes)
- [ ] When rule changes, all players must tap correct button within time limit
- [ ] Players who tap wrong button or don't tap in time get penalty points
- [ ] Game runs for 10 rounds (10 rule changes)

**Technical Notes:**
- Rule types: color-based, shape-based, size-based, position-based
- Rules stored as: `{ type: 'color', target: 'blue', negative: false }`
- Track correct/incorrect taps per player
- Scoring: +5 for correct tap, -5 for incorrect/missing tap

**Dependencies:** Story 3.1

---

### Story 7.2: Secret Button - Display View
**As a** spectator  
**I want** to see the current rule and player status on TV  
**So that** I can follow the game

**Acceptance Criteria:**
- [ ] Display shows current rule in large text: "TAP BLUE"
- [ ] Timer counts down from rule announcement to deadline
- [ ] Player names shown with status: correct (green), incorrect (red), waiting (gray)
- [ ] Round counter: "Round 5 of 10"
- [ ] After each round, brief summary of who got it right/wrong

**Technical Notes:**
- Use bold, high-contrast colors for rule text
- Player status updates in real-time as they tap buttons
- Consider adding sound effects for correct/incorrect taps

**Dependencies:** Story 7.1

---

### Story 7.3: Secret Button - Controller View
**As a** player  
**I want** to see buttons and tap the correct one  
**So that** I can score points

**Acceptance Criteria:**
- [ ] Controller shows 4 buttons arranged in a grid (2x2)
- [ ] Buttons have different colors or shapes based on round
- [ ] Current rule displayed at top of controller: "Tap blue"
- [ ] Countdown timer visible
- [ ] Immediate feedback when button tapped (highlight, vibration)
- [ ] After tapping, buttons disabled until next round

**Technical Notes:**
- Buttons: 50% width, square aspect ratio
- Colors: red, blue, green, yellow (for color rounds)
- Shapes: circle, square, triangle, star (for shape rounds)
- Disable all buttons after player taps to prevent multiple inputs

**Dependencies:** Story 7.2

---

### Story 7.4: Secret Button - Rule Progression & Scoring
**As the** system  
**I want** to increase difficulty as the game progresses  
**So that** it becomes more challenging

**Acceptance Criteria:**
- [ ] First 3 rounds: simple color rules ("Tap blue")
- [ ] Rounds 4-6: negative rules ("Don't tap red")
- [ ] Rounds 7-9: shape or size rules ("Tap largest shape")
- [ ] Round 10: trick round (rule reverses mid-countdown)
- [ ] Final scores calculated: total correct taps vs incorrect
- [ ] Top 50% of players get +20 points, bottom 50% get -10 points

**Technical Notes:**
- Rule difficulty progression defined in game config
- Trick round: announce one rule, then change it at 2 seconds remaining
- Scoring: calculate percentage correct per player, then rank
- Handle ties: if tied for cutoff, all tied players get positive points

**Dependencies:** Story 7.3

---

## Epic 8: Game - Guess Who Wrote It

### Story 8.1: Guess Who Wrote It - Game Logic
**As a** developer  
**I want** Guess Who Wrote It game logic implemented  
**So that** players can submit and guess answers

**Acceptance Criteria:**
- [ ] Game has two phases: submission and guessing
- [ ] Submission phase: all players submit answer to a prompt (30 seconds)
- [ ] Guessing phase: one player (guesser) matches answers to players
- [ ] Guesser rotates each round (or chosen randomly)
- [ ] Game runs for 1 round per player in lobby (everyone gets to guess once)
- [ ] Points awarded for: correct guesses (+10), fooling the guesser (+5)

**Technical Notes:**
- Prompt examples: "Worst excuse for being late", "Fake product idea"
- Store submissions: `{ [playerId]: answerText }`
- Guesser sees shuffled list of answers and list of player names
- Guesser must match each answer to a player

**Dependencies:** Story 3.1

---

### Story 8.2: Guess Who Wrote It - Submission Phase
**As a** player  
**I want** to submit a funny answer to the prompt  
**So that** I can participate in the guessing game

**Acceptance Criteria:**
- [ ] Display shows the current prompt in large text
- [ ] Controller shows prompt and a text input field
- [ ] Players have 30 seconds to submit their answer
- [ ] Timer counts down on both display and controller
- [ ] After submitting, player sees "Waiting for others..."
- [ ] Once all players submit (or timer expires), move to guessing phase

**Technical Notes:**
- Text input: max 100 characters
- Auto-submit when timer expires (use current text, even if empty)
- Empty submissions default to "[Player Name] didn't answer"
- Display shows submission count: "3 / 5 players submitted"

**Dependencies:** Story 8.1

---

### Story 8.3: Guess Who Wrote It - Guessing Phase
**As the** guesser  
**I want** to match answers to players  
**So that** I can score points

**Acceptance Criteria:**
- [ ] One player designated as guesser for the round
- [ ] Guesser's controller shows list of all submitted answers (shuffled)
- [ ] Guesser's controller shows list of all player names
- [ ] Guesser drags/taps to match each answer to a player
- [ ] Guesser has 60 seconds to make all matches
- [ ] Display shows guesser's progress: "Matching... 3 / 5 complete"
- [ ] After all matches made, results revealed

**Technical Notes:**
- Use drag-and-drop or tap-to-match interface
- Answers should be numbered/lettered for easier reference
- Guesser must match all answers (can't skip)
- If timer expires, unmatched answers assigned randomly

**Dependencies:** Story 8.2

---

### Story 8.4: Guess Who Wrote It - Reveal & Scoring
**As a** player  
**I want** to see the correct matches revealed  
**So that** I know who wrote what and who scored

**Acceptance Criteria:**
- [ ] Display shows each answer with the actual author and guesser's guess
- [ ] Correct matches highlighted in green
- [ ] Incorrect matches highlighted in red
- [ ] Guesser gets +10 points per correct match
- [ ] Players get +5 points if guesser guessed them incorrectly (fooled the guesser)
- [ ] Total points calculated and added to scoreboard

**Technical Notes:**
- Reveal with animation (one answer at a time)
- Show funny/interesting answers for 3-5 seconds each
- Display final tally: "Guesser got 3 / 5 correct! (+30 points)"
- All players see the same reveal sequence on display

**Dependencies:** Story 8.3

---

## Epic 9: Additional Games (Future Stories)

### Story 9.1: Game - Pass the Bomb
**Placeholder for future implementation**

### Story 9.2: Game - Reverse Reflex
**Placeholder for future implementation**

### Story 9.3: Game - Copycat Panic
**Placeholder for future implementation**

### Story 9.4: Game - Spot the Liar
**Placeholder for future implementation**

---

## Epic 10: Chromecast Integration (Future)

### Story 10.1: Google Cast SDK Integration
**As a** host  
**I want** to cast the display to my TV via Chromecast  
**So that** I don't need to connect a laptop with HDMI

**Acceptance Criteria:**
- [ ] Host's controller shows "Cast" button
- [ ] Tapping Cast button opens Chromecast device picker
- [ ] Selecting a device loads `/display` route on the TV
- [ ] Cast session persists when host switches to controller view
- [ ] Display updates in real-time on TV via Cast session

**Technical Notes:**
- Requires registering a Google Cast Receiver app
- Use `chrome.cast` API on sender (host phone)
- Create custom receiver HTML for `/display` route
- This is complex; consider using ngrok for initial testing

**Dependencies:** Story 2.1

---

## Testing Guidance

### Manual Testing Workflow

**Setup:**
1. Start Docker container: `docker-compose up`
2. Find local IP: `ipconfig` (e.g., `192.168.1.100`)
3. Ensure both phones on same WiFi network as development machine

**Test Scenario 1: Lobby Creation & Joining**
1. Phone 1 (Host): Navigate to `http://192.168.1.100:3000`
2. Phone 1: Tap "Create Lobby", note the room code
3. Laptop: Open `http://192.168.1.100:3000/display?room=XXXX` in browser
4. Phone 2 (Player): Navigate to `http://192.168.1.100:3000`
5. Phone 2: Enter room code and player name
6. Verify: Both players appear on display and in player lists

**Test Scenario 2: Game Selection & Flow**
1. Phone 1: Select 2-3 games and start session
2. Verify: Display shows first game instructions
3. Phone 1: Tap "Start Round"
4. Verify: Game starts on all devices
5. Play through game
6. Verify: Results appear, scoreboard updates
7. Phone 1: Tap "Next Round"
8. Verify: Next game loads

**Test Scenario 3: Penalty System**
1. Play a game where Phone 2 loses
2. Verify: Phone 2 sees penalty modal
3. Phone 2: Choose "Drink to clear"
4. Verify: Scoreboard shows 0 points for that round, drink count +1

**Test Scenario 4: Disconnection**
1. Phone 2: Close browser or turn off WiFi
2. Verify: Display shows player as disconnected
3. Phone 2: Rejoin lobby
4. Verify: Player reconnects successfully

### Unit Testing (Optional)

**Backend Tests:**
- Lobby creation and room code generation
- Player join validation
- Game state transitions
- Scoreboard calculations

**Frontend Tests:**
- Component rendering for display and controller routes
- WebSocket connection handling
- Game-specific UI interactions

**Suggested Testing Framework:**
- Backend: Jest + Supertest for API/WebSocket testing
- Frontend: Vitest + React Testing Library

---

## Acceptance Testing Checklist

Before marking a story as complete, verify:
- [ ] Acceptance criteria all met
- [ ] Works on both phones (tested locally)
- [ ] Display updates correctly in laptop browser
- [ ] No console errors in browser or server logs
- [ ] WebSocket connections stable
- [ ] Code follows project structure and naming conventions
- [ ] README updated if new setup steps required
