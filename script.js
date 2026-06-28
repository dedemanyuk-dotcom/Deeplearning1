// ============================================================
// SCRIPT.JS - Deep Learning SD
// Deskripsi: Logika Utama Aplikasi (Vanilla JS)
// Versi: 1.0.4 (Fix Validasi Game, Audio Crash, & QRCode Sertifikat)
// ============================================================

// --- STATE MANAGEMENT (Local Storage) ---
const DB_KEY = 'dl_sd_data_v1';
let State = {
  user: {
    name: '', class: '', avatar: '😊', level: 1, xp: 0, points: 0, streak: 0,
    lastLogin: null, joinDate: new Date().toISOString()
  },
  stats: { quizCompleted: 0, topicsRead: 0, gamesPlayed: 0, daysActive: 0 },
  history: { activities: [], quizzes: [], journal: [], dlDrafts: {} },
  settings: { darkMode: false, animations: true, sfx: true, volume: 70 },
  badges: [] 
};

// --- AUDIO SYSTEM (Aman dari Crash Browser) ---
const AudioSystem = {
  ctx: null,
  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if(AudioCtx) this.ctx = new AudioCtx();
      }
    } catch(e) { console.warn("Audio tidak didukung di browser ini."); }
  },
  play(freq, type, duration) {
    if (!State.settings.sfx) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(State.settings.volume / 100, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {} // Abaikan jika audio terblokir
  },
  success() { this.play(600, 'sine', 0.1); setTimeout(() => this.play(800, 'sine', 0.2), 100); },
  error() { this.play(300, 'square', 0.1); setTimeout(() => this.play(250, 'square', 0.2), 150); },
  click() { this.play(400, 'sine', 0.05); }
};

// --- UTILITIES ---
const Utils = {
  saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(State)); },
  loadDB() { 
    const data = localStorage.getItem(DB_KEY); 
    if (data) State = { ...State, ...JSON.parse(data) }; 
  },
  resetDB() { localStorage.removeItem(DB_KEY); location.reload(); },
  formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  },
  formatShortDate(isoString) {
    return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '💡';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 3000);
  },
  addActivity(title, type, score = 0) {
    State.history.activities.unshift({ id: Date.now(), title, type, score, date: new Date().toISOString() });
    if (State.history.activities.length > 50) State.history.activities.pop(); 
    this.saveDB();
    App.updateDashboard();
  },
  confetti() {
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.backgroundColor = ['#2563EB', '#22C55E', '#FACC15', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)];
      p.style.animationDuration = (Math.random() * 2 + 1) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3000);
    }
  }
};

