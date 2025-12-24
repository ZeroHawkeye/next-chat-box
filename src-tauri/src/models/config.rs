use serde::{Deserialize, Serialize};

/// 应用配置数据结构
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct AppConfig {
    /// 主题模式 (light/dark/system)
    #[serde(default)]
    pub theme: String,

    /// 主题色
    #[serde(default)]
    pub color: String,

    /// 缩放级别
    #[serde(default)]
    pub zoom: i32,

    /// 是否显示应用侧边栏
    #[serde(default)]
    pub show_app_rail: bool,

    /// 侧边栏是否展开
    #[serde(default)]
    pub sidebar_open: bool,

    /// 侧边栏宽度
    #[serde(default)]
    pub sidebar_width: i32,
}
