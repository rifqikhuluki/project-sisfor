<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function extractReceipt(Request $request)
    {
        try {
            // Validasi file
            if (!$request->hasFile('image')) {
                return response()->json([
                    'success' => false,
                    'message' => 'File tidak ditemukan'
                ], 422);
            }

            $file = $request->file('image');
            if (!$file->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'File tidak valid'
                ], 422);
            }

            // Encode file ke Base64
            $imageData = base64_encode(file_get_contents($file->getRealPath()));
            $mimeType = $file->getMimeType();
            $today = date('Y-m-d');

            // Prompt lengkap ke Gemini
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

            $apiKey = env('GEMINI_API_KEY');
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={$apiKey}";

            $response = Http::withOptions(['verify' => false])->timeout(30)->post($url, [
                'contents' => [[
                    'parts' => [
                        ['text' => $prompt],
                        ['inline_data' => ['mime_type' => $mimeType, 'data' => $imageData]]
                    ]
                ]]
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gemini API Error',
                    'status' => $response->status(),
                    'body' => $response->body()
                ], 500);
            }

            $result = $response->json();
            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Extract JSON dari response
            preg_match('/\{[\s\S]*\}/', $text, $matches);
            if (!$matches) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengekstrak data. Coba gambar lebih jelas.'
                ], 422);
            }

            $data = json_decode(trim($matches[0]), true);

            if (!isset($data['amount']) || !isset($data['category']) || !isset($data['description'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak lengkap. Coba upload lagi.'
                ], 422);
            }

            // Pastikan amount numeric
            $amount = preg_replace('/[^0-9.-]/', '', $data['amount']);

            return response()->json([
                'success' => true,
                'amount' => (float) $amount,
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
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }
}
