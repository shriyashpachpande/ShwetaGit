import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const hf = axios.create({
  baseURL: "https://api-inference.huggingface.co/models",
  headers: {
    Authorization: `Bearer ${process.env.HF_API_KEY}`,
  },
});
