import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Plus,
  X,
  RotateCcw,
  Shuffle,
  Edit3,
  MinusCircle,
  Sparkles,
  Palette,
  Check,
} from 'lucide-react';
import { sound } from './utils/audio';

type ModeType = 'wheel' | 'slip' | 'dice' | 'coin' | 'cards' | 'finger';

interface OptionItem {
  id: string;
  text: string;
}

// ----------------------------------------------------------------------
// 8 CURATED LUXURY & SCI-FI VISUAL THEMES (Alignd with OS Style)
// ----------------------------------------------------------------------
interface VisualTheme {
  id: string;
  name: string;
  tag: string;
  description: string;
  isDark: boolean;
  bgBase: string;
  bgGradient: string;
  dotColor: string;
  textColor: string;
  subtextColor: string;
  stageCard: string;
  pillActive: string;
  pillInactive: string;
  horizonGlow: {
    start: string;
    mid: string;
    end: string;
    halo: string;
  };
  btnGlow: string;
  accentText: string;
  glassPanel: string;
  wheelColors: Array<{ fill: string; border: string }>;
}

const VISUAL_THEMES: Record<string, VisualTheme> = {
  minimalist: {
    id: 'minimalist',
    name: '极简黑白智能风',
    tag: 'Minimalist Clean',
    description: '包豪斯纯粹素白，清透呼吸感，黑白克制平衡',
    isDark: false,
    bgBase: '#F4F5F8',
    bgGradient: 'radial-gradient(ellipse 100% 70% at 50% 0%, #FFFFFF 0%, #F4F6F9 50%, #E8ECF2 100%)',
    dotColor: '#0F172A',
    textColor: 'text-slate-900',
    subtextColor: 'text-slate-500',
    stageCard: 'bg-white/95 border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)] text-slate-900',
    pillActive: 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm ring-2 ring-slate-900/10',
    pillInactive: 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100',
    btnGlow: 'bg-slate-900 hover:bg-black text-white font-bold shadow-[0_4px_16px_rgba(15,23,42,0.25)]',
    accentText: 'text-slate-900 font-bold',
    glassPanel: 'bg-white/95 border-slate-200 shadow-sm text-slate-900',
    horizonGlow: {
      start: '#0F172A',
      mid: '#FFFFFF',
      end: '#64748B',
      halo: '#CBD5E1',
    },
    wheelColors: [
      { fill: 'rgba(241, 245, 249, 0.95)', border: '#CBD5E1' },
      { fill: 'rgba(226, 232, 240, 0.95)', border: '#94A3B8' },
      { fill: 'rgba(248, 250, 252, 0.95)', border: '#CBD5E1' },
      { fill: 'rgba(203, 213, 225, 0.95)', border: '#64748B' },
      { fill: 'rgba(241, 245, 249, 0.95)', border: '#CBD5E1' },
      { fill: 'rgba(226, 232, 240, 0.95)', border: '#94A3B8' },
    ],
  },
  obsidian_orange: {
    id: 'obsidian_orange',
    name: '熔岩黑橙看板风',
    tag: 'Lava Charcoal',
    description: '深邃炭黑与熔岩炽橙，硬核利落高聚焦',
    isDark: true,
    bgBase: '#0C0A09',
    bgGradient: 'radial-gradient(ellipse 95% 65% at 50% 12%, rgba(249, 115, 22, 0.16) 0%, rgba(180, 83, 9, 0.06) 40%, #0C0A09 85%)',
    dotColor: '#F97316',
    textColor: 'text-amber-50',
    subtextColor: 'text-stone-400',
    stageCard: 'bg-[#151210]/90 border-orange-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(249,115,22,0.12)] text-amber-50',
    pillActive: 'bg-orange-500 text-stone-950 font-bold border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    pillInactive: 'bg-stone-900/70 border-white/10 text-stone-300 hover:bg-white/10',
    btnGlow: 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-stone-950 font-bold shadow-[0_0_24px_rgba(249,115,22,0.5)]',
    accentText: 'text-orange-400',
    glassPanel: 'bg-[#151210]/90 border-orange-500/25',
    horizonGlow: {
      start: '#F97316',
      mid: '#FED7AA',
      end: '#EA580C',
      halo: '#C2410C',
    },
    wheelColors: [
      { fill: 'rgba(249, 115, 22, 0.35)', border: 'rgba(251, 146, 60, 0.5)' },
      { fill: 'rgba(234, 88, 12, 0.35)', border: 'rgba(249, 115, 22, 0.45)' },
      { fill: 'rgba(251, 146, 60, 0.28)', border: 'rgba(253, 186, 116, 0.5)' },
      { fill: 'rgba(30, 27, 24, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
      { fill: 'rgba(194, 65, 12, 0.35)', border: 'rgba(251, 146, 60, 0.5)' },
      { fill: 'rgba(41, 37, 36, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
    ],
  },
  mint_glass: {
    id: 'mint_glass',
    name: '清透薄荷毛玻璃风',
    tag: 'Translucent Mint',
    description: '晨露薄荷与凝光白玻，清爽明润治愈',
    isDark: false,
    bgBase: '#EEF6F3',
    bgGradient: 'radial-gradient(ellipse 100% 70% at 50% 0%, #FFFFFF 0%, #EEF6F3 45%, #DCECE5 100%)',
    dotColor: '#14B8A6',
    textColor: 'text-teal-950',
    subtextColor: 'text-teal-700/80',
    stageCard: 'bg-white/85 border-teal-200/80 shadow-[0_16px_40px_rgba(13,148,136,0.08),0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-2xl text-teal-950',
    pillActive: 'bg-teal-700 text-white font-bold border-teal-700 shadow-sm ring-2 ring-teal-700/10',
    pillInactive: 'bg-white/85 border-teal-200 text-teal-800 hover:bg-teal-50',
    btnGlow: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-[0_4px_20px_rgba(13,148,136,0.35)]',
    accentText: 'text-teal-600 font-bold',
    glassPanel: 'bg-white/85 border-teal-200 shadow-sm text-teal-950',
    horizonGlow: {
      start: '#0D9488',
      mid: '#CCFBF1',
      end: '#10B981',
      halo: '#14B8A6',
    },
    wheelColors: [
      { fill: 'rgba(20, 184, 166, 0.28)', border: 'rgba(45, 212, 191, 0.5)' },
      { fill: 'rgba(16, 185, 129, 0.25)', border: 'rgba(52, 211, 153, 0.45)' },
      { fill: 'rgba(240, 253, 250, 0.95)', border: '#99F6E4' },
      { fill: 'rgba(13, 148, 136, 0.25)', border: 'rgba(45, 212, 191, 0.5)' },
      { fill: 'rgba(248, 250, 252, 0.95)', border: '#CBD5E1' },
      { fill: 'rgba(5, 150, 105, 0.25)', border: 'rgba(52, 211, 153, 0.45)' },
    ],
  },
  celestial: {
    id: 'celestial',
    name: '星云紫光深空风',
    tag: 'Nebula Violet',
    description: '深邃宇宙与星云流光，静谧幽远冥想感',
    isDark: true,
    bgBase: '#080512',
    bgGradient: 'radial-gradient(ellipse 95% 65% at 50% 12%, rgba(139, 92, 246, 0.22) 0%, rgba(99, 102, 241, 0.08) 40%, #080512 85%)',
    dotColor: '#A855F7',
    textColor: 'text-slate-100',
    subtextColor: 'text-slate-400',
    stageCard: 'bg-[#120B24]/90 border-violet-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(139,92,246,0.15)] text-slate-100',
    pillActive: 'bg-violet-600 text-white font-bold border-violet-400 shadow-[0_0_16px_rgba(139,92,246,0.5)]',
    pillInactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10',
    btnGlow: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-[0_0_24px_rgba(139,92,246,0.55)]',
    accentText: 'text-violet-400',
    glassPanel: 'bg-[#120B24]/90 border-violet-500/25',
    horizonGlow: {
      start: '#8B5CF6',
      mid: '#EDE9FE',
      end: '#7C3AED',
      halo: '#6366F1',
    },
    wheelColors: [
      { fill: 'rgba(124, 58, 237, 0.32)', border: 'rgba(167, 139, 250, 0.45)' },
      { fill: 'rgba(79, 70, 229, 0.28)', border: 'rgba(129, 140, 248, 0.4)' },
      { fill: 'rgba(139, 92, 246, 0.25)', border: 'rgba(196, 181, 253, 0.4)' },
      { fill: 'rgba(30, 41, 59, 0.7)', border: 'rgba(255, 255, 255, 0.15)' },
      { fill: 'rgba(109, 40, 217, 0.32)', border: 'rgba(167, 139, 250, 0.45)' },
      { fill: 'rgba(51, 65, 85, 0.7)', border: 'rgba(255, 255, 255, 0.15)' },
    ],
  },
  cyber: {
    id: 'cyber',
    name: '宙斯机甲暗黑风',
    tag: 'Zeus Cyber Mech',
    description: '钛金暗黑与电光青蓝，硬核科幻 HUD 仪表感',
    isDark: true,
    bgBase: '#050A12',
    bgGradient: 'radial-gradient(ellipse 95% 65% at 50% 12%, rgba(6, 182, 212, 0.20) 0%, rgba(2, 132, 199, 0.08) 40%, #050A12 85%)',
    dotColor: '#00F0FF',
    textColor: 'text-slate-100',
    subtextColor: 'text-slate-400',
    stageCard: 'bg-[#0A1320]/90 border-cyan-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(6,182,212,0.15)] text-slate-100',
    pillActive: 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.5)]',
    pillInactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10',
    btnGlow: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_24px_rgba(6,182,212,0.45)]',
    accentText: 'text-cyan-400',
    glassPanel: 'bg-[#0A1320]/90 border-cyan-500/25',
    horizonGlow: {
      start: '#00F0FF',
      mid: '#E0F2FE',
      end: '#0284C7',
      halo: '#0369A1',
    },
    wheelColors: [
      { fill: 'rgba(6, 182, 212, 0.32)', border: 'rgba(34, 211, 238, 0.45)' },
      { fill: 'rgba(14, 116, 144, 0.35)', border: 'rgba(6, 182, 212, 0.4)' },
      { fill: 'rgba(2, 132, 199, 0.3)', border: 'rgba(56, 189, 248, 0.4)' },
      { fill: 'rgba(15, 23, 42, 0.75)', border: 'rgba(255, 255, 255, 0.18)' },
      { fill: 'rgba(8, 145, 178, 0.35)', border: 'rgba(34, 211, 238, 0.45)' },
      { fill: 'rgba(30, 41, 59, 0.75)', border: 'rgba(255, 255, 255, 0.18)' },
    ],
  },
  sakura: {
    id: 'sakura',
    name: '霓光幻樱夜色风',
    tag: 'Neon Sakura',
    description: '霓虹暗夜粉紫光晕，空灵梦幻流光',
    isDark: true,
    bgBase: '#0E0611',
    bgGradient: 'radial-gradient(ellipse 95% 65% at 50% 12%, rgba(236, 72, 153, 0.20) 0%, rgba(168, 85, 247, 0.08) 40%, #0E0611 85%)',
    dotColor: '#EC4899',
    textColor: 'text-pink-50',
    subtextColor: 'text-pink-300/70',
    stageCard: 'bg-[#180C1E]/90 border-pink-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(236,72,153,0.15)] text-pink-50',
    pillActive: 'bg-pink-600 text-white font-bold border-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.5)]',
    pillInactive: 'bg-white/5 border-white/10 text-pink-200/80 hover:bg-white/10',
    btnGlow: 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white font-bold shadow-[0_0_24px_rgba(236,72,153,0.5)]',
    accentText: 'text-pink-400',
    glassPanel: 'bg-[#180C1E]/90 border-pink-500/25',
    horizonGlow: {
      start: '#EC4899',
      mid: '#FCE7F3',
      end: '#C084FC',
      halo: '#DB2777',
    },
    wheelColors: [
      { fill: 'rgba(236, 72, 153, 0.35)', border: 'rgba(244, 114, 182, 0.5)' },
      { fill: 'rgba(192, 132, 252, 0.32)', border: 'rgba(216, 180, 254, 0.45)' },
      { fill: 'rgba(219, 39, 119, 0.32)', border: 'rgba(244, 114, 182, 0.5)' },
      { fill: 'rgba(30, 20, 28, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
      { fill: 'rgba(168, 85, 247, 0.32)', border: 'rgba(216, 180, 254, 0.45)' },
      { fill: 'rgba(40, 25, 38, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
    ],
  },
  obsidian_gold: {
    id: 'obsidian_gold',
    name: '曜石黑金雅致风',
    tag: 'Obsidian Gold',
    description: '顶级黑金质感，香槟流金与曜石暗哑',
    isDark: true,
    bgBase: '#0A0907',
    bgGradient: 'radial-gradient(ellipse 95% 65% at 50% 12%, rgba(245, 158, 11, 0.16) 0%, rgba(180, 83, 9, 0.08) 40%, #0A0907 85%)',
    dotColor: '#F59E0B',
    textColor: 'text-amber-50',
    subtextColor: 'text-stone-400',
    stageCard: 'bg-[#15130F]/90 border-amber-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(245,158,11,0.12)] text-amber-50',
    pillActive: 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    pillInactive: 'bg-stone-900/70 border-white/10 text-stone-300 hover:bg-white/10',
    btnGlow: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 font-bold shadow-[0_0_24px_rgba(245,158,11,0.5)]',
    accentText: 'text-amber-400',
    glassPanel: 'bg-[#15130F]/90 border-amber-500/25',
    horizonGlow: {
      start: '#F59E0B',
      mid: '#FEF3C7',
      end: '#D97706',
      halo: '#B45309',
    },
    wheelColors: [
      { fill: 'rgba(217, 119, 6, 0.35)', border: 'rgba(251, 191, 36, 0.5)' },
      { fill: 'rgba(180, 83, 9, 0.35)', border: 'rgba(245, 158, 11, 0.45)' },
      { fill: 'rgba(245, 158, 11, 0.28)', border: 'rgba(252, 211, 77, 0.5)' },
      { fill: 'rgba(30, 27, 24, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
      { fill: 'rgba(161, 98, 7, 0.35)', border: 'rgba(251, 191, 36, 0.5)' },
      { fill: 'rgba(41, 37, 36, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
    ],
  },
  abyssal: {
    id: 'abyssal',
    name: '深海极渊碧蓝风',
    tag: 'Abyssal Ocean',
    description: '万米深海电光蓝弧，冷冽清澈幽谧',
    isDark: true,
    bgBase: '#030610',
    bgGradient: 'radial-gradient(ellipse 95% 65% at 50% 12%, rgba(59, 130, 246, 0.20) 0%, rgba(6, 182, 212, 0.08) 40%, #030610 85%)',
    dotColor: '#3B82F6',
    textColor: 'text-blue-50',
    subtextColor: 'text-blue-300/70',
    stageCard: 'bg-[#070E20]/90 border-blue-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(59,130,246,0.15)] text-blue-50',
    pillActive: 'bg-blue-600 text-white font-bold border-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.5)]',
    pillInactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10',
    btnGlow: 'bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-500 text-white font-bold shadow-[0_0_24px_rgba(59,130,246,0.5)]',
    accentText: 'text-blue-400',
    glassPanel: 'bg-[#070E20]/90 border-blue-500/25',
    horizonGlow: {
      start: '#3B82F6',
      mid: '#DBEAFE',
      end: '#06B6D4',
      halo: '#1D4ED8',
    },
    wheelColors: [
      { fill: 'rgba(59, 130, 246, 0.35)', border: 'rgba(96, 165, 250, 0.5)' },
      { fill: 'rgba(6, 182, 212, 0.32)', border: 'rgba(34, 211, 238, 0.45)' },
      { fill: 'rgba(29, 78, 216, 0.35)', border: 'rgba(96, 165, 250, 0.5)' },
      { fill: 'rgba(15, 23, 42, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
      { fill: 'rgba(37, 99, 235, 0.35)', border: 'rgba(96, 165, 250, 0.5)' },
      { fill: 'rgba(30, 41, 59, 0.8)', border: 'rgba(255, 255, 255, 0.15)' },
    ],
  },
};

const PRESETS = [
  {
    title: '今天吃什么',
    items: ['热腾腾火锅', '麻辣烫', '日料寿司', '麦当劳/KFC', '兰州牛肉面', '减脂轻食', '现炒快餐', '柳州螺蛳粉'],
  },
  {
    title: '下午茶点单',
    items: ['生椰拿铁', '手打柠檬茶', '波霸奶茶', '冰美式', '鲜果暴打茶', '温开水养生'],
  },
  {
    title: '去还是不去',
    items: ['去！遵从直觉', '不去，享受独处'],
  },
  {
    title: '买还是不买',
    items: ['买！喜欢就值', '不买！省下即赚', '先加购物车冷静3天'],
  },
  {
    title: '谁来洗碗',
    items: ['我来洗碗', '你来清洁', '剪刀石头布', '今天免单明天洗', '点外卖省得洗'],
  },
  {
    title: '周末放风',
    items: ['公园草坪野餐', '电影院看新片', '宅家补觉看剧', '逛当代美术馆', '近郊徒步登山', '文创市集闲逛'],
  },
];

const FORTUNE_BLESSINGS = [
  { blessing: '上上大吉 · 天命所归', poem: '春风得意马蹄疾，心之所向皆成真' },
  { blessing: '特上吉签 · 直觉神断', poem: '潜龙腾渊遇祥云，不必多虑即刻行' },
  { blessing: '大吉如意 · 万事亨通', poem: '顺应心意最自在，吉星高照顺风来' },
  { blessing: '胜意妙签 · 潜识最优', poem: '念头初动即良机，放开手脚定如意' },
  { blessing: '吉利畅达 · 逍遥自在', poem: '莫负当下好时光，笃定前行无彷徨' },
  { blessing: '天选神签 · 绝佳妙着', poem: '冥冥之中自有定，此选定然不负卿' },
];

const ARCANA_NAMES = [
  '0 · 愚者 (The Fool)',
  'I · 魔术师 (Magician)',
  'II · 女祭司 (Priestess)',
  'III · 皇后 (Empress)',
  'IV · 皇帝 (Emperor)',
  'V · 教皇 (Hierophant)',
  'VI · 恋人 (Lovers)',
  'VII · 战车 (Chariot)',
  'VIII · 力量 (Strength)',
  'IX · 隐士 (Hermit)',
  'X · 命运之轮 (Wheel of Fortune)',
  'XI · 正义 (Justice)',
];

export default function App() {
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_visual_theme') || 'celestial';
    }
    return 'celestial';
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const theme = useMemo(() => VISUAL_THEMES[activeThemeId] || VISUAL_THEMES.celestial, [activeThemeId]);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  const handleSelectTheme = (id: string) => {
    setActiveThemeId(id);
    sound.playTick(1.2);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_visual_theme', id);
    }
    const target = VISUAL_THEMES[id];
    if (target) {
      showToast(`已切换至「${target.name}」界面风格`);
    }
  };

  const [activeMode, setActiveMode] = useState<ModeType>('wheel');
  const [topic, setTopic] = useState('今天吃什么');

  const [options, setOptions] = useState<OptionItem[]>(() =>
    PRESETS[0].items.map((text, idx) => ({ id: `opt_${idx}`, text }))
  );

  const [winner, setWinner] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [newInput, setNewInput] = useState('');
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchText, setBatchText] = useState('');

  // 1. Multi-Style Decision Wheel State
  type WheelStyleType = 'chrono' | 'vinyl' | 'warp' | 'roulette';
  const [wheelStyle, setWheelStyle] = useState<WheelStyleType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('decision_wheel_style');
      if (saved === 'chrono' || saved === 'vinyl' || saved === 'warp' || saved === 'roulette') {
        return saved as WheelStyleType;
      }
    }
    return 'chrono';
  });

  const handleSelectWheelStyle = (style: WheelStyleType) => {
    setWheelStyle(style);
    sound.playSciFiTick();
    if (typeof window !== 'undefined') {
      localStorage.setItem('decision_wheel_style', style);
    }
    const styleNames: Record<WheelStyleType, string> = {
      chrono: '量子刻度仪盘 (Chrono Core)',
      vinyl: '极简工坊黑胶 (Studio Vinyl)',
      warp: '全息星轨光环 (Orbital Warp)',
      roulette: '皇家黑金轮盘 (Imperial Gold)',
    };
    showToast(`已更换转盘款式为「${styleNames[style]}」`);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const wheelLastIndexRef = useRef<number>(-1);

  // 2. Fortune Slip Cylinder (灵签神筒) State
  const [isShakingSlip, setIsShakingSlip] = useState(false);
  const [drawnSlip, setDrawnSlip] = useState<{
    text: string;
    blessing: string;
    poem: string;
  } | null>(null);

  // 3. 3D Dice State
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [diceNumber, setDiceNumber] = useState(1);
  const [diceRotations, setDiceRotations] = useState({ x: 0, y: 0 });

  // 4. Coin State
  const [isCoinFlipping, setIsCoinFlipping] = useState(false);
  const [coinRotation, setCoinRotation] = useState(0);
  const [coinStats, setCoinStats] = useState({ heads: 0, tails: 0 });

  // 5. Memory / Tarot Cards State
  const [cards, setCards] = useState<Array<{ id: string; text: string; flipped: boolean; arcanaName: string }>>([]);
  const [isCardShuffling, setIsCardShuffling] = useState(false);

  // 6. Multi-Touch Finger State
  const [touchPoints, setTouchPoints] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [fingerCountdown, setFingerCountdown] = useState<number | null>(null);
  const [fingerWinner, setFingerWinner] = useState<number | null>(null);
  const fingerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fingerCanvasRef = useRef<HTMLDivElement>(null);

  // Sync Cards
  useEffect(() => {
    setCards(
      [...options].sort(() => Math.random() - 0.5).slice(0, 12).map((o, idx) => ({
        id: `${o.id}_${idx}`,
        text: o.text,
        flipped: false,
        arcanaName: ARCANA_NAMES[idx % ARCANA_NAMES.length],
      }))
    );
  }, [options]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (fingerTimerRef.current) clearInterval(fingerTimerRef.current);
    };
  }, []);

  // -------------------------------------------------------------
  // MULTI-STYLE PRECISION TURNTABLE (Canvas Rendering)
  // -------------------------------------------------------------
  const drawWheel = useCallback(
    (rotationAngle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 2;
      const cssWidth = canvas.clientWidth || 360;
      const cssHeight = canvas.clientHeight || 360;

      if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const count = options.length;
      if (count === 0) {
        ctx.restore();
        return;
      }
      const sliceAngle = (2 * Math.PI) / count;

      // -------------------------------------------------------------
      // STYLE 1: CHRONO CORE (量子刻度仪盘 - 默认高精赛博刻度盘)
      // -------------------------------------------------------------
      if (wheelStyle === 'chrono') {
        const outerBezelR = 168;
        const innerBezelR = 145;
        const hubR = 48;

        // 1. Outer Tachymeter Milled Bezel
        ctx.save();
        const bezelGrad = ctx.createRadialGradient(centerX, centerY, innerBezelR, centerX, centerY, outerBezelR + 4);
        if (theme.isDark) {
          bezelGrad.addColorStop(0, '#1E2433');
          bezelGrad.addColorStop(0.5, '#121622');
          bezelGrad.addColorStop(1, '#080A10');
        } else {
          bezelGrad.addColorStop(0, '#FFFFFF');
          bezelGrad.addColorStop(0.5, '#E2E8F0');
          bezelGrad.addColorStop(1, '#CBD5E1');
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerBezelR, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerBezelR, 0, 2 * Math.PI, true);
        ctx.fillStyle = bezelGrad;
        ctx.fill();

        ctx.strokeStyle = theme.horizonGlow.start + (theme.isDark ? '66' : '99');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 72 Tachymeter Precision Tick Marks (Fixed Bezel)
        for (let i = 0; i < 72; i++) {
          const angle = (i * 5 * Math.PI) / 180;
          const isMajor = i % 6 === 0; // Every 30 deg
          const isCardinal = i % 18 === 0; // Every 90 deg (0, 90, 180, 270)
          const tickLen = isCardinal ? 9 : isMajor ? 6.5 : 3.5;

          const r1 = outerBezelR - 2;
          const r2 = r1 - tickLen;

          const x1 = centerX + r1 * Math.cos(angle);
          const y1 = centerY + r1 * Math.sin(angle);
          const x2 = centerX + r2 * Math.cos(angle);
          const y2 = centerY + r2 * Math.sin(angle);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = isCardinal
            ? theme.horizonGlow.start
            : isMajor
            ? theme.isDark ? '#94A3B8' : '#475569'
            : theme.isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';
          ctx.lineWidth = isCardinal ? 2 : isMajor ? 1.5 : 0.8;
          ctx.stroke();
        }

        // Cardinal Degree Labels (000°, 090°, 180°, 270°)
        const cardinals = [
          { text: '090°', angle: 0 },
          { text: '180°', angle: Math.PI / 2 },
          { text: '270°', angle: Math.PI },
          { text: '000°', angle: (3 * Math.PI) / 2 },
        ];
        ctx.font = 'bold 7px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = theme.horizonGlow.start;
        cardinals.forEach(({ text, angle }) => {
          const rx = centerX + (innerBezelR + 9) * Math.cos(angle);
          const ry = centerY + (innerBezelR + 9) * Math.sin(angle);
          ctx.fillText(text, rx, ry);
        });

        // 8 Socket Rivets on Outer Rim
        for (let r = 0; r < 8; r++) {
          const boltAngle = (r * 45 * Math.PI) / 180;
          const bx = centerX + (outerBezelR - 5) * Math.cos(boltAngle);
          const by = centerY + (outerBezelR - 5) * Math.sin(boltAngle);
          ctx.beginPath();
          ctx.arc(bx, by, 2, 0, 2 * Math.PI);
          ctx.fillStyle = theme.isDark ? '#334155' : '#CBD5E1';
          ctx.fill();
          ctx.strokeStyle = theme.isDark ? '#0F172A' : '#94A3B8';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        ctx.restore();

        // 2. Rotating Rotor Wedges
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotationAngle * Math.PI) / 180);

        for (let i = 0; i < count; i++) {
          const start = i * sliceAngle;
          const end = (i + 1) * sliceAngle;
          const sliceTheme = theme.wheelColors[i % theme.wheelColors.length];

          // Wedge shape from hub to innerBezelR
          ctx.beginPath();
          ctx.arc(0, 0, innerBezelR, start, end, false);
          ctx.arc(0, 0, hubR, end, start, true);
          ctx.closePath();

          // Radial Gradient for 3D Dished Gauge Perspective
          const grad = ctx.createRadialGradient(0, 0, hubR, 0, 0, innerBezelR);
          grad.addColorStop(0, theme.isDark ? '#0B0D13' : '#F1F5F9');
          grad.addColorStop(0.2, sliceTheme.fill);
          grad.addColorStop(1, sliceTheme.fill);
          ctx.fillStyle = grad;
          ctx.fill();

          // Spoke Divider Line with Metallic Sheen
          ctx.strokeStyle = sliceTheme.border;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Glowing Node Bead at Wedge Perimeter
          const beadX = innerBezelR * Math.cos(start);
          const beadY = innerBezelR * Math.sin(start);
          ctx.beginPath();
          ctx.arc(beadX, beadY, 2.2, 0, 2 * Math.PI);
          ctx.fillStyle = theme.horizonGlow.start;
          ctx.shadowColor = theme.horizonGlow.start;
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Slice Content (Micro-Index Badge + Text)
          ctx.save();
          const midAngle = start + sliceAngle / 2;
          ctx.rotate(midAngle);

          // 1. Micro-Index Badge near perimeter (01, 02...)
          const indexNum = String(i + 1).padStart(2, '0');
          ctx.font = 'bold 8px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = theme.isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.35)';
          ctx.fillText(indexNum, innerBezelR - 14, 0);

          // 2. Main Text Label
          ctx.font = `bold ${count > 10 ? 11 : count > 6 ? 12 : 13}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = theme.isDark ? '#FFFFFF' : '#0F172A';
          ctx.shadowColor = theme.isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.7)';
          ctx.shadowBlur = 4;
          const itemText = options[i].text;
          const maxChars = count > 10 ? 5 : count > 6 ? 6 : 7;
          const displayText = itemText.length > maxChars ? itemText.slice(0, maxChars - 1) + '…' : itemText;
          ctx.fillText(displayText, (innerBezelR - 26 + hubR) / 2, 0);
          ctx.restore();
        }

        ctx.restore(); // end rotating wedges

        // 3. Central Reactor Hub Collar
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, hubR, 0, 2 * Math.PI);
        const hubGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, hubR);
        hubGrad.addColorStop(0, theme.isDark ? '#0D111A' : '#FFFFFF');
        hubGrad.addColorStop(0.8, theme.isDark ? '#1A2234' : '#E2E8F0');
        hubGrad.addColorStop(1, theme.isDark ? '#0A0D13' : '#94A3B8');
        ctx.fillStyle = hubGrad;
        ctx.fill();
        ctx.strokeStyle = theme.horizonGlow.start + '88';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glowing core ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, hubR - 5, 0, 2 * Math.PI);
        ctx.strokeStyle = theme.horizonGlow.start;
        ctx.shadowColor = theme.horizonGlow.start;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

      // -------------------------------------------------------------
      // STYLE 2: STUDIO VINYL (极简工坊黑胶盘)
      // -------------------------------------------------------------
      } else if (wheelStyle === 'vinyl') {
        const outerR = 162;
        const hubR = 48;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotationAngle * Math.PI) / 180);

        // Dark Vinyl Body with Alternating Minimalist Contrast
        for (let i = 0; i < count; i++) {
          const start = i * sliceAngle;
          const end = (i + 1) * sliceAngle;
          const isEven = i % 2 === 0;

          ctx.beginPath();
          ctx.arc(0, 0, outerR, start, end, false);
          ctx.arc(0, 0, hubR, end, start, true);
          ctx.closePath();
          ctx.fillStyle = isEven
            ? theme.isDark ? '#161922' : '#F1F5F9'
            : theme.isDark ? '#0F1117' : '#E2E8F0';
          ctx.fill();
          ctx.strokeStyle = theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Slice Text
          ctx.save();
          const midAngle = start + sliceAngle / 2;
          ctx.rotate(midAngle);

          // Index
          ctx.font = 'bold 9px "Plus Jakarta Sans", monospace';
          ctx.fillStyle = theme.horizonGlow.start;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`[0${i + 1}]`, outerR - 16, 0);

          // Text
          ctx.font = `600 ${count > 10 ? 11 : 12.5}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = theme.isDark ? '#F8FAFC' : '#0F172A';
          const itemText = options[i].text;
          const displayText = itemText.length > 6 ? itemText.slice(0, 5) + '…' : itemText;
          ctx.fillText(displayText, (outerR - 28 + hubR) / 2, 0);
          ctx.restore();
        }

        // Concentric Vinyl Sound Grooves
        for (let g = hubR + 10; g < outerR - 6; g += 9) {
          ctx.beginPath();
          ctx.arc(0, 0, g, 0, 2 * Math.PI);
          ctx.strokeStyle = theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        ctx.restore();

        // Outer Sleek Rim
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerR + 2, 0, 2 * Math.PI);
        ctx.strokeStyle = theme.isDark ? '#334155' : '#CBD5E1';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Center 45-RPM Record Label Hub
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, hubR, 0, 2 * Math.PI);
        ctx.fillStyle = '#DC2626'; // Classic record red label
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner spindle ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, 14, 0, 2 * Math.PI);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

      // -------------------------------------------------------------
      // STYLE 3: ORBITAL WARP (全息星轨光环)
      // -------------------------------------------------------------
      } else if (wheelStyle === 'warp') {
        const outerR = 160;
        const hubR = 48;

        // Outer Holographic Star Rings
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([3, 7]);
        ctx.arc(centerX, centerY, outerR + 8, 0, 2 * Math.PI);
        ctx.strokeStyle = theme.horizonGlow.start + '55';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Rotating Energy Arc Petals
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotationAngle * Math.PI) / 180);

        for (let i = 0; i < count; i++) {
          const start = i * sliceAngle;
          const end = (i + 1) * sliceAngle;
          const sliceTheme = theme.wheelColors[i % theme.wheelColors.length];

          ctx.beginPath();
          ctx.arc(0, 0, outerR, start, end, false);
          ctx.arc(0, 0, hubR, end, start, true);
          ctx.closePath();

          ctx.fillStyle = sliceTheme.fill;
          ctx.fill();
          ctx.strokeStyle = theme.horizonGlow.start;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Star node at outer corner
          const px = outerR * Math.cos(start);
          const py = outerR * Math.sin(start);
          ctx.beginPath();
          ctx.arc(px, py, 2.8, 0, 2 * Math.PI);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = theme.horizonGlow.start;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Text
          ctx.save();
          const midAngle = start + sliceAngle / 2;
          ctx.rotate(midAngle);
          ctx.font = `600 ${count > 10 ? 11 : 12.5}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = theme.isDark ? '#FFFFFF' : '#0F172A';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const itemText = options[i].text;
          const displayText = itemText.length > 6 ? itemText.slice(0, 5) + '…' : itemText;
          ctx.fillText(displayText, (outerR + hubR) / 2, 0);
          ctx.restore();
        }
        ctx.restore();

        // Center Plasma Singularity Hub
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, hubR, 0, 2 * Math.PI);
        ctx.fillStyle = theme.isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = theme.horizonGlow.start;
        ctx.shadowColor = theme.horizonGlow.start;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

      // -------------------------------------------------------------
      // STYLE 4: IMPERIAL GOLD (皇家黑金轮盘)
      // -------------------------------------------------------------
      } else {
        const outerR = 168;
        const innerBezelR = 144;
        const hubR = 48;

        // 1. Polished Gold Bezel with 24 Milled Ball Pockets
        ctx.save();
        const goldGrad = ctx.createLinearGradient(centerX - outerR, centerY - outerR, centerX + outerR, centerY + outerR);
        goldGrad.addColorStop(0, '#F59E0B');
        goldGrad.addColorStop(0.3, '#FDE68A');
        goldGrad.addColorStop(0.6, '#D97706');
        goldGrad.addColorStop(1, '#B45309');

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerR, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerBezelR, 0, 2 * Math.PI, true);
        ctx.fillStyle = goldGrad;
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 24 Milled Dimples on Rim
        for (let b = 0; b < 24; b++) {
          const bAngle = (b * (360 / 24) * Math.PI) / 180;
          const bx = centerX + (outerR - 10) * Math.cos(bAngle);
          const by = centerY + (outerR - 10) * Math.sin(bAngle);
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, 2 * Math.PI);
          ctx.fillStyle = '#78350F';
          ctx.fill();
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        ctx.restore();

        // 2. Rotating Alternating Royal Obsidian & Ruby Sectors
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotationAngle * Math.PI) / 180);

        for (let i = 0; i < count; i++) {
          const start = i * sliceAngle;
          const end = (i + 1) * sliceAngle;
          const isEven = i % 2 === 0;

          ctx.beginPath();
          ctx.arc(0, 0, innerBezelR, start, end, false);
          ctx.arc(0, 0, hubR, end, start, true);
          ctx.closePath();

          ctx.fillStyle = isEven ? '#181A22' : '#881337'; // Obsidian vs Royal Burgundy
          ctx.fill();
          ctx.strokeStyle = '#F59E0B'; // Gold wire borders
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Slice Text in Gold Leaf
          ctx.save();
          const midAngle = start + sliceAngle / 2;
          ctx.rotate(midAngle);
          ctx.font = `bold ${count > 10 ? 11 : 12.5}px "Plus Jakarta Sans", serif`;
          ctx.fillStyle = '#FEF08A';
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 4;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const itemText = options[i].text;
          const displayText = itemText.length > 6 ? itemText.slice(0, 5) + '…' : itemText;
          ctx.fillText(displayText, (innerBezelR + hubR) / 2, 0);
          ctx.restore();
        }
        ctx.restore();

        // 3. Center Polished Brass Dome
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, hubR, 0, 2 * Math.PI);
        const domeGrad = ctx.createRadialGradient(centerX - 10, centerY - 10, 2, centerX, centerY, hubR);
        domeGrad.addColorStop(0, '#FEF9C3');
        domeGrad.addColorStop(0.5, '#F59E0B');
        domeGrad.addColorStop(1, '#92400E');
        ctx.fillStyle = domeGrad;
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    },
    [options, isWheelSpinning, theme, wheelStyle]
  );

  useEffect(() => {
    drawWheel(wheelRotation);
  }, [drawWheel, wheelRotation, theme, wheelStyle]);

  const spinWheel = useCallback(() => {
    if (isWheelSpinning || options.length < 2) return;

    setIsWheelSpinning(true);
    setWinner(null);

    const count = options.length;
    const sliceAngle = 360 / count;
    const winningIndex = Math.floor(Math.random() * count);

    const targetSliceMid = winningIndex * sliceAngle + sliceAngle / 2;
    const targetBase = ((270 - targetSliceMid) % 360 + 360) % 360;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 2));
    const startRot = wheelRotation % 360;
    const finalRot = wheelRotation + (360 - startRot) + extraSpins + targetBase;

    const startTime = performance.now();
    const duration = 4000;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentRot = wheelRotation + (finalRot - wheelRotation) * easeOutQuart(progress);

      setWheelRotation(currentRot);
      drawWheel(currentRot);

      const pointerAngle = ((270 - (currentRot % 360)) % 360 + 360) % 360;
      const currentIdx = Math.floor(pointerAngle / sliceAngle) % count;
      if (currentIdx !== wheelLastIndexRef.current) {
        sound.playSciFiTick();
        wheelLastIndexRef.current = currentIdx;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsWheelSpinning(false);
        setWinner(options[winningIndex].text);
        sound.playSciFiLock();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isWheelSpinning, options, wheelRotation, drawWheel]);

  // -------------------------------------------------------------
  // 2. FORTUNE SLIP CYLINDER (灵签神筒)
  // -------------------------------------------------------------
  const shakeSlip = () => {
    if (isShakingSlip || options.length === 0) return;
    setIsShakingSlip(true);
    setDrawnSlip(null);
    setWinner(null);

    sound.playSlipRattle();
    const interval = setInterval(() => {
      sound.playSlipRattle();
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      sound.playSlipDrop();
      sound.playSciFiLock();

      const picked = options[Math.floor(Math.random() * options.length)].text;
      const blessingData = FORTUNE_BLESSINGS[Math.floor(Math.random() * FORTUNE_BLESSINGS.length)];

      setIsShakingSlip(false);
      setDrawnSlip({
        text: picked,
        blessing: blessingData.blessing,
        poem: blessingData.poem,
      });
      setWinner(`🎋 ${blessingData.blessing} · ${picked}`);
    }, 1200);
  };

  // -------------------------------------------------------------
  // 3. 3D DICE
  // -------------------------------------------------------------
  const DICE_TRANSFORMS: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },
    2: { x: 90, y: 0 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: -90, y: 0 },
    6: { x: 180, y: 0 },
  };

  const rollDice = () => {
    if (isDiceRolling) return;
    setIsDiceRolling(true);
    setWinner(null);
    sound.playDiceRoll();

    const targetNum = Math.floor(Math.random() * 6) + 1;
    const targetFace = DICE_TRANSFORMS[targetNum];

    const extraX = 360 * (3 + Math.floor(Math.random() * 2));
    const extraY = 360 * (3 + Math.floor(Math.random() * 2));

    setDiceRotations({
      x: extraX + targetFace.x,
      y: extraY + targetFace.y,
    });

    setTimeout(() => {
      setIsDiceRolling(false);
      setDiceNumber(targetNum);
      sound.playSciFiLock();

      const matchingOption = options[(targetNum - 1) % options.length]?.text;
      setWinner(`🎲 晶相第 ${targetNum} 面 · ${matchingOption}`);
    }, 1300);
  };

  // -------------------------------------------------------------
  // 4. COIN
  // -------------------------------------------------------------
  const optionA = options[0]?.text || '正面 · 做！冲！';
  const optionB = options[1]?.text || '反面 · 算了，改天';

  const flipCoin = () => {
    if (isCoinFlipping) return;
    setIsCoinFlipping(true);
    setWinner(null);
    sound.playCoinToss();

    const isHeads = Math.random() >= 0.5;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 2));
    const targetAngle = isHeads ? 0 : 180;
    const nextRot = coinRotation + extraSpins + targetAngle;
    setCoinRotation(nextRot);

    setTimeout(() => {
      sound.playCoinLand();
      sound.playSciFiLock();
      setIsCoinFlipping(false);
      setCoinStats((prev) => ({
        heads: isHeads ? prev.heads + 1 : prev.heads,
        tails: !isHeads ? prev.tails + 1 : prev.tails,
      }));
      setWinner(isHeads ? `☀️ 阳面·天行健 · ${optionA}` : `🌙 阴面·地势坤 · ${optionB}`);
    }, 1450);
  };

  // -------------------------------------------------------------
  // 5. CARDS (TAROT ARCANA)
  // -------------------------------------------------------------
  const shuffleCards = () => {
    if (isCardShuffling) return;
    setIsCardShuffling(true);
    setWinner(null);
    sound.playCardFlip();

    setTimeout(() => {
      setCards(
        [...options].sort(() => Math.random() - 0.5).slice(0, 12).map((o, idx) => ({
          id: `${o.id}_${Date.now()}_${idx}`,
          text: o.text,
          flipped: false,
          arcanaName: ARCANA_NAMES[idx % ARCANA_NAMES.length],
        }))
      );
      setIsCardShuffling(false);
    }, 400);
  };

  const handleFlipCard = (index: number) => {
    if (isCardShuffling || cards[index].flipped) return;

    sound.playCardFlip();
    const updated = [...cards];
    updated[index].flipped = true;
    setCards(updated);
    setWinner(`🎴 ${updated[index].arcanaName} · ${updated[index].text}`);
    sound.playSciFiLock();
  };

  // -------------------------------------------------------------
  // 6. STELLAR LINK (Multi-touch)
  // -------------------------------------------------------------
  const startFingerCountdown = (pts: typeof touchPoints) => {
    if (fingerTimerRef.current) clearInterval(fingerTimerRef.current);
    setFingerWinner(null);
    setWinner(null);
    setFingerCountdown(3);
    sound.playHeartbeat();
    sound.playSciFiTick();

    let count = 3;
    fingerTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setFingerCountdown(count);
        sound.playHeartbeat();
        sound.playSciFiTick();
      } else {
        if (fingerTimerRef.current) clearInterval(fingerTimerRef.current);
        setFingerCountdown(0);
        sound.playSciFiLock();

        const chosenIndex = Math.floor(Math.random() * pts.length);
        const chosenId = pts[chosenIndex].id;
        setFingerWinner(chosenId);
        sound.playFanfare();
        setWinner(`天选之人 · 选手 #${chosenIndex + 1}`);
      }
    }, 1000);
  };

  const handleFingerCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fingerCanvasRef.current || fingerWinner !== null) return;
    const rect = fingerCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPt = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: theme.horizonGlow.start,
    };

    const nextPoints = [...touchPoints, newPt];
    setTouchPoints(nextPoints);

    if (nextPoints.length >= 2 && fingerCountdown === null) {
      startFingerCountdown(nextPoints);
    }
  };

  const handleFingerTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!fingerCanvasRef.current || fingerWinner !== null) return;
    e.preventDefault();
    const rect = fingerCanvasRef.current.getBoundingClientRect();
    const newPts: typeof touchPoints = [];

    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      newPts.push({
        id: t.identifier,
        x: t.clientX - rect.left,
        y: t.clientY - rect.top,
        color: theme.horizonGlow.start,
      });
    }

    setTouchPoints(newPts);
    if (newPts.length >= 2 && fingerCountdown === null) {
      startFingerCountdown(newPts);
    }
  };

  const resetFingerGame = () => {
    if (fingerTimerRef.current) clearInterval(fingerTimerRef.current);
    setTouchPoints([]);
    setFingerCountdown(null);
    setFingerWinner(null);
    setWinner(null);
  };

  // Option Handlers
  const handleSelectPreset = (p: typeof PRESETS[0]) => {
    setTopic(p.title);
    setWinner(null);
    setDrawnSlip(null);
    setOptions(p.items.map((text, idx) => ({ id: `opt_${idx}_${Date.now()}`, text })));
  };

  const handleAddOption = () => {
    const text = newInput.trim();
    if (!text) return;
    setWinner(null);
    setOptions((prev) => [...prev, { id: `opt_${Date.now()}`, text }]);
    setNewInput('');
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    setWinner(null);
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleEliminateWinner = () => {
    if (!winner || options.length <= 2) return;
    const cleanText = winner.includes('·') ? winner.split('·')[1].trim() : winner;
    setOptions((prev) => prev.filter((o) => o.text !== cleanText && o.text !== winner));
    setWinner(null);
    setDrawnSlip(null);
  };

  const handleShuffle = () => {
    setWinner(null);
    setOptions((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleOpenBatch = () => {
    setBatchText(options.map((o) => o.text).join('\n'));
    setIsBatchOpen(true);
  };

  const handleSaveBatch = () => {
    const lines = batchText
      .split(/[\n,，、]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length >= 2) {
      setWinner(null);
      setOptions(lines.map((text, idx) => ({ id: `opt_${Date.now()}_${idx}`, text })));
    }
    setIsBatchOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-all duration-500"
      style={{
        background: theme.bgGradient,
        backgroundColor: theme.bgBase,
        color: theme.isDark ? '#F8FAFC' : '#0F172A',
      }}
    >
      {/* ================= HIGH-END AMBIENT ATMOSPHERE ENGINE ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* 1. Core Luminous Spotlight Behind Center Stage */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[720px] sm:w-[980px] h-[520px] rounded-full blur-[100px] transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${theme.horizonGlow.start}24 0%, ${theme.horizonGlow.halo}10 45%, transparent 70%)`,
            opacity: theme.isDark ? 0.9 : 0.45,
          }}
        />

        {/* 2. Micro Coordinate Grid & Starlight Mesh (Sci-Fi Precision for Dark Themes) */}
        {theme.isDark && (
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${theme.horizonGlow.start} 1.2px, transparent 1.2px), linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
              backgroundSize: '40px 40px, 80px 80px, 80px 80px',
            }}
          />
        )}
      </div>

      {/* Floating Header */}
      <header className={`relative z-30 border-b backdrop-blur-xl px-5 sm:px-8 py-3.5 transition-colors ${
        theme.isDark ? 'border-white/[0.08] bg-[#07050E]/70' : 'border-slate-200/80 bg-white/75'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: theme.horizonGlow.start }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight">
                  Decision OS
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                  theme.isDark ? 'bg-white/10 border-white/20 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  {theme.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Selector Modal Trigger */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all hover:scale-105 active:scale-95 shadow-sm ${
                theme.isDark
                  ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
              }`}
              title="浏览全部主题工坊"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: theme.horizonGlow.start }} />
              <span>换主题风格</span>
              <span
                className="w-2 h-2 rounded-full ring-2 ring-white/30"
                style={{ backgroundColor: theme.horizonGlow.start }}
              />
            </button>

            {/* Mute Button */}
            <button
              onClick={() => {
                const next = sound.toggleMute();
                setIsMuted(next);
              }}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                theme.isDark ? 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title={isMuted ? '开启音效' : '静音'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
        {/* Hero Title Section */}
        <div className="text-center mb-5">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-medium mb-3 shadow-sm ${
              theme.isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <span style={{ color: theme.horizonGlow.start }}>✦</span>
            <span>欢迎来到你的智能决策空间 · 决策思维 OS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            做决定，从不需要纠结。
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            挑选决策模型，把复杂多解的难题交给纯粹概率的指引
          </p>
        </div>

        {/* ================= HORIZONTAL THEME PILLS BAR (Reference Style) ================= */}
        <div className="w-full flex items-center gap-2 overflow-x-auto scrollbar-none py-1 mb-5 px-1">
          {Object.values(VISUAL_THEMES).map((t) => {
            const isSelected = activeThemeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  isSelected ? t.pillActive : t.pillInactive
                }`}
                title={t.description}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs ring-1 ring-white/20"
                  style={{ backgroundColor: t.dotColor }}
                />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Selector Pill Bar */}
        <div className="w-full flex items-center justify-center mb-4">
          <div className={`inline-flex p-1 rounded-full overflow-x-auto max-w-full scrollbar-none shadow-xl border ${
            theme.isDark ? 'bg-[#0E1017]/85 border-white/10' : 'bg-slate-200/60 border-slate-300'
          }`}>
            {[
              { id: 'wheel', label: '星轨光环盘' },
              { id: 'slip', label: '神谕流光抽签' },
              { id: 'dice', label: '晶体星相骰' },
              { id: 'coin', label: '星弧双态币' },
              { id: 'cards', label: '隐秘星卡' },
              { id: 'finger', label: '星轨抓阄' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMode(m.id as ModeType);
                  setWinner(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeMode === m.id
                    ? `${theme.btnGlow} font-semibold`
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 mb-4 scrollbar-none">
          {PRESETS.map((p) => {
            const isCurrent = topic === p.title;
            return (
              <button
                key={p.title}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer border ${
                  isCurrent
                    ? theme.isDark ? 'bg-white/15 border-white/30 text-white font-semibold' : 'bg-slate-900 border-slate-900 text-white font-semibold'
                    : theme.isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {/* ================= INTERACTIVE STAGE CARD (OS Style) ================= */}
        <div className={`w-full rounded-3xl p-5 sm:p-7 border backdrop-blur-2xl transition-all duration-300 relative overflow-hidden my-2 select-none ${theme.stageCard}`}>
          {/* Card Top Sub-Header */}
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-current/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.horizonGlow.start }} />
              <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${theme.accentText}`}>
                {activeMode === 'wheel' ? '01 · 决策模型 // 星轨光环盘' :
                 activeMode === 'slip' ? '02 · 决策模型 // 神谕流光抽签' :
                 activeMode === 'dice' ? '03 · 决策模型 // 晶体星相骰' :
                 activeMode === 'coin' ? '04 · 决策模型 // 星弧双态币' :
                 activeMode === 'cards' ? '05 · 决策模型 // 隐秘星卡' :
                 '06 · 决策模型 // 星轨多人抓阄'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono opacity-60">
                {options.length} 个候选已同步
              </span>
            </div>
          </div>

          <div className="w-full min-h-[340px] flex flex-col items-center justify-center relative">
          {/* MODE 1: MULTI-STYLE PRECISION TURNTABLE */}
          {activeMode === 'wheel' && (
            <div className="flex flex-col items-center w-full">
              {/* Wheel Style Switcher Bar */}
              <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 mb-4 max-w-full overflow-x-auto scrollbar-none shadow-inner">
                {[
                  { id: 'chrono', label: '量子刻度仪', icon: '⚡' },
                  { id: 'vinyl', label: '极简工坊黑胶', icon: '💿' },
                  { id: 'warp', label: '全息星轨环', icon: '🌌' },
                  { id: 'roulette', label: '皇家黑金盘', icon: '👑' },
                ].map((st) => {
                  const isAct = wheelStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => handleSelectWheelStyle(st.id as WheelStyleType)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isAct
                          ? 'bg-white/20 text-white font-bold shadow-sm border border-white/30 scale-102'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="text-xs">{st.icon}</span>
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative flex items-center justify-center">
                {/* Ethereal Glow Behind Wheel */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl scale-110 pointer-events-none opacity-25"
                  style={{ backgroundColor: theme.horizonGlow.start }}
                />

                {/* High-DPI Canvas Turntable */}
                <canvas
                  ref={canvasRef}
                  className="w-[330px] h-[330px] sm:w-[360px] sm:h-[360px] cursor-pointer drop-shadow-2xl"
                  onClick={spinWheel}
                />

                {/* Precision Needle / Reticle Indicator */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
                  {wheelStyle === 'chrono' && (
                    <div className="relative flex flex-col items-center">
                      <svg width="28" height="38" viewBox="0 0 28 38" fill="none" className="drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
                        {/* Metallic chassis */}
                        <path d="M14 38L3 11C2 7 4 3 8 3H20C24 3 26 7 25 11L14 38Z" fill="#0A0D14" stroke={theme.horizonGlow.start} strokeWidth="1.8" />
                        {/* Internal neon prism */}
                        <path d="M14 34L6 11H22L14 34Z" fill={theme.horizonGlow.start} fillOpacity="0.45" />
                        {/* Sapphire/Ruby Center Laser Lens */}
                        <circle cx="14" cy="11" r="3.5" fill="#FFFFFF" />
                        <circle cx="14" cy="11" r="2" fill={theme.horizonGlow.start} />
                        {/* Laser Tip */}
                        <polygon points="14,37 11.5,29 16.5,29" fill="#FFFFFF" />
                      </svg>
                      {/* Downward laser projection beam */}
                      <div className="w-1 h-3 rounded-full -mt-1 shadow-lg animate-laser-pulse" style={{ backgroundColor: theme.horizonGlow.start }} />
                    </div>
                  )}

                  {wheelStyle === 'vinyl' && (
                    <div className="relative flex flex-col items-center">
                      {/* Vintage Turntable Tonearm Cartridge */}
                      <div className="w-5 h-8 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 rounded-sm shadow-xl border border-white/60 flex flex-col items-center justify-between p-0.5">
                        <div className="w-2.5 h-1 bg-slate-800 rounded-xs" />
                        <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm border border-red-300" />
                      </div>
                      {/* Sapphire Stylus Needle Tip */}
                      <div className="w-1 h-3 bg-red-500 shadow-md" style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }} />
                    </div>
                  )}

                  {wheelStyle === 'warp' && (
                    <div className="relative flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-cyan-400/80 flex items-center justify-center bg-cyan-950/80 shadow-[0_0_16px_rgba(6,182,212,0.8)]">
                        <span className="text-cyan-300 text-xs font-mono">▼</span>
                      </div>
                      <div className="w-1 h-3 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    </div>
                  )}

                  {wheelStyle === 'roulette' && (
                    <div className="relative flex flex-col items-center">
                      <svg width="26" height="36" viewBox="0 0 26 36" fill="none" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                        <path d="M13 36L3 12C2 8 4 4 8 4H18C22 4 24 8 23 12L13 36Z" fill="#78350F" stroke="#FDE047" strokeWidth="2" />
                        <polygon points="13,32 6,11 20,11" fill="#F59E0B" />
                        <circle cx="13" cy="11" r="3.5" fill="#EF4444" stroke="#FEF08A" strokeWidth="1" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Center 3D Tactile Trigger Hub */}
                <button
                  onClick={spinWheel}
                  disabled={isWheelSpinning || options.length < 2}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center font-bold transition-all duration-200 cursor-pointer ${
                    isWheelSpinning ? 'opacity-85 scale-95' : 'hover:scale-105 active:scale-90 shadow-2xl'
                  }`}
                  style={{
                    background: theme.isDark
                      ? 'radial-gradient(circle at 35% 35%, #2A334A 0%, #101420 70%, #080A10 100%)'
                      : 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #E2E8F0 70%, #94A3B8 100%)',
                    boxShadow: `0 0 24px ${theme.horizonGlow.start}44, 0 8px 18px rgba(0,0,0,0.55), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.6)`,
                    border: `2px solid ${theme.horizonGlow.start}`,
                  }}
                >
                  <span className="text-sm sm:text-base leading-none mb-0.5">
                    {isWheelSpinning ? '…' : wheelStyle === 'chrono' ? '⚡' : wheelStyle === 'vinyl' ? '💿' : wheelStyle === 'warp' ? '🌌' : '👑'}
                  </span>
                  <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: theme.isDark ? '#FFFFFF' : '#0F172A' }}>
                    {isWheelSpinning ? '转动中' : '启动'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: FORTUNE SLIP CYLINDER (神谕流光抽签) */}
          {activeMode === 'slip' && (
            <div className="flex flex-col items-center w-full max-w-md py-2 relative">
              {/* Ethereal Glow Behind Cylinder */}
              <div
                className="absolute inset-0 rounded-full blur-3xl scale-95 pointer-events-none opacity-25"
                style={{ backgroundColor: theme.horizonGlow.start }}
              />

              {/* Emerged Fortune Slip (天命灵签) when drawn */}
              {drawnSlip ? (
                <div className="w-full flex flex-col items-center animate-slip-rise my-2 z-20">
                  <div
                    className={`relative w-72 rounded-3xl p-6 border-2 shadow-2xl flex flex-col items-center text-center overflow-hidden ${
                      theme.isDark ? 'bg-[#0E1017]/95 border-amber-400/40 text-white' : 'bg-white border-amber-500/50 text-stone-900'
                    }`}
                    style={{
                      boxShadow: `0 0 35px ${theme.horizonGlow.start}55, 0 20px 40px rgba(0,0,0,0.6)`,
                    }}
                  >
                    {/* Shimmer light sweep overlay */}
                    <div className="absolute inset-0 shimmer-foil pointer-events-none" />

                    {/* Slip Top Cinnabar Red Cap */}
                    <div className="w-16 h-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-sm -mt-2 mb-3" />

                    {/* Blessing Title Badge */}
                    <div
                      className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider font-mono uppercase mb-2 border shadow-xs"
                      style={{
                        backgroundColor: theme.horizonGlow.start + '22',
                        borderColor: theme.horizonGlow.start + '66',
                        color: theme.isDark ? '#FDE047' : '#B45309',
                      }}
                    >
                      ✦ {drawnSlip.blessing} ✦
                    </div>

                    {/* Decorative Ancient Seal Icon */}
                    <div
                      className="w-11 h-11 rounded-full border-2 flex items-center justify-center my-1 text-sm font-bold shadow-inner"
                      style={{
                        borderColor: theme.horizonGlow.start,
                        color: theme.horizonGlow.start,
                        backgroundColor: theme.isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)',
                      }}
                    >
                      签
                    </div>

                    {/* Main Drawn Option Text */}
                    <div className="text-xl sm:text-2xl font-black tracking-tight my-3 px-2 leading-snug drop-shadow-sm">
                      {drawnSlip.text}
                    </div>

                    {/* Poetic Auspicious Guidance */}
                    <div className="text-xs text-slate-400 italic px-3 py-2 rounded-xl bg-white/5 border border-white/10 w-full mb-3">
                      “{drawnSlip.poem}”
                    </div>

                    <div className="text-[10px] font-mono opacity-60 tracking-widest uppercase">
                      CELESTIAL ORACLE // 天命所归
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={shakeSlip}
                      disabled={isShakingSlip}
                      className={`px-6 py-2.5 rounded-full text-xs font-semibold ${theme.btnGlow} transition-all cursor-pointer shadow-lg active:scale-95`}
                    >
                      <span>摇筒再抽一签</span>
                    </button>
                    <button
                      onClick={() => setDrawnSlip(null)}
                      className={`px-4 py-2.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        theme.isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      收回签筒
                    </button>
                  </div>
                </div>
              ) : (
                /* Authentic 3D Oriental Rosewood & Brass Shrine Cylinder */
                <div className="flex flex-col items-center">
                  <div
                    onClick={shakeSlip}
                    className={`relative w-52 h-72 flex flex-col items-center justify-end cursor-pointer group transition-transform ${
                      isShakingSlip ? 'animate-slip-shake scale-105' : 'hover:scale-103 active:scale-97'
                    }`}
                    title="点击摇动神筒抽签"
                  >
                    {/* Realistically Fanned Divination Bamboo Sticks Inside Mouth */}
                    <div className="absolute top-1 w-44 h-36 flex items-end justify-center pointer-events-none z-0">
                      {[
                        { rot: -18, height: 118, text: '吉', delay: '0s' },
                        { rot: -11, height: 126, text: '祥', delay: '0.12s' },
                        { rot: -5, height: 122, text: '泰', delay: '0.06s' },
                        { rot: 0, height: 136, text: '天命', delay: '0.18s', isCenter: true },
                        { rot: 5, height: 124, text: '通', delay: '0.08s' },
                        { rot: 12, height: 128, text: '顺', delay: '0.15s' },
                        { rot: 19, height: 120, text: '福', delay: '0.2s' },
                      ].map((stick, idx) => {
                        const isCenter = stick.isCenter;
                        const jumpOffset = isShakingSlip ? (idx % 2 === 0 ? -12 : -7) : 0;
                        return (
                          <div
                            key={idx}
                            className={`absolute w-3.5 rounded-t-sm border border-amber-900/50 shadow-md transition-all duration-300 flex flex-col items-center justify-start overflow-hidden ${
                              isCenter
                                ? 'bg-gradient-to-t from-amber-900 via-amber-700 to-amber-500 z-10 ring-1 ring-amber-300/60'
                                : 'bg-gradient-to-t from-stone-900 via-amber-950 to-amber-800'
                            }`}
                            style={{
                              height: `${stick.height}px`,
                              transform: `rotate(${stick.rot}deg) translateY(${jumpOffset - (isCenter ? 12 : 0)}px)`,
                              transformOrigin: 'bottom center',
                              boxShadow: isCenter ? `0 0 16px ${theme.horizonGlow.start}66` : '0 2px 6px rgba(0,0,0,0.5)',
                            }}
                          >
                            {/* Cinnabar Lacquer Tip (朱砂红首) */}
                            <div className="w-full h-4 bg-gradient-to-b from-red-600 via-rose-600 to-red-800 shadow-inner shrink-0" />
                            {/* Gold Inlaid Character */}
                            <span className="text-[8px] font-bold text-amber-200 font-serif leading-none mt-1 opacity-90 scale-90">
                              {stick.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cylinder Top Elliptical Rim Opening */}
                    <div className="relative z-10 w-40 h-8 -mb-4 rounded-full bg-gradient-to-b from-[#1C0F0A] to-[#0A0503] border-2 border-amber-500/70 shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-center">
                      <div className="w-36 h-5 rounded-full bg-[#080402] border border-amber-900/40" />
                    </div>

                    {/* Cylinder Authentic Curved Body */}
                    <div
                      className={`relative z-10 w-40 h-52 rounded-b-[2rem] p-3 border-x-2 border-b-2 flex flex-col items-center justify-between overflow-hidden shadow-2xl ${
                        theme.isDark
                          ? 'border-amber-500/40'
                          : 'border-amber-600/50'
                      }`}
                      style={{
                        background: 'linear-gradient(90deg, #1A0D08 0%, #35180E 22%, #4E2314 48%, #2F150C 76%, #140905 100%)',
                        boxShadow: `0 20px 40px rgba(0,0,0,0.7), inset 0 3px 6px rgba(255,255,255,0.15), inset 0 -8px 16px rgba(0,0,0,0.9), 0 0 25px ${theme.horizonGlow.start}25`,
                      }}
                    >
                      {/* Top Brass Hoop with Rivet Studs */}
                      <div className="w-full h-3 rounded-full bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 border border-amber-200/60 shadow-md flex items-center justify-around px-2">
                        <div className="w-1 h-1 rounded-full bg-amber-950" />
                        <div className="w-1 h-1 rounded-full bg-amber-950" />
                        <div className="w-1 h-1 rounded-full bg-amber-950" />
                        <div className="w-1 h-1 rounded-full bg-amber-950" />
                      </div>

                      {/* Center Ornate Medallion Sigil */}
                      <div className="flex flex-col items-center my-auto">
                        <div
                          className="w-16 h-16 rounded-full border-2 border-amber-400/60 flex flex-col items-center justify-center shadow-lg relative bg-black/60"
                          style={{
                            boxShadow: `0 0 20px ${theme.horizonGlow.start}44, inset 0 0 12px rgba(0,0,0,0.8)`,
                          }}
                        >
                          <div className="absolute inset-1 rounded-full border border-amber-300/30" />
                          <span className="text-xl leading-none text-amber-300 font-serif drop-shadow-md">靈</span>
                          <span className="text-[9px] font-bold text-amber-400 font-serif tracking-widest mt-0.5">
                            神簽
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-200 mt-2 font-serif tracking-widest">
                          御賜 · 天命靈簽
                        </span>
                        <span className="text-[10px] text-amber-300/70 mt-0.5 font-mono">
                          {isShakingSlip ? '神签共鸣摇动中…' : '轻触筒身或下方摇签'}
                        </span>
                      </div>

                      {/* Bottom Brass Hoop Band */}
                      <div className="w-full h-3.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700 border border-amber-200/60 shadow-md" />
                    </div>

                    {/* Pedestal Cast Shadow */}
                    <div
                      className="w-36 h-4 rounded-[100%] blur-md pointer-events-none opacity-60 -mt-1"
                      style={{ backgroundColor: theme.horizonGlow.start }}
                    />
                  </div>

                  {/* Trigger CTA Button */}
                  <button
                    onClick={shakeSlip}
                    disabled={isShakingSlip}
                    className={`mt-6 px-8 py-3 rounded-full text-xs font-bold ${theme.btnGlow} transition-all cursor-pointer active:scale-95 shadow-xl flex items-center gap-2`}
                  >
                    <span className="text-sm">✦</span>
                    <span>{isShakingSlip ? '神筒剧烈共鸣摇动中…' : '摇一摇 · 祈求天命神签'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: 3D DICE */}
          {activeMode === 'dice' && (
            <div className="flex flex-col items-center select-none py-2 w-full max-w-md">
              <div className="w-40 h-40 flex items-center justify-center perspective-800 relative">
                {/* Projected Radial Shadow & Ring below dice */}
                <div
                  className="absolute bottom-4 w-28 h-6 rounded-[100%] blur-md pointer-events-none opacity-40 transition-all duration-300"
                  style={{
                    backgroundColor: theme.horizonGlow.start,
                    transform: isDiceRolling ? 'scale(0.6)' : 'scale(1)',
                  }}
                />

                <div
                  onClick={rollDice}
                  className="relative w-24 h-24 preserve-3d cursor-pointer active:scale-95 transition-transform duration-[1300ms]"
                  style={{
                    transform: `rotateX(${diceRotations.x}deg) rotateY(${diceRotations.y}deg)`,
                    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
                  }}
                  title="点击掷骰子"
                >
                  {/* Face 1 */}
                  <div
                    className={`absolute inset-0 w-24 h-24 rounded-2xl border-2 shadow-2xl flex items-center justify-center backface-hidden backdrop-blur-md ${
                      theme.isDark ? 'bg-slate-900/90 border-white/25' : 'bg-white/95 border-stone-300'
                    }`}
                    style={{
                      transform: 'translateZ(48px)',
                      boxShadow: `0 0 20px ${theme.horizonGlow.start}33`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full shadow-lg ring-2 ring-white/40"
                      style={{ backgroundColor: theme.horizonGlow.start }}
                    />
                  </div>

                  {/* Face 6 */}
                  <div
                    className={`absolute inset-0 w-24 h-24 rounded-2xl border-2 shadow-2xl p-3.5 flex flex-col justify-between backface-hidden backdrop-blur-md ${
                      theme.isDark ? 'bg-slate-900/90 border-white/25' : 'bg-white/95 border-stone-300'
                    }`}
                    style={{ transform: 'rotateX(180deg) translateZ(48px)' }}
                  >
                    <div className="flex justify-between"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-between"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-between"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                  </div>

                  {/* Face 2 */}
                  <div
                    className={`absolute inset-0 w-24 h-24 rounded-2xl border-2 shadow-2xl p-3.5 flex flex-col justify-between backface-hidden backdrop-blur-md ${
                      theme.isDark ? 'bg-slate-900/90 border-white/25' : 'bg-white/95 border-stone-300'
                    }`}
                    style={{ transform: 'rotateY(90deg) translateZ(48px)' }}
                  >
                    <div className="flex justify-start"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-center"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-end"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                  </div>

                  {/* Face 5 */}
                  <div
                    className={`absolute inset-0 w-24 h-24 rounded-2xl border-2 shadow-2xl p-3.5 flex flex-col justify-between backface-hidden backdrop-blur-md ${
                      theme.isDark ? 'bg-slate-900/90 border-white/25' : 'bg-white/95 border-stone-300'
                    }`}
                    style={{ transform: 'rotateY(-90deg) translateZ(48px)' }}
                  >
                    <div className="flex justify-between"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-center"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-between"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                  </div>

                  {/* Face 3 */}
                  <div
                    className={`absolute inset-0 w-24 h-24 rounded-2xl border-2 shadow-2xl p-3.5 flex flex-col justify-between backface-hidden backdrop-blur-md ${
                      theme.isDark ? 'bg-slate-900/90 border-white/25' : 'bg-white/95 border-stone-300'
                    }`}
                    style={{ transform: 'rotateX(90deg) translateZ(48px)' }}
                  >
                    <div className="flex justify-between"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-center"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                  </div>

                  {/* Face 4 */}
                  <div
                    className={`absolute inset-0 w-24 h-24 rounded-2xl border-2 shadow-2xl p-3.5 flex flex-col justify-between backface-hidden backdrop-blur-md ${
                      theme.isDark ? 'bg-slate-900/90 border-white/25' : 'bg-white/95 border-stone-300'
                    }`}
                    style={{ transform: 'rotateX(-90deg) translateZ(48px)' }}
                  >
                    <div className="flex justify-start"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                    <div className="flex justify-end"><div className="w-3.5 h-3.5 rounded-full bg-slate-400" /></div>
                  </div>
                </div>
              </div>

              {/* 6-Face Mapping Astrolabe Grid */}
              <div className="w-full mt-4 grid grid-cols-3 gap-2 px-2">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const opt = options[(num - 1) % options.length]?.text;
                  const isWon = !isDiceRolling && diceNumber === num && winner !== null;
                  return (
                    <div
                      key={num}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isWon
                          ? 'border-2 scale-105 shadow-lg font-bold'
                          : theme.isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                      style={{
                        borderColor: isWon ? theme.horizonGlow.start : undefined,
                        boxShadow: isWon ? `0 0 16px ${theme.horizonGlow.start}44` : undefined,
                      }}
                    >
                      <div className="flex items-center justify-center gap-1 text-[10px] font-mono opacity-70">
                        <span>面 #{num}</span>
                        {isWon && <span style={{ color: theme.horizonGlow.start }}>★</span>}
                      </div>
                      <div className="text-xs truncate font-medium mt-0.5">
                        {opt}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={rollDice}
                disabled={isDiceRolling}
                className={`mt-5 px-8 py-2.5 rounded-full text-xs font-semibold ${theme.btnGlow} transition-all cursor-pointer active:scale-95 shadow-xl`}
              >
                {isDiceRolling ? '晶相骰高速翻滚中…' : '掷骰子定乾坤'}
              </button>
            </div>
          )}

          {/* MODE 4: COIN FLIP (3D MINTED COMMEMORATIVE MEDALLION) */}
          {activeMode === 'coin' && (
            <div className="flex flex-col items-center select-none py-2 w-full max-w-md perspective-1200">
              {/* Coin Parabolic Stage */}
              <div className="relative h-56 w-full flex items-center justify-center">
                {/* Dynamic Ground Shadow that expands and contracts on flip */}
                <div
                  className={`absolute bottom-2 w-36 h-6 rounded-[100%] blur-md pointer-events-none transition-all duration-700 ${
                    isCoinFlipping ? 'scale-40 opacity-15' : 'scale-100 opacity-60'
                  }`}
                  style={{ backgroundColor: theme.horizonGlow.start }}
                />

                {/* 3D Minted Coin Body */}
                <div
                  onClick={flipCoin}
                  className={`relative w-44 h-44 rounded-full cursor-pointer preserve-3d transition-all ${
                    isCoinFlipping
                      ? 'duration-[1450ms] ease-out -translate-y-28 scale-110'
                      : 'duration-200 hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    transform: `rotateX(${coinRotation}deg)`,
                    transitionTimingFunction: isCoinFlipping ? 'cubic-bezier(0.2, 0.85, 0.35, 1.05)' : 'ease-out',
                  }}
                  title="点击抛起金币"
                >
                  {/* SIDE A: HEADS (正面 · 乾阳金币 / High-Relief Helios Sunburst) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-full p-2.5 flex flex-col items-center justify-between text-center backface-hidden shadow-2xl overflow-hidden coin-sheen-gold border-4 border-amber-300"
                    style={{
                      boxShadow: `0 16px 36px rgba(0,0,0,0.6), inset 0 3px 6px rgba(255,255,255,0.8), inset 0 -4px 10px rgba(120,53,15,0.9), 0 0 25px ${theme.horizonGlow.start}55`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Beaded Knurled Outer Ring */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-amber-200/60 pointer-events-none" />

                    {/* Top Embossed Motto Banner */}
                    <div className="relative z-10 text-[9px] font-mono font-bold tracking-widest text-amber-950 uppercase pt-1 drop-shadow-xs">
                      ✦ DESTINY · 乾阳 ✦
                    </div>

                    {/* Center Embossed Helios Sunburst Emblem */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-100 shadow-inner flex items-center justify-center my-auto">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow-md">
                        {/* 16 Sun Rays */}
                        <g stroke="#78350F" strokeWidth="1.8" strokeLinecap="round">
                          <line x1="20" y1="2" x2="20" y2="7" />
                          <line x1="20" y1="33" x2="20" y2="38" />
                          <line x1="2" y1="20" x2="7" y2="20" />
                          <line x1="33" y1="20" x2="38" y2="20" />
                          <line x1="7" y1="7" x2="11" y2="11" />
                          <line x1="29" y1="29" x2="33" y2="33" />
                          <line x1="7" y1="33" x2="11" y2="29" />
                          <line x1="29" y1="11" x2="33" y2="7" />
                        </g>
                        <circle cx="20" cy="20" r="10" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
                        {/* Sun Face Expression */}
                        <circle cx="16.5" cy="18" r="1.5" fill="#78350F" />
                        <circle cx="23.5" cy="18" r="1.5" fill="#78350F" />
                        <path d="M16 23C17.5 25 22.5 25 24 23" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Bottom Minted Option Ribbon */}
                    <div className="relative z-10 w-full px-2 py-1 rounded-lg bg-amber-950/85 border border-amber-400/50 text-amber-100 shadow-md mb-1">
                      <span className="text-[11px] font-black line-clamp-1 leading-tight tracking-wide">
                        {optionA}
                      </span>
                    </div>
                  </div>

                  {/* SIDE B: TAILS (反面 · 坤阴银币 / High-Relief Selene Crescent Moon) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-full p-2.5 flex flex-col items-center justify-between text-center backface-hidden shadow-2xl overflow-hidden coin-sheen-silver border-4 border-slate-200"
                    style={{
                      boxShadow: `0 16px 36px rgba(0,0,0,0.6), inset 0 3px 6px rgba(255,255,255,0.9), inset 0 -4px 10px rgba(30,41,59,0.9), 0 0 25px ${theme.horizonGlow.halo}55`,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateX(180deg)',
                    }}
                  >
                    {/* Beaded Knurled Outer Ring */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-slate-400/60 pointer-events-none" />

                    {/* Top Embossed Motto Banner */}
                    <div className="relative z-10 text-[9px] font-mono font-bold tracking-widest text-slate-900 uppercase pt-1 drop-shadow-xs">
                      ✦ CHANCE · 坤阴 ✦
                    </div>

                    {/* Center Embossed Selene Crescent Moon Emblem */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 border border-white shadow-inner flex items-center justify-center my-auto">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow-md">
                        {/* Constellation stars */}
                        <circle cx="10" cy="12" r="1.2" fill="#334155" />
                        <circle cx="28" cy="8" r="1.5" fill="#334155" />
                        <circle cx="32" cy="24" r="1.2" fill="#334155" />
                        <circle cx="12" cy="30" r="1.2" fill="#334155" />
                        {/* Crescent Moon */}
                        <path
                          d="M26 10C17 10 11 16 11 23C11 28.5 14.5 33 20 34C15 32 14 26 15 22C16 17 21 12 26 10Z"
                          fill="#F8FAFC"
                          stroke="#1E293B"
                          strokeWidth="1.6"
                        />
                        {/* Moon eye & crater */}
                        <circle cx="17" cy="21" r="1.2" fill="#64748B" />
                        <circle cx="19" cy="27" r="1.5" fill="#94A3B8" />
                      </svg>
                    </div>

                    {/* Bottom Minted Option Ribbon */}
                    <div className="relative z-10 w-full px-2 py-1 rounded-lg bg-slate-950/85 border border-slate-300/50 text-slate-100 shadow-md mb-1">
                      <span className="text-[11px] font-black line-clamp-1 leading-tight tracking-wide">
                        {optionB}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Binary Flip History Ledger */}
              {(coinStats.heads > 0 || coinStats.tails > 0) && (
                <div className={`w-full px-4 py-2 mt-2 rounded-2xl border text-xs flex flex-col gap-1.5 ${
                  theme.isDark ? 'bg-white/5 border-white/10' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>☀️ 乾阳面: {coinStats.heads} 次</span>
                    <span>胜率 {Math.round((coinStats.heads / (coinStats.heads + coinStats.tails)) * 100)}%</span>
                    <span>🌙 坤阴面: {coinStats.tails} 次</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-700/40 overflow-hidden flex">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(coinStats.heads / (coinStats.heads + coinStats.tails)) * 100}%`,
                        backgroundColor: theme.horizonGlow.start,
                      }}
                    />
                    <div
                      className="h-full bg-slate-500 transition-all duration-300"
                      style={{
                        width: `${(coinStats.tails / (coinStats.heads + coinStats.tails)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={flipCoin}
                disabled={isCoinFlipping}
                className={`mt-4 px-8 py-3 rounded-full text-xs font-bold ${theme.btnGlow} transition-all cursor-pointer active:scale-95 shadow-xl flex items-center gap-2`}
              >
                <span className="text-sm">🪙</span>
                <span>{isCoinFlipping ? '精铸金币凌空飞旋中…' : '翻掷金币 · 一掷定乾坤'}</span>
              </button>
            </div>
          )}

          {/* MODE 5: CARDS (TAROT ARCANA) */}
          {activeMode === 'cards' && (
            <div className="flex flex-col items-center w-full max-w-md">
              <div className={`grid grid-cols-3 sm:grid-cols-4 gap-2.5 w-full p-4 rounded-3xl border shadow-2xl ${
                theme.isDark ? 'bg-[#0E1017]/85 border-white/10' : 'bg-white border-stone-200'
              }`}>
                {cards.slice(0, 12).map((card, idx) => (
                  <div
                    key={card.id}
                    onClick={() => handleFlipCard(idx)}
                    className={`h-28 rounded-2xl cursor-pointer perspective-800 transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${
                      isCardShuffling ? 'scale-75 opacity-30 translate-y-4' : ''
                    }`}
                  >
                    <div
                      className={`relative w-full h-full rounded-2xl shadow-md transition-transform duration-500 preserve-3d ${
                        card.flipped ? 'rotate-y-180' : ''
                      }`}
                      style={{
                        transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* Card Back: Ornate Holographic Mandala */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-2xl border-2 flex flex-col items-center justify-between p-2 backface-hidden text-xs relative overflow-hidden ${
                          theme.isDark
                            ? 'bg-gradient-to-br from-[#181D2D] via-[#0E111C] to-[#080910] border-amber-400/30 text-amber-200'
                            : 'bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 border-amber-500/40 text-amber-100'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          boxShadow: `inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.4)`,
                        }}
                      >
                        <div className="absolute inset-0 shimmer-foil pointer-events-none opacity-40" />
                        <span className="text-[9px] font-mono opacity-50 tracking-widest">ARCANA</span>
                        <div
                          className="w-9 h-9 rounded-full border border-amber-400/40 flex items-center justify-center text-sm shadow-sm"
                          style={{ color: theme.horizonGlow.start }}
                        >
                          ✧
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-wider">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Card Front: Revealed Choice */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-2xl border-2 p-2.5 flex flex-col items-center justify-between text-center backface-hidden shadow-2xl ${
                          theme.isDark ? 'bg-[#151824] border-amber-400/50 text-white' : 'bg-white border-amber-500/60 text-stone-900'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          boxShadow: `0 0 20px ${theme.horizonGlow.start}33`,
                        }}
                      >
                        <span className="text-[8px] font-mono text-amber-400 font-bold uppercase truncate max-w-full">
                          {card.arcanaName.split('(')[0]}
                        </span>
                        <span className="text-xs font-black line-clamp-3 leading-snug my-auto">
                          {card.text}
                        </span>
                        <span className="text-[8px] font-mono opacity-50">✦ REVEALED ✦</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={shuffleCards}
                disabled={isCardShuffling}
                className={`mt-4 px-6 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
                  theme.isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>洗牌重阵 · 翻开盲盒</span>
              </button>
            </div>
          )}

          {/* MODE 6: STELLAR LINK (Multi-touch Finger Roulette) */}
          {activeMode === 'finger' && (
            <div className="flex flex-col items-center w-full max-w-md select-none">
              <div
                ref={fingerCanvasRef}
                onClick={handleFingerCanvasClick}
                onTouchStart={handleFingerTouchStart}
                className={`relative w-full h-72 rounded-3xl border-2 shadow-2xl flex items-center justify-center cursor-crosshair overflow-hidden touch-none ${
                  theme.isDark ? 'bg-[#0A0D16]/95 border-white/10' : 'bg-stone-950 border-stone-800'
                }`}
                style={{
                  boxShadow: `0 0 30px ${theme.horizonGlow.start}22`,
                }}
              >
                {/* Concentric Radar Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-dashed border-white/30" />
                  <div className="w-44 h-44 rounded-full border border-white/20 absolute" />
                  <div className="w-24 h-24 rounded-full border border-dashed border-white/30 absolute" />
                  <div className="w-full h-px bg-white/20 absolute" />
                  <div className="h-full w-px bg-white/20 absolute" />
                </div>

                {/* SVG Live Constellation Connecting Beams */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  {touchPoints.map((p1, i) =>
                    touchPoints.slice(i + 1).map((p2) => (
                      <line
                        key={`${p1.id}-${p2.id}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={theme.horizonGlow.start}
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        strokeOpacity="0.75"
                        className="animate-pulse"
                      />
                    ))
                  )}
                </svg>

                {touchPoints.length === 0 && (
                  <div className="text-center text-slate-400 pointer-events-none p-4 z-20">
                    <div className="text-3xl mb-2 animate-bounce" style={{ color: theme.horizonGlow.start }}>
                      ✦
                    </div>
                    <p className="text-xs font-bold text-white">
                      请多人同时按住屏幕（或连续点击 2 个以上位置）
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      星轨光线自动连结 · 倒计时锁定天选之人
                    </p>
                  </div>
                )}

                {fingerCountdown !== null && fingerWinner === null && (
                  <div className="absolute z-30 flex flex-col items-center pointer-events-none">
                    <span
                      className="text-7xl font-black font-mono animate-pulse drop-shadow-lg"
                      style={{ color: theme.horizonGlow.start }}
                    >
                      {fingerCountdown > 0 ? fingerCountdown : '✦'}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase mt-1">
                      LOCKING ON TARGET...
                    </span>
                  </div>
                )}

                {/* Touch Nodes */}
                {touchPoints.map((pt, idx) => {
                  const isWon = fingerWinner === pt.id;
                  const isLost = fingerWinner !== null && fingerWinner !== pt.id;

                  return (
                    <div
                      key={pt.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 z-20 ${
                        isLost ? 'opacity-20 scale-75' : isWon ? 'scale-125 z-40' : 'scale-100'
                      }`}
                      style={{ left: pt.x, top: pt.y }}
                    >
                      {/* Pulse shockwave ring */}
                      <div
                        className="absolute -inset-3 rounded-full animate-ping opacity-30 pointer-events-none"
                        style={{ backgroundColor: pt.color }}
                      />
                      <div
                        className="w-13 h-13 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs text-white shadow-2xl relative"
                        style={{
                          backgroundColor: pt.color,
                          boxShadow: `0 0 25px ${pt.color}`,
                        }}
                      >
                        {isWon ? '👑' : `#${idx + 1}`}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between w-full px-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.horizonGlow.start }} />
                  <span>星位节点: {touchPoints.length}</span>
                </span>
                <button
                  onClick={resetFingerGame}
                  className="font-medium underline cursor-pointer hover:opacity-100 opacity-80"
                  style={{ color: theme.horizonGlow.start }}
                >
                  清空重置
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* ================= GORGEOUS RESULT CARD ================= */}
        {winner && (
          <div className={`w-full mt-6 p-6 rounded-3xl border shadow-2xl text-center animate-fade-in flex flex-col items-center relative overflow-hidden backdrop-blur-2xl ${theme.stageCard}`}>
            <div
              className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-xl pointer-events-none opacity-30"
              style={{ backgroundColor: theme.horizonGlow.start }}
            />

            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${theme.accentText}`}>
              FINAL CHOICE // 确立决定
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight my-1.5 drop-shadow-sm">
              {winner}
            </div>
            <p className="text-xs text-slate-400">
              遵从概率指引，第一反应往往就是潜意识的最优解！
            </p>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => {
                  if (activeMode === 'wheel') spinWheel();
                  else if (activeMode === 'slip') shakeSlip();
                  else if (activeMode === 'dice') rollDice();
                  else if (activeMode === 'coin') flipCoin();
                  else if (activeMode === 'cards') shuffleCards();
                  else if (activeMode === 'finger') resetFingerGame();
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold ${theme.btnGlow} transition-all flex items-center gap-1.5 cursor-pointer shadow-md`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>再来一次</span>
              </button>

              {options.some((o) => o.text === winner || winner.includes(o.text)) && options.length > 2 && (
                <button
                  onClick={handleEliminateWinner}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                    theme.isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:text-red-400' : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-red-500'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>排除此项继续选</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= SHARED CANDIDATE POOL CARD ================= */}
        <div className={`w-full mt-4 rounded-3xl p-5 sm:p-6 border backdrop-blur-2xl transition-all duration-300 ${theme.stageCard}`}>
          <div className="flex items-center justify-between mb-3.5 text-xs">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${theme.isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                当前决策候选 ({options.length})
              </span>
              <span className="text-[11px] opacity-60">· 实时全模式共享</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShuffle}
                className="opacity-75 hover:opacity-100 flex items-center gap-1 transition-opacity cursor-pointer text-xs"
                title="打乱顺序"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>打乱</span>
              </button>
              <button
                onClick={handleOpenBatch}
                className="opacity-75 hover:opacity-100 flex items-center gap-1 transition-opacity cursor-pointer text-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>批量修改</span>
              </button>
            </div>
          </div>

          {/* Option Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {options.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  theme.isDark
                    ? 'bg-white/5 border-white/10 text-slate-200'
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: theme.horizonGlow.start }}
                />
                <span>{item.text}</span>
                {options.length > 2 && (
                  <button
                    onClick={() => handleRemoveOption(item.id)}
                    className="opacity-50 hover:opacity-100 hover:text-red-400 ml-0.5 transition-colors cursor-pointer"
                    title="移除"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* Quick Add Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
              placeholder="输入新选项，按回车添加…"
              className={`flex-1 px-4 py-2.5 text-xs rounded-full border focus:outline-none transition-colors ${
                theme.isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-white/30'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400'
              }`}
            />
            <button
              onClick={handleAddOption}
              disabled={!newInput.trim()}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold ${theme.btnGlow} transition-opacity flex items-center gap-1 cursor-pointer disabled:opacity-40`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Theme Switch Toast Notification (Reference Image 3 Style) */}
      {toastMessage && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
          <div className={`px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-2xl border flex items-center gap-2.5 ${
            theme.isDark
              ? 'bg-[#150F26]/90 border-white/20 text-white shadow-purple-950/60 ring-1 ring-white/10'
              : 'bg-slate-900/90 border-slate-800 text-white shadow-slate-900/30 ring-1 ring-black/10'
          }`}>
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white/25"
              style={{ backgroundColor: theme.horizonGlow.start }}
            />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Batch Edit Modal */}
      {isBatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl relative overflow-hidden ${
            theme.isDark ? 'bg-[#0E1017] border-white/15' : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">
                批量修改候选选项
              </h3>
              <button
                onClick={() => setIsBatchOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">每行输入一个选项，或用逗号隔开：</p>
            <textarea
              rows={6}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              className={`w-full p-3 text-xs rounded-2xl font-mono focus:outline-none border mb-4 ${
                theme.isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
              placeholder="火锅&#10;奶茶&#10;牛肉面"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsBatchOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveBatch}
                className={`px-5 py-2 text-xs font-semibold ${theme.btnGlow} rounded-full cursor-pointer`}
              >
                应用更新
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Theme Button */}
      <button
        onClick={() => setIsThemeModalOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl border font-semibold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer ${
          theme.isDark
            ? 'bg-[#0E1017]/95 hover:bg-[#181B26] border-white/20 text-white'
            : 'bg-white/95 hover:bg-stone-50 border-stone-300 text-stone-900'
        }`}
        style={{
          boxShadow: `0 8px 30px ${theme.horizonGlow.start}44`,
        }}
        title="更换视觉主题风格"
      >
        <Palette className="w-4 h-4" style={{ color: theme.horizonGlow.start }} />
        <span>换主题</span>
        <span
          className="w-2.5 h-2.5 rounded-full ring-2 ring-white/30"
          style={{ backgroundColor: theme.horizonGlow.start }}
        />
        <span className="text-[11px] opacity-80 hidden sm:inline">{theme.name}</span>
      </button>

      {/* Full Theme Gallery Modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-2xl max-h-[90vh] rounded-3xl p-6 border shadow-2xl relative flex flex-col overflow-hidden ${
              theme.isDark ? 'bg-[#0B0D14] border-white/15 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: theme.horizonGlow.start }}
                >
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    更换视觉主题风格
                  </h3>
                  <p className="text-xs text-slate-400">
                    一键切换全套光影、星轨地平线、转盘色板与拟真材质
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Themes Grid */}
            <div className="overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pr-1">
              {Object.values(VISUAL_THEMES).map((t) => {
                const isSelected = activeThemeId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 scale-[1.01] shadow-xl'
                        : 'border-white/10 hover:border-white/25 hover:-translate-y-0.5'
                    }`}
                    style={{
                      background: t.bgGradient,
                      backgroundColor: t.bgBase,
                      borderColor: isSelected ? t.horizonGlow.start : undefined,
                      boxShadow: isSelected ? `0 0 24px ${t.horizonGlow.start}33` : undefined,
                      color: t.isDark ? '#F8FAFC' : '#0F172A',
                    }}
                  >
                    {/* Simulated Preview Banner */}
                    <div className="relative h-20 w-full rounded-xl overflow-hidden mb-3 border border-white/10 flex items-center justify-center bg-black/40">
                      {/* Ambient Aura Preview */}
                      <div
                        className="absolute inset-0 opacity-50 blur-lg"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${t.horizonGlow.start}, transparent 70%)`,
                        }}
                      />

                      {/* Mini Wheel Slices Preview Dots */}
                      <div className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                        {t.wheelColors.slice(0, 5).map((wc, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: wc.border }}
                          />
                        ))}
                      </div>

                      {/* Active Tag */}
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1"
                          style={{ backgroundColor: t.horizonGlow.start }}
                        >
                          <Check className="w-3 h-3" />
                          <span>当前使用</span>
                        </div>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${t.isDark ? 'text-white' : 'text-slate-900'}`}>
                            {t.name}
                          </span>
                          <span className={`text-[10px] font-mono uppercase tracking-wider ${t.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t.tag}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 line-clamp-1 ${t.isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {t.description}
                        </p>
                      </div>

                      <div
                        className="w-4 h-4 rounded-full border-2 border-white/40 shrink-0 mt-0.5 flex items-center justify-center"
                        style={{ backgroundColor: t.dotColor || t.horizonGlow.start }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                已生效主题：<strong className="text-white">{theme.name}</strong>（已自动保存）
              </span>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className={`px-6 py-2 rounded-full text-xs font-semibold ${theme.btnGlow} cursor-pointer hover:opacity-95`}
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
