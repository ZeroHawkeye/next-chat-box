import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Apple Design System 输入框组件
 * 
 * 设计特点:
 * - Apple HIG 标准高度 (44px 最小)
 * - 柔和的圆角和背景
 * - 精致的聚焦环效果
 * - 流畅的过渡动画
 */
const inputVariants = cva(
  [
    "flex w-full",
    "text-body text-foreground",
    "placeholder:text-muted-foreground",
    "transition-all duration-fast ease-apple",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "file:border-0 file:bg-transparent file:text-body file:font-medium",
  ].join(" "),
  {
    variants: {
      variant: {
        // 默认 - Apple 搜索框风格
        default: [
          "h-11 px-4 rounded-xl",
          "bg-secondary border-0",
          "focus:outline-none focus:ring-[3px] focus:ring-primary/20",
        ].join(" "),
        
        // 带边框
        bordered: [
          "h-11 px-4 rounded-xl",
          "bg-background border border-border",
          "focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15",
          "hover:border-border-secondary",
        ].join(" "),
        
        // 填充样式
        filled: [
          "h-11 px-4 rounded-xl",
          "bg-muted border-0",
          "focus:outline-none focus:ring-[3px] focus:ring-primary/20 focus:bg-background",
        ].join(" "),
        
        // 下划线样式
        underline: [
          "h-11 px-1 rounded-none",
          "bg-transparent border-b border-border",
          "focus:outline-none focus:border-primary",
          "hover:border-border-secondary",
        ].join(" "),
        
        // 纯净样式 - 用于内联编辑
        plain: [
          "h-auto px-2 py-1.5 rounded-lg",
          "bg-transparent border-0",
          "focus:outline-none focus:bg-secondary/50",
          "hover:bg-secondary/30",
        ].join(" "),
      },
      inputSize: {
        sm: "h-9 px-3 text-subheadline rounded-lg",
        default: "",
        lg: "h-12 px-5 text-body rounded-xl",
        xl: "h-14 px-6 text-body rounded-2xl",
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
    const inputClasses = cn(
      inputVariants({ variant, inputSize }),
      leftIcon && "pl-11",
      rightIcon && "pr-11",
      error && "ring-[3px] ring-destructive/20 border-destructive focus:ring-destructive/20 focus:border-destructive",
      className
    )

    if (leftIcon || rightIcon) {
      return (
        <div className="space-y-1.5">
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              className={inputClasses}
              ref={ref}
              {...props}
            />
            {rightIcon && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
          {helperText && (
            <p className={cn(
              "text-caption-1 px-1",
              error ? "text-destructive" : "text-muted-foreground"
            )}>
              {helperText}
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-1.5">
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn(
            "text-caption-1 px-1",
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

// Apple 风格搜索框
interface SearchInputProps extends Omit<InputProps, "leftIcon" | "variant"> {
  onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, inputSize, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <SearchIcon />
        </div>
        <input
          ref={ref}
          type="search"
          className={cn(
            inputVariants({ variant: "default", inputSize }),
            "pl-11",
            value && onClear && "pr-11",
            // 隐藏原生清除按钮
            "[&::-webkit-search-cancel-button]:hidden",
            className
          )}
          value={value}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30 transition-colors"
          >
            <ClearIcon />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

// 浮动标签输入框
interface FloatingLabelInputProps extends Omit<InputProps, "placeholder"> {
  label: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, error, helperText, ...props }, ref) => {
    const inputId = id || React.useId()
    
    return (
      <div className="space-y-1.5">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "peer w-full h-14 px-4 pt-5 pb-2 rounded-xl",
              "bg-secondary text-foreground",
              "placeholder-transparent",
              "focus:outline-none focus:ring-[3px] focus:ring-primary/20",
              "transition-all duration-fast ease-apple",
              error && "ring-[3px] ring-destructive/20",
              className
            )}
            placeholder={label}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2",
              "text-muted-foreground text-body",
              "transition-all duration-fast ease-apple pointer-events-none origin-left",
              "peer-focus:top-3.5 peer-focus:scale-[0.75] peer-focus:text-primary",
              "peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:scale-[0.75]",
              error && "peer-focus:text-destructive"
            )}
          >
            {label}
          </label>
        </div>
        {helperText && (
          <p className={cn(
            "text-caption-1 px-1",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

// 文本域
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-xl",
            "px-4 py-3",
            "bg-secondary",
            "text-body text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-[3px] focus:ring-primary/20",
            "transition-all duration-fast ease-apple",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "resize-none",
            error && "ring-[3px] ring-destructive/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn(
            "text-caption-1 px-1",
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

// 表单字段组
interface FormFieldProps {
  label?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

function FormField({ label, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-subheadline font-medium text-foreground px-1">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      {children}
    </div>
  )
}

// 图标组件
function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 13C10.5376 13 13 10.5376 13 7.5C13 4.46243 10.5376 2 7.5 2C4.46243 2 2 4.46243 2 7.5C2 10.5376 4.46243 13 7.5 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 15L11.5 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 3L3 9M3 3L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { Input, SearchInput, FloatingLabelInput, Textarea, FormField, inputVariants }
