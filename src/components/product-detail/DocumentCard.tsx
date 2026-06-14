"use client"

import { FileText, Video, ExternalLink, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatBytes, formatDate } from "@/lib/utils"

interface DocumentCardProps {
  document: any
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const getIcon = () => {
    switch (document.type) {
      case "PDF":
        return <FileText className="h-6 w-6 text-red-400" />
      case "VIDEO":
        return <Video className="h-6 w-6 text-purple-400" />
      case "YOUTUBE":
        return <Video className="h-6 w-6 text-red-500" />
      case "LINK":
        return <ExternalLink className="h-6 w-6 text-cyan-400" />
      default:
        return <FileText className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getStatusBadge = () => {
    if (document.processed) {
      return <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">✓ Processed</span>
    }

    return <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">⏳ Processing...</span>
  }

  return (
    <div className="glass glass-hover rounded-xl p-6 group">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">{getIcon()}</div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <h4 className="truncate font-semibold transition-colors group-hover:text-indigo-400">{document.name}</h4>
            {getStatusBadge()}
          </div>

          <div className="mb-4 space-y-1 text-xs text-muted-foreground">
            {document.fileSize && <div>Size: {formatBytes(document.fileSize)}</div>}
            {document.pageCount && <div>{document.pageCount} pages</div>}
            {document.duration && <div>Duration: {Math.floor(document.duration / 60)}:{(document.duration % 60).toString().padStart(2, "0")}</div>}
            <div>Uploaded: {formatDate(document.createdAt)}</div>
          </div>

          <div className="flex gap-2">
            {document.type === "PDF" && (
              <Button size="sm" variant="outline">
                <Eye className="mr-1 h-3 w-3" />
                Preview
              </Button>
            )}
            {document.type === "VIDEO" && document.url && (
              <Button size="sm" variant="outline">
                <Video className="mr-1 h-3 w-3" />
                Watch
              </Button>
            )}
            {document.type === "YOUTUBE" && (
              <Button size="sm" variant="outline" asChild>
                <a href={`https://youtube.com/watch?v=${document.youtubeId}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  YouTube
                </a>
              </Button>
            )}
            {document.url && document.type === "PDF" && (
              <Button size="sm" variant="ghost" asChild>
                <a href={document.url} download>
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
