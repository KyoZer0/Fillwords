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
  win() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this._note(freq, 'sine', 0.4, 0.1, i * 0.15);
    });
    this.haptics.trigger(defaultPatterns.success);
  }
  setMute(isMuted) {
    this.enabled = !isMuted;
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
    this.colors = ['#FFD700', '#0ea5e9', '#e6b800', '#0e7490', '#ffffff'];
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
        p.vy += 0.4; // gravity
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
// BOARD GENERATOR — Smart dynamic algorithm
// Auto-sizes grid, prevents path conflicts,
// scoring-based placement with diagonal bias
// ==========================================
function generateBoard(cols, rows, words) {
  const ALL_DIRS = [
    [1,1],[-1,1],[1,-1],[-1,-1],  // diagonals
    [0,1],[1,0],[0,-1],[-1,0]     // cardinal
  ];

  // Auto-expand grid so every word can fit in at least one direction
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
    const placedPaths = []; // array of Set<cellKey>

    for (const word of sortedWords) {
      const w = word.toUpperCase();
      const placement = findBestPlacement(grid, w, placedPaths);
      if (!placement) return null; // retry entire board

      // Apply placement to grid
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

    // Shuffled start positions for randomness
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

        // Check cell compatibility
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

        // Prevent path containment: no word's cells should be a
        // subset of another's (prevents BEE/BEETLE problem)
        let pathConflict = false;
        for (const existingPath of placedPaths) {
          // Check if new path is subset of existing
          let newInExisting = true;
          for (const k of newPathSet) {
            if (!existingPath.has(k)) { newInExisting = false; break; }
          }
          // Check if existing is subset of new
          let existingInNew = true;
          for (const k of existingPath) {
            if (!newPathSet.has(k)) { existingInNew = false; break; }
          }
          if (newInExisting || existingInNew) { pathConflict = true; break; }

          // Limit shared cells to 1 to prevent partial overlap issues
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

        // Score: prefer diagonals, penalize overlap, add randomness
        const isDiag = (dr !== 0 && dc !== 0) ? 1 : 0;
        const score = isDiag * 10 - overlapCount * 5 + Math.random() * 8;
        candidates.push({ positions, score });

        // Limit candidates to keep performance reasonable
        if (candidates.length >= 40) break;
      }
      if (candidates.length >= 40) break;
    }

    if (candidates.length === 0) return null;

    // Pick from top candidates with some randomness
    candidates.sort((a, b) => b.score - a.score);
    const topN = Math.min(candidates.length, 5);
    return candidates[Math.floor(Math.random() * topN)];
  }

  // Retry up to 200 times to get a valid board
  let result = null;
  for (let attempt = 0; attempt < 200; attempt++) {
    result = tryGenerate();
    if (result) break;
  }

  // Absolute fallback — place words horizontally, wrapping rows
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

  // Fill blanks with random letters (full alphabet for variety)
  const FILL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < effectiveRows; r++) {
    for (let c = 0; c < effectiveCols; c++) {
      if (result.grid[r][c] === '') {
        result.grid[r][c] = FILL[Math.floor(Math.random() * FILL.length)];
      }
    }
  }

  // Return actual dimensions used (may differ from requested)
  result.cols = effectiveCols;
  result.rows = effectiveRows;
  return result;
}

// ==========================================
// GAME ENGINE
// ==========================================
// Color palette for found words (cycles through these)
const WORD_COLORS = ['yellow', 'purple', 'lightblue'];

