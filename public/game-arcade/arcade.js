import { CATEGORIES } from './levels.js';
import { WebHaptics, defaultPatterns } from 'https://esm.sh/web-haptics';

// ==========================================
// SOUND ENGINE
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.haptics = new WebHaptics();
  }
  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
    // WebHaptics needs an interaction to enable audio-based fallback context
    this.haptics.trigger(defaultPatterns.light);
  }
  _note(freq, type, duration, volume, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }
  click() { 
    this._note(600, 'sine', 0.1, 0.05); 
    this.haptics.trigger(defaultPatterns.light);
  }
  select() { 
    this._note(400, 'sine', 0.1, 0.02); 
    this.haptics.trigger(defaultPatterns.selection);
  }
  found() { 
    this._note(523.25, 'sine', 0.15, 0.1, 0); // C5
    this._note(659.25, 'sine', 0.15, 0.1, 0.1); // E5
    this._note(783.99, 'sine', 0.3, 0.1, 0.2); // G5
    this.haptics.trigger(defaultPatterns.success);
  }
  error() { 
    this._note(150, 'sawtooth', 0.2, 0.05); 
    this.haptics.trigger(defaultPatterns.error);
  }
  blast() { 
    this._note(100, 'square', 0.4, 0.15, 0); 
    this._note(50, 'sawtooth', 0.6, 0.2, 0.1); 
    this.haptics.trigger(defaultPatterns.heavy);
  }
  freeze() {
    this._note(1200, 'sine', 0.1, 0.08, 0);
    this._note(1600, 'sine', 0.2, 0.08, 0.1);
    this._note(2400, 'sine', 0.4, 0.05, 0.2);
    this.haptics.trigger(defaultPatterns.rigid);
  }
  pathReveal() {
    this._note(880, 'sine', 0.1, 0.05, 0);
    this._note(1320, 'sine', 0.1, 0.05, 0.1);
    this._note(1760, 'sine', 0.3, 0.05, 0.2);
    this.haptics.trigger(defaultPatterns.nudge);
  }
  xray() {
    this._note(400, 'triangle', 0.1, 0.05, 0);
    this._note(600, 'triangle', 0.3, 0.05, 0.1);
    this.haptics.trigger(defaultPatterns.medium);
  }
  hint() {
    this._note(900, 'sine', 0.1, 0.08, 0);
    this._note(1200, 'sine', 0.2, 0.08, 0.1);
    this.haptics.trigger(defaultPatterns.nudge);
  }
  powerup() {
    this._note(880, 'sine', 0.1, 0.1, 0);
    this._note(1760, 'sine', 0.2, 0.1, 0.1);
    this.haptics.trigger(defaultPatterns.heavy);
  }
  win() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this._note(freq, 'sine', 0.4, 0.1, i * 0.15);
    });
    this.haptics.trigger(defaultPatterns.success);
  }
  gameOver() {
    this._note(300, 'sawtooth', 0.3, 0.1, 0);
    this._note(250, 'sawtooth', 0.3, 0.1, 0.3);
    this._note(200, 'sawtooth', 0.6, 0.1, 0.6);
    this.haptics.trigger(defaultPatterns.error);
  }
}

// ==========================================
// CONFETTI SYSTEM
// ==========================================
class ConfettiSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.colors = ['#22d3ee', '#e879f9', '#fbbf24', '#4ade80', '#ffffff'];
  }
  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  burst(count = 100) {
    this.resize();
    for (let i = 0; i < count; i++) {
        this.particles.push({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            size: Math.random() * 8 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * 360,
            rv: (Math.random() - 0.5) * 10
        });
    }
    if (!this.running) {
        this.running = true;
        this._animate();
    }
  }
  _animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let active = false;
    for (let p of this.particles) {
        p.vy += 0.4;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rv;
        if (p.y < this.canvas.height) active = true;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation * Math.PI / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        this.ctx.restore();
    }
    if (active) requestAnimationFrame(() => this._animate());
    else this.running = false;
  }
  stop() { this.running = false; this.particles = []; }
}

