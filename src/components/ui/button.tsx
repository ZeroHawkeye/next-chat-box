import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Apple Design System 按钮组件
 * 
 * 设计特点:
 * - Apple HIG 标准尺寸 (44px 最小触摸目标)
 * - SF Pro 字体和精确的字重
 * - 连续曲率圆角 (continuous corners)
 * - 精致的按压反馈动画
 * - 系统色彩规范
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-semibold",
    "select-none",
    "transition-all duration-fast ease-apple",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97] active:opacity-90",
  ].join(" "),
  {
    variants: {
      variant: {
        // 主要按钮 - Apple 蓝填充
        default: [
          "bg-primary text-primary-foreground",
          "hover:brightness-110",
          "shadow-apple-sm",
        ].join(" "),
        
        // 次要按钮 - 柔和背景
        secondary: [
          "bg-primary/12 text-primary",
          "hover:bg-primary/18",
        ].join(" "),
        
        // 三级按钮 - 纯文字
        tertiary: [
          "bg-transparent text-primary",
          "hover:bg-primary/8",
        ].join(" "),
        
        // 灰色按钮 - Apple 灰色填充
        gray: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
        ].join(" "),
        
        // 轮廓按钮
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-foreground/4",
        ].join(" "),
        
        // 幽灵按钮 - 无背景
        ghost: [
          "text-foreground",
          "hover:bg-foreground/6",
        ].join(" "),
        
        // 链接样式
        link: [
          "text-primary",
          "hover:underline underline-offset-2",
          "p-0 h-auto font-normal",
        ].join(" "),
        
        // 危险按钮 - Apple 红
        destructive: [
          "bg-destructive/12 text-destructive",
          "hover:bg-destructive/18",
        ].join(" "),
        
        // 危险按钮填充
        "destructive-fill": [
          "bg-destructive text-destructive-foreground",
          "hover:brightness-110",
        ].join(" "),
        
        // 成功按钮 - Apple 绿
        success: [
          "bg-success/12 text-success",
          "hover:bg-success/18",
        ].join(" "),
        
        // 成功按钮填充
        "success-fill": [
          "bg-success text-success-foreground",
          "hover:brightness-110",
        ].join(" "),
        
        // 玻璃态按钮
        glass: [
          "bg-background/70 backdrop-blur-xl",
          "border border-border",
          "text-foreground",
          "hover:bg-background/85",
          "shadow-apple-sm",
        ].join(" "),
        
        // 深色按钮
        dark: [
          "bg-foreground text-background",
          "hover:opacity-90",
        ].join(" "),
      },
      size: {
        // Apple 标准尺寸
        xs: "h-7 px-2.5 text-caption-1 rounded-md gap-1",
        sm: "h-8 px-3 text-footnote rounded-lg gap-1.5",
        default: "h-11 px-5 text-body rounded-xl",
        lg: "h-[50px] px-6 text-body rounded-xl",
        xl: "h-14 px-8 text-body rounded-2xl",
        // 图标按钮
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
        "icon-xl": "h-14 w-14 rounded-2xl",
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
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "relative text-transparent pointer-events-none"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {leftIcon && !loading && <span className="shrink-0 -ml-0.5">{leftIcon}</span>}
        {children}
        {rightIcon && !loading && <span className="shrink-0 -mr-0.5">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Apple 风格加载动画
function LoadingSpinner() {
  return (
    <div className="spinner-apple">
      <style>{`
        .spinner-apple {
          width: 20px;
          height: 20px;
          position: relative;
        }
        .spinner-apple::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid currentColor;
          opacity: 0.2;
        }
        .spinner-apple::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: currentColor;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// 图标按钮
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

// 按钮组
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
          "[&>button:not(:first-child)]:-ml-[0.5px]",
          "[&>button:not(:first-child):not(:last-child)]:border-x-0",
        ].join(" ") : "gap-2",
        className
      )}
    >
      {children}
    </div>
  )
}

// Apple 分段控件
interface SegmentedControlProps {
  options: Array<{ value: string; label: string; icon?: React.ReactNode }>
  value: string
  onChange: (value: string) => void
  className?: string
  size?: "sm" | "default"
}

function SegmentedControl({ 
  options, 
  value, 
  onChange, 
  className,
  size = "default" 
}: SegmentedControlProps) {
  return (
    <div 
      className={cn(
        "inline-flex p-0.5 rounded-lg bg-secondary",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center justify-center gap-1.5 font-medium transition-all duration-fast ease-apple",
            size === "sm" ? "px-3 py-1 text-footnote rounded-md" : "px-4 py-1.5 text-subheadline rounded-lg",
            value === option.value
              ? "bg-background text-foreground shadow-apple-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

export { Button, IconButton, ButtonGroup, SegmentedControl, buttonVariants }
