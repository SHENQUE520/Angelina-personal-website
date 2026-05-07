(function () {
    // ============ PLAYLIST DATA ============
    const PLAYLIST = [
        { src: 'music/aespa - Live My Life.mp3', title: 'Live My Life', artist: 'aespa' },
        { src: 'music/aespa - Whiplash.mp3', title: 'Whiplash', artist: 'aespa' },
        { src: 'music/aespa - BAHAMA.mp3', title: 'BAHAMA', artist: 'aespa' },
        { src: 'music/aespa - Just Another Girl.mp3', title: 'Just Another Girl', artist: 'aespa' },
        { src: 'music/i-dle - Allergy.mp3', title: 'Allergy', artist: '(G)I-DLE' },
        { src: 'music/i-dle - TOMBOY.mp3', title: 'TOMBOY', artist: '(G)I-DLE' },
        { src: 'music/ITZY - Imaginary Friend.mp3', title: 'Imaginary Friend', artist: 'ITZY' },
        { src: 'music/SEVENTEEN - 음악의 신 (God of Music).mp3', title: 'God of Music', artist: 'SEVENTEEN' },
        { src: 'music/G-DRAGON - HOME SWEET HOME (feat_ TAEYANG, DAESUNG).mp3', title: 'HOME SWEET HOME', artist: 'G-DRAGON' },
        { src: 'music/Henry Young _ Ashley Alisha - One More Last Time.ogg', title: 'One More Last Time', artist: 'Henry Young & Ashley Alisha' },
        { src: 'music/JVKE _ Annika Wells _ Kaden Hawke - her (feat_ Annika Wells & Kaden Hawke).ogg', title: 'her', artist: 'JVKE' },
        { src: 'music/Novo Amor - Carry You.ogg', title: 'Carry You', artist: 'Novo Amor' },
        { src: 'music/Nozomi Kitay _ Gal D _ 百足 - Moshi Moshi (feat_ 百足).ogg', title: 'Moshi Moshi', artist: 'Nozomi Kitay & Gal D' },
        { src: 'music/TOMORROW X TOGETHER - 永遠に光れ (永远闪耀).ogg', title: '永遠に光れ', artist: 'TXT' },
    ];

    function shuffled(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // ============ LANGUAGE ============
    let currentLang = 'en';
    const langToggleDesktop = document.getElementById('langToggleDesktop');
    const langToggleMobile = document.getElementById('langToggleMobile');
    const mobileNavPanel = document.getElementById('mobileNavPanel');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const allPageSections = document.querySelectorAll('.page-section');
    const topNav = document.getElementById('topNav');
    let currentPage = 'home';

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('wuYC_lang', lang);
        const toggleText = lang === 'en' ? '中文' : 'English';
        if (langToggleDesktop) langToggleDesktop.textContent = toggleText;
        if (langToggleMobile) langToggleMobile.textContent = toggleText;
        document.querySelectorAll('[data-en][data-zh]').forEach(el => {
            const enText = el.getAttribute('data-en');
            const zhText = el.getAttribute('data-zh');
            if (enText && zhText) el.textContent = lang === 'en' ? enText : zhText;
        });
        document.querySelectorAll('[data-en-placeholder][data-zh-placeholder]').forEach(el => {
            el.placeholder = lang === 'en' ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-zh-placeholder');
        });
        document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
        updateNavActiveState();
    }

    function toggleLanguage() { applyLanguage(currentLang === 'en' ? 'zh' : 'en'); }
    if (langToggleDesktop) langToggleDesktop.addEventListener('click', toggleLanguage);
    if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);

    // ============ NAVIGATION ============
    function navigateToPage(pageName, scrollTarget) {
        currentPage = pageName;
        allPageSections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById('page-' + pageName);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (scrollTarget) {
                setTimeout(() => {
                    const el = document.getElementById(scrollTarget);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400);
            }
        }
        updateNavActiveState();
        if (mobileNavPanel) mobileNavPanel.classList.remove('open');
        if (hamburgerBtn) hamburgerBtn.classList.remove('open');
        document.body.classList.remove('no-scroll');
        updateBodyClass(pageName);
        updateNavStyling(pageName);
        if (history.pushState) history.pushState(null, null, '#' + pageName);
        if (pageName === 'travel') {
            VideoManager.start();
            MusicPlayer.pauseForVideo();
        } else {
            VideoManager.stop();
            MusicPlayer.resumeAfterVideo();
        }
        if (pageName !== 'family') FriendVideo.deactivate();
    }

    function updateNavActiveState() {
        document.querySelectorAll('[data-page]').forEach(a => {
            a.classList.toggle('active', a.getAttribute('data-page') === currentPage);
        });
    }

    function updateBodyClass(pageName) {
        document.body.classList.remove('page-travel', 'page-family');
        if (pageName === 'travel') document.body.classList.add('page-travel');
        else if (pageName === 'family') document.body.classList.add('page-family');
    }

    function updateNavStyling(pageName) {
        if (!topNav) return;
        const navLinksAll = topNav.querySelectorAll('.nav-links a');
        const navLogo = topNav.querySelector('.nav-logo');
        const langTog = topNav.querySelector('.lang-toggle');
        topNav.style.background = '';
        topNav.style.borderBottomColor = '';
        topNav.style.boxShadow = '';
        navLinksAll.forEach(a => { a.style.color = ''; });
        if (navLogo) navLogo.style.color = '';
        if (langTog) { langTog.style.background = ''; langTog.style.color = ''; langTog.style.borderColor = ''; langTog.style.boxShadow = ''; }
        if (pageName === 'travel') {
            topNav.style.background = '#F5F0E8';
            topNav.style.borderBottomColor = '#D5CDC0';
            topNav.style.boxShadow = '0px 4px 0px 0px #C5BDB0';
            navLinksAll.forEach(a => { a.style.color = '#2C2416'; });
            if (navLogo) navLogo.style.color = '#2C2416';
            if (langTog) { langTog.style.background = 'transparent'; langTog.style.color = '#2C2416'; langTog.style.borderColor = '#2C2416'; langTog.style.boxShadow = '3px 3px 0px 0px #C5BDB0'; }
        } else if (pageName === 'family') {
            topNav.style.background = '#1A3C2A';
            topNav.style.borderBottomColor = '#2D5A3F';
            topNav.style.boxShadow = '0px 4px 0px 0px #1E4530';
            navLinksAll.forEach(a => { a.style.color = '#C8DCC8'; });
            if (navLogo) navLogo.style.color = '#E8F0E4';
            if (langTog) { langTog.style.background = 'transparent'; langTog.style.color = '#E8F0E4'; langTog.style.borderColor = '#E8F0E4'; langTog.style.boxShadow = '3px 3px 0px 0px #2D5A3F'; }
        }
    }

    document.addEventListener('click', function (e) {
        const link = e.target.closest('[data-page]');
        if (link) {
            const page = link.getAttribute('data-page');
            if (page && document.getElementById('page-' + page)) { e.preventDefault(); navigateToPage(page); }
        }
    });

    if (hamburgerBtn && mobileNavPanel) {
        hamburgerBtn.addEventListener('click', function () {
            const isOpen = mobileNavPanel.classList.contains('open');
            mobileNavPanel.classList.toggle('open', !isOpen);
            hamburgerBtn.classList.toggle('open', !isOpen);
            document.body.classList.toggle('no-scroll', !isOpen);
        });
        mobileNavPanel.addEventListener('click', function (e) {
            if (e.target.closest('[data-page]')) {
                mobileNavPanel.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth > 860 && mobileNavPanel) {
            mobileNavPanel.classList.remove('open');
            if (hamburgerBtn) hamburgerBtn.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
    });

    window.addEventListener('popstate', function () {
        const hash = window.location.hash.replace('#', '');
        navigateToPage((hash && document.getElementById('page-' + hash)) ? hash : 'home');
    });

    // ============ VIDEO MANAGER (travel bg) ============
    const VideoManager = {
        el: document.getElementById('travelVideoBg'),
        hasStarted: false,

        start() {
            if (!this.el) return;
            this.el.currentTime = 0;
            this.el.muted = false;
            this.el.play().catch(() => { this.el.muted = true; this.el.play().catch(() => {}); });
            this.hasStarted = true;
        },

        stop() {
            if (!this.el) return;
            this.el.pause();
            this.el.currentTime = 0;
            this.el.muted = true;
        },

        unmute() { if (this.el) { this.el.muted = false; } },
        mute() { if (this.el) { this.el.muted = true; } }
    };

    // ============ TRAVEL VIDEO CONTROLS ============
    function initVideoControls(videoEl, playBtn, progressEl, muteBtn, fullscreenBtn) {
        if (!videoEl) return;
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (videoEl.paused) { videoEl.play(); playBtn.textContent = '⏸'; }
                else { videoEl.pause(); playBtn.textContent = '▶'; }
            });
        }
        if (progressEl) {
            videoEl.addEventListener('timeupdate', () => {
                if (videoEl.duration) progressEl.value = (videoEl.currentTime / videoEl.duration) * 100;
            });
            progressEl.addEventListener('input', () => {
                if (videoEl.duration) videoEl.currentTime = (progressEl.value / 100) * videoEl.duration;
            });
        }
        if (muteBtn) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                videoEl.muted = !videoEl.muted;
                muteBtn.textContent = videoEl.muted ? '🔇' : '🔊';
            });
        }
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (videoEl.requestFullscreen) videoEl.requestFullscreen();
                else if (videoEl.webkitRequestFullscreen) videoEl.webkitRequestFullscreen();
            });
        }
        // Click video to fullscreen
        videoEl.addEventListener('click', () => {
            if (videoEl.requestFullscreen) videoEl.requestFullscreen();
            else if (videoEl.webkitRequestFullscreen) videoEl.webkitRequestFullscreen();
        });
    }

    // ============ FRIEND VIDEO ============
    const FriendVideo = {
        el: document.getElementById('friendVideo'),
        isActive: false,

        deactivate() {
            if (!this.el) return;
            this.isActive = false;
            this.el.pause();
            this.el.muted = true;
            MusicPlayer.resumeAfterVideo();
            const btn = document.getElementById('friendPlayBtn');
            if (btn) btn.textContent = '▶';
        },

        activate() {
            if (!this.el) return;
            this.isActive = true;
            MusicPlayer.pauseForVideo();
            this.el.muted = false;
            this.el.play().catch(() => { this.el.muted = true; this.el.play().catch(() => {}); });
            const btn = document.getElementById('friendPlayBtn');
            if (btn) btn.textContent = '⏸';
        },

        init() {
            if (!this.el) return;
            initVideoControls(
                this.el,
                document.getElementById('friendPlayBtn'),
                document.getElementById('friendProgress'),
                document.getElementById('friendMuteBtn'),
                document.getElementById('friendFullscreenBtn')
            );
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && currentPage === 'family') this.activate();
                    else this.deactivate();
                });
            }, { threshold: 0.5 });
            observer.observe(this.el);
        }
    };

    // ============ MUSIC PLAYER ============
    const MusicPlayer = {
        audio: document.getElementById('bgAudio'),
        disc: document.getElementById('cdDisc'),
        qqDisc: document.getElementById('qqDisc'),
        playPauseBtn: document.getElementById('cdPlayPauseBtn'),
        playIcon: document.getElementById('cdPlayIcon'),
        nowPlaying: document.getElementById('cdNowPlaying'),
        qqTitle: document.getElementById('qqTitle'),
        qqArtist: document.getElementById('qqArtist'),
        discWrap: document.getElementById('cdDiscWrap'),
        isPlaying: false,
        wasPlayingBeforeVideo: false,
        currentIndex: 0,
        shuffleOrder: [],

        buildShuffleOrder() {
            const rest = shuffled(PLAYLIST.slice(1).map((_, i) => i + 1));
            this.shuffleOrder = [0, ...rest];
        },

        nextShuffleIndex() {
            const pos = this.shuffleOrder.indexOf(this.currentIndex);
            const nextPos = (pos + 1) % this.shuffleOrder.length;
            return this.shuffleOrder[nextPos];
        },

        prevShuffleIndex() {
            const pos = this.shuffleOrder.indexOf(this.currentIndex);
            const prevPos = (pos - 1 + this.shuffleOrder.length) % this.shuffleOrder.length;
            return this.shuffleOrder[prevPos];
        },

        nextTrack() {
            const next = this.nextShuffleIndex();
            this.currentIndex = next;
            this.loadTrack(next);
            if (this.isPlaying) this.play();
            HobbyPlaylist.updateActive();
            CDPopup.refresh();
        },

        prevTrack() {
            const prev = this.prevShuffleIndex();
            this.currentIndex = prev;
            this.loadTrack(prev);
            if (this.isPlaying) this.play();
            HobbyPlaylist.updateActive();
            CDPopup.refresh();
        },

        init() {
            if (!this.audio) return;
            this.buildShuffleOrder();
            this.loadTrack(0);

            if (this.discWrap) {
                this.discWrap.addEventListener('click', (e) => {
                    if (e.target.closest('#cdPlayPauseBtn')) return;
                    navigateToPage('hobbies', 'playlist-section');
                });
            }

            if (this.playPauseBtn) {
                this.playPauseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle();
                });
            }

            const qqPlayPauseBtn = document.getElementById('qqPlayPauseBtn');
            if (qqPlayPauseBtn) {
                qqPlayPauseBtn.addEventListener('click', () => this.toggle());
            }

            const qqPrevBtn = document.getElementById('qqPrevBtn');
            if (qqPrevBtn) {
                qqPrevBtn.addEventListener('click', () => this.prevTrack());
            }

            const qqNextBtn = document.getElementById('qqNextBtn');
            if (qqNextBtn) {
                qqNextBtn.addEventListener('click', () => this.nextTrack());
            }

            this.audio.addEventListener('ended', () => {
                this.nextTrack();
            });

            // Autoplay
            this.audio.play().then(() => {
                this.isPlaying = true;
                this._setPlayingUI(true);
            }).catch(() => {
                const tryAutoplay = () => {
                    if (!this.isPlaying) this.play();
                    document.removeEventListener('click', tryAutoplay);
                    document.removeEventListener('keydown', tryAutoplay);
                    document.removeEventListener('touchstart', tryAutoplay);
                };
                document.addEventListener('click', tryAutoplay);
                document.addEventListener('keydown', tryAutoplay);
                document.addEventListener('touchstart', tryAutoplay);
            });
        },

        loadTrack(index) {
            const song = PLAYLIST[index];
            this.currentIndex = index;
            this.audio.src = song.src;
            if (this.nowPlaying) this.nowPlaying.textContent = song.title;
            if (this.qqTitle) this.qqTitle.textContent = song.title;
            if (this.qqArtist) this.qqArtist.textContent = song.artist;
        },

        _setPlayingUI(playing) {
            if (this.disc) this.disc.classList.toggle('playing', playing);
            if (this.qqDisc) this.qqDisc.classList.toggle('playing', playing);
            if (this.playIcon) this.playIcon.textContent = playing ? '⏸' : '▶';
            if (this.playPauseBtn) this.playPauseBtn.classList.toggle('playing', playing);
            const qqPlayPauseBtn = document.getElementById('qqPlayPauseBtn');
            if (qqPlayPauseBtn) qqPlayPauseBtn.textContent = playing ? '⏸' : '▶';
        },

        play() {
            if (currentPage === 'travel') return;
            if (FriendVideo.isActive) return;
            this.audio.play().then(() => {
                this.isPlaying = true;
                this._setPlayingUI(true);
            }).catch(() => {});
        },

        pause() {
            this.audio.pause();
            this.isPlaying = false;
            this._setPlayingUI(false);
        },

        toggle() { if (this.isPlaying) this.pause(); else this.play(); },

        pauseForVideo() {
            this.wasPlayingBeforeVideo = this.isPlaying;
            if (this.isPlaying) this.pause();
        },

        resumeAfterVideo() {
            if (this.wasPlayingBeforeVideo) this.play();
            this.wasPlayingBeforeVideo = false;
        }
    };

    // ============ CD HOVER POPUP ============
    const CDPopup = {
        container: document.getElementById('cdPopupTracks'),
        picks: [],

        refresh() {
            this.picks = shuffled(PLAYLIST).slice(0, 3);
            this.render();
        },

        render() {
            if (!this.container) return;
            this.container.innerHTML = '';
            this.picks.forEach(song => {
                const idx = PLAYLIST.indexOf(song);
                const div = document.createElement('div');
                div.className = 'cd-popup-track' + (idx === MusicPlayer.currentIndex ? ' active' : '');
                div.innerHTML = `<span class="cd-popup-track-name">${song.title}</span><span class="cd-popup-track-artist">${song.artist}</span>`;
                div.addEventListener('click', () => {
                    MusicPlayer.loadTrack(idx);
                    MusicPlayer.play();
                    HobbyPlaylist.updateActive();
                    this.render();
                });
                this.container.appendChild(div);
            });
        },

        init() {
            this.refresh();
            // Refresh picks each time popup becomes visible
            const player = document.getElementById('cdPlayer');
            if (player) {
                player.addEventListener('mouseenter', () => this.refresh());
            }
        }
    };

    // ============ HOBBY PLAYLIST (QQ Music style) ============
    const HobbyPlaylist = {
        grid: document.getElementById('hobbyPlaylistGrid'),
        refreshBtn: document.getElementById('playlistRefreshBtn'),
        currentSample: [],

        renderTracks(songs) {
            if (!this.grid) return;
            this.grid.innerHTML = '';
            songs.forEach((song, i) => {
                const idx = PLAYLIST.indexOf(song);
                const isActive = idx === MusicPlayer.currentIndex;
                const row = document.createElement('div');
                row.className = 'qqmusic-track' + (isActive ? ' active' : '');
                row.innerHTML = `
                    <span class="qqmusic-track-num">${i + 1}</span>
                    <div class="qqmusic-track-info">
                        <div class="qqmusic-track-title">${song.title}</div>
                        <div class="qqmusic-track-artist">${song.artist}</div>
                    </div>
                    <span class="qqmusic-track-play">${isActive && MusicPlayer.isPlaying ? '▶' : ''}</span>
                `;
                row.addEventListener('click', () => {
                    MusicPlayer.loadTrack(idx);
                    MusicPlayer.play();
                    this.updateActive();
                });
                this.grid.appendChild(row);
            });
        },

        updateActive() {
            if (!this.grid) return;
            this.grid.querySelectorAll('.qqmusic-track').forEach((row, i) => {
                const song = this.currentSample[i];
                if (!song) return;
                const idx = PLAYLIST.indexOf(song);
                const isActive = idx === MusicPlayer.currentIndex;
                row.classList.toggle('active', isActive);
                row.querySelector('.qqmusic-track-play').textContent = (isActive && MusicPlayer.isPlaying) ? '▶' : '';
            });
        },

        refresh() {
            this.currentSample = shuffled(PLAYLIST);
            this.renderTracks(this.currentSample);
        },

        init() {
            this.refresh();
            if (this.refreshBtn) this.refreshBtn.addEventListener('click', () => this.refresh());
        }
    };

    // ============ LIKE HEART ============
    const LikeHeart = {
        btn: document.getElementById('likeHeart'),
        countEl: document.getElementById('likeCount'),
        count: parseInt(localStorage.getItem('wuYC_likes') || '0'),
        liked: localStorage.getItem('wuYC_liked') === '1',

        init() {
            if (!this.btn) return;
            this.render();
            this.btn.addEventListener('click', () => {
                if (this.liked) {
                    this.count = Math.max(0, this.count - 1);
                    this.liked = false;
                } else {
                    this.count++;
                    this.liked = true;
                    this.btn.classList.add('pop');
                    setTimeout(() => this.btn.classList.remove('pop'), 400);
                }
                localStorage.setItem('wuYC_likes', this.count);
                localStorage.setItem('wuYC_liked', this.liked ? '1' : '0');
                this.render();
            });
        },

        render() {
            if (this.countEl) this.countEl.textContent = this.count;
            if (this.btn) this.btn.classList.toggle('liked', this.liked);
        }
    };

    // ============ INIT ============
    function init() {
        applyLanguage(currentLang);
        const hash = window.location.hash.replace('#', '');
        const initialPage = (hash && document.getElementById('page-' + hash)) ? hash : 'home';
        navigateToPage(initialPage);
        MusicPlayer.init();
        HobbyPlaylist.init();
        FriendVideo.init();
        CDPopup.init();
        LikeHeart.init();

        // Travel video controls
        initVideoControls(
            document.getElementById('travelVideoBg'),
            document.getElementById('travelPlayBtn'),
            document.getElementById('travelProgress'),
            document.getElementById('travelMuteBtn'),
            document.getElementById('travelFullscreenBtn')
        );
    }

    init();
})();