// ==========================================
// BOARD GENERATOR
// ==========================================
function generateBoard(cols, rows, words) {
  const ALL_DIRS = [
    [1,1],[-1,1],[1,-1],[-1,-1],
    [0,1],[1,0],[0,-1],[-1,0]
  ];

  const maxWordLen = Math.max(...words.map(w => w.length));
  const effectiveCols = Math.max(cols, maxWordLen);
  const effectiveRows = Math.max(rows, maxWordLen);

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function cellKey(r, c) { return r * 1000 + c; }

  function tryGenerate() {
    const grid = Array(effectiveRows).fill(null).map(() => Array(effectiveCols).fill(''));
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const placedWords = [];
    const placedPaths = [];

    for (const word of sortedWords) {
      const w = word.toUpperCase();
      const placement = findBestPlacement(grid, w, placedPaths);
      if (!placement) return null;

      const pathSet = new Set();
      for (let i = 0; i < w.length; i++) {
        const pos = placement.positions[i];
        grid[pos.r][pos.c] = w[i];
        pathSet.add(cellKey(pos.r, pos.c));
      }
      placedWords.push({ word: w, positions: placement.positions });
      placedPaths.push(pathSet);
    }

    return { grid, placedWords };
  }

  function findBestPlacement(grid, word, placedPaths) {
    const candidates = [];
    const starts = [];
    for (let r = 0; r < effectiveRows; r++)
      for (let c = 0; c < effectiveCols; c++)
        starts.push([r, c]);
    shuffle(starts);
    const dirs = shuffle([...ALL_DIRS]);

    for (const [r, c] of starts) {
      for (const [dr, dc] of dirs) {
        const endR = r + dr * (word.length - 1);
        const endC = c + dc * (word.length - 1);
        if (endR < 0 || endR >= effectiveRows || endC < 0 || endC >= effectiveCols) continue;

        let valid = true;
        const positions = [];
        const newPathSet = new Set();
        let overlapCount = 0;

        for (let i = 0; i < word.length; i++) {
          const cr = r + dr * i;
          const cc = c + dc * i;
          const cell = grid[cr][cc];
          if (cell !== '' && cell !== word[i]) { valid = false; break; }
          if (cell !== '') overlapCount++;
          positions.push({ r: cr, c: cc });
          newPathSet.add(cellKey(cr, cc));
        }
        if (!valid) continue;

        let pathConflict = false;
        for (const existingPath of placedPaths) {
          let newInExisting = true;
          for (const k of newPathSet) {
            if (!existingPath.has(k)) { newInExisting = false; break; }
          }
          let existingInNew = true;
          for (const k of existingPath) {
            if (!newPathSet.has(k)) { existingInNew = false; break; }
          }
          if (newInExisting || existingInNew) { pathConflict = true; break; }

          let shared = 0;
          for (const k of newPathSet) {
            if (existingPath.has(k)) {
              shared++;
              if (shared > 1) break;
            }
          }
          if (shared > 1) { pathConflict = true; break; }
        }
        if (pathConflict) continue;

        const isDiag = (dr !== 0 && dc !== 0) ? 1 : 0;
        const score = isDiag * 10 - overlapCount * 5 + Math.random() * 8;
        candidates.push({ positions, score });
        if (candidates.length >= 40) break;
      }
      if (candidates.length >= 40) break;
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    const topN = Math.min(candidates.length, 5);
    return candidates[Math.floor(Math.random() * topN)];
  }

  let result = null;
  for (let attempt = 0; attempt < 100; attempt++) {
    result = tryGenerate();
    if (result) break;
  }

  if (!result) {
    const grid = Array(effectiveRows).fill(null).map(() => Array(effectiveCols).fill(''));
    const placedWords = [];
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    for (const word of sortedWords) {
      const w = word.toUpperCase();
      let placed = false;
      for (let r = 0; r < effectiveRows && !placed; r++) {
        for (let c = 0; c <= effectiveCols - w.length && !placed; c++) {
          let canPlace = true;
          for (let i = 0; i < w.length; i++) {
            if (grid[r][c + i] !== '' && grid[r][c + i] !== w[i]) { canPlace = false; break; }
          }
          if (canPlace) {
            const positions = [];
            for (let i = 0; i < w.length; i++) {
              grid[r][c + i] = w[i];
              positions.push({ r, c: c + i });
            }
            placedWords.push({ word: w, positions });
            placed = true;
          }
        }
      }
      if (!placed) placedWords.push({ word: w.toUpperCase(), positions: [] });
    }
    result = { grid, placedWords };
  }

  const FILL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < effectiveRows; r++) {
    for (let c = 0; c < effectiveCols; c++) {
      if (result.grid[r][c] === '') {
        result.grid[r][c] = FILL[Math.floor(Math.random() * FILL.length)];
      }
    }
  }

  result.cols = effectiveCols;
  result.rows = effectiveRows;
  return result;
}

// ==========================================
// ARCADE GAME ENGINE
// ==========================================
const WORD_COLORS = ['yellow', 'purple', 'lightblue'];

const DEFAULT_POWERS = {
  blast: 2,
  xray: 2,
  pathfinder: 1,
  freeze: 2,
  hint: 3
};

