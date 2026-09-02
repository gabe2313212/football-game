// API Integration with API-Football
class FootballAPI {
    constructor() {
        this.baseURL = CONFIG.BASE_URL;
        this.apiKey = CONFIG.API_KEY;
        this.apiHost = CONFIG.API_HOST;
    }

    async makeRequest(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.baseURL}${endpoint}?${queryString}`;

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': this.apiHost
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            return null;
        }
    }

    // Get teams from a specific league
    async getTeams(leagueId, season = CONFIG.SEASON) {
        return this.makeRequest('/teams', {
            league: leagueId,
            season: season
        });
    }

    // Get team squad/players
    async getTeamPlayers(teamId, season = CONFIG.SEASON) {
        return this.makeRequest('/players', {
            team: teamId,
            season: season
        });
    }

    // Get league standings
    async getStandings(leagueId, season = CONFIG.SEASON) {
        return this.makeRequest('/standings', {
            league: leagueId,
            season: season
        });
    }

    // Get player stats
    async getPlayerStats(playerId, season = CONFIG.SEASON) {
        return this.makeRequest('/players', {
            id: playerId,
            season: season
        });
    }

    // Get head-to-head matches between teams
    async getMatchesBetweenTeams(team1Id, team2Id) {
        return this.makeRequest('/fixtures', {
            h2h: `${team1Id}-${team2Id}`
        });
    }

    // Get all matches in a season
    async getSeasonMatches(leagueId, season = CONFIG.SEASON) {
        return this.makeRequest('/fixtures', {
            league: leagueId,
            season: season
        });
    }

    // Simulate a match based on player stats
    simulateMatch(team1Players, team2Players) {
        const getTeamStrength = (players) => {
            return players.reduce((sum, player) => sum + (player.statistics?.[0]?.statistics?.rating || 70), 0) / players.length;
        };

        const team1Strength = getTeamStrength(team1Players);
        const team2Strength = getTeamStrength(team2Players);

        const team1Goals = Math.floor(Math.random() * 5 * (team1Strength / 75));
        const team2Goals = Math.floor(Math.random() * 5 * (team2Strength / 75));

        return {
            team1Goals,
            team2Goals,
            result: team1Goals > team2Goals ? 'win' : team1Goals < team2Goals ? 'loss' : 'draw'
        };
    }
}

// Initialize API instance
const api = new FootballAPI();
