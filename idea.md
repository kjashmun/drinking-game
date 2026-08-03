# Drinking Game App Idea

## Core Concept
This is a party-style multiplayer web app built for a shared TV screen with each player joining on their phone as a controller.

One player hosts a lobby, everyone else joins with a simple player name, and the group rotates through short mini-games that are easy to learn, fast to play, and fun to watch. The best games should create tension, chaos, and social moments instead of long rules or complicated strategy.

The host casts the display to a TV using Chromecast, creating a seamless two-screen experience: one for spectacle, one for private input.

## Platform
**Web app** with built-in Chromecast support.

Why web:
- Players join instantly with a room code or QR scan
- No App Store install friction
- Works for both iPhone and Android
- Session-based model fits the web naturally
- Fast iteration and testing

## Session Model
- One player creates a lobby as host
- Other players join with a player name only
- No permanent accounts
- No long-term player profiles
- No persistent storage required at the start
- Lobby state only exists while the room is active
- Shared scoreboard lasts for the current session only
- When the lobby ends, all game data is deleted

## Why No Database Initially
This concept makes sense as a session-based app first.

At the start, the game likely only needs:
- an in-memory lobby
- an in-memory player list
- an in-memory current mini-game state
- an in-memory scoreboard

If the server restarts, the lobby disappears, which is probably acceptable for this kind of party game.

## Design Goals
- Very fast to join
- TV display via Chromecast from host's phone
- Easy enough for drunk players to understand quickly
- Rounds should usually last under 1 to 3 minutes
- High player interaction
- Strong spectator value even when it is not your turn
- Increasing tension or chaos during a round
- Funny social moments between rounds
- Smooth rotation between intense games and comedy games
- Phones never sleep during gameplay (wake-lock enabled)

## Core Product Flow

### Setup
1. Host opens the app on their phone
2. Taps "Create Lobby"
3. Taps "Cast to TV" and selects their Chromecast device
4. Display route loads on TV showing room code + QR code
5. Host's phone switches to controller view
6. Players scan QR or enter room code to join
7. Players enter a name and land on their controller view

### Game Selection
1. Once everyone has joined, host sees game selection screen
2. Host checks which mini-games to include in the session
3. App generates a shuffled playlist of selected games
4. Lobby is ready

### Round Flow
1. Next game instructions appear on TV
2. Host taps "Start Round" when everyone is ready
3. Game runs with real-time input from all players
4. Game ends, results appear on TV
5. Scoreboard updates and displays on TV
6. Players with negative points see a private penalty choice on their phone
7. Host taps "Next Round" when ready
8. Repeat until playlist is exhausted

### Penalty System
When a player loses a round and receives negative points:
- Their phone shows a modal with two options:
  - "Drink to clear penalty" - sets their round score to 0, increments drink count
  - "Keep the negative" - adds the negative points to their total score
- This choice is private and only visible on their phone
- Once all players with penalties choose, the updated scoreboard appears

### End of Session
- Final scoreboard displays
- Option to play again with the same games or select new ones
- Option to end the lobby (clears all data)

## Scoring System

### Points Structure
- Winners of a round receive positive points (amount varies by game)
- Losers receive negative points
- Players can choose to drink to erase negative points from that round
- Scoreboard tracks:
  - Total score (cumulative across all rounds)
  - Round-by-round scores
  - Total drinks taken during the session

### Scoreboard Display
- Appears after every round
- Shows all players ranked by total score
- Highlights who won/lost the previous round
- Shows drink count for each player
- Persistent throughout the session

### Example:
```
Player       Total Score    This Round    Drinks
------       -----------    ----------    ------
Alice        +45            +15           2
Bob          +30            +10           1
Carol        +20            -5 → 0 🍺     3
Dave         -10            -5            0
```

### Premise
Every player is assigned a random number at the start of the round. That number represents their position in the current circle order.

On the shared screen, the circle and ball movement are visible to everyone. On each phone, the player mainly sees when the ball is approaching them and what action they need to perform.

