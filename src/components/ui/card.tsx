import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Apple Design System 卡片组件
 * 
 * 设计特点:
 * - Apple 标准圆角和阴影
 * - 分组列表样式 (Grouped List)
 * - 内嵌列表样式 (Inset Grouped)
 * - 精致的边框和分隔线
 */
const cardVariants = cva(
  [
    "rounded-xl",
    "transition-all duration-normal ease-apple",
  ].join(" "),
  {
    variants: {
      variant: {
        // 默认卡片 - Apple 标准
        default: [
          "bg-card text-card-foreground",
          "shadow-apple-sm",
        ].join(" "),
        
        // 带边框卡片
        bordered: [
          "bg-card text-card-foreground",
          "border-0.5 border-border",
        ].join(" "),
        
        // 凸起卡片
        elevated: [
          "bg-card text-card-foreground",
          "shadow-apple-md",
        ].join(" "),
        
        // 浮动卡片 - 用于模态框等
        floating: [
          "bg-card text-card-foreground",
          "shadow-apple-xl",
        ].join(" "),
        
        // 玻璃态卡片
        glass: [
          "bg-background/70 backdrop-blur-xl",
          "border-0.5 border-border/50",
          "text-foreground",
        ].join(" "),
        
        // 分组卡片 - Apple 设置页风格
        grouped: [
          "bg-card text-card-foreground",
          "shadow-apple-xs",
          "overflow-hidden",
          "[&>*+*]:border-t [&>*+*]:border-border",
        ].join(" "),
        
        // 内嵌分组 - 带左边距的分隔线
        inset: [
          "bg-card text-card-foreground",
          "shadow-apple-xs",
          "overflow-hidden",
        ].join(" "),
        
        // 交互式卡片
        interactive: [
          "bg-card text-card-foreground",
          "shadow-apple-sm",
          "hover:shadow-apple-md hover:-translate-y-0.5",
          "active:scale-[0.99] active:shadow-apple-sm",
          "cursor-pointer",
        ].join(" "),
        
        // 选中状态卡片
        selectable: [
          "bg-card text-card-foreground",
          "border-2 border-transparent",
          "shadow-apple-sm",
          "hover:border-primary/30",
          "cursor-pointer",
          "data-[selected=true]:border-primary data-[selected=true]:bg-primary/5",
        ].join(" "),
        
        // 纯净 - 无背景
        plain: [
          "bg-transparent",
        ].join(" "),
      },
      padding: {
        none: "",
        xs: "p-3",
        sm: "p-4",
        default: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

// 卡片头部
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// 卡片标题 - Apple 风格
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-headline", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// 卡片描述
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-subheadline text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// 卡片内容
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

// 卡片底部
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Apple 风格列表项
interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  rightText?: string
  subtitle?: string
  destructive?: boolean
  chevron?: boolean
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ 
    className, 
    children, 
    leftIcon, 
    rightIcon, 
    rightText,
    subtitle,
    destructive,
    chevron,
    onClick,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-4 py-3 min-h-11",
        "transition-colors duration-fast ease-apple",
        onClick && "cursor-pointer active:bg-foreground/5",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {leftIcon && (
        <div className={cn(
          "shrink-0",
          destructive ? "text-destructive" : "text-primary"
        )}>
          {leftIcon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-body",
          destructive && "text-destructive"
        )}>
          {children}
        </div>
        {subtitle && (
          <div className="text-footnote text-muted-foreground mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      {rightText && (
        <span className="text-body text-muted-foreground shrink-0">
          {rightText}
        </span>
      )}
      {rightIcon && (
        <div className="shrink-0 text-muted-foreground">
          {rightIcon}
        </div>
      )}
      {chevron && (
        <ChevronRight className="shrink-0 text-muted-foreground/50" />
      )}
    </div>
  )
)
ListItem.displayName = "ListItem"

// 内嵌列表项 - 分隔线从左侧图标后开始
const InsetListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <ListItem 
        ref={ref} 
        className={cn(
          "before:absolute before:bottom-0 before:left-[52px] before:right-0 before:h-[0.5px] before:bg-border",
          "last:before:hidden",
          className
        )} 
        {...props} 
      />
    </div>
  )
)
InsetListItem.displayName = "InsetListItem"

// 分组头部
interface GroupHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  action?: React.ReactNode
}

const GroupHeader = React.forwardRef<HTMLDivElement, GroupHeaderProps>(
  ({ className, title, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-4 py-2",
        className
      )}
      {...props}
    >
      <span className="text-footnote text-muted-foreground uppercase tracking-wide">
        {title}
      </span>
      {action}
    </div>
  )
)
GroupHeader.displayName = "GroupHeader"

// 分组底部说明
const GroupFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4 py-2 text-footnote text-muted-foreground", className)}
    {...props}
  />
))
GroupFooter.displayName = "GroupFooter"

// 特色卡片
interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon, title, description, children, ...props }, ref) => (
    <Card
      ref={ref}
      variant="interactive"
      className={cn("group", className)}
      {...props}
    >
      {icon && (
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <CardHeader className="p-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent className="mt-4">{children}</CardContent>}
    </Card>
  )
)
FeatureCard.displayName = "FeatureCard"

// 统计卡片
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, trend, icon, ...props }, ref) => (
    <Card ref={ref} variant="elevated" className={cn("", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-footnote text-muted-foreground">{label}</p>
          <p className="text-title-1">{value}</p>
          {change && (
            <p className={cn(
              "text-footnote font-medium",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
)
StatCard.displayName = "StatCard"

// Chevron 图标
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      width="7" 
      height="12" 
      viewBox="0 0 7 12" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 1L6 6L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  ListItem,
  InsetListItem,
  GroupHeader,
  GroupFooter,
  FeatureCard,
  StatCard,
  cardVariants,
}
