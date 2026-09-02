// Utility Functions
class Utils {
    // Profanity filter for team names
    static profanityList = ['ass', 'bad', 'crap', 'damn', 'dick', 'fuck', 'hell', 'piss', 'shit', 'whore'];

    static isAppropriateTeamName(name) {
        const lowerName = name.toLowerCase();
        return !this.profanityList.some(word => lowerName.includes(word));
    }

    // Generate random player from pool
    static getRandomPlayer(players) {
        return players[Math.floor(Math.random() * players.length)];
    }

    // Open pack and get players
    static openPack(allPlayers, packType = 'BRONZE') {
        const rates = CONFIG.PULL_RATES[packType];
        const rand = Math.random();
        let rarity;

        if (rand <= rates.icon) {
            rarity = 'icon';
        } else if (rand <= rates.icon + rates.rare) {
            rarity = 'rare';
        } else {
            rarity = 'common';
        }

        // Filter players by rarity (simplified - in real game you'd have rarity data)
        const filteredPlayers = allPlayers.filter(p => {
            if (rarity === 'icon') return p.isIcon === true;
            if (rarity === 'rare') return p.statistics?.[0]?.statistics?.rating >= 80;
            return p.statistics?.[0]?.statistics?.rating < 80;
        });

        const pulledPlayers = [];
        for (let i = 0; i < 5; i++) { // 5 cards per pack
            if (filteredPlayers.length > 0) {
                pulledPlayers.push(this.getRandomPlayer(filteredPlayers));
            }
        }

        return pulledPlayers;
    }

    // Get player rating
    static getPlayerRating(player) {
        return player.statistics?.[0]?.statistics?.rating || 70;
    }

    // Get player position
    static getPlayerPosition(player) {
        return player.statistics?.[0]?.games?.position || 'Unknown';
    }

    // Format match result
    static formatMatchResult(team1Name, team1Goals, team2Name, team2Goals) {
        return `${team1Name} ${team1Goals} - ${team2Goals} ${team2Name}`;
    }

    // Calculate points from match
    static calculatePoints(result) {
        switch(result) {
            case 'win': return CONFIG.POINTS.WIN;
            case 'draw': return CONFIG.POINTS.DRAW;
            case 'loss': return CONFIG.POINTS.LOSS;
            default: return 0;
        }
    }

    // Generate season schedule
    static generateSeasonSchedule(teams, userTeamId) {
        const schedule = [];
        const opponents = teams.filter(t => t.team.id !== userTeamId);
        
        opponents.forEach(opponent => {
            schedule.push({
                opponent: opponent.team,
                played: false,
                result: null,
                points: 0
            });
        });

        return schedule.sort(() => Math.random() - 0.5);
    }

    // Check if team name is valid
    static isValidTeamName(name) {
        return name.length > 0 && name.length <= 30 && this.isAppropriateTeamName(name);
    }

    // Store game data to localStorage
    static saveGameState(mode, data) {
        localStorage.setItem(`${mode}_gameState`, JSON.stringify(data));
    }

    // Load game data from localStorage
    static loadGameState(mode) {
        const data = localStorage.getItem(`${mode}_gameState`);
        return data ? JSON.parse(data) : null;
    }

    // Clear game data
    static clearGameState(mode) {
        localStorage.removeItem(`${mode}_gameState`);
    }
}