class GameEngine {
  constructor() {
    this.sound = new SoundEngine();
    this.confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));
    this.state = {
        level: null,
        board: null, // {grid, placedWords}
        foundWords: new Set(),
        tileWordCounts: {}, // tracks how many found words use each tile: "r,c" -> count
        
        // Interaction state
        isDragging: false,
        startTile: null,
        currentPath: [], // Array of {r,c}
        pathHasCrossing: false, // true when swiping over already-selected tile
        svgLines: [], // permanently drawn lines for found words (full path arrays)
        
        // Progress & Tutorial
        unlockedLevels: this.loadProgress(),
        tutorialShown: localStorage.getItem('fillwords_tutorial') === 'true'
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
        win: document.getElementById('win-screen')
    };
    
    // Toggles
    this.soundToggles = document.querySelectorAll('.sound-toggle');
    this.volumeSliders = document.querySelectorAll('input[type="range"]');
    
    // UI elements
    this.catGrid = document.getElementById('category-grid');
    this.lvlGrid = document.getElementById('level-grid');
    
    // Game elements
    this.gridEl = document.getElementById('letter-grid');
    this.wordListEl = document.getElementById('word-list');
    this.svgOverlay = document.getElementById('swipe-overlay');
    this.tutorialEl = document.getElementById('game-tutorial');
  }

  loadProgress() {
    let saved = {};
    try {
      const raw = localStorage.getItem('fillwords_progress');
      if (raw) saved = JSON.parse(raw);
    } catch(e) {}
    // Merge: ensure every category has at least its first level unlocked
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
      const saved = localStorage.getItem('fillwords_stats');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { levelsCompleted: 0, wordsFound: 0, lastPlayedDate: null, streak: 0 };
  }

  saveStats(stats) {
    localStorage.setItem('fillwords_stats', JSON.stringify(stats));
  }

  updateStats(wordsFoundInLevel) {
    const stats = this.loadStats();
    stats.levelsCompleted = (stats.levelsCompleted || 0) + 1;
    stats.wordsFound = (stats.wordsFound || 0) + wordsFoundInLevel;
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastPlayedDate === today) {
      // already played today, streak stays
    } else if (stats.lastPlayedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      stats.streak = (stats.streak || 0) + 1;
    } else {
      stats.streak = 1;
    }
    stats.lastPlayedDate = today;
    this.saveStats(stats);
  }

  getDailyPuzzle() {
    // Seed by day: YYYYMMDD → index into all levels across all categories
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const allLevels = CATEGORIES.flatMap(cat => cat.levels.map(lvl => ({ cat, lvl })));
    const idx = seed % allLevels.length;
    return allLevels[idx];
  }

  saveProgress() {
    localStorage.setItem('fillwords_progress', JSON.stringify(this.state.unlockedLevels));
  }
  
  unlockNextLevel(currentLevel) {
    let catSlug = null;
    let nextLvlId = null;
    
    // Find category and next level
    for (const cat of CATEGORIES) {
      const idx = cat.levels.findIndex(l => l.id === currentLevel.id);
      if (idx !== -1) {
        catSlug = cat.slug;
        if (idx < cat.levels.length - 1) {
          nextLvlId = cat.levels[idx + 1].id;
        }
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
    // Nav buttons
    document.getElementById('back-to-menu').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('menu');
    });
    document.getElementById('back-to-levels').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('level');
    });
    
    document.getElementById('back-to-menu-win').addEventListener('click', () => {
        this.sound.click(); this.switchScreen('menu');
    });
    document.getElementById('play-again').addEventListener('click', () => {
        this.sound.click(); this.loadLevel(this.state.level);
    });
    document.getElementById('next-level').addEventListener('click', () => {
        this.sound.click();
        const cat = CATEGORIES.find(c => c.levels.some(l => l.id === this.state.level.id));
        const idx = cat.levels.findIndex(l => l.id === this.state.level.id);
        if (idx < cat.levels.length - 1) {
            this.loadLevel(cat.levels[idx + 1]);
        } else {
            this.switchScreen('menu');
        }
    });

    // Sound Toggles
    this.soundToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if(e.target.tagName.toLowerCase() === 'input') return;
        this.sound.enabled = !this.sound.enabled;
        this.updateSoundToggles();
        if (this.sound.enabled) { this.sound.init(); this.sound.click(); }
      });
    });

    // Board interaction
    const boardPanel = document.getElementById('board-container');
    boardPanel.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    
    // Prevent context menu
    boardPanel.addEventListener('contextmenu', e => e.preventDefault());
  }

  updateSoundToggles() {
    this.soundToggles.forEach(btn => {
      if (this.sound.enabled) {
        btn.classList.add('active');
        const lb = btn.querySelector('span');
        if (lb) lb.innerText = "Sound On";
      } else {
        btn.classList.remove('active');
        const lb = btn.querySelector('span');
        if (lb) lb.innerText = "Sound Off";
      }
    });
  }

  // --- Rendering UI --- //
  renderMenu() {
    // Populate inline stats
    const stats = this.loadStats();
    const el = (id) => document.getElementById(id);
    if (el('stat-levels')) el('stat-levels').textContent = stats.levelsCompleted || 0;
    if (el('stat-words')) el('stat-words').textContent = stats.wordsFound || 0;
    if (el('stat-streak')) el('stat-streak').textContent = stats.streak || 0;

    // Hero play button = Puzzle of the Day
    const daily = this.getDailyPuzzle();
    if (el('potd-title')) el('potd-title').textContent = `▶  Play Today's Puzzle`;
    if (el('potd-meta')) el('potd-meta').textContent = `${daily.cat.name} · ${daily.lvl.title} · ${daily.lvl.difficulty}`;
    const potdBtn = el('potd-play-btn');
    if (potdBtn) {
      potdBtn.onclick = () => {
        this.sound.init();
        this.sound.click();
        if (!this.state.unlockedLevels[daily.cat.slug]) this.state.unlockedLevels[daily.cat.slug] = [];
        if (!this.state.unlockedLevels[daily.cat.slug].includes(daily.lvl.id)) {
          this.state.unlockedLevels[daily.cat.slug].push(daily.lvl.id);
          this.saveProgress();
        }
        this.loadLevel(daily.lvl);
      };
    }

    // Category pills
    this.catGrid.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const pill = document.createElement('div');
      pill.className = 'category-card';
      pill.innerHTML = `
        <div class="cat-body">
          <span class="cat-emoji">${cat.emoji || '🔤'}</span>
          <span class="cat-name">${cat.name}</span>
        </div>
      `;
      pill.addEventListener('click', () => {
        this.sound.init();
        this.sound.click();
        this.renderLevelSelect(cat);
      });
      this.catGrid.appendChild(pill);
    });
  }

  renderLevelSelect(cat) {
    document.getElementById('level-cat-name').textContent = `${cat.emoji || ''} ${cat.name}`;
    this.lvlGrid.innerHTML = '';
    
    cat.levels.forEach((lvl, idx) => {
      const isUnlocked = this.state.unlockedLevels[cat.slug]?.includes(lvl.id);
      
      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="level-title">
          ${isUnlocked ? '' : '🔒 '}
          ${lvl.title}
        </div>
        <div class="level-meta-right">
          <span class="level-diff">${lvl.difficulty}</span>
        </div>
      `;
      
      if (isUnlocked) {
        card.addEventListener('click', () => {
          this.sound.click();
          this.loadLevel(lvl);
        });
      }
      this.lvlGrid.appendChild(card);
    });
    
    this.switchScreen('level');
  }

  // --- Game State --- //
  loadLevel(level) {
    this.state.level = level;
    this.state.foundWords.clear();
    this.state.svgLines = [];
    this.state.tileWordCounts = {};
    this.state.board = generateBoard(level.cols, level.rows, level.words);
    
    // Use actual board dimensions (may be auto-expanded for long words)
    const actualCols = this.state.board.cols || level.cols;
    const actualRows = this.state.board.rows || level.rows;
    
    document.getElementById('game-level-title').textContent = level.title;
    
    // Setup Grid UI
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
    
    // Setup Word List UI
    this.wordListEl.innerHTML = '';
    level.words.forEach(word => {
        const span = document.createElement('div');
        span.className = 'word-item';
        span.id = `word-${word}`;
        span.textContent = word;
        this.wordListEl.appendChild(span);
    });
    
    this.updateSVG();
    this.switchScreen('game');
    
    // GSAP Intro
    gsap.fromTo('.letter-tile', 
      { opacity: 0, scale: 0.5 }, 
      { opacity: 1, scale: 1, stagger: 0.02, duration: 0.4, ease: 'back.out(1.5)' }
    );
    
    this.showTutorialIfNeeded();
  }

  showTutorialIfNeeded() {
    // Show tutorial only on the first level
    if (this.state.level.id !== 1 || this.state.foundWords.size > 0) return;
    
    const wordObj = this.state.board.placedWords[0];
    if (!wordObj) return;

    // We only show tutorial once
    this.tutorialEl.style.display = 'flex';
    this.tutorialEl.style.opacity = '1';
    
    // Animate hand over the first word
    const startPos = this.getTileCenter(wordObj.positions[0].r, wordObj.positions[0].c);
    const endPos = this.getTileCenter(wordObj.positions[wordObj.positions.length-1].r, wordObj.positions[wordObj.positions.length-1].c);
    
    if (startPos && endPos) {
      const hand = document.getElementById('tutorial-hand');
      
      const overlayBox = this.svgOverlay.getBoundingClientRect();
      const parentBox = this.tutorialEl.getBoundingClientRect();
      
      // We offset the finger tip slightly
      const sX = overlayBox.left + startPos.x - parentBox.left - 10;
      const sY = overlayBox.top + startPos.y - parentBox.top + 10;
      const eX = overlayBox.left + endPos.x - parentBox.left - 10;
      const eY = overlayBox.top + endPos.y - parentBox.top + 10;
      
      gsap.set(hand, { x: sX + 40, y: sY + 40, opacity: 0, scale: 0.5 });
      
      this.tutorialAnim = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
        .to(hand, { x: sX, y: sY, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
        .to(hand, { scale: 0.9, duration: 0.2 })
        .to(hand, { x: eX, y: eY, duration: 1.2, ease: 'power1.inOut' })
        .to(hand, { scale: 1, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }
  
  hideTutorial() {
    if (this.tutorialEl.style.display !== 'none') {
      if (this.tutorialAnim) this.tutorialAnim.kill();
      gsap.to(this.tutorialEl, { opacity: 0, duration: 0.3, onComplete: () => {
        this.tutorialEl.style.display = 'none';
      }});
    }
  }

  // --- Interaction --- //
  resetIdleTimer() {
    if (this._idleTimer) clearTimeout(this._idleTimer);
    if (this.state.foundWords.size === this.state.level?.words.length) return; // game over
    
    this._idleTimer = setTimeout(() => {
        this.showHint();
    }, 10000); // 10 seconds
  }

  showHint() {
    if (this.state.isDragging) return;
    
    // Find an un-found word
    const expectedWords = this.state.level.words;
    const missingWord = expectedWords.find(w => !this.state.foundWords.has(w));
    if (!missingWord) return;
    
    // Find its positions
    const wordObj = this.state.board.placedWords.find(pw => pw.word === missingWord);
    if (wordObj && wordObj.positions.length > 0) {
        // Shake the first letter
        const startPos = wordObj.positions[0];
        const el = this.getTileElement(startPos.r, startPos.c);
        if (el) {
            el.classList.add('hint-shake');
            setTimeout(() => el.classList.remove('hint-shake'), 600);
        }
    }
    this.resetIdleTimer();
  }

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

    this.resetIdleTimer();
    this.hideTutorial();

    this.sound.init(); // ensure active
    
    this.state.isDragging = true;
    this.state.startTile = tile;
    this.state.currentPath = [tile];
    this.sound.select();
    this.highlightPath();
  }

  onPointerMove(e) {
    if (!this.state.isDragging) return;
    e.preventDefault(); // prevent scrolling
    const tile = this.getTileFromEvent(e);
    if (!tile) return;
    
    const path = this.state.currentPath;
    const last = path[path.length - 1];
    
    // Must be adjacent (8-directional) to the last tile in path
    const dr = Math.abs(tile.r - last.r);
    const dc = Math.abs(tile.c - last.c);
    if (dr > 1 || dc > 1 || (dr === 0 && dc === 0)) return;
    
    // Backtracking: if tile is the second-to-last in path, pop last tile
    if (path.length >= 2) {
      const prev = path[path.length - 2];
      if (prev.r === tile.r && prev.c === tile.c) {
        path.pop();
        // Recalculate crossing state
        this.state.pathHasCrossing = this._pathHasDuplicates(path);
        this.sound.select();
        this.highlightPath();
        this.resetIdleTimer();
        return;
      }
    }
    
    // Check if tile is already in path (crossing)
    const alreadyInPath = path.some(p => p.r === tile.r && p.c === tile.c);
    if (alreadyInPath) {
      // Mark crossing but don't add the tile again
      this.state.pathHasCrossing = true;
      this.highlightPath();
      this.resetIdleTimer();
      return;
    }
    
    // Add tile to path
    path.push({ r: tile.r, c: tile.c });
    this.sound.select();
    this.highlightPath();
    this.resetIdleTimer();
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
        
        // Assign rotating color
        const colorIdx = this.state.svgLines.length % WORD_COLORS.length;
        const colorClass = `word-color-${WORD_COLORS[colorIdx]}`;
        
        // Mark UI list with color
        const wordEl = document.getElementById(`word-${text}`);
        wordEl.classList.add('found', colorClass);
        
        // Save full path in SVG with color
        this.state.svgLines.push({ path: [...this.state.currentPath], colorIndex: colorIdx });
        
        // Trigger tile animations with color
        this.state.currentPath.forEach(p => {
          const key = `${p.r},${p.c}`;
          this.state.tileWordCounts[key] = (this.state.tileWordCounts[key] || 0) + 1;
          const el = this.getTileElement(p.r, p.c);
          
          if (this.state.tileWordCounts[key] >= 2) {
            // Shared tile: remove any single-word color and apply shared style
            el.classList.remove('word-color-yellow', 'word-color-purple', 'word-color-lightblue');
            el.classList.add('found', 'word-shared');
          } else {
            el.classList.add('found', colorClass);
          }
          gsap.fromTo(el, {scale: 1.2}, {scale: 1, duration: 0.3, ease: 'bounce.out'});
        });
        
        this.checkWin();
    } else {
        if(this.state.currentPath.length > 1) this.sound.error();
    }
    
    // Reset selection
    this.state.currentPath = [];
    this.state.pathHasCrossing = false;
    this.highlightPath(); // clears selection
  }

  highlightPath() {
    // Reset all selection and crossing
    document.querySelectorAll('.letter-tile').forEach(el => {
      el.classList.remove('selected', 'crossing');
    });
    
    const hasCrossing = this.state.pathHasCrossing;
    
    // Highlight current
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
    let html = '';
    
    // Render permanently found lines as polylines with rotating colors
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
    
    // Render current drag line as polyline
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
    
    // Get position relative to the svgOverlay container (board-container)
    const container = document.getElementById('board-container').getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    
    // Also account for the overlay offset (1rem = 16px) 
    // Wait, the overlay is position: absolute with top: 1rem, left: 1rem. So it exactly matches the padding of board-container!
    // That means the coordinate system of SVG starts exactly where the grid content box starts.
    return {
        x: rect.left - container.left - 16 + rect.width / 2,
        y: rect.top - container.top - 16 + rect.height / 2
    };
  }

  checkWin() {
    if (this.state.foundWords.size === this.state.level.words.length) {
        // Save stats
        this.updateStats(this.state.foundWords.size);
        // Unlock next level
        this.unlockNextLevel(this.state.level);
        if (this._idleTimer) clearTimeout(this._idleTimer);
        
        // Hide overlay lines
        this.svgOverlay.style.opacity = '0';
        
        // Make all tiles fall
        const tiles = document.querySelectorAll('.letter-tile');
        tiles.forEach((tile, i) => {
            setTimeout(() => {
                tile.classList.add('tile-fall');
            }, Math.random() * 400);
        });

        setTimeout(() => {
            this.sound.win();
            this.confetti.burst(150);
            
            document.getElementById('win-words-found').textContent = this.state.foundWords.size;
            this.switchScreen('win');
        }, 1200);
    }
  }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});

// Update SVG when resizing window
window.addEventListener('resize', () => {
   if (window.game && window.game.state.board) {
       window.game.updateSVG();
   }
});