### How It Works
1. Players enter the round.
2. Everyone receives a random order number.
3. A ball starts traveling around the player circle.
4. When the ball reaches a player, they must react in time to return or redirect it.
5. If players keep succeeding, the ball speed increases.
6. After a success streak, the circle order may reshuffle.
7. The round gets faster and more chaotic until someone misses.
8. The player who fails takes the loss for the round.

### What Makes It Fun
- The rules are instantly understandable.
- Everyone stays alert because their turn can come fast.
- Reshuffling creates panic and laughter.
- The pace naturally escalates without needing complex mechanics.
- It is fun both to play and to watch on a shared screen.

### Variations
- Reverse round: the ball suddenly changes direction
- Multi-ball round: a second ball spawns after a streak
- Fake-out ball: one visual ball is harmless and one is live
- Chaos swap: two players exchange positions mid-round

## Game Mode 1: Circle Pong

### Premise
Every player is assigned a random number at the start of the round. That number represents their position in the current circle order.

On the shared screen, the circle and ball movement are visible to everyone. On each phone, the player mainly sees when the ball is approaching them and what action they need to perform.

### How It Works
1. Players enter the round.
2. Everyone receives a random order number.
3. A ball starts traveling around the player circle.
4. When the ball reaches a player, they must react in time to return or redirect it.
5. If players keep succeeding, the ball speed increases.
6. After a success streak, the circle order may reshuffle.
7. The round gets faster and more chaotic until someone misses.
8. The player who fails takes the loss for the round.

### What Makes It Fun
- The rules are instantly understandable.
- Everyone stays alert because their turn can come fast.
- Reshuffling creates panic and laughter.
- The pace naturally escalates without needing complex mechanics.
- It is fun both to play and to watch on a shared screen.

### Variations
- Reverse round: the ball suddenly changes direction
- Multi-ball round: a second ball spawns after a streak
- Fake-out ball: one visual ball is harmless and one is live
- Chaos swap: two players exchange positions mid-round

## Brainstormed Mini-Games

### 1. Pass the Bomb
A hidden timer starts. Players take turns completing a tiny prompt before passing the bomb.

Example prompts:
- name a fast food chain
- say a word starting with M
- name a movie sequel

The bomb explodes on whoever hesitates too long or gets caught when the timer ends.

Why it fits:
- very easy to run on phones and TV
- immediate tension
- good for loud group energy

### 2. Bluff Match
Everyone answers a funny prompt on their phone. One player, or the whole group, then tries to guess who wrote each answer.

Example prompt:
- worst excuse for being late to a wedding

This captures the social comedy feel of party card games, but the twist is identity guessing instead of just judging the funniest answer.

Why it fits:
- great for humor
- creates friend-group callouts
- works well between more intense reflex games

### 3. Secret Button
Every phone shows a small set of colored buttons, shapes, or symbols. The shared screen announces quick rules like:
- tap blue
- do not tap the largest shape
- tap the symbol that appeared two rounds ago

Rules start simple and quickly become confusing.

Why it fits:
- extremely easy to control
- fast rounds
- lots of panic mistakes

### 4. Reverse Reflex
Players must do the opposite of what the screen suggests.

Examples:
- if the screen says left, tap right
- if it says duck, stay still
- if it says stop, tap now

Partway through the round, the rule can flip again so players are no longer sure whether they should obey or reverse.

Why it fits:
- short and intense
- funny because people fail in obvious ways
- easy to spectate

### 5. Copycat Panic
One player is briefly shown a pose, expression, sound, or motion prompt. They perform it, and everyone else must copy it as fast as possible.

Possible prompts:
- shocked face
- evil laugh
- salute
- pretend to chug

The slowest player, least accurate player, or last confirmation loses.

Why it fits:
- physical and funny
- works well in the same room
- gives variety beyond tapping games

### 6. Spot the Liar
Everyone gets a prompt, but one player secretly gets a slightly different version. After answering, the group has to figure out who had the odd prompt.

