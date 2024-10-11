'use client'

import { useState } from 'react'
import { Eye, EyeOff, Calendar, Mail, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'  

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) 
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [mensaje, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const { toast } = useToast()

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.com$/;
  const passwordRegex = /^[^\\"';,./\\]+$/;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === "confirmPassword" || name === "password") {
      setPasswordError("");
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (!nameRegex.test(formData.nombre)) {
      setFormError('El nombre no puede contener números ni caracteres especiales.')
      setIsLoading(false)
      return
    }

    if (!nameRegex.test(formData.apellido)) {
      setFormError('El apellido no puede contener números ni caracteres especiales.')
      setIsLoading(false)
      return
    }

    if (!emailRegex.test(formData.email)) {
      setFormError('El correo electrónico debe ser de Gmail, Yahoo, Hotmail o Outlook.')
      setIsLoading(false)
      return
    }

    if (!passwordRegex.test(formData.password)) {
      setPasswordError('La contraseña contiene caracteres inválidos que pueden causar problemas.')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8088/api/v1/public/crearUsuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "nombre":     formData.nombre,
          "apellido":   formData.apellido,
          "email":      formData.email,
          "username":   formData.username,
          "password":   formData.password,
          "avatar_url": '',
          "role":       2
        }),
      })
      // {
      //  "nombre":     "Brendin",
      //  "apellido":   "Minger",
      //  "email":      "bminger3@berkeley.edu",
      //  "username":   "bminger3",
      //  "password":   "tH4FXLf9UC~fnW",
      //  "avatar_url": "http://dummyimage.com/104x100.png/ff4444/ffffff",
      //  "role":       1
      // },


      if (!response.ok) {
        throw new Error('Error al registrar. Por favor, intenta de nuevo.')
      }
      console.log(response)
      console.log('Registro exitoso')
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada exitosamente.",
      })
    } catch (error: any) {
      setError(error.message ?? "")
      toast({
        title: "Error",
        description: mensaje ?? "Error al registrar. Por favor, intenta de nuevo.",
      })
    } finally {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="max-h-screen w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-center mb-6">
            <Calendar className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Regístrate en EventoPro
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex flex-row space-x-4'>
              <div className="space-y-2 w-full">
                <Label htmlFor="nombre">Nombre</Label>
                <div className="flex flex-row">
                  <Input id="nombre" name="nombre" className='w-[85%]' placeholder="Tu Nombre" type="text" required value={formData.nombre} onChange={handleInputChange} />
                  <User className="h-5 w-5 m-auto text-gray-500" />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="apellido">Apellido</Label>
                <div className="flex flex-row">
                  <Input id="apellido" name="apellido" className='w-[85%]' placeholder="Tu Apellido" type="text" required value={formData.apellido} onChange={handleInputChange} />
                 <User className="h-5 w-5 m-auto text-gray-500" />
                </div>
              </div>
            </div>
            <div className='flex flex-row space-x-4'>
              <div className="space-y-2 w-full">
                <Label htmlFor="username">Username</Label>
                <div className="flex flex-row">
                  <Input id="username" name="username" className='w-[85%]' placeholder="Nombre de Usuario" type="text" required value={formData.username} onChange={handleInputChange}/>
                 <User className="h-5 w-5 m-auto text-gray-500" />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="flex flex-row">
                  <Input id="email" name="email" className='w-[85%]' placeholder="tu@ejemplo.com" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" required value={formData.email} onChange={handleInputChange} />
                  <Mail className="h-5 w-5 m-auto text-gray-500" />
                </div>
              </div>
            </div>
            <div className='flex flex-row space-x-4'>
              <div className="space-y-2 w-full">
                <Label htmlFor="password">Contraseña</Label>
                <div className="flex flex-row">
                  <Input id="password" name="password" className='w-[85%]' type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleInputChange} />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="h-5 w-5 m-auto text-gray-500"
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
              <div className="space-y-2 w-full">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="flex flex-row">
                  <Input id="confirmPassword" name="confirmPassword" className='w-[85%]' type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={handleInputChange} />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="h-5 w-5 m-auto text-gray-500"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {formError && (
              <p className="text-red-500 text-sm">{formError}</p>
            )}
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Registrarse'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}<a href='/' className="text-purple-600 hover:underline">Inicia Sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}