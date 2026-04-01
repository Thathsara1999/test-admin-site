import axios from 'axios';
import { auth } from '../firebase'; // Your existing firebase config

const API_URL = 'https://us-central1-your-project-id.cloudfunctions.net/babyCardAPI';

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

// Add token to every request
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface BabyInfo {
    firstName: string;
    lastName?: string;
    birthDate: string;
    sex: 'male' | 'female';
    motherName: string;
}

export interface Measurement {
    heightCm: number;
    weightKg: number;
    measurementDate: string;
    notes?: string;
}

export interface ChatMessagePayload {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatReplyRequest {
    message: string;
    messages?: ChatMessagePayload[];
}

const resolveChatReply = (data: any): string => {
    if (typeof data?.reply === 'string' && data.reply.trim()) return data.reply;
    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    if (typeof data?.response === 'string' && data.response.trim()) return data.response;

    const choiceContent = data?.choices?.[0]?.message?.content;
    if (typeof choiceContent === 'string' && choiceContent.trim()) return choiceContent;

    return 'I could not generate a response right now.';
};

export const babyAPI = {
    // Upload baby card
    uploadBabyCard: async (
        imageFile: File,
        babyInfo: BabyInfo,
        measurement: Measurement,
        ocrData?: any
    ) => {
        const formData = new FormData();

        formData.append('image', imageFile);
        formData.append('babyInfo', JSON.stringify(babyInfo));
        formData.append('measurement', JSON.stringify(measurement));

        if (ocrData) {
            formData.append('ocrData', JSON.stringify(ocrData));
        }

        const response = await api.post('/upload-baby-card', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    },

    // Get all babies
    getMyBabies: async () => {
        const response = await api.get('/my-babies');
        return response.data.babies;
    },

    // Get single baby
    getBaby: async (babyId: string) => {
        const response = await api.get(`/baby/${babyId}`);
        return response.data;
    },
};

export const chatAPI = {
    getReply: async ({ message, messages = [] }: ChatReplyRequest): Promise<string> => {
        const endpoint = process.env.REACT_APP_AI_ENDPOINT_URL;

        if (endpoint && endpoint.trim()) {
            const response = await axios.post(
                endpoint,
                { message, messages },
                { timeout: 30000 }
            );

            return resolveChatReply(response.data);
        }

        const response = await api.post('/chat', { message, messages });
        return resolveChatReply(response.data);
    },
};