"use client"

import { FormEvent, useState } from 'react'
import { Eye, EyeOff, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'
import { Toast } from '@radix-ui/react-toast'
import { ToastTitle } from '@/components/ui/toast'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [username, setUsername] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState<string>("")
  const [response, setResponse] = useState<string | null>(null)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const { toast } = useToast()

  const usernameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+$/;
  const passwordRegex = /^[^\\"';,./\\]+$/;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    if(!usernameRegex.test(username)) {
      setError('El nombre de usuario no puede contener números ni caracteres especiales.')
      toast({
        title: "Error",
        description: 'El nombre de usuario no puede contener números ni caracteres especiales.',
      })
      setIsLoading(false)
      return
    }

    if (!passwordRegex.test(password)) {
      setError('La contraseña no puede contener caracteres especiales.')
      toast({
        title: "Error",
        description: 'La contraseña no puede contener caracteres especiales.',
      })
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        username: username,
        password_hash: password,
      }

      const response = await fetch('http://localhost:8088/api/v1/public/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      const data = await response.json()
      setResponse(data)
    } catch (e: any) {
      setError(e.message ?? "")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-center mb-6">
            <Calendar className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Iniciar Sesión en EventoPro
          </h2>
          {error && <div className='text-red-500 text-sm'>{error}</div>}
          {response && <div className='text-green-500 text-sm'>{response}</div>}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                placeholder=""
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className='flex flex-row gap-x-2' htmlFor="password">Contraseña<p className='text-gray-400'>(8 caracteres minimo)</p></Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder='********'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading} onClick={()=> {
              toast({
                title: "Iniciando Sesión",
                description: 'Iniciando Sesión...',
              })
            }}>
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-purple-600 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}<a href="/registro" className="text-purple-600 hover:underline">Regístrate</a>
            </p>
          </div>
        </div>
        <div className="px-4 py-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Al iniciar sesión, aceptas nuestros{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Términos de Servicio
            </a>{" "}y{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
