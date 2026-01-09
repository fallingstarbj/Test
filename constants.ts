
import { Question, TherapyScene } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "在过去的一周里，您是否感到由于排班不规律导致睡眠质量下降？",
    options: [
      { text: "从不", score: 0 },
      { text: "偶尔", score: 1 },
      { text: "经常", score: 2 },
      { text: "总是", score: 3 }
    ]
  },
  {
    id: 2,
    text: "您在工作中是否经常感到精神高度紧张，担心安全事故发生？",
    options: [
      { text: "完全没有", score: 0 },
      { text: "轻度紧张", score: 1 },
      { text: "明显紧张", score: 2 },
      { text: "极度焦虑", score: 3 }
    ]
  },
  {
    id: 3,
    text: "您是否感到长期在外地工作导致与家人沟通不畅，心情低落？",
    options: [
      { text: "很少", score: 0 },
      { text: "有时", score: 1 },
      { text: "非常多", score: 2 },
      { text: "极度痛苦", score: 3 }
    ]
  },
  {
    id: 4,
    text: "您是否觉得对目前的铁路工作失去了兴趣或动力？",
    options: [
      { text: "依然热爱", score: 0 },
      { text: "有些疲劳", score: 1 },
      { text: "比较厌倦", score: 2 },
      { text: "完全失去动力", score: 3 }
    ]
  },
  {
    id: 5,
    text: "当紧急情况发生时，您是否感到无法集中注意力？",
    options: [
      { text: "冷静应对", score: 0 },
      { text: "偶尔分心", score: 1 },
      { text: "很难集中", score: 2 },
      { text: "大脑一片空白", score: 3 }
    ]
  },
  {
    id: 6,
    text: "您是否感到近期脾气变得暴躁，容易因为小事对同事或乘客发火？",
    options: [
      { text: "没有变化", score: 0 },
      { text: "稍微有点", score: 1 },
      { text: "比较明显", score: 2 },
      { text: "完全无法控制", score: 3 }
    ]
  },
  {
    id: 7,
    text: "即使不在值班期间，您是否也难以从工作状态中切换出来，脑子里全是数据或计划？",
    options: [
      { text: "能够放松", score: 0 },
      { text: "偶尔想起", score: 1 },
      { text: "很难放下", score: 2 },
      { text: "完全被工作占据", score: 3 }
    ]
  },
  {
    id: 8,
    text: "您是否感到莫名的身体疲劳，即使休息了很久还是觉得很累？",
    options: [
      { text: "精力充沛", score: 0 },
      { text: "轻微疲劳", score: 1 },
      { text: "沉重疲劳", score: 2 },
      { text: "精疲力竭", score: 3 }
    ]
  },
  {
    id: 9,
    text: "您是否觉得周围的人（包括家人和朋友）都不理解您工作的特殊性和辛苦？",
    options: [
      { text: "感觉被理解", score: 0 },
      { text: "偶尔孤独", score: 1 },
      { text: "比较孤独", score: 2 },
      { text: "极度孤独隔绝", score: 3 }
    ]
  },
  {
    id: 10,
    text: "您对未来的职业生涯是否感到迷茫，甚至产生离职或转岗的冲动？",
    options: [
      { text: "目标明确", score: 0 },
      { text: "偶尔迷茫", score: 1 },
      { text: "经常动摇", score: 2 },
      { text: "每天都在考虑", score: 3 }
    ]
  }
];

export const THERAPY_SCENES: TherapyScene[] = [
  {
    id: 'forest',
    title: '静谧森林',
    description: '通过极简线条意象，感受微风绕林的宁静与生机。',
    imagePrompt: '',
    audioPrompt: '',
    videoUrl: '', 
    audioUrl: 'https://www.soundjay.com/nature/sounds/rain-01.mp3',
    icon: 'fa-tree'
  },
  {
    id: 'ocean',
    title: '蔚蓝海岸',
    description: '极简波浪律动，带你找回大海的宽广与松弛感。',
    imagePrompt: '',
    audioPrompt: '',
    videoUrl: '', 
    audioUrl: 'https://www.soundjay.com/nature/ocean-wave-1.mp3',
    icon: 'fa-water'
  },
  {
    id: 'zen',
    title: '禅意呼吸',
    description: '跟随光圈的律动调整呼吸，在极简中寻求专注。',
    imagePrompt: '',
    audioPrompt: '',
    videoUrl: '', 
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chime-1.mp3',
    icon: 'fa-leaf'
  }
];