class ArcadeEngine {
  constructor() {
    this.sound = new SoundEngine();
    this.confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));
    
    this.state = {
        level: null,
        board: null,
        foundWords: new Set(),
        tileWordCounts: {},
        
        isDragging: false,
        startTile: null,
        currentPath: [],
        pathHasCrossing: false,
        svgLines: [],
        
        // Arcade state
        score: 0,
        combo: 0,
        comboMultiplier: 1,
        timeLeft: 0,
        timerInterval: null,
        timerFrozen: false,
        timerFreezeTimeout: null,
        comboTimeout: null,
        activePower: null,
        powers: { ...DEFAULT_POWERS },
        hintsUsed: 0,
        
        unlockedLevels: this.loadProgress(),
    };
    
    this.initDOM();
    this.bindEvents();
    this.renderMenu();
  }

  initDOM() {
    this.screens = {
        menu: document.getElementById('menu-screen'),
        level: document.getElementById('level-screen'),
        game: document.getElementById('game-screen'),
        gameover: document.getElementById('gameover-screen'),
        win: document.getElementById('win-screen')
    };
    
    this.catGrid = document.getElementById('category-grid');
    this.lvlGrid = document.getElementById('level-grid');
    this.gridEl = document.getElementById('letter-grid');
    this.progressDots = document.getElementById('progress-dots');
    this.progressCount = document.getElementById('progress-count');
    this.svgOverlay = document.getElementById('swipe-overlay');
    
    this.scoreVal = document.getElementById('score-value');
    this.comboDisplay = document.getElementById('combo-display');
    this.comboText = document.getElementById('combo-text');
    this.timerDisplay = document.getElementById('timer-display');
    this.timerVal = document.getElementById('timer-value');
    
    this.powerBtns = {
      blast: document.getElementById('pw-blast'),
      xray: document.getElementById('pw-xray'),
      pathfinder: document.getElementById('pw-pathfinder'),
      freeze: document.getElementById('pw-freeze'),
      hint: document.getElementById('pw-hint')
    };
  }

  loadProgress() {
    let saved = {};
    try {
      const raw = localStorage.getItem('fillwords_arcade_progress');
      if (raw) saved = JSON.parse(raw);
    } catch(e) {}
    const progress = { ...saved };
    CATEGORIES.forEach(cat => {
      if (!progress[cat.slug] || !Array.isArray(progress[cat.slug]) || progress[cat.slug].length === 0) {
        progress[cat.slug] = [cat.levels[0].id];
      }
    });
    return progress;
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('fillwords_arcade_stats');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { levelsPlayed: 0, highestScore: 0, streak: 0, lastPlayedDate: null };
  }

  saveStats(stats) {
    localStorage.setItem('fillwords_arcade_stats', JSON.stringify(stats));
  }

  saveProgress() {
    localStorage.setItem('fillwords_arcade_progress', JSON.stringify(this.state.unlockedLevels));
  }

  updateStats(won, finalScore) {
    const stats = this.loadStats();
    stats.levelsPlayed++;
    if (finalScore > stats.highestScore) stats.highestScore = finalScore;
    
    const today = new Date().toISOString().split('T')[0];
    if (won && stats.lastPlayedDate !== today) {
      if (stats.lastPlayedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
        stats.streak++;
      } else {
        stats.streak = 1;
      }
      stats.lastPlayedDate = today;
    }
    this.saveStats(stats);
  }

  getDailyPuzzle() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const allLevels = CATEGORIES.flatMap(cat => cat.levels.map(lvl => ({ cat, lvl })));
    return allLevels[seed % allLevels.length];
  }

  unlockNextLevel(currentLevel) {
    let catSlug = null;
    let nextLvlId = null;
    for (const cat of CATEGORIES) {
      const idx = cat.levels.findIndex(l => l.id === currentLevel.id);
      if (idx !== -1) {
        catSlug = cat.slug;
        if (idx < cat.levels.length - 1) nextLvlId = cat.levels[idx + 1].id;
        break;
      }
    }
    if (catSlug && nextLvlId) {
      if (!this.state.unlockedLevels[catSlug]) this.state.unlockedLevels[catSlug] = [];
      if (!this.state.unlockedLevels[catSlug].includes(nextLvlId)) {
        this.state.unlockedLevels[catSlug].push(nextLvlId);
        this.saveProgress();
      }
    }
  }

  switchScreen(id) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[id].classList.add('active');
  }

  bindEvents() {
    document.getElementById('back-to-menu').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('menu');
    });
    document.getElementById('back-to-levels').addEventListener('click', () => {
        this.sound.click(); this.endGame(); this.switchScreen('level');
    });
    
    document.getElementById('back-to-menu-win').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('menu'); this.renderMenu();
    });
    document.getElementById('go-back-menu').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('menu'); this.renderMenu();
    });
    
    document.getElementById('play-again').addEventListener('click', () => {
        this.sound.click(); this.loadLevel(this.state.level);
    });
    document.getElementById('retry-level').addEventListener('click', () => {
        this.sound.click(); this.loadLevel(this.state.level);
    });
    document.getElementById('next-level').addEventListener('click', () => {
        this.sound.click();
        const cat = CATEGORIES.find(c => c.levels.some(l => l.id === this.state.level.id));
        const idx = cat.levels.findIndex(l => l.id === this.state.level.id);
        if (idx < cat.levels.length - 1) {
            this.loadLevel(cat.levels[idx + 1]);
        } else {
            this.switchScreen('menu'); this.renderMenu();
        }
    });

    const boardPanel = document.getElementById('board-container');
    boardPanel.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    boardPanel.addEventListener('contextmenu', e => e.preventDefault());

    // Power-ups
    Object.values(this.powerBtns).forEach(btn => {
      btn.addEventListener('click', () => this.usePowerUp(btn.dataset.power));
    });
  }

  // --- UI Update Methods --- //
  renderMenu() {
    const stats = this.loadStats();
    document.getElementById('stat-levels').textContent = stats.levelsPlayed;
    document.getElementById('stat-highscore').textContent = stats.highestScore;
    document.getElementById('stat-streak').textContent = stats.streak;

    const daily = this.getDailyPuzzle();
    document.getElementById('potd-meta').textContent = `${daily.cat.name} · ${daily.lvl.title}`;
    
    document.getElementById('potd-play-btn').onclick = () => {
      this.sound.init(); this.sound.click();
      if (!this.state.unlockedLevels[daily.cat.slug]) this.state.unlockedLevels[daily.cat.slug] = [];
      if (!this.state.unlockedLevels[daily.cat.slug].includes(daily.lvl.id)) {
        this.state.unlockedLevels[daily.cat.slug].push(daily.lvl.id);
        this.saveProgress();
      }
      this.loadLevel(daily.lvl);
    };

    this.catGrid.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const pill = document.createElement('div');
      pill.className = 'category-card';
      pill.innerHTML = `
        <div class="cat-body">
          <span class="cat-emoji">${cat.emoji || '⚡'}</span>
          <span class="cat-name">${cat.name}</span>
        </div>
      `;
      pill.addEventListener('click', () => {
        this.sound.init(); this.sound.click();
        this.renderLevelSelect(cat);
      });
      this.catGrid.appendChild(pill);
    });
  }

  renderLevelSelect(cat) {
    document.getElementById('level-cat-name').textContent = `${cat.emoji || ''} ${cat.name}`;
    this.lvlGrid.innerHTML = '';
    
    cat.levels.forEach((lvl) => {
      const isUnlocked = this.state.unlockedLevels[cat.slug]?.includes(lvl.id);
      
      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="level-title">${isUnlocked ? '' : '🔒 '} ${lvl.title}</div>
        <div class="level-meta-right">
          <span class="level-diff">${lvl.difficulty}</span>
        </div>
      `;
      
      if (isUnlocked) {
        card.addEventListener('click', () => {
          this.sound.click(); this.loadLevel(lvl);
        });
      }
      this.lvlGrid.appendChild(card);
    });
    this.switchScreen('level');
  }

  // --- Game Core --- //
  loadLevel(level) {
    this.endGame(); // clear timers
    this.state.level = level;
    this.state.foundWords.clear();
    this.state.svgLines = [];
    this.state.tileWordCounts = {};
    
    // Reset arcade mechanics
    this.state.score = 0;
    this.state.combo = 0;
    this.state.comboMultiplier = 1;
    this.state.powers = { ...DEFAULT_POWERS };
    this.state.hintsUsed = 0;
    this.state.timerFrozen = false;
    this.state.activePower = null;
    
    // Set timer based on difficulty
    const diff = level.difficulty.toLowerCase();
    if (diff === 'easy') this.state.timeLeft = 120;
    else if (diff === 'medium') this.state.timeLeft = 90;
    else if (diff === 'hard') this.state.timeLeft = 75;
    else this.state.timeLeft = 60;

    this.state.board = generateBoard(level.cols, level.rows, level.words);
    const actualCols = this.state.board.cols || level.cols;
    const actualRows = this.state.board.rows || level.rows;
    
    this.gridEl.style.gridTemplateColumns = `repeat(${actualCols}, 1fr)`;
    this.gridEl.innerHTML = '';
    
    for (let r=0; r<actualRows; r++) {
        for (let c=0; c<actualCols; c++) {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.dataset.r = r;
            tile.dataset.c = c;
            tile.textContent = this.state.board.grid[r][c];
            this.gridEl.appendChild(tile);
        }
    }
    
    this.updateProgressUI();
    this.updateScoreUI();
    this.updateTimerUI();
    this.updatePowerUpsUI();
    this.updateSVG();
    
    this.switchScreen('game');
    
    gsap.fromTo('.letter-tile', 
      { opacity: 0, scale: 0.5 }, 
      { opacity: 1, scale: 1, stagger: 0.02, duration: 0.4, ease: 'back.out(1.5)' }
    );
    
    this.startTimer();
  }

  endGame() {
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);
    if (this.state.timerFreezeTimeout) clearTimeout(this.state.timerFreezeTimeout);
    if (this.state.comboTimeout) clearTimeout(this.state.comboTimeout);
  }

  // --- Timers & Scoring --- //
  startTimer() {
    this.state.timerInterval = setInterval(() => {
      if (!this.state.timerFrozen) {
        this.state.timeLeft--;
        this.updateTimerUI();
        if (this.state.timeLeft <= 0) this.triggerGameOver();
      }
    }, 1000);
  }

  updateTimerUI() {
    const m = Math.floor(this.state.timeLeft / 60);
    const s = this.state.timeLeft % 60;
    this.timerVal.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    
    this.timerDisplay.className = 'timer-display';
    if (this.state.timerFrozen) this.timerDisplay.classList.add('frozen');
    else if (this.state.timeLeft <= 15) this.timerDisplay.classList.add('urgent');
  }

  updateProgressUI() {
    const total = this.state.level.words.length;
    const found = this.state.foundWords.size;
    
    this.progressCount.textContent = `${found} / ${total}`;
    
    // Only re-render dots if count mismatch to preserve animations
    if (this.progressDots.children.length !== total) {
      this.progressDots.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        this.progressDots.appendChild(dot);
      }
    }
    
    // Update dot states
    const dots = this.progressDots.children;
    for (let i = 0; i < total; i++) {
      if (i < found && !dots[i].classList.contains('found')) {
        dots[i].classList.add('found');
      }
    }
  }

  updateScoreUI() {
    this.scoreVal.textContent = this.state.score;
    if (this.state.comboMultiplier > 1) {
      this.comboDisplay.style.display = 'flex';
      this.comboText.textContent = `×${this.state.comboMultiplier}`;
      gsap.fromTo(this.comboDisplay, {scale: 1.3}, {scale: 1, duration: 0.3, ease: 'bounce.out'});
    } else {
      this.comboDisplay.style.display = 'none';
    }
  }

  addScore(points, triggerEl) {
    const finalPoints = Math.floor(points * this.state.comboMultiplier);
    this.state.score += finalPoints;
    this.updateScoreUI();
    
    // Floating text animation
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      const popup = document.createElement('div');
      popup.className = 'score-popup';
      popup.textContent = `+${finalPoints}`;
      popup.style.left = `${rect.left}px`;
      popup.style.top = `${rect.top}px`;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 800);
    }
  }

  registerFindScore(endTileEl) {
    this.state.combo++;
    if (this.state.combo >= 3) this.state.comboMultiplier = 2;
    else if (this.state.combo >= 2) this.state.comboMultiplier = 1.5;
    
    this.addScore(100, endTileEl);
    
    if (this.state.comboTimeout) clearTimeout(this.state.comboTimeout);
    this.state.comboTimeout = setTimeout(() => {
      this.state.combo = 0;
      this.state.comboMultiplier = 1;
      this.updateScoreUI();
    }, 5000);
  }

  // --- Power-ups --- //
  updatePowerUpsUI() {
    Object.keys(this.powerBtns).forEach(key => {
      const btn = this.powerBtns[key];
      const charges = this.state.powers[key];
      const chargeEl = document.getElementById(`pw-${key}-charges`);
      if (chargeEl) chargeEl.textContent = `×${charges}`;
      
      btn.classList.remove('active-power', 'depleted');
      if (charges <= 0) btn.classList.add('depleted');
      else if (this.state.activePower === key) btn.classList.add('active-power');
    });
  }

  usePowerUp(power) {
    if (this.state.powers[power] <= 0 || this.state.isDragging) return;
    
    // Direct action powers
    if (power === 'freeze') {
      this.powerFreeze();
      return;
    }
    if (power === 'hint') {
      this.powerHint();
      return;
    }
    if (power === 'pathfinder') {
      this.powerPathFinder();
      return;
    }
    
    // Targeted powers (Blast, X-Ray)
    if (this.state.activePower === power) {
      this.state.activePower = null; // Toggle off
    } else {
      this.state.activePower = power;
      this.sound.select();
    }
    this.updatePowerUpsUI();
  }

  powerFreeze() {
    if (this.state.timerFrozen) return;
    this.sound.freeze();
    this.state.powers.freeze--;
    this.state.timerFrozen = true;
    this.updateTimerUI();
    this.updatePowerUpsUI();
    
    const frost = document.getElementById('frost-overlay');
    if(frost) frost.classList.add('active');
    
    this.state.timerFreezeTimeout = setTimeout(() => {
      this.state.timerFrozen = false;
      if(frost) frost.classList.remove('active');
      this.sound.select();
      this.updateTimerUI();
    }, 10000);
  }

  powerHint() {
    const missingWord = this.state.level.words.find(w => !this.state.foundWords.has(w));
    if (!missingWord) return;
    
    this.sound.hint();
    this.state.powers.hint--;
    this.state.hintsUsed++;
    this.updatePowerUpsUI();
    
    const wordObj = this.state.board.placedWords.find(pw => pw.word === missingWord);
    if (wordObj && wordObj.positions.length > 0) {
      const startPos = wordObj.positions[0];
      const el = this.getTileElement(startPos.r, startPos.c);
      if (el) {
        el.classList.add('hint-shake');
        setTimeout(() => el.classList.remove('hint-shake'), 600);
      }
    }
  }

  powerPathFinder() {
    const missingWord = this.state.level.words.find(w => !this.state.foundWords.has(w));
    if (!missingWord) return;
    
    this.sound.pathReveal();
    this.state.powers.pathfinder--;
    this.updatePowerUpsUI();
    
    const wordObj = this.state.board.placedWords.find(pw => pw.word === missingWord);
    if (!wordObj) return;

    // Fast animation on the tiles
    wordObj.positions.forEach((p, idx) => {
      setTimeout(() => {
        const el = this.getTileElement(p.r, p.c);
        if (el) el.classList.add('pathfinder-reveal');
        this.sound.select();
        
        // Spawn particles
        const c = this.getTileCenter(p.r, p.c);
        if (c) {
          for(let i=0; i<3; i++) {
            const part = document.createElement('div');
            part.className = 'path-particle';
            this.svgOverlay.parentElement.appendChild(part);
            gsap.set(part, { x: c.x + (Math.random()-0.5)*20, y: c.y + (Math.random()-0.5)*20 });
            gsap.to(part, {
              y: '-=40', x: '+=' + ((Math.random()-0.5)*30),
              opacity: 0, scale: 0, duration: 0.8 + Math.random()*0.5,
              ease: 'power1.out', onComplete: () => part.remove()
            });
          }
        }
      }, idx * 100);
    });

    // Draw temporary SVG path
    setTimeout(() => {
      const points = wordObj.positions.map(p => {
        const c = this.getTileCenter(p.r, p.c);
        return c ? `${c.x},${c.y}` : null;
      }).filter(Boolean);
      
      const pathSvg = `<polyline points="${points.join(' ')}" class="pathfinder-line"></polyline>`;
      this.svgOverlay.insertAdjacentHTML('beforeend', pathSvg);
      
      this.sound.found();
    }, wordObj.positions.length * 100 + 200);

    // After animation finishes, mark it clean
    setTimeout(() => {
      document.querySelectorAll('.pathfinder-reveal').forEach(el => el.classList.remove('pathfinder-reveal'));
      const line = this.svgOverlay.querySelector('.pathfinder-line');
      if (line) line.remove();
    }, 2500);
  }

  activateBlast(centerTile) {
    this.sound.blast();
    this.state.powers.blast--;
    this.state.activePower = null;
    this.updatePowerUpsUI();

    const radius = 1; // 3x3 area
    const r = centerTile.r;
    const c = centerTile.c;
    
    // GSAP Shockwave effect
    const centerPoint = this.getTileCenter(r, c);
    if (centerPoint) {
      const wave = document.createElement('div');
      wave.className = 'blast-shockwave';
      this.svgOverlay.parentElement.appendChild(wave);
      gsap.set(wave, { x: centerPoint.x, y: centerPoint.y, width: 20, height: 20 });
      gsap.to(wave, {
        width: 300, height: 300, opacity: 0,
        borderWidth: 0, duration: 0.8,
        ease: 'power2.out', onComplete: () => wave.remove()
      });
    }

    // Find all cells that actually belong to words
    const validCells = new Set();
    this.state.board.placedWords.forEach(pw => {
      pw.positions.forEach(p => validCells.add(`${p.r},${p.c}`));
    });

    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        const el = this.getTileElement(nr, nc);
        if (el) {
          const key = `${nr},${nc}`;
          if (validCells.has(key)) {
            el.classList.add('blast-reveal');
            gsap.fromTo(el, {scale: 1.3}, {scale: 1, duration: 0.5, ease: 'bounce.out'});
          } else {
            el.classList.add('blast-filler');
          }
          
          setTimeout(() => {
            el.classList.remove('blast-reveal');
            el.classList.remove('blast-filler');
          }, 1500);
        }
      }
    }
  }

  activateXRay(centerTile) {
    this.sound.xray();
    this.state.powers.xray--;
    this.state.activePower = null;
    this.updatePowerUpsUI();

    // Find words that intersect near here
    const radius = 2;
    const nearbyWords = [];
    
    this.state.board.placedWords.forEach(pw => {
      if (this.state.foundWords.has(pw.word)) return;
      const intersects = pw.positions.some(p => 
        Math.abs(p.r - centerTile.r) <= radius && Math.abs(p.c - centerTile.c) <= radius
      );
      if (intersects) nearbyWords.push(pw);
    });

    let extraSvg = '';
    nearbyWords.forEach(pw => {
      pw.positions.forEach(p => {
        const el = this.getTileElement(p.r, p.c);
        if (el) {
          el.classList.add('xray-glow');
          setTimeout(() => el.classList.remove('xray-glow'), 3000);
        }
      });

      const points = pw.positions.map(p => {
        const c = this.getTileCenter(p.r, p.c);
        return c ? `${c.x},${c.y}` : null;
      }).filter(Boolean);
      extraSvg += `<polyline points="${points.join(' ')}" class="xray-line"></polyline>`;
    });

    this.svgOverlay.insertAdjacentHTML('beforeend', extraSvg);
    const addedLines = this.svgOverlay.querySelectorAll('.xray-line');
    setTimeout(() => addedLines.forEach(l => l.remove()), 3000);
  }

  // --- Interaction --- //
  getTileFromEvent(e) {
    const touch = e.touches ? e.touches[0] : e;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains('letter-tile')) {
        return {
            r: parseInt(el.dataset.r),
            c: parseInt(el.dataset.c),
            el: el
        };
    }
    return null;
  }

  onPointerDown(e) {
    const tile = this.getTileFromEvent(e);
    if (!tile) return;

    this.sound.init();
    
    if (this.state.activePower === 'blast') {
      this.activateBlast(tile);
      return;
    }
    if (this.state.activePower === 'xray') {
      this.activateXRay(tile);
      return;
    }
    
    this.state.isDragging = true;
    this.state.startTile = tile;
    this.state.currentPath = [tile];
    this.sound.select();
    this.highlightPath();
  }

  onPointerMove(e) {
    if (!this.state.isDragging) return;
    e.preventDefault();
    const tile = this.getTileFromEvent(e);
    if (!tile) return;
    
    const path = this.state.currentPath;
    const last = path[path.length - 1];
    
    const dr = Math.abs(tile.r - last.r);
    const dc = Math.abs(tile.c - last.c);
    if (dr > 1 || dc > 1 || (dr === 0 && dc === 0)) return;
    
    if (path.length >= 2) {
      const prev = path[path.length - 2];
      if (prev.r === tile.r && prev.c === tile.c) {
        path.pop();
        this.state.pathHasCrossing = this._pathHasDuplicates(path);
        this.sound.select();
        this.highlightPath();
        return;
      }
    }
    
    const alreadyInPath = path.some(p => p.r === tile.r && p.c === tile.c);
    if (alreadyInPath) {
      this.state.pathHasCrossing = true;
      this.highlightPath();
      return;
    }
    
    path.push({ r: tile.r, c: tile.c });
    this.sound.select();
    this.highlightPath();
  }

  _pathHasDuplicates(path) {
    const seen = new Set();
    for (const p of path) {
      const key = p.r * 1000 + p.c;
      if (seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  }

  onPointerUp(e) {
    if (!this.state.isDragging) return;
    this.state.isDragging = false;
    
    const word = this.state.currentPath.map(p => this.state.board.grid[p.r][p.c]).join('');
    const reverseWord = word.split('').reverse().join('');
    
    const expectedWords = this.state.level.words;
    let found = false;
    let text = "";
    
    if (expectedWords.includes(word) && !this.state.foundWords.has(word)) { found = true; text = word; }
    else if (expectedWords.includes(reverseWord) && !this.state.foundWords.has(reverseWord)) { found = true; text = reverseWord; }
    
    if (found) {
        this.sound.found();
        this.state.foundWords.add(text);
        
        const colorIdx = this.state.svgLines.length % WORD_COLORS.length;
        const colorClass = `word-color-${WORD_COLORS[colorIdx]}`;
        
        this.state.svgLines.push({ path: [...this.state.currentPath], colorIndex: colorIdx });
        
        this.state.currentPath.forEach(p => {
          const key = `${p.r},${p.c}`;
          this.state.tileWordCounts[key] = (this.state.tileWordCounts[key] || 0) + 1;
          const el = this.getTileElement(p.r, p.c);
          
          if (this.state.tileWordCounts[key] >= 2) {
            el.classList.remove('word-color-yellow', 'word-color-purple', 'word-color-lightblue');
            el.classList.add('found', 'word-shared');
          } else {
            el.classList.add('found', colorClass);
          }
          gsap.fromTo(el, {scale: 1.2}, {scale: 1, duration: 0.3, ease: 'bounce.out'});
        });
        
        this.registerFindScore(this.getTileElement(this.state.currentPath[this.state.currentPath.length-1].r, this.state.currentPath[this.state.currentPath.length-1].c));
        this.updateProgressUI();
        this.checkWin();
    } else {
        if(this.state.currentPath.length > 1) {
          this.sound.error();
          this.state.combo = 0;
          this.state.comboMultiplier = 1;
          this.updateScoreUI();
        }
    }
    
    this.state.currentPath = [];
    this.state.pathHasCrossing = false;
    this.highlightPath();
  }

  highlightPath() {
    document.querySelectorAll('.letter-tile').forEach(el => {
      el.classList.remove('selected', 'crossing');
    });
    
    const hasCrossing = this.state.pathHasCrossing;
    
    this.state.currentPath.forEach(p => {
        const el = this.getTileElement(p.r, p.c);
        if (el) {
          el.classList.add('selected');
          if (hasCrossing) el.classList.add('crossing');
        }
    });
    
    this.updateSVG();
  }

  getTileElement(r, c) {
    return document.querySelector(`.letter-tile[data-r="${r}"][data-c="${c}"]`);
  }

  updateSVG() {
    const existingTemp = this.svgOverlay.innerHTML.match(/<polyline.*?class=["'](?:xray-line|pathfinder-line)["'].*?><\/polyline>/g) || [];
    let html = existingTemp.join('');
    
    this.state.svgLines.forEach(line => {
      const points = line.path.map(p => {
        const c = this.getTileCenter(p.r, p.c);
        return c ? `${c.x},${c.y}` : null;
      }).filter(Boolean);
      if (points.length >= 2) {
        const colorClass = `found-line-${WORD_COLORS[line.colorIndex]}`;
        html += `<polyline points="${points.join(' ')}" class="found-line ${colorClass}"></polyline>`;
      }
    });
    
    if (this.state.currentPath.length > 0) {
      const points = this.state.currentPath.map(p => {
        const c = this.getTileCenter(p.r, p.c);
        return c ? `${c.x},${c.y}` : null;
      }).filter(Boolean);
      if (points.length >= 2) {
        const crossClass = this.state.pathHasCrossing ? ' crossing' : '';
        html += `<polyline points="${points.join(' ')}" class="swipe-line${crossClass}"></polyline>`;
      }
    }
    
    this.svgOverlay.innerHTML = html;
  }

  getTileCenter(r, c) {
    const el = this.getTileElement(r, c);
    if (!el) return null;
    const container = document.getElementById('board-container').getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left - container.left - 16 + rect.width / 2,
        y: rect.top - container.top - 16 + rect.height / 2
    };
  }

  // --- End States --- //
  triggerGameOver() {
    this.endGame();
    this.sound.gameOver();
    
    document.getElementById('go-words-found').textContent = this.state.foundWords.size;
    document.getElementById('go-score').textContent = this.state.score;
    
    this.svgOverlay.style.opacity = '0';
    this.switchScreen('gameover');
  }

  checkWin() {
    if (this.state.foundWords.size === this.state.level.words.length) {
        this.endGame();
        
        // Calculate Bonuses
        const timeBonus = this.state.timeLeft * 10;
        const noHintBonus = this.state.hintsUsed === 0 ? 200 : 0;
        const finalScore = this.state.score + timeBonus + noHintBonus + 500; // 500 perfect clear bonus
        
        this.updateStats(true, finalScore);
        this.unlockNextLevel(this.state.level);
        
        this.svgOverlay.style.opacity = '0';
        
        const tiles = document.querySelectorAll('.letter-tile');
        tiles.forEach((tile) => {
            setTimeout(() => {
                tile.style.transform = `translateY(100vh) rotate(${Math.random() * 90 - 45}deg)`;
                tile.style.opacity = '0';
                tile.style.transition = 'all 0.8s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
            }, Math.random() * 400);
        });

        setTimeout(() => {
            this.sound.win();
            this.confetti.burst(150);
            
            document.getElementById('wb-words').textContent = this.state.score;
            document.getElementById('wb-time').textContent = `+${timeBonus}`;
            document.getElementById('wb-nohint').textContent = `+${noHintBonus}`;
            document.getElementById('wb-total').textContent = finalScore;
            
            this.switchScreen('win');
        }, 1200);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new ArcadeEngine();
});

window.addEventListener('resize', () => {
   if (window.game && window.game.state.board) {
       window.game.updateSVG();
   }
});
