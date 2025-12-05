// app/frontend/components/layout/ThemeToggle.tsx
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("relative", className)}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Sun icon - visible in dark mode */}
      <Sun 
        className={cn(
          "h-5 w-5 transition-all",
          resolvedTheme === 'dark' 
            ? "rotate-0 scale-100" 
            : "rotate-90 scale-0 absolute"
        )} 
      />
      {/* Moon icon - visible in light mode */}
      <Moon 
        className={cn(
          "h-5 w-5 transition-all",
          resolvedTheme === 'light' 
            ? "rotate-0 scale-100" 
            : "-rotate-90 scale-0 absolute"
        )} 
      />
    </Button>
  )
}
