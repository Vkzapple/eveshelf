import { Link } from 'react-router-dom'
import { ArrowLeft, Database } from 'lucide-react'

export default function SupabaseSetup() {
  return (
    <main className="admin">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Content studio</p>
          <h1>
            eve<em>shelf</em> admin
          </h1>
        </div>
        <Link to="/" className="btn btn-outline">
          <ArrowLeft size={16} />
          View shelf
        </Link>
      </div>

      <div className="setup-panel setup-panel-lg">
        <Database size={22} />
        <div>
          <h2>Supabase is not connected yet</h2>
          <ol className="setup-steps">
            <li>Create a project in the Supabase dashboard.</li>
            <li>
              Open the SQL editor and run <code>supabase/schema.sql</code>, then{' '}
              <code>supabase/seed.sql</code>.
            </li>
            <li>
              In Authentication, create your admin user and disable new sign-ups.
            </li>
            <li>
              Copy <code>.env.example</code> to <code>.env.local</code> and fill in the
              project URL and anon key.
            </li>
            <li>Restart the dev server and sign in here at /admin.</li>
          </ol>
        </div>
      </div>
    </main>
  )
}