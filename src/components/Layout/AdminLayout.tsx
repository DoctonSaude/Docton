import { Outlet, Link } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-slate-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Docton • Admin</h1>
        <nav className="space-y-2">
          <Link to="/admin" className="block hover:underline">Dashboard</Link>
        </nav>
      </aside>
      <main className="p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
