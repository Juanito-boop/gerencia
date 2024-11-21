import React, { useState } from "react";
import ModalCreacion from "@/components/modales/lugares/modalCreacionLugar";
import ModalEditLugar from "@/components/modales/lugares/ModalEditLugar";
import ModalInfo from "@/components/modales/lugares/modalInformacion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { backend_url } from "@/constantes";
import { Plus, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ModalEliminar from "@/components/modales/lugares/modalEliminar";

export interface Lugares {
	id_lugar: string;
	nombrelugar: string;
	direccionlugar: string;
	aforototallugar: number;
}

export default function LugaresSectionView({
	activeSection,
	rol,
}: {
	activeSection: string;
	rol: string;
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	// Fetch lugares using React Query
	const fetchLugares = async () => {
		const response = await fetch(`${backend_url}/lugares`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch lugares");
		}

		const lugares: Lugares[] = await response.json();
		const lugaresOrdenados = lugares.sort((a, b) =>
			a.nombrelugar.localeCompare(b.nombrelugar)
		);
		return lugaresOrdenados;
	};

	const {
		data: allLugares,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["lugares"],
		queryFn: fetchLugares,
		staleTime: Infinity, // Los datos se consideran frescos indefinidamente
		// cacheTime: Infinity, // Los datos se mantienen en caché indefinidamente
		refetchOnMount: false, // No se refetch al montar el componente
		refetchOnWindowFocus: false, // No se refetch al enfocar la ventana
		enabled: activeSection === "lugares", // Solo se ejecuta si la sección activa es "lugares"
	});

	const renderLugares = () => {
		if (isLoading) {
			return (
				<div className="grid gap-3 grid-cols-3">
					{Array(3)
						.fill(0)
						.map((_, index) => (
							<Card key={index}>
								<CardHeader>
									<Skeleton className="w-full h-6 mb-2" />
									<Skeleton className="w-3/4 h-4" />
								</CardHeader>
								<CardContent>
									<Skeleton className="w-full h-4 mb-2" />
									<Skeleton className="w-2/3 h-4" />
									<Skeleton className="w-1/2 h-4" />
								</CardContent>
								<CardFooter>
									<Skeleton className="w-1/3 h-8" />
								</CardFooter>
							</Card>
						))}
				</div>
			);
		}

		if (error) {
			return <p>Error al cargar lugares: {(error as Error).message}</p>;
		}

		const filteredLugares = (allLugares || []).filter((lugar) =>
			lugar.nombrelugar.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (filteredLugares.length === 0) {
			return <p>No hay lugares disponibles.</p>;
		}

		return (
			<div className="grid gap-3 grid-cols-3">
				{filteredLugares.map((lugar) => (
					<Card key={lugar.id_lugar} className="border-gradient">
						<CardHeader className="h-auto">
							<CardTitle className="text-[#2c457e] text-xl truncate">
								{lugar.nombrelugar}
							</CardTitle>
						</CardHeader>
						<CardFooter className="zonaSensible">
							<ModalInfo elemento={lugar}>
								<Button
									className="bg-[#2c457e] hover:bg-[#2c457e]/90"
									size={"default"}
								>
									Ver Detalles
								</Button>
							</ModalInfo>
							{rol === "administrador" && (
								<>
									<ModalEditLugar lugar={lugar}>
										<Button
											className="bg-[#F49C00] hover:bg-[#F49C00]/90"
											size={"default"}
										>
											Editar Lugar
										</Button>
									</ModalEditLugar>
									<ModalEliminar elemento={lugar}>
										<Button
											className="bg-[#ea3433] hover:bg-[#ea3433]/90 eliminar"
											size={"default"}	
										>
											<Trash />
											Eliminar Lugar
										</Button>
									</ModalEliminar>
								</>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		);
	};

	// Función para manejar la eliminación de un lugar

	return (
		<>
			<div className="h-auto mb-6 grid gap-x-6 grid-cols-6">
				<Input
					className="border-2 col-span-5"
					placeholder="Buscar Lugar"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{rol === "administrador" && (
					<div className="col-start-6">
						<ModalCreacion>
							<Button
								className="bg-[#2c457e] hover:bg-[#2c457e]/90"
								onClick={() => {
									queryClient.invalidateQueries({ queryKey: ["lugares"] });
								}}
							>
								<Plus />
								Agregar Lugar
							</Button>
						</ModalCreacion>
					</div>
				)}
			</div>
			{renderLugares()}
		</>
	);
}
