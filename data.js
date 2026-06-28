// ============================================================
// DATA - Deep Learning SD
// Berisi semua data materi, soal, game, motivasi, dll.
// ============================================================

const APP_DATA = {

  // ---- MATERI PELAJARAN ----
  subjects: [
    {
      id: 'matematika', name: 'Matematika', emoji: '🔢', color: '#2563EB',
      desc: 'Belajar berhitung, geometri, dan logika matematika',
      topics: [
        {
          id: 'mat-1', title: 'Penjumlahan & Pengurangan',
          summary: 'Operasi dasar penjumlahan dan pengurangan bilangan bulat.',
          content: `
            <h3>📘 Penjumlahan</h3>
            <p>Penjumlahan adalah operasi menggabungkan dua bilangan atau lebih. Contoh: <strong>3 + 4 = 7</strong></p>
            <div class="info-box">Cara mudah: gunakan garis bilangan untuk memahami penjumlahan!</div>
            <h3>📘 Pengurangan</h3>
            <p>Pengurangan adalah operasi mengurangi satu bilangan dari bilangan lain. Contoh: <strong>10 - 3 = 7</strong></p>
            <h4>Contoh Soal:</h4>
            <ol>
              <li>25 + 37 = ?</li>
              <li>50 - 18 = ?</li>
              <li>Adi mempunyai 45 kelereng, lalu diberikan 23. Berapa total kelereng Adi?</li>
            </ol>
          `,
          xp: 50, level: 1
        },
        {
          id: 'mat-2', title: 'Perkalian & Pembagian',
          summary: 'Operasi perkalian dan pembagian bilangan.',
          content: `
            <h3>📘 Perkalian</h3>
            <p>Perkalian adalah penjumlahan berulang. Contoh: <strong>4 × 3 = 12</strong> (artinya 4 ditambah 4 kali sebanyak 3 kali)</p>
            <div class="info-box">Tips: Hapalkan tabel perkalian 1-10 untuk belajar lebih cepat!</div>
            <h3>📘 Pembagian</h3>
            <p>Pembagian adalah kebalikan dari perkalian. Contoh: <strong>12 ÷ 4 = 3</strong></p>
            <h4>Tabel Perkalian:</h4>
            <p>2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10...</p>
          `,
          xp: 60, level: 1
        },
        {
          id: 'mat-3', title: 'Pecahan Sederhana',
          summary: 'Mengenal pecahan, pembilang, dan penyebut.',
          content: `
            <h3>📘 Mengenal Pecahan</h3>
            <p>Pecahan adalah bagian dari keseluruhan. Ditulis sebagai <strong>a/b</strong> dimana a = pembilang, b = penyebut.</p>
            <div class="info-box">Contoh: Pizza dibagi 4 bagian sama rata, satu bagian = 1/4</div>
          `,
          xp: 70, level: 2
        }
      ]
    },
    {
      id: 'bindo', name: 'Bahasa Indonesia', emoji: '📖', color: '#22C55E',
      desc: 'Membaca, menulis, menyimak, dan berbicara dalam Bahasa Indonesia',
      topics: [
        {
          id: 'bindo-1', title: 'Membaca Nyaring',
          summary: 'Teknik membaca nyaring dengan intonasi yang tepat.',
          content: `
            <h3>📘 Membaca Nyaring</h3>
            <p>Membaca nyaring adalah membaca dengan suara yang dapat didengar orang lain dengan intonasi dan lafal yang tepat.</p>
            <div class="info-box">Kunci membaca nyaring: lafal jelas, intonasi tepat, dan ekspresi yang sesuai!</div>
            <h4>Langkah-langkah:</h4>
            <ol>
              <li>Baca teks diam-diam terlebih dahulu</li>
              <li>Pahami isi teks</li>
              <li>Baca dengan suara jelas dan intonasi tepat</li>
            </ol>
          `,
          xp: 50, level: 1
        },
        {
          id: 'bindo-2', title: 'Menulis Cerita Pendek',
          summary: 'Cara menulis cerita pendek yang menarik.',
          content: `
            <h3>📘 Struktur Cerita Pendek</h3>
            <p>Cerita pendek memiliki struktur: <strong>Pengenalan → Konflik → Penyelesaian</strong></p>
            <div class="info-box">Tips: Gunakan kata-kata yang deskriptif untuk membuat cerita lebih hidup!</div>
          `,
          xp: 65, level: 2
        }
      ]
    },
    {
      id: 'ipa', name: 'IPA', emoji: '🔬', color: '#8B5CF6',
      desc: 'Ilmu Pengetahuan Alam: makhluk hidup, lingkungan, dan fisika dasar',
      topics: [
        {
          id: 'ipa-1', title: 'Bagian-bagian Tumbuhan',
          summary: 'Mengenal bagian tumbuhan dan fungsinya.',
          content: `
            <h3>🌿 Bagian Tumbuhan</h3>
            <ul>
              <li><strong>Akar:</strong> Menyerap air dan mineral dari tanah</li>
              <li><strong>Batang:</strong> Menopang tumbuhan dan mengalirkan air</li>
              <li><strong>Daun:</strong> Tempat fotosintesis berlangsung</li>
              <li><strong>Bunga:</strong> Alat perkembangbiakan tumbuhan</li>
              <li><strong>Buah:</strong> Hasil dari proses pembuahan</li>
              <li><strong>Biji:</strong> Calon tumbuhan baru</li>
            </ul>
            <div class="info-box">Fotosintesis: Tumbuhan mengubah cahaya matahari + CO₂ + air menjadi makanan dan O₂</div>
          `,
          xp: 55, level: 1
        },
        {
          id: 'ipa-2', title: 'Siklus Air',
          summary: 'Memahami proses siklus air di alam.',
          content: `
            <h3>💧 Siklus Air</h3>
            <p>Siklus air adalah perputaran air di bumi secara terus-menerus.</p>
            <ol>
              <li><strong>Evaporasi:</strong> Air menguap karena panas matahari</li>
              <li><strong>Kondensasi:</strong> Uap air berubah menjadi awan</li>
              <li><strong>Presipitasi:</strong> Air jatuh sebagai hujan/salju</li>
              <li><strong>Infiltrasi:</strong> Air meresap ke dalam tanah</li>
            </ol>
          `,
          xp: 60, level: 2
        }
      ]
    },
    {
      id: 'ips', name: 'IPS', emoji: '🌍', color: '#F59E0B',
      desc: 'Ilmu Pengetahuan Sosial: sejarah, geografi, ekonomi, sosiologi',
      topics: [
        {
          id: 'ips-1', title: 'Peta dan Kompas',
          summary: 'Cara membaca peta dan menggunakan kompas.',
          content: `
            <h3>🗺️ Mengenal Peta</h3>
            <p>Peta adalah gambaran permukaan bumi pada bidang datar dengan skala tertentu.</p>
            <h4>Komponen Peta:</h4>
            <ul>
              <li>Judul peta</li>
              <li>Skala peta</li>
              <li>Legenda/keterangan</li>
              <li>Mata angin</li>
              <li>Garis tepi</li>
            </ul>
          `,
          xp: 50, level: 1
        }
      ]
    },
    {
      id: 'ppkn', name: 'PPKn', emoji: '🇮🇩', color: '#EF4444',
      desc: 'Pendidikan Pancasila dan Kewarganegaraan',
      topics: [
        {
          id: 'ppkn-1', title: 'Pancasila',
          summary: 'Lima sila Pancasila dan maknanya.',
          content: `
            <h3>🦅 Pancasila - Dasar Negara Indonesia</h3>
            <ol>
              <li><strong>Ketuhanan Yang Maha Esa</strong> - Percaya kepada Tuhan YME</li>
              <li><strong>Kemanusiaan yang Adil dan Beradab</strong> - Menghargai sesama manusia</li>
              <li><strong>Persatuan Indonesia</strong> - Menjaga keutuhan bangsa</li>
              <li><strong>Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan</strong> - Bermusyawarah untuk mufakat</li>
              <li><strong>Keadilan Sosial bagi Seluruh Rakyat Indonesia</strong> - Mewujudkan keadilan</li>
            </ol>
          `,
          xp: 55, level: 1
        }
      ]
    },
    {
      id: 'bingg', name: 'Bahasa Inggris', emoji: '🇬🇧', color: '#06B6D4',
      desc: 'English for Elementary School: vocabulary, grammar, conversation',
      topics: [
        {
          id: 'bingg-1', title: 'Greetings & Introduction',
          summary: 'How to greet and introduce yourself in English.',
          content: `
            <h3>👋 Greetings</h3>
            <ul>
              <li>Hello / Hi - Halo</li>
              <li>Good morning - Selamat pagi</li>
              <li>Good afternoon - Selamat siang</li>
              <li>Good evening - Selamat sore/malam</li>
              <li>Goodbye / Bye - Selamat tinggal</li>
            </ul>
            <h3>🙋 Introduction</h3>
            <p>My name is... = Nama saya adalah...</p>
            <p>I am from... = Saya berasal dari...</p>
            <p>Nice to meet you = Senang bertemu dengan Anda</p>
          `,
          xp: 50, level: 1
        }
      ]
    },
    {
      id: 'senbud', name: 'Seni Budaya', emoji: '🎨', color: '#EC4899',
      desc: 'Seni Rupa, Seni Musik, Seni Tari, dan Prakarya',
      topics: [
        {
          id: 'senbud-1', title: 'Warna dan Unsur Seni Rupa',
          summary: 'Mengenal warna primer, sekunder, dan unsur-unsur seni rupa.',
          content: `
            <h3>🎨 Warna Primer</h3>
            <p>Warna yang tidak dapat dibuat dari campuran warna lain: <span style="color:red">Merah</span>, <span style="color:blue">Biru</span>, <span style="color:#DAA520">Kuning</span></p>
            <h3>🎨 Warna Sekunder</h3>
            <p>Hasil campuran dua warna primer: Oranye, Hijau, Ungu</p>
            <div class="info-box">Merah + Kuning = Oranye | Biru + Kuning = Hijau | Merah + Biru = Ungu</div>
          `,
          xp: 50, level: 1
        }
      ]
    },
    {
      id: 'pjok', name: 'PJOK', emoji: '⚽', color: '#84CC16',
      desc: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
      topics: [
        {
          id: 'pjok-1', title: 'Teknik Dasar Sepak Bola',
          summary: 'Cara menendang, mengoper, dan mengontrol bola.',
          content: `
            <h3>⚽ Teknik Dasar Sepak Bola</h3>
            <ul>
              <li><strong>Menendang (Kicking):</strong> Gunakan bagian dalam kaki untuk akurasi</li>
              <li><strong>Mengoper (Passing):</strong> Tendang bola ke arah teman dengan tepat</li>
              <li><strong>Mengontrol (Controlling):</strong> Hentikan bola menggunakan telapak kaki</li>
              <li><strong>Menggiring (Dribbling):</strong> Bawa bola sambil berlari pelan</li>
            </ul>
          `,
          xp: 50, level: 1
        }
      ]
    },
    {
      id: 'agama', name: 'Agama', emoji: '🕌', color: '#10B981',
      desc: 'Pendidikan Agama dan Budi Pekerti',
      topics: [
        {
          id: 'agama-1', title: 'Rukun Islam',
          summary: 'Lima rukun Islam yang wajib diketahui.',
          content: `
            <h3>☪️ Rukun Islam</h3>
            <ol>
              <li><strong>Syahadat:</strong> Mengucapkan dua kalimat syahadat</li>
              <li><strong>Sholat:</strong> Mendirikan sholat lima waktu</li>
              <li><strong>Zakat:</strong> Membayar zakat</li>
              <li><strong>Puasa:</strong> Berpuasa di bulan Ramadhan</li>
              <li><strong>Haji:</strong> Menunaikan ibadah haji bagi yang mampu</li>
            </ol>
          `,
          xp: 55, level: 1
        }
      ]
    },
    {
      id: 'informatika', name: 'Informatika', emoji: '💻', color: '#6366F1',
      desc: 'Dasar-dasar komputer, pemrograman, dan literasi digital',
      topics: [
        {
          id: 'info-1', title: 'Pengenalan Komputer',
          summary: 'Bagian-bagian komputer dan fungsinya.',
          content: `
            <h3>💻 Bagian-bagian Komputer</h3>
            <ul>
              <li><strong>CPU (Prosesor):</strong> Otak komputer - memproses semua perintah</li>
              <li><strong>RAM:</strong> Memori sementara untuk menyimpan data yang sedang diproses</li>
              <li><strong>Hard Disk:</strong> Penyimpanan data jangka panjang</li>
              <li><strong>Monitor:</strong> Layar untuk menampilkan informasi</li>
              <li><strong>Keyboard:</strong> Alat input untuk mengetik</li>
              <li><strong>Mouse:</strong> Alat input untuk menggerakkan kursor</li>
            </ul>
          `,
          xp: 60, level: 1
        }
      ]
    }
  ],

  // ---- SOAL QUIZ ----
  quizzes: [
    // Matematika
    { id: 'q1', subject: 'matematika', level: 1, type: 'multiple',
      question: 'Berapa hasil dari 25 + 37?', points: 10,
      options: ['52', '62', '72', '82'], answer: '62',
      explanation: '25 + 37 = 62. Caranya: 5+7=12 (tulis 2 simpan 1), 2+3+1=6, jadi 62.' },
    { id: 'q2', subject: 'matematika', level: 1, type: 'multiple',
      question: 'Berapa hasil dari 8 × 7?', points: 10,
      options: ['54', '56', '58', '64'], answer: '56',
      explanation: '8 × 7 = 56. Ingat tabel perkalian!' },
    { id: 'q3', subject: 'matematika', level: 1, type: 'truefalse',
      question: '5 × 5 = 25', points: 5,
      options: ['Benar', 'Salah'], answer: 'Benar',
      explanation: '5 × 5 memang sama dengan 25.' },
    { id: 'q4', subject: 'matematika', level: 2, type: 'multiple',
      question: 'Bilangan manakah yang merupakan kelipatan 4?', points: 15,
      options: ['14', '18', '20', '22'], answer: '20',
      explanation: '20 ÷ 4 = 5. Jadi 20 adalah kelipatan 4.' },
    { id: 'q5', subject: 'matematika', level: 1, type: 'essay',
      question: 'Jelaskan apa itu pecahan! Berikan satu contoh!', points: 20,
      answer: 'pecahan bagian keseluruhan',
      explanation: 'Pecahan adalah bagian dari keseluruhan. Contoh: 1/2 berarti satu dari dua bagian.' },
    // IPA
    { id: 'q6', subject: 'ipa', level: 1, type: 'multiple',
      question: 'Bagian tumbuhan yang berfungsi untuk fotosintesis adalah...', points: 10,
      options: ['Akar', 'Batang', 'Daun', 'Bunga'], answer: 'Daun',
      explanation: 'Daun mengandung klorofil yang berfungsi untuk proses fotosintesis.' },
    { id: 'q7', subject: 'ipa', level: 1, type: 'truefalse',
      question: 'Air dapat menguap menjadi uap air karena panas matahari', points: 5,
      options: ['Benar', 'Salah'], answer: 'Benar',
      explanation: 'Proses ini disebut evaporasi, bagian dari siklus air.' },
    { id: 'q8', subject: 'ipa', level: 2, type: 'multiple',
      question: 'Proses perubahan uap air menjadi air disebut...', points: 15,
      options: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Infiltrasi'], answer: 'Kondensasi',
      explanation: 'Kondensasi adalah proses berubahnya uap air menjadi titik-titik air (awan).' },
    // Bahasa Indonesia
    { id: 'q9', subject: 'bindo', level: 1, type: 'multiple',
      question: 'Ide pokok sebuah paragraf biasanya terdapat pada...', points: 10,
      options: ['Kalimat pertama atau terakhir', 'Kalimat tengah', 'Semua kalimat', 'Tidak ada'], answer: 'Kalimat pertama atau terakhir',
      explanation: 'Ide pokok umumnya ada di awal (deduktif) atau akhir (induktif) paragraf.' },
    // PPKn
    { id: 'q10', subject: 'ppkn', level: 1, type: 'multiple',
      question: 'Sila ke-3 Pancasila berbunyi...', points: 10,
      options: ['Ketuhanan Yang Maha Esa', 'Persatuan Indonesia', 'Keadilan Sosial', 'Kemanusiaan yang Adil'], answer: 'Persatuan Indonesia',
      explanation: 'Sila ke-3 Pancasila adalah Persatuan Indonesia, dilambangkan pohon beringin.' },
    // Bahasa Inggris
    { id: 'q11', subject: 'bingg', level: 1, type: 'multiple',
      question: '"Good morning" diucapkan pada waktu...', points: 10,
      options: ['Pagi hari', 'Siang hari', 'Sore hari', 'Malam hari'], answer: 'Pagi hari',
      explanation: 'Good morning = Selamat pagi, diucapkan di pagi hari.' },
    // Matematika lanjutan
    { id: 'q12', subject: 'matematika', level: 1, type: 'multiple',
      question: 'Berapa hasil 100 - 47?', points: 10,
      options: ['43', '53', '63', '73'], answer: '53',
      explanation: '100 - 47 = 53.' },
    { id: 'q13', subject: 'matematika', level: 1, type: 'truefalse',
      question: '12 ÷ 4 = 3', points: 5,
      options: ['Benar', 'Salah'], answer: 'Benar',
      explanation: '12 dibagi 4 sama dengan 3.' },
    { id: 'q14', subject: 'ipa', level: 1, type: 'multiple',
      question: 'Hewan yang berkembangbiak dengan bertelur disebut...', points: 10,
      options: ['Mamalia', 'Ovipar', 'Vivipar', 'Ovovivipar'], answer: 'Ovipar',
      explanation: 'Ovipar berasal dari kata "ovum" = telur. Contoh: ayam, ikan, kupu-kupu.' },
    { id: 'q15', subject: 'bindo', level: 1, type: 'multiple',
      question: 'Antonim kata "tinggi" adalah...', points: 10,
      options: ['Besar', 'Pendek', 'Lebar', 'Panjang'], answer: 'Pendek',
      explanation: 'Antonim berarti lawan kata. Lawan dari tinggi adalah pendek.' }
  ],

  // ---- AI TUTOR RESPONSES ----
  aiResponses: {
    greetings: [
      'Halo! Senang bertemu denganmu! 😊 Apa yang ingin kamu pelajari hari ini?',
      'Hai! Aku siap membantumu belajar! 📚 Ada yang ingin ditanyakan?',
      'Selamat belajar! Aku adalah AI Tutor-mu. Tanyakan apa saja! 🌟'
    ],
    motivasi: [
      '💪 Semangat! Belajar sedikit setiap hari akan membuat perubahan besar!',
      '⭐ Kamu hebat! Terus belajar dan jangan menyerah!',
      '🚀 Setiap langkah kecil membawamu lebih dekat ke tujuanmu!',
      '🌈 Kesulitan hari ini adalah kekuatan di masa depan!',
      '🏆 Juara bukan yang tidak pernah gagal, tapi yang tidak pernah berhenti!'
    ],
    keywords: {
      'penjumlahan': 'Penjumlahan adalah operasi matematika untuk menggabungkan dua bilangan. Contoh: 3 + 4 = 7. Kamu bisa menggunakan jari atau garis bilangan untuk membantu! 🔢',
      'pengurangan': 'Pengurangan adalah kebalikan dari penjumlahan. Contoh: 10 - 3 = 7. Bayangkan kamu punya 10 permen, lalu 3 dimakan, tersisa 7! 🍬',
      'perkalian': 'Perkalian adalah penjumlahan berulang! 4 × 3 = 4 + 4 + 4 = 12. Hapalkan tabel perkalian ya! 📊',
      'pembagian': 'Pembagian adalah memisahkan sesuatu menjadi beberapa bagian sama besar. 12 ÷ 4 = 3 artinya 12 dibagi 4 kelompok, masing-masing isi 3. 🍕',
      'pecahan': 'Pecahan adalah bagian dari keseluruhan. Kalau pizza dibagi 4, satu irisan = 1/4. Mudah kan? 🍕',
      'fotosintesis': 'Fotosintesis adalah proses tumbuhan membuat makanan menggunakan cahaya matahari, air, dan CO₂. Hasilnya: glukosa dan oksigen! 🌿☀️',
      'siklus air': 'Siklus air terdiri dari: Evaporasi (menguap) → Kondensasi (jadi awan) → Presipitasi (hujan) → Infiltrasi (meresap). Terus berulang! 💧',
      'pancasila': 'Pancasila adalah dasar negara Indonesia dengan 5 sila. Sila 1: Ketuhanan, Sila 2: Kemanusiaan, Sila 3: Persatuan, Sila 4: Musyawarah, Sila 5: Keadilan. 🇮🇩',
      'paragraf': 'Paragraf adalah kumpulan kalimat yang membahas satu topik. Biasanya punya kalimat utama (ide pokok) dan kalimat penjelas. 📝',
      'tumbuhan': 'Tumbuhan punya akar (serap air), batang (pengangkut), daun (fotosintesis), bunga (reproduksi), buah, dan biji! 🌱',
      'komputer': 'Komputer terdiri dari: CPU (otak), RAM (memori sementara), Hard Disk (penyimpanan), Monitor, Keyboard, Mouse. Kamu sedang menggunakannya sekarang! 💻',
      'english': 'Let me help you with English! Start with simple words: Hello, Good morning, Thank you, Please, Sorry. Practice every day! 🇬🇧',
      'warna': 'Warna primer: Merah, Biru, Kuning. Campurannya menghasilkan warna sekunder: Oranye (M+K), Hijau (B+K), Ungu (M+B). 🎨',
      'sepak bola': 'Teknik dasar sepak bola: menendang (kicking), mengoper (passing), mengontrol (controlling), dan menggiring (dribbling). Olahraga sangat menyenangkan! ⚽',
      'nilai': 'Untuk dapat nilai bagus, kamu perlu: belajar rutin setiap hari, buat catatan ringkas, latihan soal, dan jangan takut bertanya! 📊',
      'belajar': 'Tips belajar efektif: buat jadwal teratur, istirahat cukup, makan bergizi, fokus saat belajar, dan ulangi materi secara berkala! 📚',
      'susah': 'Jangan menyerah! Hal yang susah hari ini akan jadi mudah setelah banyak latihan. Aku bisa membantumu! 💪',
      'capek': 'Istirahat sejenak itu boleh! Minum air putih, regangkan tubuh, lalu lanjutkan belajar. Kamu pasti bisa! 😊',
      'bosan': 'Yuk coba cara belajar berbeda! Gunakan gambar, lagu, atau bermain game edukasi. Belajar itu seru! 🎮'
    },
    default: [
      'Pertanyaan bagus! Aku akan membantu kamu mencari jawabannya. Coba klik materi yang relevan ya! 📚',
      'Hmm, itu pertanyaan menarik! Untuk jawaban lengkap, cek bagian materi yang sesuai! 🔍',
      'Aku masih belajar juga! Tapi aku sarankan kamu buka menu Materi untuk informasi lebih lengkap. 😊'
    ]
  },

  // ---- BADGE ----
  badges: [
    { id: 'pemula', name: 'Pemula', emoji: '🌱', desc: 'Selesaikan 1 materi', condition: { type: 'topics', count: 1 } },
    { id: 'rajin', name: 'Rajin', emoji: '📚', desc: 'Login 5 hari berturut-turut', condition: { type: 'streak', count: 5 } },
    { id: 'disiplin', name: 'Disiplin', emoji: '⏰', desc: 'Login 10 hari berturut-turut', condition: { type: 'streak', count: 10 } },
    { id: 'quiz-champion', name: 'Juara Quiz', emoji: '🏆', desc: 'Nilai sempurna di 3 quiz', condition: { type: 'perfect_quiz', count: 3 } },
    { id: 'cepat', name: 'Si Cepat', emoji: '⚡', desc: 'Selesaikan quiz dalam 1 menit', condition: { type: 'fast_quiz', time: 60 } },
    { id: 'kreatif', name: 'Kreatif', emoji: '🎨', desc: 'Isi semua tahap deep learning', condition: { type: 'deep_learning', count: 1 } },
    { id: 'master-ipa', name: 'Master IPA', emoji: '🔬', desc: 'Selesaikan semua materi IPA', condition: { type: 'subject_complete', subject: 'ipa' } },
    { id: 'master-mat', name: 'Master Matematika', emoji: '🔢', desc: 'Selesaikan semua materi Matematika', condition: { type: 'subject_complete', subject: 'matematika' } },
    { id: 'master-bindo', name: 'Master Bahasa', emoji: '📖', desc: 'Selesaikan semua materi Bahasa Indonesia', condition: { type: 'subject_complete', subject: 'bindo' } },
    { id: 'explorer', name: 'Penjelajah', emoji: '🗺️', desc: 'Kunjungi semua menu', condition: { type: 'menu_visits', count: 8 } },
    { id: 'poin-1000', name: 'Ribuan Poin', emoji: '💰', desc: 'Kumpulkan 1000 poin', condition: { type: 'points', count: 1000 } },
    { id: 'first-quiz', name: 'Quiz Pertama', emoji: '🎯', desc: 'Selesaikan quiz pertama', condition: { type: 'quiz_count', count: 1 } }
  ],

  // ---- MOTIVASI HARIAN ----
  dailyMotivation: [
    '🌟 "Belajar hari ini, bersinar hari esok!"',
    '💡 "Setiap pertanyaan adalah pintu menuju pengetahuan baru."',
    '🚀 "Mimpi besar dimulai dari langkah kecil yang konsisten."',
    '🌈 "Kesalahan adalah guru terbaik. Jangan takut salah!"',
    '⭐ "Kamu lebih pintar dari yang kamu kira. Terus berusaha!"',
    '🎯 "Fokus pada prosesnya, hasilnya pasti menyusul."',
    '💪 "Setiap detik yang kamu pakai belajar tidak akan sia-sia."',
    '🏆 "Juara bukan yang tidak pernah gagal, tapi yang bangkit lagi."',
    '📚 "Buku adalah jendela dunia. Semakin banyak membaca, semakin luas wawasanmu."',
    '🌱 "Pertumbuhan terjadi di luar zona nyamanmu."',
    '🔑 "Pengetahuan adalah kunci yang membuka semua pintu."',
    '✨ "Setiap hari ada kesempatan baru untuk menjadi lebih baik."',
    '🎓 "Pendidikan adalah investasi terbaik untuk masa depanmu."',
    '💫 "Percaya pada dirimu! Kamu mampu mencapai hal-hal luar biasa."',
    '🌍 "Belajar bukan hanya tentang nilai, tapi tentang memahami dunia."'
  ],

  // ---- LEVELS ----
  levels: [
    { level: 1, name: 'Pemula', minXP: 0, maxXP: 100, emoji: '🌱' },
    { level: 2, name: 'Pelajar', minXP: 100, maxXP: 300, emoji: '📚' },
    { level: 3, name: 'Cerdas', minXP: 300, maxXP: 600, emoji: '🎓' },
    { level: 4, name: 'Pintar', minXP: 600, maxXP: 1000, emoji: '⭐' },
    { level: 5, name: 'Jenius', minXP: 1000, maxXP: 1500, emoji: '🏆' },
    { level: 6, name: 'Master', minXP: 1500, maxXP: 2500, emoji: '👑' },
    { level: 7, name: 'Legend', minXP: 2500, maxXP: 999999, emoji: '💎' }
  ],

  // ---- GAME DATA ----
  memoryCards: [
    { id: 1, emoji: '🍎', name: 'Apel' },
    { id: 2, emoji: '🐶', name: 'Anjing' },
    { id: 3, emoji: '🌟', name: 'Bintang' },
    { id: 4, emoji: '🚗', name: 'Mobil' },
    { id: 5, emoji: '🎮', name: 'Game' },
    { id: 6, emoji: '🌸', name: 'Bunga' },
    { id: 7, emoji: '🏠', name: 'Rumah' },
    { id: 8, emoji: '📚', name: 'Buku' }
  ],

  mathProblems: [
    { q: '5 + 3', a: 8 }, { q: '10 - 4', a: 6 }, { q: '6 × 3', a: 18 },
    { q: '12 ÷ 4', a: 3 }, { q: '7 + 8', a: 15 }, { q: '20 - 9', a: 11 },
    { q: '4 × 5', a: 20 }, { q: '15 ÷ 3', a: 5 }, { q: '9 + 6', a: 15 },
    { q: '25 - 8', a: 17 }, { q: '3 × 7', a: 21 }, { q: '24 ÷ 6', a: 4 },
    { q: '11 + 9', a: 20 }, { q: '30 - 15', a: 15 }, { q: '8 × 4', a: 32 }
  ],

  wordScrambles: [
    { word: 'BUKU', scrambled: 'KUKB', hint: 'Tempat menyimpan ilmu 📚' },
    { word: 'GURU', scrambled: 'UURG', hint: 'Pahlawan tanpa tanda jasa 👨‍🏫' },
    { word: 'SEKOLAH', scrambled: 'HOALEKS', hint: 'Tempat belajar 🏫' },
    { word: 'ILMU', scrambled: 'ULIM', hint: 'Pengetahuan yang kita punya 🧠' },
    { word: 'PINTAR', scrambled: 'NITARP', hint: 'Lawan dari bodoh 💡' },
    { word: 'BELAJAR', scrambled: 'RELAJAB', hint: 'Aktivitas utama siswa 📖' },
    { word: 'MATEMATIKA', scrambled: 'KAIMATEMA', hint: 'Pelajaran hitung-menghitung 🔢' },
    { word: 'INDONESIA', scrambled: 'AIEDNOSIN', hint: 'Negara kita tercinta 🇮🇩' }
  ]
};
