// Main Game Logic
class FootballGame {
    constructor() {
        this.currentMode = null;
        this.gameState = null;
        this.allPlayers = [];
        this.allTeams = [];
    }

    async init() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <header>
                    <h1>⚽ Football Game</h1>
                    <p>Build your dream team and compete!</p>
                </header>
                <div class="mode-selector">
                    <button class="btn btn-primary" onclick="game.selectMode('buildRoster')">
                        Build a Roster
                    </button>
                    <button class="btn btn-primary" onclick="game.selectMode('superSquad')">
                        Super Squad
                    </button>
                </div>
            </div>
        `;
    }

    async selectMode(mode) {
        this.currentMode = mode;
        
        if (mode === 'buildRoster') {
            await this.initBuildRoster();
        } else if (mode === 'superSquad') {
            await this.initSuperSquad();
        }
    }

    // BUILD A ROSTER MODE
    async initBuildRoster() {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading">Loading teams and players...</div>';

        try {
            // Get Premier League teams
            const teamsData = await api.getTeams(40); // 40 is Premier League ID
            if (!teamsData || !teamsData.response) {
                throw new Error('Could not load teams');
            }

            this.allTeams = teamsData.response;
            await this.showBuildRosterScreen();
        } catch (error) {
            console.error(error);
            app.innerHTML = `
                <div class="container">
                    <h2>Error Loading Game</h2>
                    <p>${error.message}</p>
                    <p>Make sure you've set your API-Football key in config.js</p>
                    <button class="btn btn-secondary" onclick="game.init()">Back</button>
                </div>
            `;
        }
    }

    async showBuildRosterScreen() {
        const app = document.getElementById('app');
        const teamsHTML = this.allTeams.slice(0, 10).map(t => `
            <div class="team-card" onclick="game.selectRosterTeam(${t.team.id}, '${t.team.name}')">
                <img src="${t.team.logo}" alt="${t.team.name}">
                <h3>${t.team.name}</h3>
            </div>
        `).join('');

        app.innerHTML = `
            <div class="container">
                <h2>Build a Roster - Select a Team</h2>
                <p>Choose a team to pick 6 players from</p>
                <div class="teams-grid">
                    ${teamsHTML}
                </div>
                <button class="btn btn-secondary" onclick="game.init()">Back</button>
            </div>
        `;
    }

    async selectRosterTeam(teamId, teamName) {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading">Loading team players...</div>';

        try {
            const playersData = await api.getTeamPlayers(teamId);
            if (!playersData || !playersData.response) {
                throw new Error('Could not load players');
            }

            const players = playersData.response.slice(0, 20); // Get first 20 players
            
            app.innerHTML = `
                <div class="container">
                    <h2>${teamName} - Select 6 Players</h2>
                    <div id="playerSelection"></div>
                    <div id="selectedCount">Selected: 0/6</div>
                    <button class="btn btn-primary" id="startBtn" disabled onclick="game.startBuildRosterSeason()">Start Season</button>
                    <button class="btn btn-secondary" onclick="game.showBuildRosterScreen()">Back</button>
                </div>
            `;

            this.selectedRosterPlayers = [];
            this.currentRosterTeamName = teamName;
            this.rosterPlayers = players;

            const selectionDiv = document.getElementById('playerSelection');
            selectionDiv.innerHTML = players.map((p, idx) => `
                <div class="player-card" onclick="game.togglePlayerSelection(${idx})">
                    <h4>${p.player.name}</h4>
                    <p>Position: ${Utils.getPlayerPosition(p)}</p>
                    <p>Rating: ${Utils.getPlayerRating(p)}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error(error);
            app.innerHTML = `
                <div class="container">
                    <h2>Error Loading Players</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-secondary" onclick="game.showBuildRosterScreen()">Back</button>
                </div>
            `;
        }
    }

    togglePlayerSelection(idx) {
        const player = this.rosterPlayers[idx];
        const index = this.selectedRosterPlayers.findIndex(p => p.player.id === player.player.id);

        if (index > -1) {
            this.selectedRosterPlayers.splice(index, 1);
        } else if (this.selectedRosterPlayers.length < 6) {
            this.selectedRosterPlayers.push(player);
        }

        const count = this.selectedRosterPlayers.length;
        document.getElementById('selectedCount').textContent = `Selected: ${count}/6`;
        document.getElementById('startBtn').disabled = count !== 6;

        // Visual feedback
        const cards = document.querySelectorAll('.player-card');
        cards.forEach((card, i) => {
            if (this.selectedRosterPlayers.findIndex(p => p.player.id === this.rosterPlayers[i].player.id) > -1) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    startBuildRosterSeason() {
        this.gameState = {
            mode: 'buildRoster',
            team: this.currentRosterTeamName,
            players: this.selectedRosterPlayers,
            matches: [],
            totalPoints: 0,
            season: 1
        };

        this.showBuildRosterSeason();
    }

    showBuildRosterSeason() {
        const app = document.getElementById('app');
        const opponents = this.allTeams.filter(t => t.team.name !== this.gameState.team).slice(0, 10);

        let matchesHTML = '';
        opponents.forEach((opp, idx) => {
            matchesHTML += `
                <div class="match-card">
                    <h4>${this.gameState.team} vs ${opp.team.name}</h4>
                    <button class="btn btn-small" onclick="game.playBuildRosterMatch(${idx})">Play Match</button>
                </div>
            `;
        });

        app.innerHTML = `
            <div class="container">
                <h2>Build a Roster - Season Mode</h2>
                <div class="stats">
                    <p>Team: ${this.gameState.team}</p>
                    <p>Players: ${this.gameState.players.length}</p>
                    <p>Total Points: ${this.gameState.totalPoints}</p>
                </div>
                <div class="matches">
                    ${matchesHTML}
                </div>
                <button class="btn btn-secondary" onclick="game.init()">Main Menu</button>
            </div>
        `;
    }

    playBuildRosterMatch(opponentIdx) {
        const opponent = this.allTeams.filter(t => t.team.name !== this.gameState.team)[opponentIdx];
        const result = api.simulateMatch(this.gameState.players, []);

        const points = Utils.calculatePoints(result.result);
        this.gameState.totalPoints += points;
        this.gameState.matches.push({
            opponent: opponent.team.name,
            goals1: result.team1Goals,
            goals2: result.team2Goals,
            result: result.result,
            points: points
        });

        Utils.saveGameState('buildRoster', this.gameState);

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <h2>Match Result</h2>
                <div class="match-result">
                    <h3>${Utils.formatMatchResult(this.gameState.team, result.team1Goals, opponent.team.name, result.team2Goals)}</h3>
                    <p>Result: ${result.result.toUpperCase()}</p>
                    <p>Points Earned: +${points}</p>
                    <p>Total Points: ${this.gameState.totalPoints}</p>
                </div>
                <button class="btn btn-primary" onclick="game.showBuildRosterSeason()">Continue</button>
            </div>
        `;
    }

    // SUPER SQUAD MODE
    async initSuperSquad() {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading">Loading players...</div>';

        try {
            // Get players from both Premier League and LaLiga
            const plData = await api.getTeams(40); // Premier League
            const llData = await api.getTeams(39); // LaLiga

            if (!plData || !llData) {
                throw new Error('Could not load teams');
            }

            this.allTeams = [...plData.response, ...llData.response];
            await this.showSuperSquadSetup();
        } catch (error) {
            console.error(error);
            app.innerHTML = `
                <div class="container">
                    <h2>Error Loading Game</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-secondary" onclick="game.init()">Back</button>
                </div>
            `;
        }
    }

    async showSuperSquadSetup() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <h2>Super Squad - Create Your Team</h2>
                <div class="setup-form">
                    <input type="text" id="teamNameInput" placeholder="Enter team name" maxlength="30">
                    <small id="nameError" style="color: red; display: none;">Team name is inappropriate or invalid</small>
                    <button class="btn btn-primary" onclick="game.createSuperSquadTeam()">Create Team</button>
                    <button class="btn btn-secondary" onclick="game.init()">Back</button>
                </div>
            </div>
        `;
    }

    createSuperSquadTeam() {
        const teamName = document.getElementById('teamNameInput').value.trim();
        const errorDiv = document.getElementById('nameError');

        if (!Utils.isValidTeamName(teamName)) {
            errorDiv.style.display = 'block';
            return;
        }

        errorDiv.style.display = 'none';

        this.gameState = {
            mode: 'superSquad',
            teamName: teamName,
            squad: [],
            collection: [],
            points: 0,
            matches: [],
            league: null
        };

        this.showSuperSquadMain();
    }

    showSuperSquadMain() {
        const app = document.getElementById('app');
        const squadHTML = this.gameState.squad.length > 0 
            ? this.gameState.squad.map(p => `
                <div class="player-in-squad">
                    <p>${p.player.name}</p>
                    <p>${Utils.getPlayerPosition(p)}</p>
                    <button class="btn btn-small" onclick="game.removeFromSquad('${p.player.id}')">Remove</button>
                </div>
            `).join('')
            : '<p>No players selected yet</p>';

        app.innerHTML = `
            <div class="container">
                <h2>${this.gameState.teamName}</h2>
                <div class="super-squad-main">
                    <div class="squad-section">
                        <h3>Squad (${this.gameState.squad.length}/11)</h3>
                        <div class="squad-list">
                            ${squadHTML}
                        </div>
                    </div>
                    <div class="stats-section">
                        <h3>Stats</h3>
                        <p>Points: ${this.gameState.points}</p>
                        <p>Collection: ${this.gameState.collection.length} players</p>
                    </div>
                    <div class="actions">
                        <button class="btn btn-primary" onclick="game.showSquadBuilder()">Build Squad</button>
                        <button class="btn btn-primary" onclick="game.showPackOpening()">Open Packs</button>
                        ${this.gameState.squad.length === 11 ? `<button class="btn btn-success" onclick="game.showLeagueSelection()">Play Matches</button>` : ''}
                        <button class="btn btn-secondary" onclick="game.init()">Main Menu</button>
                    </div>
                </div>
            </div>
        `;
    }

    showSquadBuilder() {
        const app = document.getElementById('app');
        const collectionHTML = this.gameState.collection.map((p, idx) => `
            <div class="player-card" onclick="game.addToSquad(${idx})">
                <h4>${p.player.name}</h4>
                <p>Position: ${Utils.getPlayerPosition(p)}</p>
                <p>Rating: ${Utils.getPlayerRating(p)}</p>
                ${p.isIcon ? '<p style="color: gold;">⭐ ICON</p>' : ''}
            </div>
        `).join('');

        app.innerHTML = `
            <div class="container">
                <h2>Build Your Squad</h2>
                <p>Select 11 players from your collection</p>
                <div class="player-selection">
                    ${collectionHTML.length > 0 ? collectionHTML : '<p>Open packs to get players!</p>'}
                </div>
                <button class="btn btn-secondary" onclick="game.showSuperSquadMain()">Back</button>
            </div>
        `;
    }

    addToSquad(playerIdx) {
        if (this.gameState.squad.length >= 11) {
            alert('Squad is full! Remove a player first.');
            return;
        }

        const player = this.gameState.collection[playerIdx];
        this.gameState.squad.push(player);
        this.gameState.collection.splice(playerIdx, 1);

        Utils.saveGameState('superSquad', this.gameState);
        this.showSquadBuilder();
    }

    removeFromSquad(playerId) {
        const idx = this.gameState.squad.findIndex(p => p.player.id == playerId);
        if (idx > -1) {
            this.gameState.collection.push(this.gameState.squad[idx]);
            this.gameState.squad.splice(idx, 1);
            Utils.saveGameState('superSquad', this.gameState);
            this.showSuperSquadMain();
        }
    }

    showPackOpening() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <h2>Open Packs</h2>
                <p>Current Points: ${this.gameState.points}</p>
                <div class="packs">
                    <div class="pack-option">
                        <h3>Bronze Pack</h3>
                        <p>Cost: 50 Points</p>
                        <p>5 cards</p>
                        <button class="btn btn-primary" onclick="game.openPack('BRONZE')" ${this.gameState.points < 50 ? 'disabled' : ''}>
                            Open Pack
                        </button>
                    </div>
                    <div class="pack-option">
                        <h3>Gold Pack</h3>
                        <p>Cost: 100 Points</p>
                        <p>5 cards</p>
                        <button class="btn btn-primary" onclick="game.openPack('GOLD')" ${this.gameState.points < 100 ? 'disabled' : ''}>
                            Open Pack
                        </button>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="game.showSuperSquadMain()">Back</button>
            </div>
        `;
    }

    openPack(packType) {
        const cost = packType === 'BRONZE' ? 50 : 100;

        if (this.gameState.points < cost) {
            alert('Not enough points!');
            return;
        }

        this.gameState.points -= cost;

        // Get random players from collection
        const pulledPlayers = Utils.openPack(this.gameState.collection, packType);
        this.gameState.collection.push(...pulledPlayers);

        Utils.saveGameState('superSquad', this.gameState);

        const app = document.getElementById('app');
        const pulledHTML = pulledPlayers.map(p => `
            <div class="pulled-player">
                <h4>${p.player.name}</h4>
                <p>${Utils.getPlayerPosition(p)}</p>
                <p>Rating: ${Utils.getPlayerRating(p)}</p>
            </div>
        `).join('');

        app.innerHTML = `
            <div class="container">
                <h2>Pack Results!</h2>
                <div class="pulled-cards">
                    ${pulledHTML}
                </div>
                <p>Cards added to collection!</p>
                <button class="btn btn-primary" onclick="game.showSuperSquadMain()">Continue</button>
            </div>
        `;
    }

    showLeagueSelection() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <h2>Select League</h2>
                <p>Play against teams from:</p>
                <div class="league-selector">
                    <button class="btn btn-primary" onclick="game.startMatches(40)">Premier League</button>
                    <button class="btn btn-primary" onclick="game.startMatches(39)">LaLiga</button>
                </div>
                <button class="btn btn-secondary" onclick="game.showSuperSquadMain()">Back</button>
            </div>
        `;
    }

    async startMatches(leagueId) {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading">Loading league teams...</div>';

        try {
            const teamsData = await api.getTeams(leagueId);
            if (!teamsData) throw new Error('Could not load teams');

            this.gameState.league = leagueId;
            this.leagueTeams = teamsData.response.slice(0, 10);
            this.matchIndex = 0;

            this.showNextMatch();
        } catch (error) {
            app.innerHTML = `
                <div class="container">
                    <h2>Error</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-secondary" onclick="game.showSuperSquadMain()">Back</button>
                </div>
            `;
        }
    }

    showNextMatch() {
        if (this.matchIndex >= this.leagueTeams.length) {
            this.showSeasonEnd();
            return;
        }

        const opponent = this.leagueTeams[this.matchIndex];
        const app = document.getElementById('app');

        app.innerHTML = `
            <div class="container">
                <h2>Match ${this.matchIndex + 1} of ${this.leagueTeams.length}</h2>
                <div class="match-preview">
                    <div class="team">
                        <h3>${this.gameState.teamName}</h3>
                        <p>${this.gameState.squad.length}/11 players</p>
                    </div>
                    <p>vs</p>
                    <div class="team">
                        <img src="${opponent.team.logo}" alt="${opponent.team.name}" style="max-width: 100px;">
                        <h3>${opponent.team.name}</h3>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="game.playMatch(${this.matchIndex})">Play Match</button>
                <button class="btn btn-secondary" onclick="game.showSuperSquadMain()">Quit</button>
            </div>
        `;
    }

    async playMatch(matchIdx) {
        const opponent = this.leagueTeams[matchIdx];
        
        // Simulate match
        const result = api.simulateMatch(this.gameState.squad, []);
        const points = Utils.calculatePoints(result.result);

        this.gameState.points += points;
        this.gameState.matches.push({
            opponent: opponent.team.name,
            goals1: result.team1Goals,
            goals2: result.team2Goals,
            result: result.result,
            points: points
        });

        Utils.saveGameState('superSquad', this.gameState);

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <h2>Match Result</h2>
                <div class="match-result">
                    <h3>${Utils.formatMatchResult(this.gameState.teamName, result.team1Goals, opponent.team.name, result.team2Goals)}</h3>
                    <p>Result: ${result.result.toUpperCase()}</p>
                    <p>Points Earned: +${points}</p>
                    <p>Total Points: ${this.gameState.points}</p>
                </div>
                <button class="btn btn-primary" onclick="game.nextMatch()">Next Match</button>
            </div>
        `;

        this.matchIndex++;
    }

    nextMatch() {
        this.showNextMatch();
    }

    showSeasonEnd() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                <h2>Season Complete!</h2>
                <div class="season-stats">
                    <p>Total Points: ${this.gameState.points}</p>
                    <p>Matches Played: ${this.gameState.matches.length}</p>
                    <p>Wins: ${this.gameState.matches.filter(m => m.result === 'win').length}</p>
                    <p>Draws: ${this.gameState.matches.filter(m => m.result === 'draw').length}</p>
                    <p>Losses: ${this.gameState.matches.filter(m => m.result === 'loss').length}</p>
                </div>
                <button class="btn btn-primary" onclick="game.showSuperSquadMain()">Back to Team</button>
                <button class="btn btn-secondary" onclick="game.init()">Main Menu</button>
            </div>
        `;
    }
}

// Initialize game on load
const game = new FootballGame();
window.addEventListener('DOMContentLoaded', () => game.init());
