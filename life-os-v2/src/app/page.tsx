'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Save, Settings, Cloud, Download, Upload, AlertCircle, CheckCircle, Loader2, User, GripVertical } from 'lucide-react'
// 引入拖曳套件
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

// --- 型別定義 ---
interface SystemField {
  id: string
  label: string
  value: string
  icon: string
}

interface System {
  id: number
  name: string
  isActive: boolean
  isEditing: boolean
  fields: SystemField[]
}

const REPO_NAME = 'life-system'
const FILE_PATH = 'system.json'

export default function LifeOSDashboard() {
  const [systems, setSystems] = useState<System[]>([
    {
      id: 1,
      name: '專注閱讀系統',
      isActive: true,
      isEditing: false,
      fields: [
        { id: 'f1', label: '目標 (Outcome)', value: '每週讀完一本書', icon: '🎯' },
        { id: 'f2', label: '行為 (Process)', value: '每晚 9 點把手機鎖在抽屜，閱讀 60 分鐘', icon: '⚙️' }
      ]
    },
    {
      id: 2,
      name: '晨間喚醒系統',
      isActive: false,
      isEditing: false,
      fields: [
        { id: 'f1', label: '目標 (Outcome)', value: '7:00 前起床', icon: '⏰' },
        { id: 'f2', label: '行為 (Process)', value: '鬧鐘放浴室，喝一杯溫水', icon: '💧' }
      ]
    }
  ])

  // --- GitHub Sync State ---
  const [githubToken, setGithubToken] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  // 防止 Hydration 錯誤的 flag
  const [isBrowser, setIsBrowser] = useState(false)

  // 初始化
  useEffect(() => {
    setIsBrowser(true) // 標記已進入瀏覽器環境
    const storedToken = localStorage.getItem('life_os_github_token')
    const storedUser = localStorage.getItem('life_os_github_user')
    if (storedToken) setGithubToken(storedToken)
    if (storedUser) setGithubUsername(storedUser)
  }, [])

  // --- Helpers ---
  const toBase64 = (str: string) => window.btoa(unescape(encodeURIComponent(str)))
  const fromBase64 = (str: string) => decodeURIComponent(escape(window.atob(str)))

  // --- GitHub API ---
  const saveSettings = (token: string, user: string) => {
    setGithubToken(token)
    setGithubUsername(user)
    localStorage.setItem('life_os_github_token', token)
    localStorage.setItem('life_os_github_user', user)
  }

  const syncWithGithub = async (direction: 'upload' | 'download') => {
    if (!githubToken || !githubUsername) {
        setSyncStatus('error')
        setStatusMessage('MISSING_CREDENTIALS')
        setShowSettings(true)
        return
    }

    setSyncStatus('loading')
    setStatusMessage(direction === 'upload' ? 'PUSHING...' : 'PULLING...')
    const apiUrl = `https://api.github.com/repos/${githubUsername}/${REPO_NAME}/contents/${FILE_PATH}`

    try {
        const getRes = await fetch(apiUrl, {
            headers: { Authorization: `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
        })

        if (direction === 'download') {
            if (!getRes.ok) throw new Error('Repo/File Not Found')
            const data = await getRes.json()
            setSystems(JSON.parse(fromBase64(data.content)))
            setStatusMessage('SYNC_COMPLETE')
        } else {
            let sha = ''
            if (getRes.ok) {
                const data = await getRes.json()
                sha = data.sha
            }
            const body = {
                message: `Update ${FILE_PATH}`,
                content: toBase64(JSON.stringify(systems, null, 2)),
                sha: sha || undefined
            }
            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: { Authorization: `token ${githubToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            if (!putRes.ok) throw new Error('Upload Failed')
            setStatusMessage('UPLOAD_COMPLETE')
        }
        setSyncStatus('success')
        setTimeout(() => setSyncStatus('idle'), 2000)
    } catch (err) {
        setSyncStatus('error')
        setStatusMessage((err as Error).message || 'ERROR')
    }
  }

  // --- Drag & Drop Logic ---
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(systems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSystems(items)
  }

  // --- System Logic ---
  const toggleSystemActive = (id: number) => {
    setSystems(systems.map(sys => sys.id === id ? { ...sys, isActive: !sys.isActive } : sys))
  }
  const toggleEditMode = (id: number) => {
    setSystems(systems.map(sys => sys.id === id ? { ...sys, isEditing: !sys.isEditing } : sys))
  }
  const updateSystemName = (id: number, name: string) => {
    setSystems(systems.map(sys => sys.id === id ? { ...sys, name } : sys))
  }
  const updateField = (systemId: number, fieldId: string, key: keyof SystemField, value: string) => {
    setSystems(systems.map(sys => {
      if (sys.id !== systemId) return sys
      return {
        ...sys,
        fields: sys.fields.map(field => field.id === fieldId ? { ...field, [key]: value } : field)
      }
    }))
  }
  const addField = (systemId: number) => {
    const newField: SystemField = { id: `f${Date.now()}`, label: '新欄位', value: '', icon: '📝' }
    setSystems(systems.map(sys => sys.id === systemId ? { ...sys, fields: [...sys.fields, newField] } : sys))
  }
  const deleteField = (systemId: number, fieldId: string) => {
    setSystems(systems.map(sys => sys.id === systemId ? { ...sys, fields: sys.fields.filter(f => f.id !== fieldId) } : sys))
  }
  const addNewSystem = () => {
    const newSystem: System = {
      id: Date.now(),
      name: '新系統',
      isActive: false,
      isEditing: true,
      fields: [
        { id: 'f1', label: '目標 (Outcome)', value: '', icon: '🎯' },
        { id: 'f2', label: '行為 (Process)', value: '', icon: '⚙️' }
      ]
    }
    setSystems([...systems, newSystem])
    // 延遲滾動
    setTimeout(() => {
        const bottom = document.body.scrollHeight
        window.scrollTo({ top: bottom, behavior: 'smooth' })
    }, 150)
  }
  const deleteSystem = (id: number) => {
    setSystems(systems.filter(sys => sys.id !== id))
  }
  const activeCount = systems.filter(s => s.isActive).length

  return (
    <div className="min-h-screen p-8 relative">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'var(--bg-color)' }}></div>

      {/* Header */}
      <header className="relative z-10 mb-16 border-b border-[#333] pb-6 flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-bold mb-3 cyber-title leading-relaxed">LIFE_OS_DASHBOARD</h1>
            <div className="flex items-center gap-6 text-sm font-bold font-mono">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${activeCount > 0 ? 'animate-pulse' : ''}`} style={{ backgroundColor: activeCount > 0 ? 'var(--primary-neon)' : '#333', boxShadow: activeCount > 0 ? '0 0 10px var(--primary-neon)' : 'none' }}></div>
                    <span style={{ color: activeCount > 0 ? 'var(--primary-neon)' : '#666' }}>SYSTEM: {activeCount > 0 ? 'ONLINE' : 'STANDBY'}</span>
                </div>
                {githubToken && githubUsername && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--secondary-neon)' }}>
                        <Cloud size={12} /> <span>REPO: {REPO_NAME}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Sync Buttons */}
        <div className="flex gap-4">
            {githubToken && githubUsername && (
                <div className="flex gap-2">
                    <button onClick={() => syncWithGithub('download')} className="cyber-btn-sm flex gap-2 items-center" title="Pull"><Download size={14} /> PULL</button>
                    <button onClick={() => syncWithGithub('upload')} className="cyber-btn-sm flex gap-2 items-center" title="Push"><Upload size={14} /> PUSH</button>
                </div>
            )}
            <button onClick={() => setShowSettings(!showSettings)} className="cyber-btn-sm" style={{ borderColor: showSettings ? 'var(--secondary-neon)' : '#666' }}><Settings size={16} /></button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="relative z-20 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <section className="cyber-panel border-t-2 border-t-[var(--secondary-neon)]">
                <h2 className="text-xl font-bold font-mono text-white mb-6 flex items-center gap-2"><Settings size={20} color="var(--secondary-neon)" /> REPO_CONFIGURATION</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm text-[var(--primary-neon)] font-mono flex items-center gap-2"><User size={14}/> GITHUB_USERNAME</label>
                        <input type="text" className="cyber-input font-mono" placeholder="Ex: ddes2" value={githubUsername} onChange={e => saveSettings(githubToken, e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-[var(--primary-neon)] font-mono">GITHUB_TOKEN (Scope: &apos;repo&apos;)</label>
                        <div className="flex gap-2">
                            <input type="password" className="cyber-input font-mono tracking-widest" placeholder="ghp_xxxxxxxxxxxx" value={githubToken} onChange={e => saveSettings(e.target.value, githubUsername)} />
                            {syncStatus === 'loading' && <Loader2 className="animate-spin text-[var(--primary-neon)]" />}
                            {syncStatus === 'success' && <CheckCircle className="text-[var(--primary-neon)]" />}
                            {syncStatus === 'error' && <AlertCircle className="text-red-500" />}
                        </div>
                    </div>
                    {statusMessage && <div className="text-xs font-mono p-2 border border-[#333] inline-block" style={{ color: syncStatus === 'error' ? 'red' : 'var(--primary-neon)' }}>&gt; STATUS: {statusMessage}</div>}
                </div>
            </section>
        </div>
      )}

      {/* Main List */}
      <div className="relative z-10 grid gap-8 max-w-4xl mx-auto pb-32">
        <section className="cyber-panel">
          <div className="flex justify-between items-center mb-10 border-b border-[#333] pb-4">
            <h2 className="text-xl font-bold font-mono text-white"><span style={{ color: 'var(--primary-neon)' }}>&gt;</span> INSTALLED_MODULES</h2>
            <div className="text-sm font-mono" style={{ color: 'var(--primary-neon)' }}>[{activeCount} / {systems.length}]</div>
          </div>

          {/* DnD Context Wrapper */}
          {isBrowser && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="system-list">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="flex flex-col gap-10" // 間距控制
                  >
                    {systems.map((system, index) => (
                      <Draggable key={system.id} draggableId={system.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`cyber-card transition-colors duration-200 ${system.isActive ? 'active' : ''}`}
                            style={{
                              ...provided.draggableProps.style,
                              // 拖曳時的效果
                              borderColor: snapshot.isDragging ? 'var(--primary-neon)' : undefined,
                              boxShadow: snapshot.isDragging ? '0 0 20px rgba(0,255,255,0.4)' : undefined,
                              zIndex: snapshot.isDragging ? 100 : 1
                            }}
                          >
                            <div className="flex items-center justify-between mb-8">
                              <div className="flex-1 flex gap-4 items-start">
                                {/* 拖曳手柄 (Drag Handle) */}
                                <div 
                                  {...provided.dragHandleProps} 
                                  className="mt-1 cursor-grab active:cursor-grabbing text-gray-600 hover:text-[var(--primary-neon)] transition-colors"
                                  title="Drag to reorder"
                                >
                                  <GripVertical size={24} />
                                </div>

                                <div className="flex-1">
                                  {system.isEditing ? (
                                    <input type="text" value={system.name} onChange={(e) => updateSystemName(system.id, e.target.value)} className="cyber-input text-lg font-bold mb-2 w-2/3" />
                                  ) : (
                                    <h3 className="text-2xl font-bold tracking-wider font-mono mb-2" style={{ color: system.isActive ? 'var(--secondary-neon)' : '#666', textShadow: system.isActive ? '0 0 8px var(--secondary-neon)' : 'none' }}>{system.name}</h3>
                                  )}
                                  <div className="text-xs flex gap-3 items-center font-mono">
                                    <span className="text-gray-600">ID_{system.id.toString().slice(-4)}</span>
                                    {system.isActive && <span className="text-[#0ff] animate-pulse">{'<RUNNING>'}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <button onClick={() => toggleEditMode(system.id)} className="cyber-btn-sm">{system.isEditing ? <><Save size={12} /> SAVE</> : <><Edit3 size={12} /> EDIT</>}</button>
                                {system.isEditing && <button onClick={() => deleteSystem(system.id)} className="cyber-btn-sm" style={{ borderColor: '#f00', color: '#f00' }}><Trash2 size={12} /> DEL</button>}
                                <label className="cyber-toggle"><input type="checkbox" checked={system.isActive} onChange={() => toggleSystemActive(system.id)} /><span className="cyber-slider"></span></label>
                              </div>
                            </div>

                            {(system.isActive || system.isEditing) && (
                              <div className="mt-8 pt-8 border-t border-[#333] flex flex-col gap-8 font-mono">
                                {system.fields.map((field) => (
                                  <div key={field.id} className="flex items-start gap-6">
                                    <div className="flex-shrink-0 mt-1">
                                      {system.isEditing ? (
                                        <input type="text" value={field.icon} onChange={(e) => updateField(system.id, field.id, 'icon', e.target.value)} className="w-12 h-12 text-center text-xl bg-[#050505] border border-[var(--primary-neon)] text-white outline-none rounded focus:bg-[#222] focus:shadow-[0_0_10px_var(--primary-neon)] transition-all" maxLength={2} />
                                      ) : (
                                        <div className="w-12 h-12 flex items-center justify-center border border-[#333] rounded bg-[#0a0a0a] text-2xl">
                                            {field.icon}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex-grow flex flex-col gap-3">
                                      <div className="text-sm font-bold tracking-wide" style={{ color: 'var(--primary-neon)' }}>
                                        {system.isEditing ? (
                                          <input type="text" value={field.label} onChange={(e) => updateField(system.id, field.id, 'label', e.target.value)} className="bg-transparent border-b border-[#333] hover:border-[var(--primary-neon)] outline-none w-full focus:border-[var(--primary-neon)] transition-colors" style={{ color: 'var(--primary-neon)' }} />
                                        ) : (
                                          field.label
                                        )}
                                      </div>
                                      <div className="text-base text-[#ddd] leading-relaxed tracking-wide">
                                         {system.isEditing ? (
                                           <textarea value={field.value} onChange={(e) => updateField(system.id, field.id, 'value', e.target.value)} className="cyber-input w-full" style={{ minHeight: '80px' }} placeholder="輸入內容..." />
                                         ) : (
                                           field.value
                                         )}
                                      </div>
                                    </div>

                                    {system.isEditing && (
                                      <button onClick={() => deleteField(system.id, field.id)} className="text-red-500 hover:text-red-400 p-2 border border-transparent hover:border-red-500 transition-all text-xs"><Trash2 size={14} /></button>
                                    )}
                                  </div>
                                ))}

                                {system.isEditing && (
                                  <button onClick={() => addField(system.id)} className="w-full py-3 border border-dashed border-[#444] text-[#666] hover:text-[#0ff] hover:border-[#0ff] hover:bg-[#001111] transition-all text-sm uppercase tracking-widest mt-2 font-mono"><Plus size={14} className="inline mr-2" /> ADD_PARAMETER</button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          
          <button onClick={addNewSystem} className="cyber-btn w-full mt-12 py-4 text-lg"><Plus size={20} /> INITIALIZE_NEW_SYSTEM</button>
        </section>
      </div>

      <button onClick={addNewSystem} className="fixed top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold transition-all z-50 group" style={{ backgroundColor: 'var(--primary-neon)', color: '#000', boxShadow: '0 0 20px var(--primary-neon)' }}><Plus size={24} /></button>
      <div className="fixed bottom-8 left-8 text-xs opacity-50 font-mono text-gray-600 z-50">LIFE-OS-V2.6_DRAGGABLE</div>
    </div>
  )
}