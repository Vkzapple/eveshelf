import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, LogIn } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const [error, setError] = useState('')

  const onSubmit = async ({ email, password }) => {
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (authError) setError(authError.message)
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand brand-sm">
          eve<span>shelf</span>
        </Link>
        <p className="eyebrow">Admin access</p>
        <h1>Sign in to the studio</h1>
        <p className="auth-note">
          Only the owner account can manage books. Create the account in your Supabase
          dashboard first.
        </p>

        <form className="book-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="you@example.com"
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-solid" disabled={isSubmitting}>
            <LogIn size={16} />
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <Link to="/" className="auth-back">
          <ArrowLeft size={15} />
          Back to the shelf
        </Link>
      </div>
    </main>
  )
}
