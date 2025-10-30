/**
 * Markdown Parser for MDReader
 * 
 * Simple markdown parser for extracting metadata and content
 * In production, consider using a library like 'marked' or 'remark'
 */

export interface MarkdownMetadata {
  title?: string
  description?: string
  tags?: string[]
  category?: string
  author?: string
  date?: string
  readingTime?: number
  wordCount?: number
}

export interface ParsedMarkdown {
  metadata: MarkdownMetadata
  content: string
  html?: string
}

/**
 * Parse markdown file and extract metadata
 */
export function parseMarkdown(markdown: string): ParsedMarkdown {
  const lines = markdown.split('\n')
  const metadata: MarkdownMetadata = {}
  let contentStart = 0
  let frontMatterEnd = 0

  // Check for YAML front matter
  if (lines[0] === '---') {
    let frontMatterLines: string[] = []
    let inFrontMatter = true
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        frontMatterEnd = i
        contentStart = i + 1
        inFrontMatter = false
        break
      }
      
      if (inFrontMatter) {
        frontMatterLines.push(lines[i])
      }
    }

    // Parse YAML front matter
    frontMatterLines.forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match) {
        const [, key, value] = match
        
        switch (key) {
          case 'title':
            metadata.title = value.replace(/^["']|["']$/g, '')
            break
          case 'description':
            metadata.description = value.replace(/^["']|["']$/g, '')
            break
          case 'tags':
            metadata.tags = value.split(',').map(tag => tag.trim().replace(/^["']|["']$/g, ''))
            break
          case 'category':
            metadata.category = value.replace(/^["']|["']$/g, '')
            break
          case 'author':
            metadata.author = value.replace(/^["']|["']$/g, '')
            break
          case 'date':
            metadata.date = value.replace(/^["']|["']$/g, '')
            break
        }
      }
    })
  }

  // Extract content
  const content = lines.slice(contentStart).join('\n').trim()
  
  // Auto-extract title from first H1 if not in metadata
  if (!metadata.title) {
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch) {
      metadata.title = titleMatch[1].trim()
    }
  }

  // Calculate word count and reading time
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  metadata.wordCount = wordCount
  metadata.readingTime = Math.ceil(wordCount / 200) // 200 words per minute

  // Auto-extract tags from content if not in metadata
  if (!metadata.tags || metadata.tags.length === 0) {
    const tagMatches = content.matchAll(/#(\w+)/g)
    metadata.tags = Array.from(tagMatches).map(match => match[1])
  }

  // Simple HTML conversion (basic)
  const html = markdownToHtml(content)

  return {
    metadata,
    content,
    html
  }
}

/**
 * Convert markdown to HTML (basic implementation)
 */
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    
    // Code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    
    // Wrap in paragraphs
    .replace(/^(.*)$/gim, '<p>$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>)/g, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
}

/**
 * Extract plain text from markdown
 */
export function extractText(markdown: string): string {
  return markdown
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`(.+?)`/g, '$1') // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/#{1,6}/g, '') // Remove hash symbols
    .trim()
}

/**
 * Generate summary from content
 */
export function generateSummary(content: string, maxLength: number = 200): string {
  const text = extractText(content)
  if (text.length <= maxLength) return text
  
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...'
}

/**
 * Validate markdown content
 */
export function validateMarkdown(markdown: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!markdown.trim()) {
    errors.push('Content cannot be empty')
  }
  
  // Check for common markdown syntax errors
  const lines = markdown.split('\n')
  let codeBlockCount = 0
  
  lines.forEach((line, index) => {
    // Check for unclosed code blocks
    if (line.trim().startsWith('```')) {
      codeBlockCount++
    }
    
    // Check for malformed headers
    if (line.match(/^#{1,6}\s*$/)) {
      errors.push(`Empty header at line ${index + 1}`)
    }
  })
  
  if (codeBlockCount % 2 !== 0) {
    errors.push('Unclosed code block detected')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
