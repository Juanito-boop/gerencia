import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import { Lugar } from "./modalInformacion"; // Ajusta la ruta según corresponda
import { backend_url } from "@/constantes"; // Asegúrate de tener definido backend_url

interface ModalEditLugarProps {
	children: ReactNode;
	lugar: Lugar;
	key?: number;
}

export default function ModalEditLugar({ children, lugar }: Readonly<ModalEditLugarProps>) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<Lugar>({
		id_lugar: '',
		nombrelugar: '',
		direccionlugar: '',
		aforototallugar: 0,
	});

	useEffect(() => {
		if (open && lugar) {
			setFormData({
				id_lugar: lugar.id_lugar,
				nombrelugar: lugar.nombrelugar,
				direccionlugar: lugar.direccionlugar,
				aforototallugar: lugar.aforototallugar,
			});
		}
	}, [open, lugar]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData(prev => ({
			...prev,
			[id]: id === 'aforototallugar' ? parseInt(value) : value,
		}));
	};

	const handleSubmit = async () => {
		try {
			const response = await fetch(`${backend_url}/lugares/${formData.id_lugar}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					nombrelugar: formData.nombrelugar,
					direccionlugar: formData.direccionlugar,
					aforototallugar: formData.aforototallugar,
				}),
			});
			if (!response.ok) throw new Error("Error al actualizar el lugar");
			alert("Lugar actualizado exitosamente");
			setOpen(false);
		} catch (error) {
			console.error(error);
			alert("Hubo un error al actualizar el lugar.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild className="flex-shrink-0 w-full">
				{children}
			</DialogTrigger>
			<DialogContent className="mx-auto p-4">
				<Card className="w-full max-w-2xl mx-auto border-none max-h-[90%]">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-[#2c457e]">Editar Lugar</CardTitle>
					</CardHeader>
					<CardContent className="flex-grow">
						<form className="grid grid-cols-1 gap-y-4">
							<div className="space-y-4">
								<div>
									<Label htmlFor="nombrelugar">Nombre del Lugar</Label>
									<Input
										id="nombrelugar"
										placeholder="Ingrese el nombre del lugar"
										value={formData.nombrelugar}
										onChange={handleInputChange}
									/>
								</div>
								<div>
									<Label htmlFor="direccionlugar">Dirección del Lugar</Label>
									<Input
										id="direccionlugar"
										placeholder="Ingrese la dirección del lugar"
										value={formData.direccionlugar}
										onChange={handleInputChange}
									/>
								</div>
								<div>
									<Label htmlFor="aforototallugar">Aforo Total</Label>
									<Input
										id="aforototallugar"
										type="number"
										min={0}
										value={formData.aforototallugar}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</form>
					</CardContent>
					<CardFooter>
						<Button onClick={handleSubmit}>Actualizar Lugar</Button>
					</CardFooter>
				</Card>
			</DialogContent>
		</Dialog>
	);
}
