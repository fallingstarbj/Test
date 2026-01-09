
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAssessment = async (score: number, questions: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `根据铁路职工心理测评得分 ${score}/30（总分30分），提供深度分析。
    
    0-5分：身心极佳，处于巅峰状态。
    6-11分：状态良好，有轻微疲劳。
    12-19分：轻度压力，建议进行干预。
    20-24分：中度压力，需高度重视。
    25-30分：极高压力，建议寻求专业咨询。
    
    请结合铁路行业特点（高强度安全责任、不规律排班、长时间户外或密闭空间、长期离家等压力源）给出建议。`,
    config: {
      systemInstruction: `你是一名资深的铁路行业心理咨询师。
      请以 JSON 格式返回结果，包含以下字段：
      1. 'analysis': 对当前心理状态的总体概括。
      2. 'guidance': 包含 3-4 条具体的、可操作的缓解建议（如：针对夜班后的睡眠调理、针对安全压力下的呼吸法、针对离家孤独感的沟通建议等）。
      3. 'recommendedSceneId': 从 'forest', 'ocean', 'zen' 中选一个最适合当前分数的。`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          guidance: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "具体的行动指南和缓解压力的方法" 
          },
          recommendedSceneId: { type: Type.STRING }
        },
        required: ["analysis", "guidance", "recommendedSceneId"]
      }
    }
  });
  
  try {
    const text = response.text;
    return JSON.parse(text);
  } catch (e) {
    return { 
      analysis: "测评已完成。", 
      guidance: ["保持规律作息", "尝试进行深呼吸练习", "多与家人同事交流"],
      recommendedSceneId: 'forest' 
    };
  }
};

export const chatWithAI = async (message: string, history: any[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "你是'铁道心语'AI心理辅导员。专门服务于铁路职工（驾驶员、乘务员、工务、电务、供电、货运、调度等）。你的回复要专业、温暖且接地气，能识别铁路特定的术语和压力场景。"
    }
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
};
