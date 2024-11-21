'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { backend_url } from "@/constantes";
import { Calendar, DotSquare, House, MapPin, User } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from 'react';
import CambiarContraseñaSectionView from "./CambiarContraseñaSectionView";
import EditarPerfilSectionView from "./EditarPerfilSectionView";
import EventosSectionView from "./EventosSectionView";
import LugaresSectionView from "./LugaresSectionView";

const SECTIONS = {
	EVENTOS: 'eventos',
	CREAR_EVENTO: 'crearEvento',
	EDITAR_PERFIL: 'editarPerfil',
	CAMBIAR_CONTRASEÑA: 'cambiarContraseña',
	LUGARES: 'lugares'
};

export default function Page({ params }: { params: { username: string } }) {
	const username = params.username;
	const [activeSection, setActiveSection] = useState(SECTIONS.EVENTOS);
	const [user, setUser] = useState({
		user_id: "",
		username: "",
		avatar_url: "",
		nombre: "",
		apellido: "",
		email: "",
		rol: ""
	});

	useEffect(() => {
		const fetchProfile = async () => {
			const response = await fetch(`${backend_url}/perfiles/${username}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
				},
			});

			const profile = await response.json().catch(() => []);
			setUser(profile);
		};

		fetchProfile();
	}, [username]);

	const renderContent = () => {
		switch (activeSection) {
			case SECTIONS.EVENTOS:
				return <EventosSectionView user_id={user.user_id} username={user.username} rol={user.rol} />;
			case SECTIONS.EDITAR_PERFIL:
				return <EditarPerfilSectionView username={username} />;
			case SECTIONS.CAMBIAR_CONTRASEÑA:
				return <CambiarContraseñaSectionView username={username} />;
			case SECTIONS.LUGARES:
				return <LugaresSectionView activeSection={activeSection} rol={user.rol} />;
			default:
				return <EventosSectionView user_id={user.user_id} username={user.username} rol={user.rol} />;
		}
	};

	return (
		<SidebarProvider>
			<div className="flex h-screen overflow-hidden w-screen">
				<Sidebar className="border-r">
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem className="grid grid-cols-[20%_1fr] gap-x-2">
								<SidebarMenuButton className="h-full" onClick={() => window.location.href = '/home'}><House className="m-auto" /></SidebarMenuButton>
								<SidebarMenuButton className="border border-gradient" size="lg">
									<Avatar>
										<AvatarImage 
											src={user.avatar_url || "https://tslibeocsymbvzsvtfkh.supabase.co/storage/v1/object/public/Avatars/user.svg"} 
											alt={user.rol} 
											className="rounded-full"
										/>
										<AvatarFallback></AvatarFallback>
									</Avatar>
									<span className="truncate">{username}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>
					<SidebarContent>
						<SidebarMenu>
							<SidebarMenuItem className="px-2">
								<SidebarMenuButton onClick={() => setActiveSection(SECTIONS.EVENTOS)}>
									<Calendar />
									<span>Eventos</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{user.rol === 'administrador' && (
								<>
									<SidebarMenuItem className="px-2">
										<SidebarMenuButton onClick={() => setActiveSection(SECTIONS.LUGARES)}>
											<MapPin />
											<span>Lugares</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</>
							)}
							<SidebarMenuItem className="px-2">
								<SidebarMenuButton onClick={() => setActiveSection(SECTIONS.EDITAR_PERFIL)}>
									<User />
									<span>Editar Perfil</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem className="px-2">
								<SidebarMenuButton onClick={() => setActiveSection(SECTIONS.CAMBIAR_CONTRASEÑA)}>
									<DotSquare />
									<span>Cambiar Contraseña</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarContent>
					<SidebarFooter>
						<Button asChild className="bg-[#2c457e] hover:bg-[#2c457e]/90">
							<Link onClick={() => localStorage.removeItem('token')} href={"/"}>Cerrar Sesion</Link>
						</Button>
					</SidebarFooter>
				</Sidebar>
				<main className="flex-1 flex flex-col overflow-hidden w-full">
					<header className="sticky top-0 z-10 flex items-center h-16 px-6 bg-background border-b w-full">
						<h1 className="text-2xl font-bold text-[#2c457e]">Perfil de Usuario</h1>
					</header>
					<div className="flex-1 overflow-auto p-6">
						{renderContent()}
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
