/**
 * AI Categorization for MDReader
 * 
 * Uses OpenAI to automatically categorize and tag documents
 */

export interface AICategorizationResult {
  suggestedCategory: string
  suggestedTags: string[]
  summary: string
  confidence: number
  processingTime: number
}

export interface DocumentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  complexity: 'simple' | 'moderate' | 'complex'
  estimatedReadingTime: number
  keyTopics: string[]
  actionItems: string[]
}

/**
 * Analyze document content using AI
 */
export async function analyzeDocument(content: string): Promise<{
  categorization: AICategorizationResult
  analysis: DocumentAnalysis
}> {
  const startTime = Date.now()
  
  try {
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }

    // Prepare the prompt for OpenAI
    const prompt = `
Analyze the following markdown document and provide:

1. Suggested category (one of: Technical Documentation, Product Requirements, Meeting Notes, Research & Analysis, Personal Notes)
2. 3-5 relevant tags (single words or short phrases)
3. A concise summary (max 200 characters)
4. Sentiment analysis (positive/negative/neutral)
5. Content complexity (simple/moderate/complex)
6. Key topics mentioned
7. Any action items or next steps

Document content:
"""
${content.substring(0, 4000)} // Limit to first 4000 chars for API limits
"""

Respond in JSON format:
{
  "category": "suggested_category",
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "concise_summary",
  "sentiment": "positive|negative|neutral",
  "complexity": "simple|moderate|complex",
  "keyTopics": ["topic1", "topic2"],
  "actionItems": ["action1", "action2"]
}
`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert document analyzer that helps categorize and summarize markdown documents for a knowledge management system.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = JSON.parse(data.choices[0].message.content)

    const processingTime = Date.now() - startTime

    return {
      categorization: {
        suggestedCategory: aiResponse.category,
        suggestedTags: aiResponse.tags || [],
        summary: aiResponse.summary,
        confidence: 0.85, // Mock confidence score
        processingTime
      },
      analysis: {
        sentiment: aiResponse.sentiment || 'neutral',
        complexity: aiResponse.complexity || 'moderate',
        estimatedReadingTime: Math.ceil(content.split(/\s+/).length / 200),
        keyTopics: aiResponse.keyTopics || [],
        actionItems: aiResponse.actionItems || []
      }
    }

  } catch (error) {
    console.error('AI analysis failed:', error)
    
    // Fallback to basic analysis
    return fallbackAnalysis(content, Date.now() - startTime)
  }
}

/**
 * Fallback analysis when AI is unavailable
 */
function fallbackAnalysis(content: string, processingTime: number): {
  categorization: AICategorizationResult
  analysis: DocumentAnalysis
} {
  const words = content.split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // Basic keyword-based categorization
  const lowerContent = content.toLowerCase()
  
  let suggestedCategory = 'Personal Notes'
  let suggestedTags: string[] = []
  
  // Category detection
  if (lowerContent.includes('api') || lowerContent.includes('function') || lowerContent.includes('code')) {
    suggestedCategory = 'Technical Documentation'
    suggestedTags.push('technical', 'api', 'documentation')
  } else if (lowerContent.includes('requirement') || lowerContent.includes('feature') || lowerContent.includes('user story')) {
    suggestedCategory = 'Product Requirements'
    suggestedTags.push('requirements', 'product', 'features')
  } else if (lowerContent.includes('meeting') || lowerContent.includes('agenda') || lowerContent.includes('action items')) {
    suggestedCategory = 'Meeting Notes'
    suggestedTags.push('meeting', 'notes', 'action-items')
  } else if (lowerContent.includes('research') || lowerContent.includes('analysis') || lowerContent.includes('data')) {
    suggestedCategory = 'Research & Analysis'
    suggestedTags.push('research', 'analysis', 'data')
  }
  
  // Extract hashtags as tags
  const hashtagMatches = content.matchAll(/#(\w+)/g)
  const hashtagTags = Array.from(hashtagMatches).map(match => match[1])
  suggestedTags = [...new Set([...suggestedTags, ...hashtagTags])].slice(0, 5)
  
  // Generate basic summary
  const summary = content.substring(0, 150).replace(/\n/g, ' ').trim() + (content.length > 150 ? '...' : '')
  
  return {
    categorization: {
      suggestedCategory,
      suggestedTags,
      summary,
      confidence: 0.6, // Lower confidence for fallback
      processingTime
    },
    analysis: {
      sentiment: 'neutral',
      complexity: wordCount > 500 ? 'complex' : wordCount > 200 ? 'moderate' : 'simple',
      estimatedReadingTime: Math.ceil(wordCount / 200),
      keyTopics: suggestedTags,
      actionItems: []
    }
  }
}

/**
 * Batch categorize multiple documents
 */
export async function batchCategorize(documents: Array<{ id: string; content: string }>): Promise<Array<{
  id: string
  result: AICategorizationResult
}>> {
  const results = await Promise.allSettled(
    documents.map(async (doc) => ({
      id: doc.id,
      result: (await analyzeDocument(doc.content)).categorization
    }))
  )
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return {
        id: documents[index].id,
        result: fallbackAnalysis(documents[index].content, 0).categorization
      }
    }
  })
}

/**
 * Get category suggestions based on content
 */
export async function getCategorySuggestions(content: string): Promise<string[]> {
  const { categorization } = await analyzeDocument(content)
  return [categorization.suggestedCategory]
}

/**
 * Get tag suggestions based on content
 */
export async function getTagSuggestions(content: string): Promise<string[]> {
  const { categorization } = await analyzeDocument(content)
  return categorization.suggestedTags
}

/**
 * Generate AI-powered summary
 */
export async function generateAISummary(content: string): Promise<string> {
  const { categorization } = await analyzeDocument(content)
  return categorization.summary
}