// ============================================================
// APP CONTROLLER
// ============================================================
const App = {
  avatars: ['😊','😎','🤓','👩‍🎓','👨‍🎓','🦊','🐱','🐯','🐼','🐶'],
  selectedAvatar: '😊',

  init() {
    Utils.loadDB();
    this.initClock();
    
    if (typeof APP_DATA === 'undefined') {
      Utils.showToast("Gagal memuat data pelajaran. Cek koneksi atau file data.js", "error");
      return;
    }

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});

    setTimeout(() => {
      document.getElementById('splash-screen').classList.add('hidden');
      if (State.user.name) {
        this.checkStreak();
        document.getElementById('app').classList.add('active');
        this.applySettings();
        this.navigate('dashboard');
      } else {
        this.showLogin();
      }
    }, 1500);
  },

  showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('avatar-grid').innerHTML = this.avatars.map(a => `<div class="avatar-item ${a===this.selectedAvatar?'selected':''}" onclick="App.selectAvatar('${a}', this)">${a}</div>`).join('');
  },

  selectAvatar(avatar, el) {
    this.selectedAvatar = avatar;
    document.querySelectorAll('.avatar-item').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    AudioSystem.click();
  },

  login() {
    const name = document.getElementById('input-name').value.trim();
    const cls = document.getElementById('input-class').value;
    if (!name || !cls) return Utils.showToast('Nama dan kelas harus diisi!', 'warning');
    
    State.user.name = name; State.user.class = cls; State.user.avatar = this.selectedAvatar;
    State.user.lastLogin = new Date().toISOString(); State.stats.daysActive = 1;
    Utils.saveDB();

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.add('active');
    this.applySettings();
    this.navigate('dashboard');
    Utils.showToast(`Selamat datang, ${name}!`, 'success');
  },

  checkStreak() {
    const today = new Date().setHours(0,0,0,0);
    const last = new Date(State.user.lastLogin).setHours(0,0,0,0);
    const diff = (today - last) / (1000 * 60 * 60 * 24);

    if (diff === 1) { State.user.streak++; State.stats.daysActive++; }
    else if (diff > 1) { State.user.streak = 1; State.stats.daysActive++; }
    State.user.lastLogin = new Date().toISOString();
    Utils.saveDB();
  },

  navigate(pageId) {
    AudioSystem.click();
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if(activeNav) activeNav.classList.add('active');

    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    window.scrollTo(0,0);

    if(pageId === 'dashboard') this.updateDashboard();
    if(pageId === 'materi') Materi.init();
    if(pageId === 'deeplearning') DeepLearning.init();
    if(pageId === 'quiz') Quiz.init();
    if(pageId === 'games') Games.init();
    if(pageId === 'badges') Badges.init();
    if(pageId === 'leaderboard') Leaderboard.init();
    if(pageId === 'stats') Stats.init();
    if(pageId === 'journal') Journal.init();
    if(pageId === 'certificate') Certificate.init();
    if(pageId === 'settings') Settings.init();
    if(pageId === 'calendar') Calendar.init();
    if(pageId === 'portfolio') Portfolio.init();
    if(pageId === 'target') Target.init();
  },

  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('active');
  },

  applySettings() {
    document.documentElement.setAttribute('data-theme', State.settings.darkMode ? 'dark' : 'light');
    document.getElementById('theme-btn').textContent = State.settings.darkMode ? '☀️' : '🌙';
  },

  toggleTheme() {
    State.settings.darkMode = !State.settings.darkMode;
    this.applySettings();
    Utils.saveDB();
  },

  initClock() {
    setInterval(() => {
      const now = new Date();
      const clockEl = document.getElementById('clock');
      if(clockEl) {
        clockEl.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
        document.getElementById('date-display').textContent = Utils.formatDate(now);
      }
    }, 1000);
  },

  addXP(amount) {
    State.user.xp += amount;
    State.user.points += Math.floor(amount / 2);
    
    const oldLevel = State.user.level;
    const currentLevelObj = APP_DATA.levels.find(l => State.user.xp < l.maxXP) || APP_DATA.levels[APP_DATA.levels.length-1];
    State.user.level = currentLevelObj.level;

    if (State.user.level > oldLevel) {
      AudioSystem.success(); Utils.confetti();
      Utils.showToast(`🎉 Selamat! Kamu naik ke Level ${State.user.level}!`, 'success');
    }
    Utils.saveDB(); Badges.checkAll(); this.updateDashboard();
  },

  updateDashboard() {
    const u = State.user; const s = State.stats;
    const lvObj = APP_DATA.levels.find(l => l.level === u.level) || APP_DATA.levels[0];

    document.getElementById('hero-name').textContent = u.name;
    document.getElementById('hero-class').textContent = u.class;
    document.getElementById('hero-avatar').textContent = u.avatar;
    document.getElementById('header-avatar').textContent = u.avatar;
    document.getElementById('sidebar-avatar').textContent = u.avatar;
    document.getElementById('sidebar-name').textContent = u.name;
    document.getElementById('sidebar-class').textContent = u.class;

    document.getElementById('dash-poin').textContent = u.points;
    document.getElementById('dash-streak').textContent = u.streak;
    document.getElementById('dash-quiz').textContent = s.quizCompleted;
    document.getElementById('dash-topics').textContent = s.topicsRead;
    
    document.getElementById('stat-level').textContent = u.level;
    document.getElementById('stat-xp').textContent = u.xp;
    document.getElementById('stat-badges').textContent = State.badges.length;
    document.getElementById('stat-days').textContent = s.daysActive;

    const xpBase = lvObj.minXP; const xpReq = lvObj.maxXP;
    const progress = Math.min(100, ((u.xp - xpBase) / (xpReq - xpBase)) * 100);
    
    ['dash-xp-bar', 'sidebar-xp-bar'].forEach(id => document.getElementById(id).style.width = `${progress}%`);
    document.getElementById('dash-level-name').textContent = `Level ${lvObj.level} ${lvObj.emoji}`;
    document.getElementById('sidebar-level').textContent = `Level ${lvObj.level} ${lvObj.emoji}`;
    document.getElementById('dash-xp-info').textContent = `${u.xp} / ${xpReq} XP`;
    document.getElementById('sidebar-xp').textContent = `${u.xp} XP`;

    document.getElementById('hero-motivation').textContent = APP_DATA.dailyMotivation[new Date().getDay() % APP_DATA.dailyMotivation.length];
    
    const targetList = document.getElementById('daily-target-list');
    if (targetList) {
      targetList.innerHTML = `
        <div class="checklist-item done"><div class="checklist-checkbox">✓</div><div class="checklist-label">Login hari ini</div></div>
        <div class="checklist-item ${s.quizCompleted > 0 ? 'done' : ''}"><div class="checklist-checkbox">${s.quizCompleted > 0 ? '✓' : ''}</div><div class="checklist-label">Selesaikan 1 Quiz</div></div>
        <div class="checklist-item ${s.topicsRead > 0 ? 'done' : ''}"><div class="checklist-checkbox">${s.topicsRead > 0 ? '✓' : ''}</div><div class="checklist-label">Baca 1 Materi</div></div>
      `;
      let completed = 1 + (s.quizCompleted > 0 ? 1 : 0) + (s.topicsRead > 0 ? 1 : 0);
      document.getElementById('daily-target-progress').style.width = `${(completed/3)*100}%`;
      document.getElementById('daily-target-text').textContent = `${completed} / 3 target selesai`;
    }

    const actContainer = document.getElementById('recent-activity');
    if (State.history.activities.length === 0) {
      actContainer.innerHTML = `<div class="empty-state"><span class="empty-state-emoji">📭</span><div>Belum ada aktivitas</div></div>`;
    } else {
      actContainer.innerHTML = State.history.activities.slice(0, 5).map(act => `
        <div class="history-item">
          <div class="history-item-icon">${act.type==='quiz'?'📝':act.type==='materi'?'📚':'🎮'}</div>
          <div class="history-item-info">
            <div class="history-item-title">${act.title}</div>
            <div class="history-item-date">${Utils.formatShortDate(act.date)}</div>
          </div>
          ${act.score ? `<div class="history-item-score">+${act.score} XP</div>` : ''}
        </div>
      `).join('');
    }
  },
  
  installPWA() { document.getElementById('install-banner').classList.remove('show'); },
  globalSearch(val) { if(val.length > 2) { this.navigate('materi'); document.getElementById('materi-search').value = val; Materi.search(val); } }
};

// ============================================================
// MODULES
// ============================================================

