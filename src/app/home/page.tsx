"use client"

import ModalInfo from "@/components/modales/eventos/modalInformacion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { backend_url } from "@/constantes";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { CalendarDays, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface Evento {
  id_evento: number;
  nombre_evento: string;
  descripcion_evento: string;
  organizador_evento: string;
  lugar_evento: string;
  fecha_evento: Date;
  hora_evento: Date;
  valor_evento: number;
  id_usuario: string;
  id_lugar: string;
  fecha_finalizacion: Date;
  hora_finalizacion: Date;
}

const fetchEvents = async (searchTerm: string) => {
  const response = await fetch(`${backend_url}/eventos/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const allEvents: Evento[] = await response.json().catch(() => []);
  return allEvents ? allEvents.filter(event =>
    event.nombre_evento.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events', searchTerm],
    queryFn: () => fetchEvents(searchTerm),
    staleTime: 2 * 60 * 1000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const token = localStorage.getItem('token');
  let username = '';
  if (token) {
    const decodedToken = jwtDecode(token) as { user_id: string; username: string; rol: string; iat: number; exp: number };
    username = decodedToken.username;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8">
					<section className="flex justify-between">
						<h1 className="text-3xl font-bold mb-4 text-[#2c457e]">Descubre eventos increíbles</h1>
						<Button variant="secondary" asChild>
							<Link href={`/profile/${username}`}>
								<User className="mr-2 h-4 w-4" />
								Perfil
							</Link>
						</Button>
					</section>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Buscar eventos..."
							className="flex-grow border-gradient border-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </header>

        {isLoading && <p>Cargando eventos...</p>}
        {isError && <p>Error al cargar los eventos. Por favor, intenta de nuevo.</p>}

        {!isLoading && !isError && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((evento: Evento) => (
							<Card key={evento.id_evento} className="border-gradient grid grid-cols-1 grid-rows-[1fr_1fr_20%]">
                <CardHeader>
									<CardTitle className="truncate text-[#2c457e]">{evento.nombre_evento}</CardTitle>
                  <CardDescription>
											<div className="flex items-center mt-2">
												<CalendarDays className="mr-2 h-4 w-4" />
												{new Date(evento.fecha_evento).toLocaleDateString('es-ES')}
											</div>
											<div className="flex items-center mt-1">
												<MapPin className="mr-2 h-4 w-4" />
												{evento.lugar_evento}
											</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="row-start-2">
                  <p>{evento.descripcion_evento}</p>
                </CardContent>
                <CardFooter className="row-start-3">
                  <ModalInfo key={evento.id_evento} elemento={evento}>
										<Button className="my-auto bg-[#2c457e] hover:bg-[#2c457e]/90">Ver Detalles</Button>
                  </ModalInfo>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !isError && events.length === 0 && (
          <p>No se encontraron eventos. Intenta con otra búsqueda.</p>
        )}
      </main>

      <footer className="bg-muted py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 EventosApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
