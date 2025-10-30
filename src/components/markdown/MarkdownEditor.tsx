import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  Image, 
  List, 
  ListOrdered,
  Quote,
  Eye,
  Edit,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  showPreview?: boolean
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your markdown here...',
  height = '400px',
  showPreview = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = before + selectedText + after

    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  const handleBold = () => insertText('**', '**')
  const handleItalic = () => insertText('*', '*')
  const handleCode = () => insertText('`', '`')
  const handleLink = () => insertText('[', '](url)')
  const handleImage = () => insertText('![', '](url)')
  const handleList = () => insertText('- ')
  const handleOrderedList = () => insertText('1. ')
  const handleQuote = () => insertText('> ')

  const handleTab = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      insertText('  ')
    }
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering (in production, use a proper library)
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-2" />')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^1\. (.*$)/gim, '<li class="ml-4 list-decimal">1. $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/gim, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<h[1-6]>)/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<blockquote>)/g, '$1')
      .replace(/(<\/blockquote>)<\/p>/g, '$1')
      .replace(/<p>(<li>)/g, '$1')
      .replace(/(<\/li>)<\/p>/g, '$1')
  }

  const getLineNumbers = () => {
    const lines = value.split('\n')
    return lines.map((_, index) => index + 1)
  }

  const editorClasses = `
    font-mono text-sm p-4 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    resize-none outline-none
  `

  const containerClasses = `
    ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}
    ${height === '400px' && !isFullscreen ? 'h-96' : ''}
  `

  return (
    <div className={containerClasses}>
      {isFullscreen && (
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Markdown Editor</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(false)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-3 flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={handleBold} title="Bold">
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleItalic} title="Italic">
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCode} title="Code">
              <Code className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLink} title="Link">
              <Link className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleImage} title="Image">
              <Image className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button variant="ghost" size="sm" onClick={handleList} title="Bullet List">
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleOrderedList} title="Numbered List">
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleQuote} title="Quote">
              <Quote className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            {showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                title={isPreviewMode ? 'Edit' : 'Preview'}
              >
                {isPreviewMode ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Editor/Preview */}
          <div className="grid grid-cols-1" style={{ height: isFullscreen ? 'calc(100vh - 140px)' : height }}>
            {isPreviewMode ? (
              // Preview Mode
              <div className="overflow-auto p-6 bg-white">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
                />
                {!value && (
                  <div className="text-gray-400 text-center py-8">
                    Nothing to preview. Start writing to see the rendered output.
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <div className="grid grid-cols-12 h-full">
                {/* Line Numbers */}
                <div className="col-span-1 bg-gray-50 border-r border-gray-200 p-4 text-right text-gray-400 text-sm font-mono select-none overflow-hidden">
                  {getLineNumbers().map(lineNum => (
                    <div key={lineNum} className="leading-6">
                      {lineNum}
                    </div>
                  ))}
                </div>
                
                {/* Textarea */}
                <div className="col-span-11">
                  <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleTab}
                    placeholder={placeholder}
                    className={editorClasses}
                    style={{ 
                      height: '100%',
                      width: '100%',
                      border: 'none',
                      borderRadius: '0'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between text-xs text-gray-500">
            <div>
              {value.split('\n').length} lines • {value.split(/\s+/).filter(word => word.length > 0).length} words • {value.length} characters
            </div>
            <div>
              Markdown • {isPreviewMode ? 'Preview' : 'Edit'} Mode
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
