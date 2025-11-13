import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    lang: { type: String, enum: ['hi', 'en'], default: 'en' }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
    userId: { type: String, default: 'anon' },
    messages: { type: [MessageSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Chat', ChatSchema);