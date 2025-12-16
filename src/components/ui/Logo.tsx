interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({ size = 40, className = "", showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="logoSecGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* 圆角矩形背景 */}
        <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#logoMainGrad)" />

        {/* 聊天气泡 */}
        <path
          d="M136 160C136 138.461 153.461 121 175 121H337C358.539 121 376 138.461 376 160V280C376 301.539 358.539 319 337 319H270L220 369V319H175C153.461 319 136 301.539 136 280V160Z"
          fill="white"
        />

        {/* 节点1 - 左 */}
        <circle cx="200" cy="220" r="28" fill="url(#logoSecGrad)" />
        <circle cx="200" cy="220" r="16" fill="white" />

        {/* 节点2 - 右上 */}
        <circle cx="300" cy="185" r="28" fill="url(#logoMainGrad)" />
        <circle cx="300" cy="185" r="16" fill="white" />

        {/* 节点3 - 右下 */}
        <circle cx="300" cy="260" r="28" fill="url(#logoSecGrad)" />
        <circle cx="300" cy="260" r="16" fill="white" />

        {/* 连接线 */}
        <path
          d="M228 220L272 185"
          stroke="url(#logoMainGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M228 220L272 260"
          stroke="url(#logoSecGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M300 213L300 232"
          stroke="url(#logoMainGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 星光装饰 */}
        <path
          d="M350 130L354 142L366 146L354 150L350 162L346 150L334 146L346 142Z"
          fill="white"
          opacity="0.9"
        />
      </svg>

      {showText && (
        <span
          className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600"
          style={{ fontSize: size * 0.5 }}
        >
          Next AI
        </span>
      )}
    </div>
  );
}
