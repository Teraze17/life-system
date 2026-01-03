// src/types.ts

// 這是「核心組件」的形狀
export interface SystemComponents {
  outcome: string;    // 目標
  process: string;    // 行為
  trigger: string;    // 觸發器
  environment: string;// 環境
  metric: string;     // 指標
}

// 這是「回顧紀錄」的形狀
export interface ReviewLog {
  date: string;
  rating: number;     // 1-5 分
  insight: string;
}

// 這是完整「人生系統」的形狀
export interface LifeSystem {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'optimizing'; // 狀態只能是這三種之一
  version: string;
  components: SystemComponents;
  review_logs?: ReviewLog[]; // ? 表示這個欄位是選填的，一開始可能沒有回顧
}