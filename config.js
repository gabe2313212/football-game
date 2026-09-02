// API Configuration
const CONFIG = {
    API_KEY: 'YOUR_API_FOOTBALL_KEY', // Get from https://rapidapi.com/api-sports/api/api-football
    API_HOST: 'api-football-v1.p.rapidapi.com',
    BASE_URL: 'https://api-football-v1.p.rapidapi.com',
    
    // Leagues
    LEAGUES: {
        LA_LIGA: 39,
        PREMIER_LEAGUE: 39,
    },
    
    // Game settings
    SEASON: 2024,
    BUILD_ROSTER_PLAYERS: 6,
    SUPER_SQUAD_PLAYERS: 11,
    
    // Points system
    POINTS: {
        WIN: 100,
        DRAW: 50,
        LOSS: 0,
        FINAL_WIN: 1000,
    },
    
    // Pack costs
    PACKS: {
        BRONZE: {
            cost: 50,
            name: 'Bronze Pack',
            rarity: 'common'
        },
        GOLD: {
            cost: 100,
            name: 'Gold Pack',
            rarity: 'rare'
        }
    },
    
    // Icon pull rates
    PULL_RATES: {
        BRONZE: {
            common: 0.85,
            rare: 0.14,
            icon: 0.01
        },
        GOLD: {
            common: 0.60,
            rare: 0.35,
            icon: 0.05
        }
    }
};
