import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load API Keys from .env
const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
const apiKeys = rawKeys.split(',').map(key => key.trim()).filter(Boolean);

if (apiKeys.length === 0) {
    console.error('❌ Error: No GEMINI_API_KEYS found in .env file!');
    process.exit(1);
}

let currentKeyIndex = 0;

function getGenAIClient() {
    const apiKey = apiKeys[currentKeyIndex];
    return new GoogleGenAI({ apiKey });
}

function rotateKey() {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.log(`🔄 Rotated to Gemini API key index ${currentKeyIndex}`);
}

async function callGeminiWithRotation(apiCall) {
    let attempts = 0;
    while (attempts < apiKeys.length) {
        try {
            const ai = getGenAIClient();
            return await apiCall(ai);
        } catch (error) {
            console.warn(`⚠️ Key index ${currentKeyIndex} failed:`, error.message || error);
            rotateKey();
            attempts++;
        }
    }
    throw new Error('All provided Gemini API keys failed or hit quota limits.');
}

app.post('/api/workspace/prep', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    try {
        const result = await callGeminiWithRotation(async (ai) => {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are an executive workspace orchestrator. Given the user's task prompt, generate a context briefing and realistic dummy workspace resources (GitHub PRs, Google Docs, Figma links, Jira tickets).

User Prompt: "${prompt}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            taskTitle: { type: Type.STRING },
                            summaryBullets: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            suggestedAction: { type: Type.STRING },
                            resources: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        type: { type: Type.STRING, description: "github, drive, figma, jira, or docs" },
                                        url: { type: Type.STRING },
                                        snippet: { type: Type.STRING }
                                    },
                                    required: ["title", "type", "url", "snippet"]
                                }
                            }
                        },
                        required: ["taskTitle", "summaryBullets", "suggestedAction", "resources"]
                    }
                }
            });

            return JSON.parse(response.text);
        });

        return res.json({ success: true, data: result });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
export default app;