import { Evento } from "@/app/home/page";
import ModalEditInfoEvento from "@/components/modales/eventos/modalEdicionInformacion";
import ModalInfo from "@/components/modales/eventos/modalInformacion";
import ModalCreacion from "@/components/modales/eventos/modalCreacionEvento";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { backend_url } from "@/constantes";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ModalEliminar from "@/components/modales/eventos/modalEliminar";

const EventTitle = ({ title }: { title: string }) => {
	const titleRef = useRef<HTMLDivElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);
	const [duration, setDuration] = useState<number>(0);

	useState(() => {
		if (titleRef.current) {
			const contentWidth = titleRef.current.scrollWidth;
			const containerWidth = titleRef.current.offsetWidth;

			if (contentWidth > containerWidth) {
				setIsTruncated(true);
				const extraWidth = contentWidth - containerWidth;
				setDuration((extraWidth + containerWidth) / 50);
			} else {
				setIsTruncated(false);
			}
		}
	});

	return (
		<div className="relative w-full overflow-hidden">
			<div
				ref={titleRef}
				className={`text-[#2c457e] text-xl inline-block whitespace-nowrap font-bold ${isTruncated ? "animate-scroll" : ""
					}`}
				style={{
					animationDuration: `${duration}s`,
				}}
			>
				{title}
			</div>
		</div>
	);
};

interface EventCardProps {
	evento: Evento;
	user_id: string;
	username: string;
	rol: string;
	refetchEvents: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
	evento,
	user_id,
	username,
	rol,
	refetchEvents,
}) => {
	const queryClient = useQueryClient();
	const isOwner = user_id === evento.id_usuario || rol === "administrador";

	return (
		<Card
			key={evento.id_evento}
			className="border-gradient grid grid-cols-1 h-[360px]"
		>
			<CardHeader className="flex flex-col">
				<EventTitle title={evento.nombre_evento} />
				<CardDescription className="flex-1 h-[1fr]">
					<section>
						<span>Inicio </span>
						{new Date(evento.fecha_evento).toLocaleDateString()} -{" "}
						{new Date(evento.hora_evento).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</section>
					<section>
						<span>Finalización </span>
						{new Date(evento.fecha_finalizacion).toLocaleDateString()} -{" "}
						{new Date(evento.hora_finalizacion).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</section>
				</CardDescription>
			</CardHeader>
			<CardContent className="row-start-2 overflow-y-auto">
				<p>
					<strong>Organizador: </strong> {evento.organizador_evento}
				</p>
				<p>
					<strong>Lugar: </strong> {evento.lugar_evento}
				</p>
				<p>
					<strong>Valor: </strong>
					{evento.valor_evento
						? `$ ${evento.valor_evento.toLocaleString()}`
						: "Gratuito"}
				</p>
			</CardContent>
			<CardFooter className="zonaSensible row-start-3">
				<ModalInfo key={evento.id_evento} elemento={evento}>
					<Button
						className="bg-[#2c457e] hover:bg-[#2c457e]/90"
						size="default"
					>
						Ver Detalles
					</Button>
				</ModalInfo>
				{isOwner && (
					<>
						<ModalEditInfoEvento
							evento={evento}
							username={username}
							user_id={user_id}
						>
							<Button
								className="bg-[#F49C00] hover:bg-[#F49C00]/90"
								size="default"
								onClick={() => {
									queryClient.invalidateQueries({ queryKey: ["events"] });
								}}
							>
								Editar Evento
							</Button>
						</ModalEditInfoEvento>
						<ModalEliminar elemento={evento}>
							<Button
								className="bg-[#ea3433] hover:bg-[#ea3433]/90 eliminar"
								size="default"
							>
								<Trash />
								Eliminar Evento
							</Button>
						</ModalEliminar>
					</>
				)}
			</CardFooter>
		</Card>
	);
};

// Component for skeleton loading cards
const SkeletonCard: React.FC = () => (
	<Card>
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
);

export default function EventosSectionView({
	user_id,
	username,
	rol,
}: {
	user_id: string;
	username: string;
	rol: string;
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	const fetchEvents = async () => {
		const response = await fetch(`${backend_url}/eventos/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const events: Evento[] = await response.json();
		const today = new Date();
		today.setMonth(today.getMonth() - 6);
		const recentEvents = events.filter(
			(evento) => new Date(evento.fecha_evento) > today
		);
		return recentEvents;
	};

	const {
		data: allEvents,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["events"],
		queryFn: fetchEvents,
		staleTime: Infinity,
		// cacheTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	const renderEvents = () => {
		if (isLoading) {
			return Array(3)
				.fill(0)
				.map((_, index) => <SkeletonCard key={index} />);
		}

		if (error) {
			return <p>Error al cargar eventos: {(error as Error).message}</p>;
		}

		const events = allEvents || [];

		const filteredEvents = events.filter((evento: Evento) =>
			evento.nombre_evento.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (filteredEvents.length === 0) {
			return <p>No hay eventos próximos.</p>;
		}

		return filteredEvents.map((evento: Evento) => (
			<EventCard
				key={evento.id_evento}
				evento={evento}
				user_id={user_id}
				username={username}
				rol={rol}
				refetchEvents={() => queryClient.invalidateQueries({ queryKey: ["events"] })}
			/>
		));
	};

	return (
		<>
			<div className="h-auto mb-6 grid gap-x-6 grid-cols-6">
				<Input
					className="border-2 col-span-5"
					placeholder="Buscar Evento"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{rol === "administrador" && (
					<div className="col-start-6">
						<ModalCreacion user_id={user_id} username={username}>
							<Button
								className="bg-[#2c457e] hover:bg-[#2c457e]/90"
								onClick={() => {
									// Después de crear un evento, invalidamos la consulta
									queryClient.invalidateQueries({ queryKey: ["events"] });
								}}
							>
								<Plus />
								Crear Evento
							</Button>
						</ModalCreacion>
					</div>
				)}
			</div>
			<div className="grid gap-4 grid-cols-3">{renderEvents()}</div>
		</>
	);
}
