<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function extractReceipt(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:4096'
        ]);

        try {
            // Baca file gambar
            $imagePath = $request->file('image')->getRealPath();
            $imageData = base64_encode(file_get_contents($imagePath));
            $mimeType = $request->file('image')->getMimeType();

            $today = date('Y-m-d');

            $prompt = "You are a financial data extraction assistant. Today's date is {$today}. Analyze this receipt image and extract the following information in JSON format:
{
  \"amount\": <total amount as a number>,
  \"category\": <expense category: one of \"Food & Dining\", \"Transportation\", \"Shopping\", \"Entertainment\", \"Healthcare\", \"Bills & Utilities\", \"Other\">,
  \"description\": <brief description of the expense>,
  \"date\": <date in ISO format YYYY-MM-DD, if not clearly visible on receipt use {$today}>
}

Important:
- Extract the total amount only (the final amount paid)
- Choose the most appropriate category
- Keep description concise (max 100 characters)
- For date: if the receipt shows a date, use that date. If no date is visible or unclear, use today's date: {$today}
- Return ONLY valid JSON, no additional text";

            //  PAKE QUERY PARAMETER
            $apiKey = env('GEMINI_API_KEY');
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={$apiKey}";
            
            $response = Http::withOptions([
                'verify' => false  // Disable SSL verification
           ])->timeout(30)->post($url, [  // ← Pakai $url, bukan $apiUrl
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                            [
                                'inline_data' => [
                                    'mime_type' => $mimeType,
                                    'data' => $imageData
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

            // Cek error dari Gemini
            if (!$response->successful()) {
                $errorBody = $response->body();
                $statusCode = $response->status();
                
                Log::error('Gemini API Error', [
                    'status' => $statusCode,
                    'url' => $url,
                    'body' => $errorBody,
                    'headers' => $response->headers()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Gemini API Error (Status: ' . $statusCode . ')',
                    'detail' => json_decode($errorBody, true),
                    'url' => $url  // Biar kita tau URL yang dipanggil
                ], 500);
            }
            $result = $response->json();

            // Ambil text dari response
            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Extract JSON dari response
            preg_match('/\{[\s\S]*\}/', $text, $matches);

            if (!$matches) {
                Log::error('Failed to extract JSON', ['response' => $text]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengekstrak data dari nota. Coba gambar yang lebih jelas.'
                ], 422);
            }

            $data = json_decode($matches[0], true);

            // Validasi data
            if (!isset($data['amount']) || !isset($data['category']) || !isset($data['description'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak lengkap. Coba upload lagi.'
                ], 422);
            }

            //  RETURN JSON (buat React)
            return response()->json([
                'success' => true,
                'amount' => (float) $data['amount'],
                'category' => $data['category'],
                'description' => $data['description'],
                'date' => $data['date'] ?? $today
            ]);

        } catch (\Exception $e) {
            Log::error('Extract Receipt Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}