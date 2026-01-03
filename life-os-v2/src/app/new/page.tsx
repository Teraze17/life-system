// src/app/new/page.tsx
import Link from "next/link";
import { createSystem } from "../actions"; // 確認這裡路徑是否有紅字，有的話改成 ../app/actions

export default function NewSystemPage() {
  return (
    <main className="min-h-screen bg-black text-cyan-400 font-mono p-6 flex flex-col justify-center items-center selection:bg-cyan-900 selection:text-white">
      
      {/* 裝飾用的背景網格 (Optional) */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* 主控制台容器 */}
      <div className="relative z-10 w-full max-w-3xl border-2 border-cyan-500 bg-gray-900/90 shadow-[0_0_20px_rgba(6,182,212,0.4)] p-1">
        
        {/* 頂部狀態列 */}
        <div className="flex justify-between items-center bg-cyan-900/30 p-2 border-b border-cyan-500 mb-6">
          <span className="text-xs tracking-widest text-cyan-200">SYSTEM: <span className="text-green-400 animate-pulse">ONLINE ●</span></span>
          <span className="text-xs text-cyan-600">ID: USER_001</span>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 mb-2 uppercase tracking-tighter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
            New Protocol Initialization
          </h1>
          <p className="text-xs text-cyan-600 mb-8 border-l-2 border-cyan-600 pl-2">
  {"// 請輸入新系統參數以覆寫當前行為模式..."}
          </p>
          
          <form action={createSystem} className="space-y-8">
            
            {/* 系統名稱 */}
            <div className="group">
              <label className="block text-xs font-bold text-purple-400 mb-1 uppercase tracking-widest group-focus-within:text-purple-300 transition-colors">
                &gt; System Name (系統代號)
              </label>
              <input 
                name="name" 
                required 
                autoComplete="off"
                placeholder="Ex: PROTOCOL_DEEP_SLEEP" 
                className="w-full bg-black border border-gray-700 text-cyan-300 p-3 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.5)] outline-none transition-all placeholder-gray-800" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 目標 */}
              <div className="group">
                <label className="block text-xs font-bold text-cyan-500 mb-1 uppercase tracking-widest group-focus-within:text-cyan-300">
                  &gt; Mission Objective (任務目標)
                </label>
                <textarea 
                  name="outcome" 
                  required 
                  rows={3} 
                  placeholder="一年後期望達成之狀態..." 
                  className="w-full bg-black border border-gray-700 text-cyan-300 p-3 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.5)] outline-none transition-all placeholder-gray-800 resize-none" 
                />
              </div>

              {/* 行為 */}
              <div className="group">
                <label className="block text-xs font-bold text-cyan-500 mb-1 uppercase tracking-widest group-focus-within:text-cyan-300">
                  &gt; Execution Protocol (執行程序)
                </label>
                <textarea 
                  name="process" 
                  required 
                  rows={3} 
                  placeholder="每日執行之微小行動..." 
                  className="w-full bg-black border border-gray-700 text-cyan-300 p-3 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.5)] outline-none transition-all placeholder-gray-800 resize-none" 
                />
              </div>
            </div>

            {/* 參數模組 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-800 p-4 bg-black/50">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Trigger Condition</label>
                <input name="trigger" placeholder="觸發條件" className="w-full bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:border-cyan-500 outline-none py-1" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Environment Config</label>
                <input name="environment" placeholder="環境設置" className="w-full bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:border-cyan-500 outline-none py-1" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1 uppercase">Success Metric</label>
                <input name="metric" placeholder="追蹤指標" className="w-full bg-transparent border-b border-gray-700 text-sm text-gray-300 focus:border-cyan-500 outline-none py-1" />
              </div>
            </div>

            {/* 控制區 */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
              <Link 
                href="/" 
                className="px-6 py-3 text-gray-500 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-600 transition uppercase text-sm tracking-wider"
              >
                [ Abort ]
              </Link>
              <button 
                type="submit" 
                className="px-8 py-3 bg-cyan-900/50 text-cyan-300 border border-cyan-500 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] transition-all duration-300 uppercase font-bold tracking-widest text-sm relative group overflow-hidden"
              >
                <span className="relative z-10">[ INITIALIZE SYSTEM ]</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}