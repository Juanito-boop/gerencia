import { Evento } from "@/app/home/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, DollarSign, MapPin, User } from 'lucide-react';
import { ReactNode, useState } from "react";

interface ModalInfoProps {
	children: ReactNode;
	elemento: Evento;
	key?: number
}

export default function ModalInfo({ children, elemento }: Readonly<ModalInfoProps>) {
	const [open, setOpen] = useState(false);
	
	if (!elemento || !elemento.nombre_evento || !elemento.id_evento) {
		return <Button className="flex-shrink-0 w-full">Evento no disponible</Button>;
	}

	const formatDate = (date: Date | string) => {
		const parsedDate = new Date(date);
		if (isNaN(parsedDate.getTime())) {
			return "Fecha inválida";
		}
		return new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(parsedDate);
	}

	const formatTime = (date: Date | string) => {
		const parsedDate = new Date(date);
		if (isNaN(parsedDate.getTime())) {
			return "Hora inválida";
		}
		return new Intl.DateTimeFormat('es', { timeStyle: 'short' }).format(parsedDate);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild className="flex-shrink-0 w-full">
				{children}
			</DialogTrigger>
			<DialogContent 
				className="mx-auto p-4"
				aria-describedby="dialog-description"
			>
				<Card className="w-full max-w-3xl mx-auto border-none max-h-[90%]">
					<CardHeader>
						<DialogTitle>
							<CardTitle className="text-2xl font-bold text-[#2c457e]">{elemento.nombre_evento}</CardTitle>
						</DialogTitle>
						<Badge variant="secondary">{`ID: ${elemento.id_evento}`}</Badge>
					</CardHeader>
					<CardContent 
						id="dialog-description" 
						className="space-y-4 [&>div>span>strong]:text-[#2c457e]"
					>
						<p>{elemento.descripcion_evento}</p>
						<div className="flex items-center space-x-2">
							<User className="w-5 h-5 text-[#ea3433]" />
							<span><strong>Organizador: </strong>{elemento.organizador_evento}</span>
						</div>
						<div className="flex items-center space-x-2">
							<MapPin className="w-5 h-5 text-[#ea3433]" />
							<span><strong>Lugar: </strong>{elemento.lugar_evento}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Calendar className="w-5 h-5 text-[#ea3433]" />
							<span><strong>Fecha de inicio: </strong>{formatDate(elemento.fecha_evento)}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Clock className="w-5 h-5 text-[#ea3433]" />
							<span><strong>Hora de inicio: </strong>{formatTime(elemento.hora_evento)}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Calendar className="w-5 h-5 text-[#ea3433]" />
							<span><strong>Fecha de finalizacion: </strong>{formatDate(elemento.fecha_finalizacion)}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Clock className="w-5 h-5 text-[#ea3433]" />
							<span><strong>Hora de finalizacion: </strong>{formatTime(elemento.hora_finalizacion)}</span>
						</div>
						<div className="flex items-center space-x-2">
							<DollarSign className="w-5 h-5 text-[#ea3433]" />
							<span><strong>Valor: </strong>{`COP $${elemento.valor_evento ? elemento.valor_evento.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Valor no disponible'}`}</span>
						</div>
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	)
}