// Dokumentasi untuk script.js
// File ini menangani logika frontend untuk chatbot Gemini AI, termasuk pengiriman pesan dan penerimaan respons.

// Mengambil elemen DOM yang diperlukan
const form = document.getElementById('chat-form'); // Formulir untuk input pesan
const input = document.getElementById('user-input'); // Input field untuk pesan pengguna
const chatBox = document.getElementById('chat-box'); // Kotak chat untuk menampilkan pesan

// Menambahkan event listener untuk submit form
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Mencegah reload halaman saat submit

  // Mengambil pesan pengguna dan menghapus spasi di awal/akhir
  const userMessage = input.value.trim();
  if (!userMessage) return; // Jika pesan kosong, hentikan eksekusi

  // Menampilkan pesan pengguna di chat box
  appendMessage('user', userMessage);
  input.value = ''; // Mengosongkan input field

  // Menampilkan pesan "Thinking..." sebagai placeholder untuk respons bot
  const thinkingMsg = appendMessage('bot', 'Thinking...');

  // Mengirim permintaan POST ke endpoint '/api/chat' di backend
  fetch('/api/chat', {
    method: 'POST', // Metode HTTP POST
    headers: {
      'Content-Type': 'application/json' // Header untuk menentukan tipe konten sebagai JSON
    },
    body: JSON.stringify({ // Body permintaan dalam format JSON
      messages: [ // Array pesan
        {
          role: 'user', // Role pesan sebagai 'user'
          text: userMessage // Teks pesan pengguna
        }
      ]
    })
  })
  .then(response => {
    // Memeriksa apakah respons berhasil
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Lempar error jika tidak ok
    }
    return response.json(); // Parse respons sebagai JSON
  })
  .then(data => {
    // Jika ada hasil dari respons, tampilkan di chat box
    if (data.result) {
      thinkingMsg.textContent = data.result; // Ganti teks "Thinking..." dengan respons AI
    } else {
      thinkingMsg.textContent = 'Sorry, no response received.'; // Pesan error jika tidak ada respons
    }
  })
  .catch(error => {
    // Menangani error dan menampilkan pesan error di konsol dan chat box
    console.error('Error:', error);
    thinkingMsg.textContent = 'Failed to get response from server.'; // Pesan error di chat box
  });
});

// Fungsi untuk menambahkan pesan ke chat box
function appendMessage(sender, text) {
  // Membuat elemen div untuk pesan
  const msg = document.createElement('div');
  msg.classList.add('message', sender); // Menambahkan class 'message' dan sender ('user' atau 'bot')
  msg.textContent = text; // Mengatur teks pesan
  chatBox.appendChild(msg); // Menambahkan pesan ke chat box
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll ke bawah untuk menampilkan pesan terbaru
  return msg; // Mengembalikan elemen pesan untuk manipulasi lebih lanjut
}
