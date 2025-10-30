'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FileText, Eye, EyeOff, Check } from 'lucide-react'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  })

  function checkPasswordRequirements(password: string) {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement Supabase auth
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      setIsLoading(false)
      return
    }
    
    console.log('Signup attempt:', { email, password })
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-neutral-900">MDReader</h1>
          </div>
          <p className="text-neutral-600">
            Start organizing your knowledge with AI
          </p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Create Your Account
            </h2>
            <p className="text-neutral-600">
              Join thousands of teams using MDReader
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  onChange={(e) => checkPasswordRequirements(e.target.value)}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                />
                
                {/* Password Requirements */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <Check 
                      className={`w-4 h-4 mr-2 ${
                        passwordRequirements.minLength 
                          ? 'text-success-600' 
                          : 'text-neutral-300'
                      }`} 
                    />
                    <span className={passwordRequirements.minLength ? 'text-success-600' : 'text-neutral-500'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check 
                      className={`w-4 h-4 mr-2 ${
                        passwordRequirements.hasUppercase 
                          ? 'text-success-600' 
                          : 'text-neutral-300'
                      }`} 
                    />
                    <span className={passwordRequirements.hasUppercase ? 'text-success-600' : 'text-neutral-500'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check 
                      className={`w-4 h-4 mr-2 ${
                        passwordRequirements.hasLowercase 
                          ? 'text-success-600' 
                          : 'text-neutral-300'
                      }`} 
                    />
                    <span className={passwordRequirements.hasLowercase ? 'text-success-600' : 'text-neutral-500'}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check 
                      className={`w-4 h-4 mr-2 ${
                        passwordRequirements.hasNumber 
                          ? 'text-success-600' 
                          : 'text-neutral-300'
                      }`} 
                    />
                    <span className={passwordRequirements.hasNumber ? 'text-success-600' : 'text-neutral-500'}>
                      One number
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                />
              </div>

              {/* Terms and Privacy */}
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <span className="ml-2 text-sm text-neutral-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="newsletter"
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 mt-0.5"
                  />
                  <span className="ml-2 text-sm text-neutral-600">
                    Send me product updates and tips (optional)
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={!allRequirementsMet}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" disabled>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              
              <Button variant="outline" className="w-full" disabled>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <p className="text-center text-neutral-600 mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