const Materi = {
  init() { this.showSubjects(); },
  showSubjects() {
    document.getElementById('materi-view-subjects').classList.remove('hidden');
    document.getElementById('materi-view-topics').classList.add('hidden');
    document.getElementById('materi-view-detail').classList.add('hidden');
    
    document.getElementById('subjects-grid').innerHTML = APP_DATA.subjects.map(s => `
      <div class="subject-card" onclick="Materi.showTopics('${s.id}')">
        <span class="subject-emoji">${s.emoji}</span><div class="subject-name">${s.name}</div><div class="subject-desc">${s.topics.length} Topik</div>
      </div>
    `).join('');
  },
  showTopics(subjectId) {
    const subject = APP_DATA.subjects.find(s => s.id === subjectId);
    if(!subject) return;
    document.getElementById('materi-view-subjects').classList.add('hidden');
    document.getElementById('materi-view-topics').classList.remove('hidden');
    document.getElementById('topics-header').innerHTML = `<h2 class="page-title mb-4">${subject.emoji} ${subject.name}</h2>`;
    document.getElementById('topics-list').innerHTML = subject.topics.map(t => `
      <div class="topic-card" onclick="Materi.read('${subjectId}', '${t.id}')">
        <div class="topic-icon-wrap" style="background:${subject.color}20;color:${subject.color}">${subject.emoji}</div>
        <div class="topic-info">
          <div class="topic-title">${t.title}</div><div class="topic-summary">${t.summary}</div>
          <div class="topic-meta">
            <span class="topic-badge" style="background:${subject.color}20;color:${subject.color}">Level ${t.level}</span>
            <span class="topic-badge" style="background:#FACC1530;color:#EAB308">⭐ ${t.xp} XP</span>
          </div>
        </div>
      </div>
    `).join('');
  },
  read(subjectId, topicId) {
    const subject = APP_DATA.subjects.find(s => s.id === subjectId);
    const topic = subject.topics.find(t => t.id === topicId);
    document.getElementById('materi-view-topics').classList.add('hidden');
    document.getElementById('materi-view-detail').classList.remove('hidden');
    
    const safeTitle = topic.title.replace(/'/g, "\\'");
    document.getElementById('topic-detail-content').innerHTML = `
      <h2 class="page-title mt-2 mb-2">${topic.title}</h2><div class="chip chip-primary mb-4">${subject.name}</div>
      <div class="card material-content">${topic.content}</div>
      <button class="btn btn-filled mt-4" onclick="Materi.finish('${safeTitle}', ${topic.xp})">✅ Selesai Membaca (+${topic.xp} XP)</button>
    `;
  },
  finish(title, xp) {
    State.stats.topicsRead++; App.addXP(xp); Utils.addActivity(`Membaca: ${title}`, 'materi', xp);
    Utils.showToast(`Berhasil menyelesaikan materi! +${xp} XP`, 'success'); this.showSubjects();
  },
  search(val) {
    val = val.toLowerCase();
    const grid = document.getElementById('subjects-grid');
    if(!val) return this.showSubjects();
    let html = '';
    APP_DATA.subjects.forEach(s => s.topics.forEach(t => {
      if(t.title.toLowerCase().includes(val) || t.summary.toLowerCase().includes(val)) {
        html += `<div class="topic-card mb-2" onclick="Materi.read('${s.id}', '${t.id}')">
          <div class="topic-info"><div class="topic-title">${t.title}</div><div class="topic-summary">${s.name}</div></div>
        </div>`;
      }
    }));
    grid.innerHTML = html || '<div class="empty-state">Tidak ditemukan</div>';
  }
};

const Quiz = {
  questions: [], currentIndex: 0, score: 0, timer: null, timeLeft: 0,
  init() {
    document.getElementById('quiz-subject-filter').innerHTML = `<option value="all">Semua Pelajaran</option>` + 
      APP_DATA.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    this.renderHistory();
  },
  start() {
    const subj = document.getElementById('quiz-subject-filter').value;
    const count = parseInt(document.getElementById('quiz-count').value);
    let pool = subj === 'all' ? APP_DATA.quizzes : APP_DATA.quizzes.filter(q => q.subject === subj);
    if(pool.length === 0) return Utils.showToast('Belum ada soal untuk materi ini', 'error');
    
    this.questions = pool.sort(() => 0.5 - Math.random()).slice(0, count);
    this.currentIndex = 0; this.score = 0; this.timeLeft = count * 60;
    
    document.getElementById('quiz-select-view').classList.add('hidden');
    document.getElementById('quiz-active-view').classList.remove('hidden');
    document.getElementById('quiz-result-view').classList.add('hidden');
    this.startTimer(); this.renderQuestion();
  },
  startTimer() {
    clearInterval(this.timer);
    const timerEl = document.getElementById('quiz-timer');
    this.timer = setInterval(() => {
      this.timeLeft--;
      const m = Math.floor(this.timeLeft / 60); const s = this.timeLeft % 60;
      timerEl.textContent = `⏱️ ${m}:${s.toString().padStart(2,'0')}`;
      if(this.timeLeft <= 30) timerEl.classList.add('warning'); else timerEl.classList.remove('warning');
      if(this.timeLeft <= 0) { clearInterval(this.timer); this.finish(); }
    }, 1000);
  },
  renderQuestion() {
    const q = this.questions[this.currentIndex];
    document.getElementById('quiz-q-number').textContent = `Pertanyaan ${this.currentIndex + 1} dari ${this.questions.length}`;
    document.getElementById('quiz-q-text').textContent = q.question;
    document.getElementById('quiz-progress-info').textContent = `Soal ${this.currentIndex + 1} / ${this.questions.length}`;
    document.getElementById('quiz-progress-bar').style.width = `${((this.currentIndex+1)/this.questions.length)*100}%`;
    
    const optsCont = document.getElementById('quiz-options-container');
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-next-btn').classList.add('hidden');
    document.getElementById('quiz-skip-btn').classList.remove('hidden');
    
    if (q.type === 'multiple' || q.type === 'truefalse') {
      const labels = ['A', 'B', 'C', 'D'];
      optsCont.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" onclick="Quiz.check('${opt}', this)">
          <span class="quiz-option-label">${labels[i]}</span> ${opt}
        </button>
      `).join('');
    } else if (q.type === 'essay') {
      optsCont.innerHTML = `
        <textarea class="quiz-essay-input" id="quiz-essay-ans" placeholder="Ketik jawabanmu..."></textarea>
        <button class="btn btn-filled mt-3" onclick="Quiz.checkEssay()">Cek Jawaban</button>
      `;
    }
  },
  check(ans, el) {
    const q = this.questions[this.currentIndex];
    document.querySelectorAll('.quiz-option').forEach(btn => btn.disabled = true);
    
    const expEl = document.getElementById('quiz-explanation');
    expEl.classList.remove('hidden');
    expEl.innerHTML = `<strong>Jawaban: ${q.answer}</strong><br>${q.explanation}`;
    
    if (ans === q.answer) {
      el.classList.add('correct'); this.score += q.points; AudioSystem.success();
    } else {
      el.classList.add('wrong');
      document.querySelectorAll('.quiz-option').forEach(btn => { if(btn.textContent.includes(q.answer)) btn.classList.add('correct'); });
      AudioSystem.error();
    }
    document.getElementById('quiz-score-info').textContent = `⭐ ${this.score} poin`;
    document.getElementById('quiz-next-btn').classList.remove('hidden');
    document.getElementById('quiz-skip-btn').classList.add('hidden');
  },
  checkEssay() {
    const ans = document.getElementById('quiz-essay-ans').value.toLowerCase().trim();
    if (!ans) return Utils.showToast('Isi jawabanmu dulu ya!', 'warning');

    const q = this.questions[this.currentIndex];
    const expEl = document.getElementById('quiz-explanation');
    expEl.classList.remove('hidden');
    expEl.innerHTML = `<strong>Jawaban referensi:</strong><br>${q.explanation}`;
    
    let isCorrect = q.answer.split(' ').some(word => ans.includes(word));
    if(isCorrect) { this.score += q.points; AudioSystem.success(); } else { AudioSystem.error(); }
    
    document.getElementById('quiz-score-info').textContent = `⭐ ${this.score} poin`;
    document.getElementById('quiz-next-btn').classList.remove('hidden');
    document.getElementById('quiz-skip-btn').classList.add('hidden');
  },
  skip() { this.next(); },
  next() {
    this.currentIndex++;
    if (this.currentIndex >= this.questions.length) this.finish(); else this.renderQuestion();
  },
  finish() {
    clearInterval(this.timer);
    document.getElementById('quiz-active-view').classList.add('hidden');
    document.getElementById('quiz-result-view').classList.remove('hidden');
    
    const maxScore = this.questions.reduce((a,b)=>a+b.points, 0);
    const percentage = Math.round((this.score / maxScore) * 100);
    
    document.getElementById('result-score').textContent = percentage;
    document.getElementById('result-total').textContent = this.questions.length;
    document.getElementById('result-points').textContent = this.score;
    
    let msg = 'Luar Biasa!'; let emoji = '🎉';
    if(percentage < 50) { msg = 'Terus Belajar!'; emoji = '📚'; } else if(percentage < 80) { msg = 'Kerja Bagus!'; emoji = '👍'; }
    document.getElementById('result-msg').textContent = msg;
    document.getElementById('result-emoji').textContent = emoji;
    
    State.stats.quizCompleted++; App.addXP(this.score);
    Utils.addActivity(`Quiz Selesai (${percentage}%)`, 'quiz', this.score);
    State.history.quizzes.unshift({ date: new Date().toISOString(), score: percentage, points: this.score });
    Utils.saveDB(); if(percentage === 100) Badges.checkAll();
  },
  restart() { this.start(); },
  renderHistory() {
    const list = document.getElementById('quiz-history-list');
    if(!State.history.quizzes.length) return;
    list.innerHTML = State.history.quizzes.slice(0,5).map(q => `
      <div class="history-item"><div class="history-item-icon">📝</div>
      <div class="history-item-info"><div class="history-item-title">Nilai: ${q.score}</div><div class="history-item-date">${Utils.formatDate(q.date)}</div></div>
      <div class="history-item-score">+${q.points} Poin</div></div>
    `).join('');
  }
};

const Games = {
  init() {
    document.getElementById('games-grid').innerHTML = `
      <div class="game-card" onclick="Games.startMemory()"><span class="game-emoji">🃏</span><div class="game-name">Memory Card</div><div class="game-desc">Latih daya ingatmu</div></div>
      <div class="game-card" onclick="Games.startMath()"><span class="game-emoji">⚡</span><div class="game-name">Hitung Cepat</div><div class="game-desc">Matematika kilat</div></div>
      <div class="game-card" onclick="Games.startWord()"><span class="game-emoji">🔤</span><div class="game-name">Susun Kata</div><div class="game-desc">Tebak kata acak</div></div>
    `;
  },
  showMenu() {
    document.getElementById('games-select-view').classList.remove('hidden');
    document.getElementById('game-memory-view').classList.add('hidden');
    document.getElementById('game-math-view').classList.add('hidden');
    document.getElementById('game-word-view').classList.add('hidden');
    clearInterval(this.mathTimerInterval);
  },
  
  // -- MEMORY GAME --
  memCards: [], firstCard: null, memMoves: 0, memPairs: 0,
  startMemory() {
    document.getElementById('games-select-view').classList.add('hidden');
    document.getElementById('game-memory-view').classList.remove('hidden');
    this.memoryReset();
  },
  memoryReset() {
    this.memMoves = 0; this.memPairs = 0; this.firstCard = null;
    document.getElementById('mem-moves').textContent = 0; document.getElementById('mem-pairs').textContent = 0;
    
    let cards = [...APP_DATA.memoryCards, ...APP_DATA.memoryCards];
    cards.sort(() => 0.5 - Math.random()); this.memCards = cards;
    
    document.getElementById('memory-grid').innerHTML = cards.map((c, i) => `
      <div class="memory-card" id="mem-c-${i}" onclick="Games.memFlip(${i})"><div class="memory-back">❓</div><div class="memory-front">${c.emoji}</div></div>
    `).join('');
  },
  memFlip(idx) {
    const el = document.getElementById(`mem-c-${idx}`);
    if(el.classList.contains('flipped') || el.classList.contains('matched')) return;
    el.classList.add('flipped'); AudioSystem.click();
    
    if(!this.firstCard) {
      this.firstCard = { idx, el, id: this.memCards[idx].id };
    } else {
      this.memMoves++; document.getElementById('mem-moves').textContent = this.memMoves;
      const secondId = this.memCards[idx].id;
      if(this.firstCard.id === secondId) {
        el.classList.add('matched'); this.firstCard.el.classList.add('matched'); this.firstCard = null;
        this.memPairs++; document.getElementById('mem-pairs').textContent = this.memPairs; AudioSystem.success();
        if(this.memPairs === APP_DATA.memoryCards.length) {
          setTimeout(() => {
            Utils.confetti(); const xp = 50 - (this.memMoves > 15 ? (this.memMoves-15) : 0);
            App.addXP(xp > 10 ? xp : 10); Utils.addActivity('Memory Game Selesai', 'game', xp);
            Utils.showToast(`Menang! +${xp > 10 ? xp : 10} XP`, 'success');
          }, 500);
        }
      } else {
        const fc = this.firstCard.el; this.firstCard = null;
        setTimeout(() => { el.classList.remove('flipped'); fc.classList.remove('flipped'); }, 800);
      }
    }
  },

  // -- MATH GAME --
  mathScore: 0, mathStreak: 0, mathTime: 60, mathTimerInterval: null, currMathProb: null,
  startMath() {
    document.getElementById('games-select-view').classList.add('hidden');
    document.getElementById('game-math-view').classList.remove('hidden');
    this.mathScore = 0; this.mathStreak = 0; this.mathTime = 60;
    document.getElementById('math-score').textContent = 0;
    document.getElementById('math-streak-count').textContent = 0;
    document.getElementById('math-feedback').textContent = '';
    this.nextMath();
    
    clearInterval(this.mathTimerInterval);
    this.mathTimerInterval = setInterval(() => {
      this.mathTime--;
      document.getElementById('math-timer').textContent = `⏱️ ${this.mathTime}`;
      document.getElementById('math-time-bar').style.width = `${(this.mathTime/60)*100}%`;
      if(this.mathTime <= 0) {
        clearInterval(this.mathTimerInterval); Utils.showToast(`Waktu habis! Skor: ${this.mathScore}`, 'info');
        App.addXP(this.mathScore); Utils.addActivity('Hitung Cepat', 'game', this.mathScore);
        setTimeout(() => this.showMenu(), 2000);
      }
    }, 1000);
  },
  nextMath() {
    this.currMathProb = APP_DATA.mathProblems[Math.floor(Math.random() * APP_DATA.mathProblems.length)];
    document.getElementById('math-problem').textContent = this.currMathProb.q + ' = ?';
    const inputEl = document.getElementById('math-input');
    inputEl.value = ''; inputEl.focus();
  },
  mathCheck() {
    const inputEl = document.getElementById('math-input');
    const ans = parseInt(inputEl.value);
    const fb = document.getElementById('math-feedback');
    
    // FIX: Validasi jika jawaban kosong
    if(isNaN(ans)) {
        fb.textContent = '⚠️ Ketik angkanya dulu!';
        fb.style.color = 'var(--warning)';
        return;
    }
    
    if(ans === this.currMathProb.a) {
      this.mathStreak++; this.mathScore += (5 + this.mathStreak);
      document.getElementById('math-score').textContent = this.mathScore;
      document.getElementById('math-streak-count').textContent = this.mathStreak;
      fb.textContent = '✅ Benar!'; fb.style.color = 'var(--secondary)';
      inputEl.value = ''; AudioSystem.success(); this.nextMath();
    } else {
      this.mathStreak = 0; document.getElementById('math-streak-count').textContent = 0;
      fb.textContent = `❌ Salah! Jawaban: ${this.currMathProb.a}`; fb.style.color = 'var(--danger)';
      inputEl.value = ''; AudioSystem.error(); setTimeout(()=>this.nextMath(), 1000);
    }
  },

  // -- WORD GAME --
  wordScore: 0, wordQ: 1, currWord: null,
  startWord() {
    document.getElementById('games-select-view').classList.add('hidden');
    document.getElementById('game-word-view').classList.remove('hidden');
    this.wordScore = 0; this.wordQ = 1; document.getElementById('word-score').textContent = 0;
    this.nextWord();
  },
  nextWord() {
    if(this.wordQ > 5) {
      Utils.showToast(`Game Selesai! Skor: ${this.wordScore}`, 'success');
      App.addXP(this.wordScore); Utils.addActivity('Susun Kata', 'game', this.wordScore);
      return this.showMenu();
    }
    document.getElementById('word-question').textContent = this.wordQ;
    const inputEl = document.getElementById('word-input');
    inputEl.value = ''; document.getElementById('word-feedback').textContent = ''; inputEl.focus();
    
    this.currWord = APP_DATA.wordScrambles[Math.floor(Math.random() * APP_DATA.wordScrambles.length)];
    document.getElementById('scrambled-word').textContent = this.currWord.scrambled;
    document.getElementById('word-hint').textContent = this.currWord.hint;
  },
  wordCheck() {
    const inputEl = document.getElementById('word-input');
    const ans = inputEl.value.toUpperCase().trim();
    const fb = document.getElementById('word-feedback');
    
    // FIX: Validasi jika teks kosong
    if(!ans) {
        fb.textContent = '⚠️ Ketik kata yang kamu tebak dulu!';
        fb.style.color = 'var(--warning)';
        return;
    }
    
    if(ans === this.currWord.word) {
      this.wordScore += 20; document.getElementById('word-score').textContent = this.wordScore;
      fb.textContent = '✅ Tepat Sekali!'; fb.style.color = 'var(--secondary)';
      inputEl.value = ''; AudioSystem.success(); this.wordQ++; setTimeout(()=>this.nextWord(), 1000);
    } else {
      fb.textContent = '❌ Masih salah, coba lagi!'; fb.style.color = 'var(--danger)';
      inputEl.value = ''; AudioSystem.error();
    }
  },
  wordSkip() { this.wordQ++; this.nextWord(); }
};

const AITutor = {
  send() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if(!msg) return;
    
    this.addBubble(msg, 'user'); input.value = '';
    setTimeout(() => {
      let reply = APP_DATA.aiResponses.default[Math.floor(Math.random()*APP_DATA.aiResponses.default.length)];
      const m = msg.toLowerCase();
      if(m.includes('halo') || m.includes('hai')) reply = APP_DATA.aiResponses.greetings[0];
      if(m.includes('motivasi') || m.includes('semangat')) reply = APP_DATA.aiResponses.motivasi[Math.floor(Math.random()*APP_DATA.aiResponses.motivasi.length)];
      for(let key in APP_DATA.aiResponses.keywords) { if(m.includes(key)) { reply = APP_DATA.aiResponses.keywords[key]; break; } }
      this.addBubble(reply, 'ai'); AudioSystem.click();
    }, 600);
  },
  quickAsk(msg) { document.getElementById('chat-input').value = msg; this.send(); },
  addBubble(text, type) {
    const cont = document.getElementById('chat-messages');
    const div = document.createElement('div'); div.className = `chat-bubble ${type}`;
    div.innerHTML = type === 'ai' ? `<div class="chat-bubble-avatar">🤖</div>${text}` : text;
    cont.appendChild(div); cont.scrollTop = cont.scrollHeight;
  }
};

const DeepLearning = {
  stages: [
    { id: 'tanya', icon: '❓', title: 'Pertanyaan Utama', desc: 'Apa yang ingin kamu ketahui?' },
    { id: 'duga', icon: '🤔', title: 'Dugaan Awal', desc: 'Menurutmu, apa jawabannya?' },
    { id: 'cari', icon: '🔍', title: 'Cari Informasi', desc: 'Tuliskan fakta yang kamu temukan.' },
    { id: 'uji', icon: '🧪', title: 'Uji Pemahaman', desc: 'Apakah dugaanmu benar?' },
    { id: 'simpul', icon: '💡', title: 'Kesimpulan', desc: 'Apa ringkasan dari belajarmu?' },
    { id: 'kait', icon: '🔗', title: 'Kaitkan', desc: 'Hubungkan dengan kehidupan sehari-hari.' },
    { id: 'refleksi', icon: '📔', title: 'Refleksi', desc: 'Apa yang masih membuatmu bingung?' },
    { id: 'aksi', icon: '🚀', title: 'Aksi Nyata', desc: 'Apa yang akan kamu lakukan selanjutnya?' }
  ],
  init() {
    document.getElementById('dl-topic-select').innerHTML = '<option value="">-- Pilih Topik --</option>' + APP_DATA.subjects.map(s => s.topics.map(t => `<option value="${t.id}">${s.name} - ${t.title}</option>`).join('')).join('');
    document.getElementById('dl-stages').innerHTML = this.stages.map((s, i) => `
      <div class="dl-stage-card" id="dl-card-${s.id}">
        <div class="dl-stage-header" onclick="document.getElementById('dl-card-${s.id}').classList.toggle('open')">
          <div class="dl-stage-icon">${s.icon}</div><div class="dl-stage-title">Tahap ${i+1}: ${s.title}</div>
          <div class="dl-stage-status" id="dl-status-${s.id}">📝</div><div class="dl-stage-toggle">▼</div>
        </div>
        <div class="dl-stage-body"><p class="text-sm text-muted mb-2">${s.desc}</p><textarea class="dl-textarea" id="dl-input-${s.id}" placeholder="Ketik di sini..."></textarea></div>
      </div>
    `).join('');
  },
  loadDraft() {
    const topic = document.getElementById('dl-topic-select').value;
    if(!topic) return this.clearInputs();
    const draft = State.history.dlDrafts[topic] || {};
    this.stages.forEach(s => {
      const val = draft[s.id] || '';
      document.getElementById(`dl-input-${s.id}`).value = val; document.getElementById(`dl-status-${s.id}`).textContent = val ? '✅' : '📝';
    });
  },
  save() {
    const topic = document.getElementById('dl-topic-select').value;
    if(!topic) return Utils.showToast('Pilih topik terlebih dahulu!', 'warning');
    let filled = 0; const draft = {};
    this.stages.forEach(s => {
      const val = document.getElementById(`dl-input-${s.id}`).value;
      draft[s.id] = val; document.getElementById(`dl-status-${s.id}`).textContent = val ? '✅' : '📝';
      if(val.trim()) filled++;
    });
    State.history.dlDrafts[topic] = draft; Utils.saveDB();
    const xp = filled * 10; App.addXP(xp); Utils.addActivity('Deep Learning Update', 'dl', xp);
    Utils.showToast(`Tersimpan! +${xp} XP`, 'success');
  },
  clear() { this.clearInputs(); Utils.showToast('Form dikosongkan.', 'info'); },
  clearInputs() { this.stages.forEach(s => { document.getElementById(`dl-input-${s.id}`).value = ''; document.getElementById(`dl-status-${s.id}`).textContent = '📝'; }); },
  exportPDF() { Utils.showToast('Fitur Export PDF menggunakan jsPDF (Simulasi)', 'info'); }
};

const Portfolio = {
  init() { this.tab('quiz', document.querySelector('.tabs .tab-item')); },
  tab(type, el) {
    document.querySelectorAll('#page-portfolio .tab-item').forEach(e => e.classList.remove('active')); el.classList.add('active');
    const cont = document.getElementById('portfolio-content');
    const data = State.history.activities.filter(a => type === 'dl' ? a.type === 'dl' : a.type === type);
    if(data.length === 0) { cont.innerHTML = `<div class="empty-state"><span>📭</span><div>Belum ada data di portofolio ini.</div></div>`; return; }
    cont.innerHTML = data.map(d => `
      <div class="card mb-2"><div class="flex justify-between items-center">
        <div><div class="font-bold">${d.title}</div><div class="text-xs text-muted">${Utils.formatDate(d.date)}</div></div>
        <div class="text-primary font-bold">+${d.score} XP</div>
      </div></div>
    `).join('');
  }
};

const Badges = {
  init() { this.render(); },
  render() {
    document.getElementById('badges-grid').innerHTML = APP_DATA.badges.map(b => {
      const unlocked = State.badges.includes(b.id);
      return `<div class="badge-card ${unlocked ? 'unlocked' : 'locked'}"><span class="badge-emoji">${b.emoji}</span><div class="badge-name">${b.name}</div><div class="badge-desc">${b.desc}</div>${unlocked ? '<div class="badge-unlocked-label">UNLOCKED</div>' : ''}</div>`;
    }).join('');
    document.getElementById('badge-count').textContent = `${State.badges.length} / ${APP_DATA.badges.length}`;
    document.getElementById('badge-progress-bar').style.width = `${(State.badges.length/APP_DATA.badges.length)*100}%`;
  },
  checkAll() {
    let newBadge = false;
    APP_DATA.badges.forEach(b => {
      if(State.badges.includes(b.id)) return;
      let pass = false; const c = b.condition;
      if(c.type === 'topics' && State.stats.topicsRead >= c.count) pass = true;
      if(c.type === 'streak' && State.user.streak >= c.count) pass = true;
      if(c.type === 'points' && State.user.points >= c.count) pass = true;
      if(c.type === 'quiz_count' && State.stats.quizCompleted >= c.count) pass = true;
      if(pass) { State.badges.push(b.id); newBadge = true; Utils.showToast(`🏅 Badge Baru: ${b.name}!`, 'success'); }
    });
    if(newBadge) { Utils.saveDB(); this.render(); }
  }
};

const Leaderboard = {
  mockData: [
    { name: 'Budi Santoso', class: 'Kelas 5', xp: 1200, points: 600, quiz: 15, streak: 12, avatar: '😎' },
    { name: 'Siti Aminah', class: 'Kelas 4', xp: 950, points: 450, quiz: 10, streak: 8, avatar: '👩‍🎓' },
    { name: 'Andi Wijaya', class: 'Kelas 6', xp: 1500, points: 800, quiz: 20, streak: 15, avatar: '🤓' },
    { name: 'Rina Melati', class: 'Kelas 3', xp: 400, points: 200, quiz: 5, streak: 3, avatar: '🐱' }
  ],
  init() { this.tab('xp', document.querySelector('#page-leaderboard .tab-item')); },
  tab(sortKey, el) {
    document.querySelectorAll('#page-leaderboard .tab-item').forEach(e => e.classList.remove('active')); el.classList.add('active');
    let list = [...this.mockData, { ...State.user, isMe: true }]; list.sort((a,b) => b[sortKey] - a[sortKey]);
    document.getElementById('leaderboard-list').innerHTML = list.map((u, i) => `
      <div class="lb-item ${i===0?'top-1':i===1?'top-2':i===2?'top-3':''} ${u.isMe?'my-rank':''}" style="${u.isMe?'border-color:var(--primary)':''}">
        <div class="lb-rank">#${i+1}</div><div class="lb-avatar">${u.avatar}</div>
        <div class="lb-info"><div class="lb-name">${u.name} ${u.isMe?'(Kamu)':''}</div><div class="lb-class">${u.class}</div></div>
        <div style="text-align:right;"><div class="lb-score">${u[sortKey]}</div><div class="lb-score-label">${sortKey.toUpperCase()}</div></div>
      </div>
    `).join('');
  }
};

const Stats = {
  init() {
    if(!window.Chart) return Utils.showToast('Tunggu sebentar, grafik sedang dimuat...', 'info');
    this.renderCharts();
  },
  renderCharts() {
    const commonOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
    new Chart(document.getElementById('chart-xp'), { type: 'line', data: { labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], datasets: [{ data: [10,30,45,60,80,100, State.user.xp % 150], borderColor: '#2563EB', tension: 0.4 }] }, options: commonOpts });
    new Chart(document.getElementById('chart-subjects'), { type: 'doughnut', data: { labels: ['Matematika', 'IPA', 'B. Indo'], datasets: [{ data: [40, 30, 30], backgroundColor: ['#2563EB', '#22C55E', '#F59E0B'] }] }, options: commonOpts });
  }
};

const Journal = {
  currentMood: null,
  init() { this.tab('tulis', document.querySelector('#page-journal .tab-item')); this.loadToday(); },
  tab(view, el) {
    document.querySelectorAll('#page-journal .tab-item').forEach(e => e.classList.remove('active')); el.classList.add('active');
    document.getElementById('journal-tulis-view').classList.toggle('hidden', view !== 'tulis'); document.getElementById('journal-riwayat-view').classList.toggle('hidden', view !== 'riwayat');
    if(view === 'riwayat') this.renderHistory();
  },
  setMood(emoji, text, el) {
    this.currentMood = { emoji, text };
    document.querySelectorAll('.mood-item').forEach(e => e.classList.remove('selected')); el.classList.add('selected');
  },
  loadToday() {
    document.getElementById('journal-today-date').textContent = Utils.formatDate(new Date().toISOString());
    ['j-today-learn','j-understood','j-difficult','j-tomorrow','j-target'].forEach(id => document.getElementById(id).value = '');
    this.currentMood = null; document.querySelectorAll('.mood-item').forEach(e => e.classList.remove('selected'));
  },
  save() {
    if(!this.currentMood) return Utils.showToast('Pilih perasaanmu hari ini!', 'warning');
    const data = { date: new Date().toISOString(), mood: this.currentMood, learn: document.getElementById('j-today-learn').value, under: document.getElementById('j-understood').value, diff: document.getElementById('j-difficult').value };
    State.history.journal.unshift(data); Utils.saveDB(); App.addXP(20); Utils.showToast('Jurnal berhasil disimpan! +20 XP', 'success');
  },
  renderHistory() {
    document.getElementById('journal-history-list').innerHTML = State.history.journal.map(j => `
      <div class="card mb-3"><div class="flex justify-between mb-2"><span class="font-bold">${Utils.formatDate(j.date)}</span><span>${j.mood.emoji} ${j.mood.text}</span></div><p class="text-sm"><strong>Belajar:</strong> ${j.learn || '-'}</p></div>
    `).join('') || '<div class="empty-state">Belum ada jurnal</div>';
  }
};

const Calendar = {
  currDate: new Date(),
  init() { this.render(); },
  render() {
    const y = this.currDate.getFullYear(); const m = this.currDate.getMonth();
    document.getElementById('cal-month').textContent = new Date(y, m).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const firstDay = new Date(y, m, 1).getDay(); const daysInMonth = new Date(y, m + 1, 0).getDate();
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => `<div class="calendar-day-label">${d}</div>`).join('');
    for(let i=0; i<firstDay; i++) grid.innerHTML += `<div></div>`;
    for(let i=1; i<=daysInMonth; i++) {
      const isToday = new Date().toDateString() === new Date(y, m, i).toDateString();
      grid.innerHTML += `<div class="calendar-day ${isToday ? 'today' : ''}" onclick="Utils.showToast('Tanggal ${i}', 'info')">${i}</div>`;
    }
  },
  prev() { this.currDate.setMonth(this.currDate.getMonth() - 1); this.render(); },
  next() { this.currDate.setMonth(this.currDate.getMonth() + 1); this.render(); }
};

const Certificate = {
  init() {},
  generate() {
    const typeSelect = document.getElementById('cert-type');
    const type = typeSelect.options[typeSelect.selectedIndex].text;
    
    document.getElementById('cert-name-display').textContent = State.user.name;
    document.getElementById('cert-class-display').textContent = State.user.class;
    document.getElementById('cert-date-display').textContent = Utils.formatDate(new Date().toISOString());
    document.getElementById('cert-number-display').textContent = `No: DLSD-${Date.now()}`;
    
    // FIX: Cegah Error jika CDN QRCode tidak meload
    const qrContainer = document.getElementById('cert-qr');
    qrContainer.innerHTML = ''; 
    try {
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, { text: `Sertifikat ${State.user.name} - ${type}`, width: 80, height: 80 });
      } else {
        qrContainer.innerHTML = '<div style="font-size:10px; border:2px solid var(--primary); padding:10px; text-align:center;">Verified By<br>DL SD</div>';
      }
    } catch(e) {
      console.warn("QR Error:", e);
    }
    
    document.getElementById('certificate-preview').classList.remove('hidden');
    Utils.showToast('Sertifikat berhasil dibuat!', 'success');
  },
  download() { Utils.showToast('Fitur Download butuh akses server/library jsPDF!', 'warning'); },
  print() { window.print(); }
};

const Target = {
  init() { this.tab('harian', document.querySelector('#page-target .tab-item')); },
  tab(type, el) {
    document.querySelectorAll('#page-target .tab-item').forEach(e => e.classList.remove('active')); el.classList.add('active');
    document.getElementById('target-content').innerHTML = `<div class="card"><div class="checklist-item done"><div class="checklist-checkbox">✓</div><div class="checklist-label">Target 1 (${type})</div></div><div class="checklist-item"><div class="checklist-checkbox"></div><div class="checklist-label">Target 2 (${type})</div></div></div>`;
  }
};

const Settings = {
  init() {
    document.getElementById('settings-name').value = State.user.name;
    document.getElementById('settings-class').value = State.user.class;
    document.getElementById('toggle-dark').checked = State.settings.darkMode;
    document.getElementById('toggle-anim').checked = State.settings.animations;
    document.getElementById('toggle-sfx').checked = State.settings.sfx;
    document.getElementById('volume-range').value = State.settings.volume;
    document.getElementById('settings-avatar-grid').innerHTML = App.avatars.map(a => `<div class="avatar-item ${a===State.user.avatar?'selected':''}" onclick="Settings.pickAvatar('${a}', this)">${a}</div>`).join('');
  },
  pickAvatar(a, el) {
    State.user.avatar = a; document.querySelectorAll('#settings-avatar-grid .avatar-item').forEach(e => e.classList.remove('selected')); el.classList.add('selected');
  },
  saveProfile() {
    State.user.name = document.getElementById('settings-name').value; State.user.class = document.getElementById('settings-class').value;
    Utils.saveDB(); App.updateDashboard(); Utils.showToast('Profil disimpan', 'success');
  },
  toggleDark(val) { State.settings.darkMode = val; App.applySettings(); Utils.saveDB(); },
  toggleAnim(val) { State.settings.animations = val; Utils.saveDB(); },
  toggleSFX(val) { State.settings.sfx = val; Utils.saveDB(); },
  setVolume(val) { State.settings.volume = val; Utils.saveDB(); },
  exportJSON() { const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(State)); const a = document.createElement('a'); a.href = dataStr; a.download = "backup_deepsd.json"; a.click(); },
  importJSON() { document.getElementById('import-file').click(); },
  handleImport(e) {
    const file = e.target.files[0]; if(!file) return; const reader = new FileReader();
    reader.onload = (e) => { try { const json = JSON.parse(e.target.result); if(json.user) { State = json; Utils.saveDB(); location.reload(); } } catch(err) { Utils.showToast('File tidak valid!', 'error'); } };
    reader.readAsText(file);
  },
  resetData() { if(confirm('Yakin ingin mereset semua data? Proses ini tidak dapat dibatalkan.')) Utils.resetDB(); }
};

// ============================================================
// EXPOSE MODULES TO GLOBAL SCOPE (WINDOW)
// ============================================================
window.App = App; window.Materi = Materi; window.Quiz = Quiz; window.Games = Games; window.AITutor = AITutor; window.DeepLearning = DeepLearning; window.Portfolio = Portfolio; window.Badges = Badges; window.Leaderboard = Leaderboard; window.Stats = Stats; window.Journal = Journal; window.Calendar = Calendar; window.Certificate = Certificate; window.Target = Target; window.Settings = Settings; window.Utils = Utils;

// Start App
window.onload = () => App.init();
