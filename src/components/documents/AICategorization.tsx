import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Tag,
  Folder,
  FileText
} from 'lucide-react'
import { analyzeDocument, AICategorizationResult, DocumentAnalysis } from '@/lib/ai/categorizer'

interface AICategorizationProps {
  content: string
  onCategorySelect?: (category: string) => void
  onTagsSelect?: (tags: string[]) => void
  onSummarySelect?: (summary: string) => void
}

export const AICategorization: React.FC<AICategorizationProps> = ({
  content,
  onCategorySelect,
  onTagsSelect,
  onSummarySelect
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    categorization: AICategorizationResult
    analysis: DocumentAnalysis
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please provide some content to analyze')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const analysisResult = await analyzeDocument(content)
      setResult(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApplyCategory = () => {
    if (result?.categorization.suggestedCategory) {
      onCategorySelect?.(result.categorization.suggestedCategory)
    }
  }

  const handleApplyTags = () => {
    if (result?.categorization.suggestedTags) {
      onTagsSelect?.(result.categorization.suggestedTags)
    }
  }

  const handleApplySummary = () => {
    if (result?.categorization.summary) {
      onSummarySelect?.(result.categorization.summary)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'complex': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'negative': return 'bg-red-100 text-red-800'
      case 'neutral': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Analyze Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                <p className="text-sm text-gray-500">
                  Get smart suggestions for category, tags, and summary
                </p>
              </div>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !content.trim()}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Processing Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Analysis completed</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {result.categorization.processingTime}ms
                  </div>
                  <div className={`flex items-center gap-1 ${getConfidenceColor(result.categorization.confidence)}`}>
                    <span>{Math.round(result.categorization.confidence * 100)}% confidence</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categorization Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Suggested Category</h4>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">
                      {result.categorization.suggestedCategory}
                    </p>
                  </div>
                  <Button
                    onClick={handleApplyCategory}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Apply Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Suggested Tags</h4>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {result.categorization.suggestedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-green-100 text-green-800">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={handleApplyTags}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Apply Tags
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Generated Summary</h4>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-900">
                    {result.categorization.summary}
                  </p>
                </div>
                <Button
                  onClick={handleApplySummary}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Apply Summary
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <h4 className="font-semibold text-gray-900">Document Analysis</h4>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Sentiment</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(result.analysis.sentiment)}`}>
                    {result.analysis.sentiment}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Complexity</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(result.analysis.complexity)}`}>
                    {result.analysis.complexity}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Reading Time</p>
                  <span className="text-sm font-medium text-gray-900">
                    {result.analysis.estimatedReadingTime} min
                  </span>
                </div>
              </div>
              
              {result.analysis.keyTopics.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Key Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.keyTopics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
