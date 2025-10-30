import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  Brain, 
  Search, 
  Users, 
  Zap, 
  FileText, 
  Network,
  Shield,
  Sparkles
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-neutral-900">MDReader</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="mb-6">
              <Sparkles className="w-16 h-16 text-primary-600 mx-auto" />
            </div>
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">
              AI-First Markdown
              <span className="text-primary-600"> Knowledge Management</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Organize, visualize, and collaborate on your markdown documents with the power of AI. 
              Automatic categorization, semantic search, and knowledge graphs - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">View Features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                Everything You Need for Smart Documentation
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                From AI-powered organization to real-time collaboration, MDReader has it all.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                    AI-Powered Categorization
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Automatically categorize and tag your documents using advanced AI. 
                    Never waste time organizing your knowledge again.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Search className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                    Semantic Search
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Search by meaning, not just keywords. Our vector-based search finds 
                    relevant content even when you don't know the exact terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Network className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                    Knowledge Graphs
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Visualize connections between your documents with interactive knowledge graphs. 
                    Discover relationships you never knew existed.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                    Real-time Collaboration
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Work together seamlessly with real-time editing, presence indicators, 
                    and version history. No more conflicts or lost work.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Zap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                    Lightning Fast
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Built for speed with sub-50ms search responses and instant navigation. 
                    Your knowledge at your fingertips, instantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                    Privacy First
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Your data stays yours with end-to-end encryption and GDPR compliance. 
                    Self-hosting options available for ultimate control.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-primary-600">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Documentation?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using MDReader to organize their knowledge 
              and collaborate more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600" asChild>
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileText className="w-6 h-6" />
              <span className="text-lg font-semibold">MDReader</span>
            </div>
            <div className="text-sm text-neutral-500">
              © 2025 MDReader. Built with ❤️ for knowledge workers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
