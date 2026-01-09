
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAssessment = async (score: number, questions: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `根据铁路职工心理测评得分 ${score}/30（总分30分），提供专业分析。0-5分极佳，6-11分良好，12-19分轻度压力，20-24分中度压力，25-30分高压。请从'forest' (静谧森林), 'ocean' (蔚蓝海岸), 'zen' (禅意茶室) 中选择一个最适合的疗愈场景作为治疗建议。`,
    config: {
      systemInstruction: "你是一名专业的铁路行业心理咨询师。请返回JSON格式，包含 'analysis' (详细的文字分析与关怀建议) 和 'recommendedSceneId' (推荐的场景ID)。分析内容要贴合铁路工种（排班、安全责任、长时间离家等）的实际心理压力源。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          recommendedSceneId: { type: Type.STRING, description: "Must be one of: forest, ocean, zen" }
        },
        required: ["analysis", "recommendedSceneId"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { analysis: response.text, recommendedSceneId: 'forest' };
  }
};

// 已移除 generateTherapyVideo，改为直接使用常量中的 URL

export const generateTherapyAudio = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const chatWithAI = async (message: string, history: any[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "你是'铁道心语'AI心理辅导员。专门服务于铁路职工，语言要专业、亲切，能够理解铁路工种（驾驶、调度、检修等）的辛苦。提供实用的解压技巧。"
    }
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
};
