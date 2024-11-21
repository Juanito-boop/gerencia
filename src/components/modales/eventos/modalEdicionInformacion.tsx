'use client'

import { Evento } from "@/app/home/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { backend_url } from "@/constantes";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface Lugar {
	id_lugar: string;
	nombrelugar: string;
	direccionlugar: string;
	aforototallugar: number;
}

interface ModalInfoProps {
	children: ReactNode;
	evento: Evento;
	username: string;
	user_id: string;
	key?: number;
}

const ModalEditInfoEvento = ({
	children,
	evento,
	username,
	user_id,
}: Readonly<ModalInfoProps>) => {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<Evento>({
		...evento,
		fecha_evento: evento.fecha_evento ? new Date(evento.fecha_evento) : new Date(),
		hora_evento: evento.hora_evento ? new Date(evento.hora_evento) : new Date(),
		fecha_finalizacion: evento.fecha_finalizacion ? new Date(evento.fecha_finalizacion) : new Date(),
		hora_finalizacion: evento.hora_finalizacion ? new Date(evento.hora_finalizacion) : new Date(),
		id_usuario: user_id,
		organizador_evento: username,
	});
	const [allLugares, setAllLugares] = useState<Lugar[]>([]);

	useEffect(() => {
		if (open && evento) {
			setFormData({
				...evento,
				fecha_evento: evento.fecha_evento ? new Date(evento.fecha_evento) : new Date(),
				hora_evento: evento.hora_evento ? new Date(evento.hora_evento) : new Date(),
				fecha_finalizacion: evento.fecha_finalizacion ? new Date(evento.fecha_finalizacion) : new Date(),
				hora_finalizacion: evento.hora_finalizacion ? new Date(evento.hora_finalizacion) : new Date(),
				id_usuario: user_id,
				organizador_evento: username,
			});
		}
	}, [open, evento, user_id, username]);

	const fetchLugares = useCallback(async () => {
		try {
			const response = await fetch(`${backend_url}/lugares`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			const lugares = await response.json();
			setAllLugares(lugares);
		} catch (error) {
			console.error("Error al obtener los lugares:", error);
		}
	}, []);

	const groupedLugares = allLugares.reduce<{ [key: string]: Array<{ id_lugar: string; nombrelugar: string; direccionlugar: string; aforototallugar: number; }> }>((groups, lugar) => {
		const { direccionlugar } = lugar;
		if (!groups[direccionlugar]) {
			groups[direccionlugar] = [];
		}
		groups[direccionlugar].push(lugar);
		return groups;
	}, {});

	useEffect(() => {
		if (open) {
			fetchLugares();
		}
	}, [open, fetchLugares]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleLugarChange = (value: string) => {
		const selectedLugar = allLugares.find((lugar) => lugar.id_lugar === value);
		if (selectedLugar) {
			setFormData((prev) => ({
				...prev,
				id_lugar: selectedLugar.id_lugar,
				lugar_evento: selectedLugar.nombrelugar,
			}));
		}
	};

	const handleSubmit = async () => {
		try {
			const response = await fetch(`${backend_url}/eventos/${evento.id_evento}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ ...formData, valor_evento: formData.valor_evento.toString() }),
			});
			if (!response.ok) throw new Error("Error al actualizar el evento");
			alert("Evento actualizado exitosamente");
			setOpen(false);
		} catch (error) {
			console.error(error);
			alert("Hubo un error al actualizar el evento.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="mx-auto p-4 min-w-[60%]">
				<Card className="h-full border-none">
					<CardHeader>
						<CardTitle>Editar Evento</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="grid grid-cols-2 grid-rows-[1fr] gap-y-2 gap-x-5">
							<div className="space-y-4 [&>div]:space-y-1">
								<div>
									<Label htmlFor="nombre_evento">Nombre del Evento</Label>
									<Input
										id="nombre_evento"
										placeholder="Ingrese el título del evento"
										value={formData.nombre_evento}
										onChange={handleInputChange}
									/>
								</div>
								<div>
									<Label htmlFor="descripcion_evento">Descripción</Label>
									<Textarea
										id="descripcion_evento"
										placeholder="Describa el evento"
										value={formData.descripcion_evento}
										onChange={handleInputChange}
									/>
								</div>
								<div>
									<Label htmlFor="id_lugar">Lugar</Label>
									<Select onValueChange={handleLugarChange} value={formData.id_lugar}>
										<SelectTrigger>
											<SelectValue placeholder="Lugar" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(groupedLugares).map(([direccionlugar, lugares]) => (
												<SelectGroup key={direccionlugar}>
													<SelectLabel>{direccionlugar}</SelectLabel>
													{lugares.map((lugar) => (
														<SelectItem key={lugar.id_lugar} value={lugar.id_lugar}>
															{lugar.nombrelugar}
														</SelectItem>
													))}
												</SelectGroup>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-4 [&>div]:space-y-1">
								<div>
									<Label htmlFor="organizador_evento">Organizador del Evento</Label>
									<Input id="organizador_evento" value={username} disabled />
								</div>
								<div>
									<Label htmlFor="fecha_evento">Fecha y Hora Inicio</Label>
									<Input
										id="fecha_evento"
										type="datetime-local"
										value={
											formData.fecha_evento && !isNaN(new Date(formData.fecha_evento).getTime())
												? new Date(formData.fecha_evento).toISOString().slice(0, 16)
												: ""
										}
										onChange={handleInputChange}
										min={new Date().toISOString().slice(0, 16)}
									/>
								</div>
								<div>
									<Label htmlFor="fecha_finalizacion">Fecha y Hora de Finalización</Label>
									<Input
										id="fecha_finalizacion"
										type="datetime-local"
										value={
											formData.fecha_finalizacion && !isNaN(new Date(formData.fecha_finalizacion).getTime())
												? new Date(formData.fecha_finalizacion).toISOString().slice(0, 16)
												: ""
										}
										onChange={handleInputChange}
										min={
											formData.fecha_evento
												? new Date(formData.fecha_evento).toISOString().slice(0, 16)
												: new Date().toISOString().slice(0, 16)
										}
									/>
								</div>
								<div>
									<Label htmlFor="valor_evento">Valor</Label>
									<Input
										id="valor_evento"
										type="number"
										min={0}
										value={formData.valor_evento}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</form>
					</CardContent>
					<CardFooter>
						<Button onClick={handleSubmit}>Actualizar Evento</Button>
					</CardFooter>
				</Card>	
			</DialogContent>
		</Dialog>
	);
};

export default ModalEditInfoEvento;
