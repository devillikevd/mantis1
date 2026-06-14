"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import DocumentCard from "./DocumentCard"

interface DocumentationTabProps {
  product: any
}

export default function DocumentationTab({ product }: DocumentationTabProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    setIsUploading(false)
  }

  return (
    <div className="space-y-8">
      {product.canEdit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8"
        >
          <h3 className="mb-4 text-xl font-semibold">Upload Documentation</h3>

          <div className="rounded-xl border-2 border-dashed border-border p-12 text-center transition-colors hover:border-indigo-500 group cursor-pointer">
            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground transition-colors group-hover:text-indigo-400" />
            <h4 className="mb-2 text-lg font-semibold">Drop files here or click to browse</h4>
            <p className="mb-4 text-sm text-muted-foreground">Support for PDFs, videos, images, and documents</p>
            <Button variant="outline">Choose Files</Button>
          </div>
        </motion.div>
      )}

      {product.documents && product.documents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {product.documents.map((doc: any, index: number) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DocumentCard document={doc} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">No documentation yet</h3>
          <p className="text-muted-foreground">{product.canEdit ? "Upload your first document to get started" : "Check back later for documentation"}</p>
        </div>
      )}
    </div>
  )
}
