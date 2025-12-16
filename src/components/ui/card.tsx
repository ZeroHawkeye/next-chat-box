import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * 2025 现代化卡片组件
 * 
 * 设计特点:
 * - 多种变体：默认、玻璃态、渐变边框、Bento风格
 * - 悬浮提升效果
 * - 细腻的阴影层次
 * - 流畅的过渡动画
 */
const cardVariants = cva(
  [
    "rounded-2xl",
    "transition-all duration-300 ease-out",
  ].join(" "),
  {
    variants: {
      variant: {
        // 默认卡片
        default: [
          "bg-card text-card-foreground",
          "border border-border/50",
          "shadow-sm shadow-black/5",
        ].join(" "),
        
        // 凸起卡片 - 更明显的阴影
        elevated: [
          "bg-card text-card-foreground",
          "shadow-lg shadow-black/10",
          "border border-border/30",
        ].join(" "),
        
        // 玻璃态卡片
        glass: [
          "bg-background/60 backdrop-blur-xl",
          "border border-white/20",
          "shadow-lg shadow-black/5",
          "text-foreground",
        ].join(" "),
        
        // 渐变边框卡片
        gradient: [
          "relative bg-card text-card-foreground",
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
          "before:bg-gradient-to-br before:from-primary/50 before:to-primary/10",
          "before:-z-10",
        ].join(" "),
        
        // 渐变填充卡片
        "gradient-fill": [
          "bg-gradient-to-br from-primary/10 to-primary/5",
          "border border-primary/20",
          "text-foreground",
        ].join(" "),
        
        // 轮廓卡片
        outline: [
          "bg-transparent",
          "border-2 border-border",
          "text-foreground",
        ].join(" "),
        
        // 交互式卡片
        interactive: [
          "bg-card text-card-foreground",
          "border border-border/50",
          "shadow-sm shadow-black/5",
          "hover:shadow-xl hover:shadow-black/10",
          "hover:-translate-y-1",
          "hover:border-primary/30",
          "cursor-pointer",
        ].join(" "),
        
        // Bento 风格卡片
        bento: [
          "bg-gradient-to-br from-card to-card/80",
          "border border-border/30",
          "shadow-lg shadow-black/5",
          "hover:shadow-xl hover:shadow-primary/10",
          "hover:border-primary/20",
        ].join(" "),
        
        // 深色强调卡片
        dark: [
          "bg-foreground text-background",
          "shadow-xl shadow-black/20",
        ].join(" "),
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
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
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// 卡片标题
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
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
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// 卡片内容区
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

// 特色卡片 - 用于突出显示
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
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
      )}
      <CardHeader className="p-0">
        <CardTitle className="group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
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
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm font-medium",
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
)
StatCard.displayName = "StatCard"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FeatureCard,
  StatCard,
  cardVariants,
}
