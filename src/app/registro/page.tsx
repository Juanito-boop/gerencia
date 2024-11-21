'use client'

import { useState } from 'react'
import { Eye, EyeOff, Calendar, Mail, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { backend_url } from '@/constantes'

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false) 
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [formData, setFormData] = useState({
		nombre: '',
		apellido: '',
		email: '',
		username: '',
		password: '',
		confirmPassword: ''
	})

	const router = useRouter()

	const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
		if (field === 'password') {
			setShowPassword(!showPassword)
		} else {
			setShowConfirmPassword(!showConfirmPassword)
		}
	}

	const { toast } = useToast()

	const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
	const usernameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]{5,}$/;
	const emailRegex = /^[a-zA-Z0-9._%+-]{5,}@(gmail|yahoo|hotmail|outlook)\.com$/;
	const passwordRegex = /^[^\\\"';,./]+$/;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData(prev => ({ ...prev, [name]: value }))
		setTimeout(() => {
			const isValidPassword = passwordRegex.test(formData.password);
			const isValidConfirmPassword = passwordRegex.test(formData.confirmPassword);
			if (isValidPassword !== isValidConfirmPassword) {
				toast({
					title: "Error",
					description: "Las contraseñas no cumplen con los requisitos de validación.",
					variant: "destructive"
				})
			}
			
			}, 1000);
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		
		const emailParts = formData.email.split('@');
		const validationErrors = [];

		if (!nameRegex.test(formData.nombre)) {
			validationErrors.push("El nombre no puede contener números ni caracteres especiales.");
		}
		if (!nameRegex.test(formData.apellido)) {
			validationErrors.push("El apellido no puede contener números ni caracteres especiales.");
		}
		if (!usernameRegex.test(formData.username)) {
			validationErrors.push("El nombre de usuario debe tener al menos 5 caracteres, solo letras y números.");
		}
		if (emailParts[0].length < 5) {
			validationErrors.push("El correo electrónico debe tener al menos 5 caracteres antes del @.");
		}
		if (!emailRegex.test(formData.email)) {
			validationErrors.push("El correo electrónico debe ser de Gmail, Yahoo, Hotmail u Outlook.");
		}
		if (!passwordRegex.test(formData.password) || !passwordRegex.test(formData.confirmPassword)) {
			validationErrors.push("La contraseña contiene caracteres inválidos que pueden causar problemas.");
		}
		if (formData.password !== formData.confirmPassword) {
			validationErrors.push("Las contraseñas no coinciden.");
		}

		if (validationErrors.length > 0) {
			validationErrors.forEach((error) => {
				toast({
					title: "Error",
					description: error,
					variant: "destructive"
				});
			});
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch(`${backend_url}/crearUsuario`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					"nombre":			formData.nombre,
					"apellido":		formData.apellido,
					"email":			formData.email,
					"username":		formData.username,
					"password":		formData.password,
					"rol": "usuario",
				}),
			})
			
			if (response.ok === true) {
				console.log(response)
				router.push('/')
			}

			toast({
				title: "Registro exitoso",
				description: "Tu cuenta ha sido creada exitosamente.",
				variant: 'constructive'
			})

		} catch (error: any) {
			toast({
				title: "Error",
				description: error.mensaje ?? "Error al registrar. Por favor, intenta de nuevo.",
			})
		} finally {
			setFormData({
				"nombre": '',
				"apellido": '',
				"email": '',
				"username": '',
				"password": '',
				"confirmPassword":	''
			})
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#ea3433] to-[#2c457e] flex items-center justify-center p-4">
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
									<Input id="username" name="username" className='w-[85%]' placeholder="Nombre de Usuario" type="text" required value={formData.username} min={5} onChange={handleInputChange} />
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
						<Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading} onClick={() => {
							toast({
								title: "Registrando Nuevo Usuario",
								description: 'Creando usuario...',
								variant: "pending"
							})
						}}>
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
