import { Database } from 'lucide-react'

export default function SetupNotice() {
  return (
    <section className="setup-section">
      <div className="setup-panel">
        <Database size={22} />
        <div>
          <h2>Connect Supabase to load the shelf</h2>
          <p>
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to{' '}
            <code>.env.local</code>, then restart the dev server. Run{' '}
            <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code> in the
            Supabase SQL editor first.
          </p>
        </div>
      </div>
    </section>
  )
}
