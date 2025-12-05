// app/frontend/components/invoices/LineItemRow.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GripVertical, X } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { LineItem, UnitType } from "@/lib/types"

interface LineItemRowProps {
  item: LineItem
  onChange: (item: LineItem) => void
  onRemove: () => void
  index: number
}

/**
 * LineItemRow — Single line item in the editor
 * 
 * Types:
 * - item: Description, quantity, unit, price
 * - section: Just description (full width)
 * - discount: Description and negative amount
 */
export function LineItemRow({
  item,
  onChange,
  onRemove,
  index,
}: LineItemRowProps) {
  const handleChange = (field: keyof LineItem, value: any) => {
    onChange({ ...item, [field]: value })
  }

  const calculateLineTotal = () => {
    if (item.type === 'section') return null
    const qty = item.quantity || 0
    const price = item.unitPrice || 0
    return qty * price
  }

  const lineTotal = calculateLineTotal()

  // Section header row
  if (item.type === 'section') {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-md",
          "bg-slate-100 dark:bg-slate-800",
          "animate-fade-in-up"
        )}
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <GripVertical className="h-4 w-4 text-slate-400 cursor-grab flex-shrink-0" />
        <Input
          value={item.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Section title"
          className="flex-1 font-semibold bg-transparent border-0 focus:ring-0 p-0 h-auto"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 flex-shrink-0"
          aria-label="Remove section"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Discount row
  if (item.type === 'discount') {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-md",
          "bg-rose-50 dark:bg-rose-950/30",
          "border border-rose-200 dark:border-rose-800",
          "animate-fade-in-up"
        )}
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <GripVertical className="h-4 w-4 text-slate-400 cursor-grab flex-shrink-0" />
        <Input
          value={item.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Discount description"
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">-S$</span>
          <Input
            type="number"
            value={Math.abs(item.unitPrice || 0)}
            onChange={(e) => handleChange('unitPrice', -Math.abs(parseFloat(e.target.value) || 0))}
            placeholder="0.00"
            className="w-24 text-right font-mono"
            step="0.01"
          />
        </div>
        <div className="w-28 text-right font-mono text-sm text-rose-600 dark:text-rose-400">
          {formatCurrency(item.unitPrice || 0)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 flex-shrink-0"
          aria-label="Remove discount"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Regular item row
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 rounded-md",
        "bg-white dark:bg-slate-900",
        "border border-slate-200 dark:border-slate-800",
        "animate-fade-in-up"
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <GripVertical className="h-4 w-4 text-slate-400 cursor-grab flex-shrink-0" />
      
      {/* Description */}
      <Input
        value={item.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Item description"
        className="flex-1 min-w-0"
      />
      
      {/* Quantity */}
      <Input
        type="number"
        value={item.quantity || ''}
        onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
        placeholder="Qty"
        className="w-20 text-right"
        min="0"
        step="0.5"
      />
      
      {/* Unit Type */}
      <Select
        value={item.unitType || 'hours'}
        onValueChange={(value) => handleChange('unitType', value as UnitType)}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hours">hours</SelectItem>
          <SelectItem value="days">days</SelectItem>
          <SelectItem value="items">items</SelectItem>
          <SelectItem value="units">units</SelectItem>
          <SelectItem value="fixed">fixed</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Unit Price */}
      <div className="flex items-center gap-1">
        <span className="text-sm text-slate-500">S$</span>
        <Input
          type="number"
          value={item.unitPrice || ''}
          onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="w-24 text-right font-mono"
          min="0"
          step="0.01"
        />
      </div>
      
      {/* Line Total */}
      <div className="w-28 text-right font-mono text-sm text-slate-900 dark:text-slate-50">
        {lineTotal !== null ? formatCurrency(lineTotal) : '—'}
      </div>
      
      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 flex-shrink-0"
        aria-label="Remove item"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
