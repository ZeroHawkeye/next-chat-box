/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      // 根字体大小基准，1rem = 16px (100% 缩放)
      // 此值由 useThemeStore 的 applyZoom 动态设置
      DEFAULT: "16px",
    },
    screens: {
      // Apple 设备断点
      "xs": "480px",    // iPhone Plus/Max
      "sm": "640px",    // iPad Mini 竖屏
      "md": "768px",    // iPad 竖屏
      "lg": "1024px",   // iPad 横屏
      "xl": "1280px",   // MacBook Air
      "2xl": "1536px",  // MacBook Pro/iMac
    },
    extend: {
      // 间距系统 - 基于 rem 的间距（响应缩放）
      spacing: {
        "0": "0rem",
        "0.5": "0.125rem",
        "1": "0.25rem",
        "1.5": "0.375rem",
        "2": "0.5rem",
        "2.5": "0.625rem",
        "3": "0.75rem",
        "3.5": "0.875rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "7": "1.75rem",
        "8": "2rem",
        "9": "2.25rem",
        "10": "2.5rem",
        "11": "2.75rem",
        "12": "3rem",
        "14": "3.5rem",
        "16": "4rem",
        "20": "5rem",
        "24": "6rem",
      },
      // Apple 圆角系统 - 连续曲率
      borderRadius: {
        "xs": "var(--radius-xs)",
        "sm": "var(--radius-sm)",
        "DEFAULT": "var(--radius)",
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "xl": "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        "full": "var(--radius-full)",
      },
      // Apple 颜色系统
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
          tertiary: "hsl(var(--background-tertiary))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          secondary: "hsl(var(--foreground-secondary))",
          tertiary: "hsl(var(--foreground-tertiary))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          secondary: "hsl(var(--border-secondary))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // 侧边栏
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          muted: "hsl(var(--sidebar-muted))",
        },
        // 标题栏
        titlebar: {
          DEFAULT: "hsl(var(--titlebar))",
          foreground: "hsl(var(--titlebar-foreground))",
          border: "hsl(var(--titlebar-border))",
        },
        // Apple 系统颜色
        apple: {
          blue: "#007AFF",
          "blue-dark": "#0A84FF",
          green: "#34C759",
          "green-dark": "#30D158",
          indigo: "#5856D6",
          "indigo-dark": "#5E5CE6",
          orange: "#FF9500",
          "orange-dark": "#FF9F0A",
          pink: "#FF2D55",
          "pink-dark": "#FF375F",
          purple: "#AF52DE",
          "purple-dark": "#BF5AF2",
          red: "#FF3B30",
          "red-dark": "#FF453A",
          teal: "#5AC8FA",
          "teal-dark": "#64D2FF",
          yellow: "#FFCC00",
          "yellow-dark": "#FFD60A",
          gray: {
            1: "#8E8E93",
            2: "#AEAEB2",
            3: "#C7C7CC",
            4: "#D1D1D6",
            5: "#E5E5EA",
            6: "#F2F2F7",
          },
          "gray-dark": {
            1: "#8E8E93",
            2: "#636366",
            3: "#48484A",
            4: "#3A3A3C",
            5: "#2C2C2E",
            6: "#1C1C1E",
          },
        },
      },
      // Apple 间距系统 - 4px 基础网格
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "2.5": "10px",
        "3": "12px",
        "3.5": "14px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "11": "44px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      // Apple 字体系统
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      // Zed + Apple 混合字体大小
      fontSize: {
        "caption-2": ["11px", { lineHeight: "1.3", letterSpacing: "0.004em" }],
        "caption-1": ["12px", { lineHeight: "1.35", letterSpacing: "0" }],
        "footnote": ["13px", { lineHeight: "1.4", letterSpacing: "-0.004em" }],
        "subheadline": ["14px", { lineHeight: "1.4", letterSpacing: "-0.008em" }],
        "callout": ["15px", { lineHeight: "1.45", letterSpacing: "-0.012em" }],
        "body": ["16px", { lineHeight: "1.5", letterSpacing: "-0.012em" }],
        "headline": ["17px", { lineHeight: "1.35", letterSpacing: "-0.016em", fontWeight: "600" }],
        "title-3": ["20px", { lineHeight: "1.3", letterSpacing: "-0.008em", fontWeight: "600" }],
        "title-2": ["22px", { lineHeight: "1.25", letterSpacing: "-0.008em", fontWeight: "600" }],
        "title-1": ["28px", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],
        "large-title": ["34px", { lineHeight: "1.15", letterSpacing: "-0.008em", fontWeight: "700" }],
      },
      // Apple 阴影系统
      boxShadow: {
        "apple-xs": "var(--shadow-xs)",
        "apple-sm": "var(--shadow-sm)",
        "apple": "var(--shadow)",
        "apple-md": "var(--shadow-md)",
        "apple-lg": "var(--shadow-lg)",
        "apple-xl": "var(--shadow-xl)",
        // 功能性阴影
        "elevated": "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "float": "0 8px 28px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.04)",
        "modal": "0 16px 48px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.04)",
        // 发光阴影
        "glow-blue": "0 0 20px rgba(0, 122, 255, 0.4)",
        "glow-green": "0 0 20px rgba(52, 199, 89, 0.4)",
        "glow-red": "0 0 20px rgba(255, 59, 48, 0.4)",
      },
      // Apple 动画系统
      animation: {
        // 基础动画
        "fade-in": "fade-in var(--duration-normal) var(--ease-out)",
        "fade-out": "fade-out var(--duration-fast) var(--ease-in)",
        "scale-in": "scale-in var(--duration-normal) var(--ease-spring)",
        "scale-out": "scale-out var(--duration-fast) var(--ease-in)",
        "slide-up": "slide-up var(--duration-normal) var(--ease-out)",
        "slide-down": "slide-down var(--duration-normal) var(--ease-out)",
        "slide-in-bottom": "slide-in-from-bottom var(--duration-slow) var(--ease-spring)",
        "slide-out-bottom": "slide-out-to-bottom var(--duration-normal) var(--ease-in)",
        // 持续动画
        "spin": "spin 1s linear infinite",
        "pulse": "pulse 2s var(--ease-in-out) infinite",
        "bounce-in": "bounce-in 0.5s var(--ease-default)",
        "shimmer": "shimmer 1.5s infinite",
        // 打字指示
        "typing": "typing-dot 1.4s infinite",
      },
      keyframes: {
        "fade-in": {
          "from": { opacity: "0" },
          "to": { opacity: "1" },
        },
        "fade-out": {
          "from": { opacity: "1" },
          "to": { opacity: "0" },
        },
        "scale-in": {
          "from": { opacity: "0", transform: "scale(0.95)" },
          "to": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "from": { opacity: "1", transform: "scale(1)" },
          "to": { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-up": {
          "from": { opacity: "0", transform: "translateY(10px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "from": { opacity: "0", transform: "translateY(-10px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "from": { opacity: "0", transform: "translateY(100%)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-out-to-bottom": {
          "from": { opacity: "1", transform: "translateY(0)" },
          "to": { opacity: "0", transform: "translateY(100%)" },
        },
        "spin": {
          "to": { transform: "rotate(360deg)" },
        },
        "pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-4px)", opacity: "1" },
        },
      },
      // Apple 过渡时长
      transitionDuration: {
        "fast": "var(--duration-fast)",
        "normal": "var(--duration-normal)",
        "slow": "var(--duration-slow)",
      },
      // Apple 缓动函数
      transitionTimingFunction: {
        "apple": "var(--ease-default)",
        "apple-in": "var(--ease-in)",
        "apple-out": "var(--ease-out)",
        "apple-in-out": "var(--ease-in-out)",
        "spring": "var(--ease-spring)",
        "bounce": "var(--ease-bounce)",
      },
      // 背景渐变
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "shimmer": "linear-gradient(90deg, transparent 0%, hsl(var(--foreground) / 0.05) 50%, transparent 100%)",
      },
      // 边框宽度 - Apple 喜欢细线
      borderWidth: {
        "DEFAULT": "1px",
        "0": "0",
        "0.5": "0.5px",
        "2": "2px",
        "4": "4px",
      },
      // 最小高度 - Apple 触摸目标
      minHeight: {
        "touch": "44px",  // Apple HIG 最小触摸目标
        "button": "50px", // Apple 标准按钮高度
      },
      // 最小宽度
      minWidth: {
        "touch": "44px",
      },
      // 透明度
      opacity: {
        "15": "0.15",
        "85": "0.85",
      },
      // z-index
      zIndex: {
        "dropdown": "1000",
        "sticky": "1020",
        "fixed": "1030",
        "modal-backdrop": "1040",
        "modal": "1050",
        "popover": "1060",
        "tooltip": "1070",
        "toast": "1080",
      },
    },
  },
  plugins: [],
}
