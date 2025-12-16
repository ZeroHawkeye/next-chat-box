import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * 2025 现代化输入框组件
 * 
 * 设计特点:
 * - 柔和的背景色
 * - 流畅的聚焦动画
 * - 多种变体样式
 * - 前后缀图标支持
 * - 浮动标签支持
 */
const inputVariants = cva(
  [
    "flex w-full",
    "text-sm text-foreground",
    "placeholder:text-muted-foreground",
    "transition-all duration-200 ease-out",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ].join(" "),
  {
    variants: {
      variant: {
        // 默认 - 柔和背景
        default: [
          "h-11 px-4 py-2 rounded-xl",
          "bg-secondary/50 border border-border/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
          "focus:bg-background",
          "hover:border-border",
        ].join(" "),
        
        // 轮廓样式
        outline: [
          "h-11 px-4 py-2 rounded-xl",
          "bg-transparent border-2 border-border",
          "focus:outline-none focus:border-primary",
          "hover:border-muted-foreground/50",
        ].join(" "),
        
        // 填充样式
        filled: [
          "h-11 px-4 py-2 rounded-xl",
          "bg-muted border border-transparent",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-primary/50",
        ].join(" "),
        
        // 玻璃态
        glass: [
          "h-11 px-4 py-2 rounded-xl",
          "bg-background/50 backdrop-blur-sm",
          "border border-border/30",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
          "focus:bg-background/80",
        ].join(" "),
        
        // 下划线样式
        underline: [
          "h-11 px-1 py-2",
          "bg-transparent border-b-2 border-border rounded-none",
          "focus:outline-none focus:border-primary",
          "hover:border-muted-foreground/50",
        ].join(" "),
        
        // 无边框 - 用于内联编辑
        ghost: [
          "h-auto px-2 py-1 rounded-lg",
          "bg-transparent border border-transparent",
          "focus:outline-none focus:bg-secondary/50 focus:border-border/50",
          "hover:bg-secondary/30",
        ].join(" "),
      },
      inputSize: {
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "",
        lg: "h-12 px-5 text-base rounded-xl",
        xl: "h-14 px-6 text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    inputSize,
    type,
    leftIcon,
    rightIcon,
    error,
    helperText,
    ...props 
  }, ref) => {
    // 带图标的输入框
    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, inputSize }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
          {helperText && (
            <p className={cn(
              "mt-1.5 text-xs",
              error ? "text-destructive" : "text-muted-foreground"
            )}>
              {helperText}
            </p>
          )}
        </div>
      )
    }

    return (
      <div>
        <input
          type={type}
          className={cn(
            inputVariants({ variant, inputSize }),
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn(
            "mt-1.5 text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// 浮动标签输入框
interface FloatingLabelInputProps extends InputProps {
  label: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || React.useId()
    
    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "peer w-full h-14 px-4 pt-5 pb-2 rounded-xl",
            "bg-secondary/50 border border-border/50",
            "text-foreground placeholder-transparent",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
            "focus:bg-background",
            "transition-all duration-200",
            className
          )}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2",
            "text-muted-foreground text-sm",
            "transition-all duration-200 pointer-events-none",
            "peer-focus:top-3.5 peer-focus:text-xs peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-xs"
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

// 搜索输入框
interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
  onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={ref}
          type="search"
          className={cn(
            inputVariants({ variant: "default" }),
            "pl-10",
            value && onClear && "pr-10",
            className
          )}
          value={value}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

// 文本域
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-xl",
            "px-4 py-3",
            "bg-secondary/50 border border-border/50",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
            "focus:bg-background",
            "transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn(
            "mt-1.5 text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, FloatingLabelInput, SearchInput, Textarea, inputVariants }
