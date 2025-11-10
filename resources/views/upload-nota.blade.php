<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Nota - Gemini AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen p-8">
    <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2"> Upload Nota</h1>
            <p class="text-gray-600">AI Gemini bakal analisa nota kamu otomatis!</p>
        </div>

        <!-- Upload Card -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            <form action="/extract-receipt" method="POST" enctype="multipart/form-data" id="uploadForm">
                <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                
                <!-- File Input with Label -->
                <div class="mb-6">
                    <label for="imageFile" class="block text-lg font-semibold text-gray-700 mb-4">
                        Pilih Foto Nota
                    </label>
                    
                    <div class="relative border-4 border-dashed border-indigo-300 rounded-2xl p-12 text-center hover:border-indigo-500 transition-all cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50" id="dropZone">
                        <input 
                            type="file" 
                            name="image" 
                            id="imageFile"
                            accept="image/jpeg,image/png,image/jpg"
                            required
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                        
                        <div id="placeholder" class="pointer-events-none">
                            <svg class="mx-auto h-20 w-20 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p class="text-xl font-bold text-gray-700 mb-2">📸 Klik atau Drag & Drop</p>
                            <p class="text-sm text-gray-500">Format: JPG, PNG (Maks 4MB)</p>
                        </div>
                        
                        <div id="preview" class="hidden pointer-events-none">
                            <img id="previewImg" class="max-h-72 mx-auto rounded-xl shadow-lg mb-4">
                            <p class="text-sm font-medium text-gray-700" id="fileName"></p>
                            <p class="text-xs text-gray-500 mt-1">Klik lagi untuk ganti foto</p>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    id="submitBtn"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    <span id="btnText" class="flex items-center justify-center gap-3">
                        <span class="text-2xl">🚀</span>
                        <span class="text-lg">Analisa Sekarang!</span>
                    </span>
                    <span id="btnLoading" class="hidden flex items-center justify-center gap-3">
                        <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-lg">Sedang diproses...</span>
                    </span>
                </button>
            </form>
        </div>

        <!-- Error Alert (PHP) -->
        <?php if(isset($_GET['error'])): ?>
        <div class="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow-lg">
            <div class="flex items-start gap-4">
                <span class="text-3xl">❌</span>
                <div>
                    <h3 class="font-bold text-red-800 text-lg mb-1">Gagal Menganalisa!</h3>
                    <p class="text-red-700"><?php echo htmlspecialchars($_GET['error']); ?></p>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- Success Result (PHP) -->
        <?php if(isset($_GET['result'])): 
            $data = json_decode($_GET['result'], true);
        ?>
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl p-8 border-2 border-green-300">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-3xl font-bold text-gray-800">✨ Hasil Analisa</h2>
                <span class="bg-green-500 text-white px-5 py-2 rounded-full font-bold shadow-lg">BERHASIL!</span>
            </div>

            <div class="grid gap-4">
                <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-indigo-500">
                    <p class="text-sm text-gray-500 mb-2 font-medium">💰 Total Biaya</p>
                    <p class="text-4xl font-extrabold text-indigo-600">Rp <?php echo number_format($data['amount'], 0, ',', '.'); ?></p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-purple-500">
                    <p class="text-sm text-gray-500 mb-2 font-medium">🏷️ Kategori</p>
                    <p class="text-2xl font-bold text-gray-800"><?php echo htmlspecialchars($data['category']); ?></p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-pink-500">
                    <p class="text-sm text-gray-500 mb-2 font-medium">📝 Deskripsi</p>
                    <p class="text-lg text-gray-800"><?php echo htmlspecialchars($data['description']); ?></p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-blue-500">
                    <p class="text-sm text-gray-500 mb-2 font-medium">📅 Tanggal</p>
                    <p class="text-lg font-semibold text-gray-800"><?php echo date('d F Y', strtotime($data['date'])); ?></p>
                </div>
            </div>

            <button onclick="window.location.href='/upload-nota'" class="w-full mt-6 bg-white hover:bg-gray-50 text-indigo-600 font-bold py-4 px-6 rounded-xl border-3 border-indigo-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                 Upload Nota Lain
            </button>
        </div>
        <?php endif; ?>
    </div>

    <script>
        const form = document.getElementById('uploadForm');
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('imageFile');
        const placeholder = document.getElementById('placeholder');
        const preview = document.getElementById('preview');
        const previewImg = document.getElementById('previewImg');
        const fileName = document.getElementById('fileName');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnLoading = document.getElementById('btnLoading');

        // Preview on file select
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 4 * 1024 * 1024) {
                    alert('❌ File terlalu besar! Maksimal 4MB');
                    fileInput.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    fileName.textContent = file.name;
                    placeholder.classList.add('hidden');
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        // Drag & drop styling
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-indigo-600', 'bg-indigo-100');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-indigo-600', 'bg-indigo-100');
        });

        // Loading state on submit
        form.addEventListener('submit', function(e) {
            if (!fileInput.files[0]) {
                e.preventDefault();
                alert('❌ Pilih foto dulu!');
                return;
            }
            
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        });
    </script>
</body>
</html>