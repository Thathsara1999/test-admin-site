// src/services/ocr.ts
const Tesseract = require('tesseract.js');

export interface OCRResult {
    heightCm: number | null;
    weightKg: number | null;
    measurementDate: string | null;
    confidence: number;
    rawText: string;
}

class OCRService {
    private worker: any = null;

    async initialize() {
        if (!this.worker) {
            this.worker = await Tesseract.createWorker('eng');
        }
        return this.worker;
    }

    async extractFromImage(imageFile: File): Promise<OCRResult> {
        try {
            await this.initialize();

            if (!this.worker) {
                throw new Error('Failed to initialize OCR worker');
            }

            const { data } = await this.worker.recognize(imageFile);

            const result = this.parseMeasurements(data.text);

            return {
                ...result,
                rawText: data.text,
            };

        } catch (error) {
            console.error('OCR processing error:', error);
            throw error;
        }
    }

    private parseMeasurements(text: string) {
        let height: number | null = null;
        let weight: number | null = null;
        let date: string | null = null;

        const heightMatch = text.match(/(\d+(?:\.\d+)?)\s*cm/i);
        if (heightMatch) {
            const value = parseFloat(heightMatch[1]);
            if (value > 20 && value < 200) height = value;
        }

        const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*kg/i);
        if (weightMatch) {
            const value = parseFloat(weightMatch[1]);
            if (value > 1 && value < 100) weight = value;
        }

        const dateMatch = text.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/);
        if (dateMatch) {
            const parsed = new Date(dateMatch[0]);
            if (!isNaN(parsed.getTime())) {
                date = parsed.toISOString().split('T')[0];
            }
        }

        let confidence = 0;
        if (height) confidence += 0.4;
        if (weight) confidence += 0.4;
        if (date) confidence += 0.2;

        return {
            heightCm: height,
            weightKg: weight,
            measurementDate: date,
            confidence,
        };
    }

    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
            this.worker = null;
        }
    }
}

export const ocrService = new OCRService();