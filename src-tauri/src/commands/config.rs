use std::fs;
use tauri::{AppHandle, Manager};

use crate::error::AppResult;
use crate::models::AppConfig;

const CONFIG_FILE: &str = "settings.json";

/// 获取配置文件路径
fn get_config_file_path(app_handle: &AppHandle) -> AppResult<std::path::PathBuf> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get config dir: {}", e))?;

    Ok(config_dir.join(CONFIG_FILE))
}

/// 获取应用配置
#[tauri::command]
pub fn get_config(app_handle: AppHandle) -> AppResult<AppConfig> {
    let config_path = get_config_file_path(&app_handle)?;

    if config_path.exists() {
        let content = fs::read_to_string(&config_path)
            .map_err(|e| format!("Failed to read config: {}", e))?;
        let config: AppConfig =
            serde_json::from_str(&content).map_err(|e| format!("Failed to parse config: {}", e))?;
        Ok(config)
    } else {
        Ok(AppConfig::default())
    }
}

/// 保存应用配置
#[tauri::command]
pub fn set_config(app_handle: AppHandle, config: AppConfig) -> AppResult<()> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get config dir: {}", e))?;

    fs::create_dir_all(&config_dir).map_err(|e| format!("Failed to create config dir: {}", e))?;

    let config_path = config_dir.join(CONFIG_FILE);
    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;

    fs::write(&config_path, content).map_err(|e| format!("Failed to write config: {}", e))?;

    Ok(())
}

/// 删除配置文件
#[tauri::command]
pub fn delete_config(app_handle: AppHandle) -> AppResult<()> {
    let config_path = get_config_file_path(&app_handle)?;

    if config_path.exists() {
        fs::remove_file(&config_path).map_err(|e| format!("Failed to delete config: {}", e))?;
    }

    Ok(())
}

/// 获取配置文件路径
#[tauri::command]
pub fn get_config_path(app_handle: AppHandle) -> AppResult<String> {
    let config_path = get_config_file_path(&app_handle)?;
    Ok(config_path.to_string_lossy().to_string())
}