Example:
- most annoying food to eat in a car
- one player instead gets: best food to eat in a car

Why it fits:
- creates suspicion and discussion
- simple tech requirements
- good social pacing change from reaction games

### 7. Freeze Frame
Players tap or spam along with a rhythm or instruction sequence, then the screen suddenly flashes a freeze warning. Anyone who keeps pressing after freeze loses.

Why it fits:
- instant crowd reaction
- easy to understand
- funny when people panic and overcommit

### 8. Hot Potato Aim
Players pass an on-screen object left, right, or to a marked target player using phone input. Direction rules change during the round, and the speed ramps up until someone fumbles the pass.

Why it fits:
- feels active on the shared screen
- keeps everyone watching constantly
- can become chaotic fast

### 9. Volume Drop
Every player holds a button on their phone and must release when they think a hidden timer has reached the perfect moment. Closest wins, worst miss loses.

Why it fits:
- simple but tense
- good as a short filler game
- gives a break from twitch reactions while staying competitive

### 10. Guess Who Wrote It
This is the strongest comedy/social mode idea so far.

Everyone submits an answer to a prompt. Then one chosen player has to match each answer to the friend who wrote it.

Example prompts:
- worst thing to hear from your Uber driver
- a fake product that should not exist
- the worst superpower to have on a first date

Why it fits:
- funny every round if the group knows each other
- easy to generate lots of prompts
- strong replay value
- feels different from the reflex games while still being highly interactive

## Best Early Prototype Candidates
These feel like the strongest first batch because they are simple, distinct, and good for a shared-screen party setup:

1. Circle Pong
2. Pass the Bomb
3. Secret Button
4. Reverse Reflex
5. Guess Who Wrote It

That mix gives:
- 3 high-speed reaction games
- 1 chaos/tension word game
- 1 comedy/social game

## Technical Implementation

### Architecture
**Two-route web app:**
- `/display` - TV view (cast receiver)
- `/controller` - phone input view

**Stack:**
- Frontend: React + Vite, TailwindCSS, Socket.io-client, Google Cast SDK
- Backend: Node.js, Express, Socket.io
- Real-time sync via WebSocket rooms
- In-memory lobby storage (no database initially)

### Key Features
- **Chromecast integration** via Google Cast Web Receiver
- **Wake-lock API** to prevent phone screens from sleeping
- **Real-time game state sync** with optimistic UI updates
- **Room-based WebSocket channels** for lobby isolation
- **Automatic lobby cleanup** after inactivity timeout

### Chromecast Flow
1. Host phone acts as Cast sender
2. `/display` route loads on Chromecast device
3. Cast session persists even when host phone switches views
4. All players send input to same lobby via WebSocket
5. Backend broadcasts state updates to display and all controllers

### Development Phases
1. **Core Infrastructure** - lobby system, WebSocket sync, two-route setup
2. **Chromecast Integration** - Cast SDK, receiver registration
3. **Game Selection System** - playlist generation, host controls
4. **Scoring + Penalties** - scoreboard, drink choice modal
5. **First 3 Games** - Circle Pong, Secret Button, Guess Who Wrote It
6. **Polish** - error handling, reconnection, UI refinement

## Lobby Configuration
- Supports 1-12 players
- Host controls round progression (manual start)
- Game playlist auto-rotates through selected games
- Host can end session at any time

## Design Decisions Made
- Platform: Web app with Chromecast support
- Lobby size: 1-12 players
- Scoring: Positive points for winners, negative points for losers
- Penalty system: Players can drink to clear negative points from a round
- Scoreboard: Displayed after every round
- Game selection: Host pre-selects games, app auto-rotates through playlist
- Round control: Host manually starts each round when ready
- Wake-lock: Enabled on all controller phones
- Session persistence: In-memory only, no database initially

## Remaining Questions
- Should game timers run server-side or client-side?
- Should disconnected players be able to reconnect to the same lobby?
- If multiple players tie for last place, do they all get negative points?
- Should non-active players see game info on phones during rounds, or just wait screens?
