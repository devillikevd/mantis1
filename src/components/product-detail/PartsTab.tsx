"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Package, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface PartsTabProps {
  product: any
}

export default function PartsTab({ product }: PartsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const parts = product.parts || []

  const filteredParts = parts.filter((part: any) =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "IN_STOCK":
        return <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">In Stock</span>
      case "LIMITED":
        return <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">Limited</span>
      case "ORDER_ONLY":
        return <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400">Order</span>
      case "DISCONTINUED":
        return <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">Discontinued</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div className="glass rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search parts by name or part number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredParts.length > 0 ? (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-semibold">Part #</th>
                  <th className="px-6 py-4 text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold">Description</th>
                  <th className="px-6 py-4 text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold">Availability</th>
                  <th className="px-6 py-4 text-sm font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map((part: any, index: number) => (
                  <motion.tr
                    key={part.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4"><code className="text-sm font-mono">{part.partNumber}</code></td>
                    <td className="px-6 py-4 font-medium">{part.name}</td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-muted-foreground">{part.description || "—"}</td>
                    <td className="px-6 py-4">{part.estimatedPrice ? <span className="font-semibold">{formatCurrency(part.estimatedPrice)}</span> : <span className="text-sm text-muted-foreground">Contact</span>}</td>
                    <td className="px-6 py-4">{getAvailabilityBadge(part.availability)}</td>
                    <td className="px-6 py-4"><Button size="sm" variant="outline"><Mail className="mr-1 h-3 w-3" />Quote</Button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          {searchQuery ? (
            <>
              <Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No parts found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </>
          ) : (
            <>
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No parts catalog yet</h3>
              <p className="text-muted-foreground">Parts information will be available soon</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
