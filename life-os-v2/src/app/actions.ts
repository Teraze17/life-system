// src/app/actions.ts
'use server'

import { Octokit } from "@octokit/rest";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { LifeSystem } from "./new/types"; // 如果這裡報錯，請改成 "../types"

// 設定 GitHub 連線
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
// 注意：這裡已經幫你改成單數了
const FILE_PATH = "system.json"; 

export async function createSystem(formData: FormData) {
  // 1. 從表單收集資料
  const rawData = {
    name: formData.get("name") as string,
    components: {
      outcome: formData.get("outcome") as string,
      process: formData.get("process") as string,
      trigger: formData.get("trigger") as string,
      environment: formData.get("environment") as string,
      metric: formData.get("metric") as string,
    }
  };

  // 2. 構建完整的系統物件
  const newSystem: LifeSystem = {
    id: Date.now().toString(),
    name: rawData.name,
    status: "active", // 預設為啟用
    version: "1.0",
    components: rawData.components,
    review_logs: []
  };

  try {
    // 3. 先去 GitHub 抓目前的檔案
    const { data: currentFile } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
    });

    if (!Array.isArray(currentFile) && "content" in currentFile) {
      // 解碼目前的內容
      const content = Buffer.from(currentFile.content, "base64").toString("utf-8");
      // 如果檔案是空的，就給一個空陣列
      const systems = JSON.parse(content || "[]");

      // 4. 把新系統加入陣列
      systems.push(newSystem);

      // 5. 寫回 GitHub
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: FILE_PATH,
        message: `Add system: ${newSystem.name}`,
        content: Buffer.from(JSON.stringify(systems, null, 2)).toString("base64"),
        sha: currentFile.sha, // 重要！必須帶上這個才能覆蓋
      });
    }
  } catch (error) {
    console.error("存檔失敗:", error);
    // 這裡我們不 throw error，避免讓使用者看到紅畫面，先在後台紀錄就好
  }

  // 6. 告訴首頁資料變了，並跳轉回去
  revalidatePath("/");
  redirect("/");
}