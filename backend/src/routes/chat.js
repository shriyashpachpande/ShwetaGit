import express from 'express';
import Chat from '../models/Chat.js';
import { replyMedical, detectLang } from '../services/llm.js';

const router = express.Router();

router.post('/send', async (req, res) => {
    try {
        const { chatId, text } = req.body || {};
        if (!text || !String(text).trim()) {
            return res.status(400).json({ error: 'Empty message' });
        }
        const lang = detectLang(text);
        let chat = chatId ? await Chat.findById(chatId) : null;
        if (!chat) chat = await Chat.create({ userId: 'anon', messages: [] });

        const history = chat.messages.slice(-10);
        const { text: botText, lang: outLang } = await replyMedical({ history, userText: text });

        chat.messages.push({ role: 'user', content: text, lang });
        chat.messages.push({ role: 'assistant', content: botText, lang: outLang });
        await chat.save();

        return res.json({ ok: true, chatId: chat._id.toString(), reply: botText, lang: outLang });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Chat failed', details: e.message });
    }
});
export default router;  