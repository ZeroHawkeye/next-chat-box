import { isTauri } from "@/lib/platform"

export interface AppConfig {
  theme: string
  color: string
  zoom: number
  show_assistant_rail: boolean
  sidebar_open: boolean
  sidebar_width: number
}

const DEFAULT_CONFIG: AppConfig = {
  theme: "system",
  color: "default",
  zoom: 100,
  show_assistant_rail: true,
  sidebar_open: true,
  sidebar_width: 280,
}

const STORAGE_KEY = "app-config"

class ConfigStorage {
  private tauriInvoke = async <T>(cmd: string, args?: Record<string, unknown>): Promise<T> => {
    if (!isTauri()) {
      throw new Error("Not in Tauri environment")
    }
    const { invoke } = await import("@tauri-apps/api/core")
    return invoke(cmd, args) as Promise<T>
  }

  private loadFromLocalStorage(): AppConfig {
    if (typeof window === "undefined") return DEFAULT_CONFIG
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        return { ...DEFAULT_CONFIG, ...parsed }
      }
    } catch (e) {
      console.error("Failed to load config from localStorage:", e)
    }
    return DEFAULT_CONFIG
  }

  private saveToLocalStorage(config: AppConfig): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch (e) {
      console.error("Failed to save config to localStorage:", e)
    }
  }

  private clearLocalStorage(): void {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Failed to clear localStorage:", e)
    }
  }

  async load(): Promise<AppConfig> {
    if (isTauri()) {
      try {
        return await this.tauriInvoke<AppConfig>("get_config")
      } catch (e) {
        console.error("Failed to load config from Tauri:", e)
        return DEFAULT_CONFIG
      }
    }
    return this.loadFromLocalStorage()
  }

  async save(config: Partial<AppConfig>): Promise<void> {
    if (isTauri()) {
      const current = await this.load()
      const newConfig = { ...current, ...config }
      try {
        await this.tauriInvoke("set_config", { config: newConfig })
      } catch (e) {
        console.error("Failed to save config to Tauri:", e)
      }
    } else {
      const current = this.loadFromLocalStorage()
      const newConfig = { ...current, ...config }
      this.saveToLocalStorage(newConfig)
    }
  }

  async delete(): Promise<void> {
    if (isTauri()) {
      try {
        await this.tauriInvoke("delete_config")
      } catch (e) {
        console.error("Failed to delete config from Tauri:", e)
      }
    } else {
      this.clearLocalStorage()
    }
  }

  async getPath(): Promise<string | null> {
    if (isTauri()) {
      try {
        return await this.tauriInvoke<string>("get_config_path")
      } catch (e) {
        console.error("Failed to get config path:", e)
        return null
      }
    }
    return null
  }
}

export const configStorage = new ConfigStorage()
