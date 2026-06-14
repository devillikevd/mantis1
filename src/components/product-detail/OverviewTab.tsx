"use client"

import { motion } from "framer-motion"

interface OverviewTabProps {
  product: any
}

export default function OverviewTab({ product }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="mb-4 text-2xl font-bold">About this product</h2>
        <div className="prose prose-invert max-w-none">
          <p className="leading-relaxed text-muted-foreground">{product.description || "No description available."}</p>
        </div>
      </motion.div>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8"
        >
          <h2 className="mb-6 text-2xl font-bold">Specifications</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(product.specifications).map(([key, value], index) => (
              <div
                key={key}
                className={`flex justify-between rounded-lg px-4 py-3 ${index % 2 === 0 ? "bg-muted/30" : "bg-transparent"}`}
              >
                <span className="text-muted-foreground">{key}</span>
                <span className="font-semibold">{String(value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="gradient-text mb-2 text-3xl font-bold">{product._count?.conversations ?? 0}</div>
            <div className="text-sm text-muted-foreground">Diagnostics Run</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="gradient-text mb-2 text-3xl font-bold">{product._count?.documents ?? 0}</div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="gradient-text mb-2 text-3xl font-bold">{product.views ?? 0}</div>
            <div className="text-sm text-muted-foreground">Views</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
