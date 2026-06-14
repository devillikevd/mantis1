"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"

interface MaintenanceTabProps {
  product: any
}

export default function MaintenanceTab({ product }: MaintenanceTabProps) {
  const [viewMode, setViewMode] = useState<"distance" | "time">("time")

  const tasks = product.maintenanceTasks || []

  const getTaskStatus = (task: any) => {
    if (!task.lastDoneDate && !task.lastDoneKm) {
      return "pending"
    }
    return "done"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case "upcoming":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="glass rounded-2xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold">Maintenance Schedule</h2>
            <p className="text-muted-foreground">Keep your {product.name} in perfect condition</p>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="time">By Time</TabsTrigger>
              <TabsTrigger value="distance">By Distance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {tasks.length > 0 ? (
          <div className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {tasks.map((task: any, index: number) => {
                const status = getTaskStatus(task)

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-16"
                  >
                    <div className="absolute left-4 top-1 w-5 -translate-x-1/2">{getStatusIcon(status)}</div>

                    <div className="glass rounded-xl p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h4 className="mb-1 text-lg font-semibold">{task.title}</h4>
                          {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                        </div>

                        {status === "done" && <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">Completed</span>}
                      </div>

                      <div className="mb-4 flex items-center gap-6 text-sm text-muted-foreground">
                        {viewMode === "time" && task.intervalDays && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Every {task.intervalDays} days
                          </div>
                        )}
                        {viewMode === "distance" && task.intervalKm && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Every {task.intervalKm.toLocaleString()} km
                          </div>
                        )}
                      </div>

                      {task.lastDoneDate && <div className="mb-4 text-xs text-muted-foreground">Last completed: {formatDate(task.lastDoneDate)}</div>}

                      {status !== "done" && (
                        <Button size="sm" variant="outline">
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No maintenance schedule yet</h3>
            <p className="text-muted-foreground">Check your product manual for recommended maintenance intervals</p>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        <h3 className="mb-4 text-xl font-semibold">Get Reminders</h3>
        <p className="mb-4 text-muted-foreground">We&apos;ll email you one week before maintenance is due</p>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500">Subscribe</Button>
        </div>
      </motion.div>
    </div>
  )
}
