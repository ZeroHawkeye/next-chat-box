// 模块声明
mod commands;
mod error;
mod models;

// 导出供外部使用
pub use error::AppResult;
pub use models::AppConfig;

use commands::{delete_config, get_config, get_config_path, set_config};

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
