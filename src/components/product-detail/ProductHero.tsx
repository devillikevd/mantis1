"use client"

import { motion } from "framer-motion"

interface ProductHeroProps {
  product: any
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <div className="relative h-96 overflow-hidden">
      <div className="absolute inset-0">
        {product.coverImage ? (
          <img
            src={product.coverImage}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative container mx-auto flex h-full items-end px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="mb-4 flex items-center space-x-2">
            {product.company.logo && (
              <img
                src={product.company.logo}
                alt={product.company.name}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="text-sm text-muted-foreground">{product.company.name}</span>
          </div>

          <h1 className="mb-4 text-5xl font-bold">{product.name}</h1>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
