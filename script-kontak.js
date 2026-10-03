document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const namaInput = document.getElementById('nama');
    const noWaInput = document.getElementById('noWa');
    const subjekInput = document.getElementById('subjek');
    const jamTamuInput = document.getElementById('jamTamu');
    const pesanInput = document.getElementById('pesan');
    const selectKeluarga = document.getElementById('pilihKeluarga');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');

    // Hitung karakter pesan
    if (pesanInput && charCount) {
        pesanInput.addEventListener('input', function () {
            charCount.textContent = pesanInput.value.length;
        });
    }

    // Fungsi cek jam bertamu (09:00 - 19:00 WIB)
    function cekJamBertamu(jamValue) {
        if (!jamValue) return false;
        const jam = parseInt(jamValue.split(':')[0], 10);
        return (jam >= 9 && jam < 19);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Mencegah reload halaman

            const nama = namaInput ? namaInput.value.trim() : '';
            const noWaTamu = noWaInput ? noWaInput.value.trim() : '';
            const subjek = subjekInput ? subjekInput.value : '';
            const jamTamu = jamTamuInput ? jamTamuInput.value : '';
            const pesan = pesanInput ? pesanInput.value.trim() : '';

            // Validasi kelengkapan form
            if (!nama || !noWaTamu || !subjek || !jamTamu || !pesan || !selectKeluarga || !selectKeluarga.value) {
                Swal.fire({
                    title: 'Formulir Belum Lengkap',
                    text: 'Mohon maaf, harap mengisi seluruh bidang formulir sebelum mengirimkan pesan.',
                    icon: 'warning',
                    confirmButtonText: 'Mengerti',
                    confirmButtonColor: '#e07a5f'
                });
                return;
            }

            // Validasi jam bertamu
            if (!cekJamBertamu(jamTamu)) {
                Swal.fire({
                    title: 'Permohonan Ditolak',
                    html: 'Mohon maaf, permohonan kunjungan Anda belum dapat kami terima.<br><br><b>Waktu penerimaan tamu resmi kediaman keluarga adalah pukul 09.00 hingga 19.00 WIB.</b><br>Silakan menyesuaikan kembali rencana jam kedatangan Anda.',
                    icon: 'error',
                    confirmButtonText: 'Tutup',
                    confirmButtonColor: '#e63946'
                });
                return;
            }

            // Jika validasi lolos, tampilkan notifikasi sukses & arahkan ke WhatsApp
            Swal.fire({
                title: 'Permohonan Diterima',
                html: `Terima kasih, permohonan kunjungan Anda pada pukul <b>${jamTamu} WIB</b> telah diterima.<br><br>Sistem akan mengarahkan Anda ke WhatsApp untuk menyampaikan pesan secara langsung.`,
                icon: 'success',
                confirmButtonText: 'Lanjutkan ke WhatsApp',
                confirmButtonColor: '#1b4332'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (submitBtn) submitBtn.disabled = true;
                    if (btnText) btnText.textContent = 'Mengarahkan ke WhatsApp...';

                    // Ambil nomor WA tujuan dari opsi dropdown yang dipilih
                    const namaTujuan = selectKeluarga.value;
                    const optionTerpilih = selectKeluarga.options[selectKeluarga.selectedIndex];
                    const noWATujuan = optionTerpilih.getAttribute('data-wa') || "6281230641264";

                    // Format isi surat WhatsApp
                    const isiSuratWA = `Yth. *${namaTujuan}*,

Perkenalkan, nama saya *${nama}* (${noWaTamu}).
Ingin mengajukan permohonan kunjungan bertamu dengan rincian:

📌 *Kategori:* ${subjek}
📅 *Jam Kunjungan:* ${jamTamu} WIB
💬 *Pesan/Maksud:* 
"${pesan}"

Mohon konfirmasi kesediaannya. Terima kasih.`;

                    const urlWA = `https://wa.me/${noWATujuan}?text=${encodeURIComponent(isiSuratWA)}`;

                    // Buka WhatsApp di tab baru
                    window.open(urlWA, '_blank');

                    setTimeout(function () {
                        contactForm.reset();
                        if (charCount) charCount.textContent = '0';
                        if (submitBtn) submitBtn.disabled = false;
                        if (btnText) btnText.textContent = 'Kirim Pesan ke WhatsApp';
                    }, 600);
                }
            });
        });
    }
});