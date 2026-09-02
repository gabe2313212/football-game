# ⚽ Football Game

A web-based football management game with two exciting modes: **Build a Roster** and **Super Squad**. Use real player data from API-Football to create and manage your dream team!

## 🎮 Game Modes

### Build a Roster
- Pick 6 players from an actual team (Premier League)
- Simulate a full season with matches
- Earn points from wins (100), draws (50), or losses (0)
- View league standings and team statistics
- Compare your team's performance vs others

### Super Squad
- Create your own 11-player team
- Name your team (with profanity filter)
- Collect players from both Premier League and LaLiga
- Access retired legends as "Icons" with prime stats
- Swap and optimize your squad lineup
- Earn points by playing matches against actual league teams
- Open packs to get new players:
  - **Bronze Pack**: 50 points (5 cards)
  - **Gold Pack**: 100 points (5 cards)
- Pull rare Cards and Icons from packs
- Complete full seasons and track your record

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- An API-Football account with an API key

### Setup Instructions

1. **Get an API Key**
   - Go to [RapidAPI - API-Football](https://rapidapi.com/api-sports/api/api-football)
   - Sign up for a free account
   - Subscribe to the API (free tier available)
   - Copy your API key

2. **Configure the Game**
   - Open `config.js`
   - Replace `YOUR_API_FOOTBALL_KEY` with your actual API key:
   ```javascript
   API_KEY: 'your_actual_api_key_here',
   ```

3. **Run the Game**
   - Open `index.html` in your web browser
   - OR use a local server (recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```
   - Then visit `http://localhost:8000`

## 📁 File Structure

```
football-game/
├── index.html          # Main HTML file
├── config.js           # Game configuration and settings
├── api.js              # API-Football integration
├── utils.js            # Utility functions and helpers
├── game.js             # Main game logic
├── styles.css          # Game styling
└── README.md           # This file
```

## 🎯 Key Features

- **Real Data**: Uses actual player stats from API-Football
- **Responsive Design**: Works on desktop and mobile devices
- **Profanity Filter**: Team names are filtered for appropriateness
- **Local Storage**: Game progress is saved in your browser
- **Match Simulation**: Matches are simulated based on real player ratings
- **Pack System**: Open packs to build your collection
- **Seasonal Play**: Complete full seasons and track your progress

## 💾 Game Data

Your game progress is automatically saved to your browser's local storage:
- Build a Roster: `buildRoster_gameState`
- Super Squad: `superSquad_gameState`

### Reset Game Data
To reset your progress, open your browser's developer console and run:
```javascript
localStorage.removeItem('buildRoster_gameState');
localStorage.removeItem('superSquad_gameState');
```

## 🛠️ Configuration Options

Edit `config.js` to customize:

```javascript
SEASON: 2024                          // Current season
BUILD_ROSTER_PLAYERS: 6               // Players in Build a Roster mode
SUPER_SQUAD_PLAYERS: 11               // Players in Super Squad mode

POINTS: {
    WIN: 100,                         // Points for a win
    DRAW: 50,                         // Points for a draw
    LOSS: 0,                          // Points for a loss
    FINAL_WIN: 1000,                  // Points for final match (future)
}

PACKS: {
    BRONZE: { cost: 50 },             // Bronze pack cost
    GOLD: { cost: 100 }               // Gold pack cost
}
```

## 🎮 How to Play

### Build a Roster Mode
1. Select **"Build a Roster"** from the main menu
2. Choose a Premier League team
3. Pick 6 players from that team
4. Play matches against other teams
5. Earn points based on results
6. View your season statistics

### Super Squad Mode
1. Select **"Super Squad"** from the main menu
2. Enter your team name (must be appropriate)
3. Open Bronze or Gold packs to collect players
4. Build an 11-player squad from your collection
5. Select a league (Premier League or LaLiga)
6. Play match-by-match against teams
7. Win matches to earn points for more packs
8. Optimize your squad by swapping players

## 📊 Player Ratings

Players have different ratings based on real API-Football data:
- **Common**: Rating < 80
- **Rare**: Rating 80-85
- **Icons**: Retired legends with prime stats

Pack pull rates:
- **Bronze Pack**: 85% Common, 14% Rare, 1% Icon
- **Gold Pack**: 60% Common, 35% Rare, 5% Icon

## 🐛 Troubleshooting

### "Could not load teams/players"
- Check that your API key is correct in `config.js`
- Verify you're subscribed to the API-Football service
- Check your network connection
- Check browser console for detailed error messages

### Game won't save
- Make sure browser cookies/storage are enabled
- Try using a different browser
- Clear browser cache and reload

### Slow performance
- Reduce the number of teams/players being loaded
- Close other browser tabs
- Try a different browser

## 📝 Notes

- The game uses the 2024 season data (configurable in `config.js`)
- Match simulations are based on player ratings and random variance
- Your team data is stored locally in your browser
- The game requires an active internet connection to fetch player data

## 🎓 Learning Resources

- [API-Football Documentation](https://www.api-football.com/documentation-v3)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs - Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork, modify, and improve this game! Some ideas for future enhancements:

- Trading system with other players
- Leaderboards and rankings
- Player injuries and recovery
- Team chemistry bonuses
- Special events and tournaments
- More detailed player statistics
- Formation customization
- Transfer market system

## 📧 Support

For issues or questions, check the code comments or create an issue in the GitHub repository.

---

**Enjoy building your dream football team! ⚽**
