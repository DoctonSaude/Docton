import { FormEvent, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [phase, setPhase] = useState<'email' | 'code'>('email')
  const { user, signInWithOtp, verifyOtp } = useAuth()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      if (phase === 'email') {
        await signInWithOtp(email)
        setMessage('Enviamos um código para seu e-mail.')
        setPhase('code')
      } else {
        await verifyOtp(email, code)
        setMessage('Login realizado!')
        setTimeout(() => { window.location.href = '/patient' }, 500)
      }
    } catch (err: any) {
      setMessage(err.message ?? 'Erro ao entrar.')
    }
  }

  if (user) {
    window.location.href = '/patient'
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Acessar a plataforma</h2>
      <p className="text-sm text-gray-600 mb-6">
        Faça login com seu e-mail. Seu papel (admin/partner/patient) vem da tabela <b>profiles</b>.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input type="email" required className="w-full border rounded-lg p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@exemplo.com" />
        </div>
        {phase === 'code' && (
          <div>
            <label className="block text-sm font-medium mb-1">Código recebido</label>
            <input type="text" required className="w-full border rounded-lg p-2" value={code} onChange={e => setCode(e.target.value)} placeholder="123456" />
          </div>
        )}
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2">
          {phase === 'email' ? 'Enviar código' : 'Validar código'}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  )
}
