import { Outlet, Link } from 'react-router-dom'

export default function PatientLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[200px_1fr]">
      <aside className="bg-indigo-700 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Docton • Paciente</h1>
        <nav className="space-y-2">
          <Link to="/patient" className="block hover:underline">Dashboard</Link>
        </nav>
      </aside>
      <main className="p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
