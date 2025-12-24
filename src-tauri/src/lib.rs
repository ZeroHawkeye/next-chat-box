use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle, Manager};

const CONFIG_FILE: &str = "settings.json";

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct AppConfig {
    #[serde(default)]
    pub theme: String,
    #[serde(default)]
    pub color: String,
    #[serde(default)]
    pub zoom: i32,
    #[serde(default)]
    pub show_app_rail: bool,
    #[serde(default)]
    pub sidebar_open: bool,
    #[serde(default)]
    pub sidebar_width: i32,
}

#[tauri::command]
fn get_config(app_handle: AppHandle) -> Result<AppConfig, String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get config dir: {}", e))?;

    let config_path = config_dir.join(CONFIG_FILE);

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

#[tauri::command]
fn set_config(app_handle: AppHandle, config: AppConfig) -> Result<(), String> {
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

#[tauri::command]
fn delete_config(app_handle: AppHandle) -> Result<(), String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get config dir: {}", e))?;

    let config_path = config_dir.join(CONFIG_FILE);

    if config_path.exists() {
        fs::remove_file(&config_path).map_err(|e| format!("Failed to delete config: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
fn get_config_path(app_handle: AppHandle) -> Result<String, String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get config dir: {}", e))?;

    let config_path = config_dir.join(CONFIG_FILE);
    Ok(config_path.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_config,
            set_config,
            delete_config,
            get_config_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
