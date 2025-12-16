import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * 2025 现代化按钮组件
 * 
 * 设计特点:
 * - 更大的圆角 (rounded-xl)
 * - 丝滑的过渡动画
 * - 渐变变体
 * - 玻璃态变体
 * - 悬浮提升效果
 * - 精细的阴影层次
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap text-sm font-medium",
    "rounded-xl",
    "ring-offset-background",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        // 默认 - 主色调填充
        default: [
          "bg-primary text-primary-foreground",
          "shadow-md shadow-primary/20",
          "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30",
          "hover:-translate-y-0.5",
        ].join(" "),
        
        // 渐变 - 2025趋势
        gradient: [
          "bg-gradient-primary text-white",
          "shadow-lg shadow-primary/25",
          "hover:shadow-xl hover:shadow-primary/35",
          "hover:-translate-y-0.5",
          "relative overflow-hidden",
          // 光泽效果由 CSS 类处理
        ].join(" "),
        
        // 次要 - 柔和背景
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "border border-border/50",
        ].join(" "),
        
        // 轮廓 - 边框样式
        outline: [
          "border-2 border-border bg-transparent",
          "hover:bg-accent hover:text-accent-foreground",
          "hover:border-primary/50",
        ].join(" "),
        
        // 轮廓渐变 - 渐变边框
        "outline-gradient": [
          "relative bg-background text-foreground",
          "before:absolute before:inset-0 before:rounded-xl before:p-[2px]",
          "before:bg-gradient-primary before:-z-10",
          "after:absolute after:inset-[2px] after:rounded-[10px] after:bg-background after:-z-10",
          "hover:text-primary",
        ].join(" "),
        
        // 玻璃态 - 毛玻璃效果
        glass: [
          "bg-background/50 backdrop-blur-md",
          "border border-white/20",
          "text-foreground",
          "shadow-lg shadow-black/5",
          "hover:bg-background/70 hover:border-white/30",
        ].join(" "),
        
        // 幽灵 - 无背景
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "text-muted-foreground hover:text-foreground",
        ].join(" "),
        
        // 链接样式
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ].join(" "),
        
        // 危险 - 删除等操作
        destructive: [
          "bg-destructive text-destructive-foreground",
          "shadow-md shadow-destructive/20",
          "hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30",
          "hover:-translate-y-0.5",
        ].join(" "),
        
        // 成功
        success: [
          "bg-success text-success-foreground",
          "shadow-md shadow-success/20",
          "hover:bg-success/90 hover:shadow-lg hover:shadow-success/30",
          "hover:-translate-y-0.5",
        ].join(" "),
        
        // 柔和主色
        "soft-primary": [
          "bg-primary/10 text-primary",
          "hover:bg-primary/20",
          "border border-primary/20",
        ].join(" "),
        
        // 柔和危险
        "soft-destructive": [
          "bg-destructive/10 text-destructive",
          "hover:bg-destructive/20",
          "border border-destructive/20",
        ].join(" "),
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-lg",
        sm: "h-9 px-3.5 text-sm",
        default: "h-11 px-5",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg rounded-2xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // 渐变按钮添加光泽效果类
    const isGradient = variant === "gradient"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isGradient && "btn-shine",
          loading && "relative text-transparent"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner className="w-4 h-4 text-current opacity-70" />
          </div>
        )}
        {leftIcon && !loading && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// 加载动画组件
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg 
      className={cn("animate-spin", className)} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// 图标按钮快捷组件
export interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon"> {
  icon: React.ReactNode
  "aria-label": string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "icon", variant = "ghost", className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("p-0", className)}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

// 按钮组组件
interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  attached?: boolean
}

function ButtonGroup({ children, className, attached = false }: ButtonGroupProps) {
  return (
    <div 
      className={cn(
        "inline-flex",
        attached ? [
          "[&>button]:rounded-none",
          "[&>button:first-child]:rounded-l-xl",
          "[&>button:last-child]:rounded-r-xl",
          "[&>button:not(:first-child)]:-ml-px",
        ].join(" ") : "gap-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Button, IconButton, ButtonGroup, buttonVariants }
