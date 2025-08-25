class SpotifyPlayer {
    constructor() {
        this.player = null;
        this.deviceId = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.volume = 50;
        this.position = 0;
        this.duration = 0;
        this.isConnected = false;
        this.accessToken = null;
        this.updateInterval = null;
        this.isShuffled = false;
        this.repeatMode = 0; // 0: off, 1: all, 2: one

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Authentication elements
        this.tokenInput = document.getElementById('tokenInput');
        this.connectBtn = document.getElementById('connectBtn');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.authSection = document.getElementById('authSection');
        this.playerSection = document.getElementById('playerSection');
        this.playerStart = document.getElementById('player');
        this.Status = document.getElementById('connection-status');;

        //Settings
        this.SettingsIcon = document.getElementById('settingsIcon');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.SettingColor = document.getElementById('selectColor');
        this.SettingColor2 = document.getElementById('selectColor2');
        this.SettingColor3 = document.getElementById('selectColor3');
        this.SettingColor4 = document.getElementById('selectColor4');
        this.SettingColor5 = document.getElementById('selectColor5');
        this.SettingColor6 = document.getElementById('selectColor6');
        this.constantColor = document.getElementById('selectColor5');

        // Player elements
        this.trackImage = document.getElementById('trackImage');
        this.trackName = document.getElementById('trackName');
        this.trackArtist = document.getElementById('trackArtist');
        this.trackAlbum = document.getElementById('trackAlbum');
        this.trackGenres = document.getElementById('trackGenres');
        this.genresList = document.getElementById('genresList');
        this.iconPlayer = document.getElementById('iconReproductor');

        // Controls
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.iconPlayPause = document.getElementById('playPauseIcon');

        // Progress
        this.progressBar = document.querySelector('.progress-bar');
        this.progressFill = document.getElementById('progress');
        this.progressHandle = document.getElementById('progressHandle');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');

        // Volume
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeFill = document.getElementById('volumeFill');

        // Navigation
        this.navPlayer = document.getElementById('navPlayer');
        this.navSearch = document.getElementById('navSearch');
        this.navPlaylists = document.getElementById('navPlaylists');

        // Sections
        this.searchSection = document.getElementById('searchSection');
        this.playlistsSection = document.getElementById('playlistsSection');

        // Search
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResults = document.getElementById('searchResults');

        // Others
        this.playlistsList = document.getElementById('playlistsList');
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    setupEventListeners() {
        // Authentication
        this.connectBtn.addEventListener('click', () => this.connect());
        this.tokenInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.connect();
        });

        //Settings
        this.SettingsIcon.addEventListener('click', () => this.toggleSettings());
        this.SettingColor.addEventListener('click', () => this.applyColor(this.SettingColor));
        this.SettingColor2.addEventListener('click', () => this.applyColor(this.SettingColor2));
        this.SettingColor3.addEventListener('click', () => this.applyColor(this.SettingColor3));
        this.SettingColor4.addEventListener('click', () => this.applyColor(this.SettingColor4));
        this.SettingColor5.addEventListener('click', () => this.applyColor(this.SettingColor5));
        this.SettingColor6.addEventListener('click', () => this.applyColor(this.SettingColor6));

        // Player controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());

        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seekToPosition(e));

        // Volume control
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        volumeSlider.addEventListener('input', function () {
            const value = this.value;
            updateSliderBg(value);
        });

        // Navigation
        this.navPlayer.addEventListener('click', () => this.showSection('player'));
        this.navSearch.addEventListener('click', () => this.showSection('search'));
        this.navPlaylists.addEventListener('click', () => this.showSection('playlists'));

        // Search
        this.searchBtn.addEventListener('click', () => this.searchMusic());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchMusic();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    async connect() {
        const token = this.tokenInput.value.trim();
        if (!token) {
            this.showError('Por favor ingresa un token válido');
            return;
        }

        this.accessToken = token;
        this.showLoading(true);


        try {
            // Initialize Spotify Web Playback SDK
            window.onSpotifyWebPlaybackSDKReady = () => {
                this.initializePlayer();
            };

            // If SDK is already loaded
            if (window.Spotify) {
                this.initializePlayer();
            }
        } catch (error) {
            console.error('Error connecting:', error);
            this.showError('Error al conectar con Spotify');
            this.showLoading(false);
        }
    }

    initializePlayer() {
        this.player = new Spotify.Player({
            name: 'Starlight',
            getOAuthToken: cb => { cb(this.accessToken); },
            volume: this.volume / 100
        });

        // Error handling
        this.player.addListener('initialization_error', ({ message }) => {
            console.error('Failed to initialize:', message);
            this.showError('Error de inicialización: ' + message);
            this.showLoading(false);
        });

        this.player.addListener('authentication_error', ({ message }) => {
            console.error('Failed to authenticate:', message);
            this.showError('Error de autenticación: Token inválido');
            this.showLoading(false);
        });

        this.player.addListener('account_error', ({ message }) => {
            console.error('Account error:', message);
            this.showError('Error de cuenta: Se requiere Spotify Premium');
            this.showLoading(false);
        });

        this.player.addListener('playback_error', ({ message }) => {
            console.error('Playback error:', message);
            this.showError('Error de reproducción: ' + message);
        });

        // Playback status updates
        this.player.addListener('player_state_changed', state => {
            if (!state) return;

            this.currentTrack = state.track_window.current_track;
            this.isPlaying = !state.paused;
            this.position = state.position;
            this.duration = state.duration;
            this.updateUI();
        });

        // Ready
        this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            this.deviceId = device_id;
            this.isConnected = true;
            this.updateConnectionStatus();
            this.showPlayerInterface();
            this.loadUserData();
            this.showLoading(false);
            this.startProgressUpdater();
        });

        // Not Ready
        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            this.isConnected = false;
            this.updateConnectionStatus();
        });

        // Connect to the player
        this.player.connect().then(success => {
            if (!success) {
                this.showError('Failed to connect to Spotify');
                this.showLoading(false);
            }
        });
    }

    updateConnectionStatus() {
        if (this.isConnected) {
            this.Status.className = 'hidden';
        } else {
            this.connectionStatus.textContent = 'Desconectado';
            this.connectionStatus.className = 'status-disconnected';
        }
    }

    showPlayerInterface() {
        this.authSection.classList.add('hidden');
        this.playerStart.classList.remove('hidden');
    }

    async loadUserData() {
        try {
            await this.loadPlaylists();
            await this.loadTopTracks();
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadPlaylists() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch playlists');

            const data = await response.json();
            this.displayPlaylists(data.items);
        } catch (error) {
            console.error('Error loading playlists:', error);
        }
    }

    async loadTopTracks() {
        const query = "Starlight";
        if (!query) return;

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();
            this.displaySearchResults(data.tracks.items);
            this.showLoading(false);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Error en la búsqueda');
            this.showLoading(false);
        }
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('hidden');
    }

    displayPlaylists(playlists) {
        this.playlistsList.innerHTML = '';

        playlists.forEach(playlist => {
            const playlistElement = document.createElement('div');
            playlistElement.className = 'playlist-item';
            playlistElement.innerHTML = `<div class="cursor-pointer hover:scale-105 transition-transform">
                <img src="${playlist.images[0]?.url || 'https://via.placeholder.com/250x250?text=Playlist'}" alt="${playlist.name}">
                <h4>${playlist.name}</h4>
                <p>${playlist.tracks.total} canciones</p>
                </div>
            `;

            playlistElement.addEventListener('click', () => {
                this.playPlaylist(playlist.id);
            });

            this.playlistsList.appendChild(playlistElement);
        });
    }

    async playPlaylist(playlistId) {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    context_uri: `spotify:playlist:${playlistId}`
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
        } catch (error) {
            console.error('Error playing playlist:', error);
            this.showError('Error al reproducir la playlist');
            this.showLoading(false);
        }
    }

    async searchMusic() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showLoading(true);

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();
            this.displaySearchResults(data.tracks.items);
            this.showLoading(false);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Error en la búsqueda');
            this.showLoading(false);
        }
    }

    displaySearchResults(tracks) {
        this.searchResults.innerHTML = '';

        tracks.slice(0, 4).forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.className = 'search-item';
            trackElement.innerHTML = `<div class="bg-[#57FFD9] p-4 rounded-lg m-4 flex flex-row items-center gap-4 hover:bg-[#ff1d89] cursor-pointer">
                <img src="${track.album.images[2]?.url || 'https://via.placeholder.com/60x60?text=Track'}" alt="${track.name}" class="rounded-lg">
                <div class="search-item-info text-black text-wrap">
                    <h1><strong>${track.name}</strong></h1>
                    <p>${track.artists.map(artist => artist.name)}</p>
                    <p>${track.album.name}</p>
                </div>
                </div>
            `;

            trackElement.addEventListener('click', () => {
                this.playTrack(track.uri);
            });

            this.searchResults.appendChild(trackElement);
        });
    }


    async playTrack(trackUri) {
        try {

            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    uris: [trackUri]
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
        } catch (error) {
            console.error('Error playing track:', error);
            this.showError('Error al reproducir la canción');
            this.showLoading(false);
        }
    }

    togglePlayPause() {
        if (this.player) {
            this.player.togglePlay();
        }
    }

    previousTrack() {
        if (this.player) {
            this.player.previousTrack();
        }
    }

    nextTrack() {
        if (this.player) {
            this.player.nextTrack();
        }
    }

    setVolume(volume) {
        this.volume = parseInt(volume);

        if (this.player) {
            this.player.setVolume(this.volume / 100);
        }
        updateSliderBg(this.volume);
    }


    seekToPosition(event) {
        if (!this.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const seekPosition = Math.floor(percentage * this.duration);

        if (this.player) {
            this.player.seek(seekPosition);
        }
    }

    async updateUI() {
        if (this.currentTrack) {
            this.trackName.textContent = this.currentTrack.name;
            this.trackArtist.textContent = this.currentTrack.artists.map(artist => artist.name).join(', ');
            this.trackAlbum.textContent = this.currentTrack.album.name;

            if (this.currentTrack.album.images[0]) {
                this.trackImage.src = this.currentTrack.album.images[0].url;
            }
        }

        this.updatePlaybackUI();
    }

    updatePlaybackUI() {
        // Update play/pause button
        const playIcon = this.playPauseBtn.querySelector('i');
        if (this.isPlaying) {
            playIcon.className = 'fas fa-pause';
            this.iconPlayPause.src = '../img/pause.png';
            this.applyColor(this.constantColor);
        } else {
            playIcon.className = 'fas fa-play';
            this.iconPlayPause.src = '../img/right.png';
            this.applyColor(this.constantColor);
        }
        // Update progress
        if (this.duration > 0) {
            const progressPercent = (this.position / this.duration) * 100;
            this.progressFill.style.width = `${progressPercent}%`;
            this.progressHandle.style.left = `${progressPercent}%`;
            this.progressBar.style.background = `linear-gradient(to right, #ff1d89 ${progressPercent}%, #e5e7eb ${progressPercent}%)`;
        }

        // Update time displays
        this.currentTime.textContent = this.formatTime(this.position);
        this.totalTime.textContent = this.formatTime(this.duration);
    }

    startProgressUpdater() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            if (this.isPlaying && this.position < this.duration) {
                this.position += 1000;
                this.updatePlaybackUI();
            }
        }, 1000);
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showSection(section) {
        // Hide all sections
        this.playerSection.classList.add('hidden');
        this.searchSection.classList.add('hidden');
        this.playlistsSection.classList.add('hidden');

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section and activate nav button
        switch (section) {
            case 'player':
                this.navPlayer.classList.add('active');
                break;
            case 'search':
                this.searchSection.classList.remove('hidden');
                this.navSearch.classList.add('active');
                break;
            case 'playlists':
                this.playlistsSection.classList.remove('hidden');
                this.navPlaylists.classList.add('active');
                break;
        }
    }

    applyColor(selectedColor) {
        this.constantColor = selectedColor;
        const colorbox = selectedColor;
        switch(colorbox.dataset.color){
            case '#FF1D89':
                if(this.isPlaying)
                    this.iconPlayer.src = '../img/reproductorPink.gif';
                else
                    this.iconPlayer.src = '../img/reproductorPinkPng.png';
                break;
            case '#C06CFF':
                if(this.isPlaying)
                    this.iconPlayer.src = '../img/reproductorMorado.gif';
                else
                    this.iconPlayer.src = '../img/reproductorMoradoPng.png';
                break;
            case '#101014':
                if(this.isPlaying)
                    this.iconPlayer.src = '../img/reproductorBlack.gif';
                else
                    this.iconPlayer.src = '../img/reproductorBlackPng.png';
                break;
            case '#FAF7F8':
                if(this.isPlaying)
                    this.iconPlayer.src = '../img/reproductorWhite.gif';
                else
                    this.iconPlayer.src = '../img/reproductorWhitePng.png';
                break;
            case '#57FFD9':
                if(this.isPlaying)
                    this.iconPlayer.src = '../img/reproductorAqua.gif';
                else
                    this.iconPlayer.src = '../img/reproductorAquaPng.png';
                break;
            case '#FF7F50':
                if(this.isPlaying)
                    this.iconPlayer.src = '../img/reproductorPeach.gif';
                else
                    this.iconPlayer.src = '../img/reproductorPeachPng.png';
                break;
        }
    }

    handleKeyboard(event) {
        if (!this.isConnected) return;

        // Don't handle shortcuts when typing in input fields
        if (event.target.tagName === 'INPUT') return;

        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextTrack();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousTrack();
                break;
        }
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    showError(message) {
        // Simple error display - you could enhance this with a proper modal
        alert(message);
    }
}

// Initialize the player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotifyPlayer();
});

// Initialize the SDK
window.onSpotifyWebPlaybackSDKReady = () => {
    console.log('Spotify Web Playback SDK is ready');
};

function updateSliderBg(value) {
    volumeSlider.style.background = `linear-gradient(to right, #ff1d89 ${value}%, #e5e7eb ${value}%)`;
}

