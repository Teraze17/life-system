// src/lib/github.ts
import { Octokit } from "@octokit/rest";
import { LifeSystem } from "../app/new/types"; // 引入剛才定義的藍圖

// 設定 GitHub 連線
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const FILE_PATH = "system.json";

// 功能：取得所有系統
export async function getSystems(): Promise<LifeSystem[]> {
  try {
    // 1. 請求 GitHub 讀取檔案
    const response = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
    });

    // 2. GitHub 回傳的內容是 base64 編碼，需要解碼
    // 這裡做一些型別檢查，確保 data 是陣列或物件，並且有 content 屬性
    if (!Array.isArray(response.data) && "content" in response.data) {
      const content = Buffer.from(response.data.content, "base64").toString("utf-8");
      
      // 3. 把文字轉成 JSON 物件
      if (!content) return [];
      return JSON.parse(content) as LifeSystem[];
    }
    
    return [];
  } catch (error) {
    console.error("讀取 GitHub 資料失敗:", error);
    return [];
  }
}