import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
  try {
    const res = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("❌ Lỗi listModels:", err.response?.data || err.message);
  }
}

listModels();
