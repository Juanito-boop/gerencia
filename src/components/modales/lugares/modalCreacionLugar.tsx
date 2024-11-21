import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { backend_url } from "@/constantes";

interface ModalInfoProps {
	children: ReactNode;
	key?: number;
}

export interface Lugar {
	nombrelugar: string;
	direccionlugar: string;
	aforototallugar: number;
}

export default function ModalCreacion({ children }: Readonly<ModalInfoProps>) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState<Lugar>({
		nombrelugar: '',
		direccionlugar: '',
		aforototallugar: 0,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(`${backend_url}/lugares`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error('Error al crear el lugar');
			}

			const data = await response.json();
			console.log('Lugar creado:', data);
			setOpen(false);
			setFormData({
				nombrelugar: '',
				direccionlugar: '',
				aforototallugar: 0,
			});
		} catch (error) {
			console.error('Error al crear el lugar:', error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild className="flex-shrink-0 w-full">
				{children}
			</DialogTrigger>
			<DialogContent className="mx-auto p-4">
				<Card className="w-full max-w-2xl mx-auto border-none max-h-[90%]">
					<DialogTitle>
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-[#2c457e]">
								Agregar Lugar
							</CardTitle>
						</CardHeader>
					</DialogTitle>
					<CardContent className="flex-grow">
						<form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-4">
							<div className="space-y-4 [&>div]:space-y-1">
								<div>
									<Label htmlFor="nombre_lugar">Nombre del Lugar</Label>
									<Input
										id="nombre_lugar"
										placeholder="Ingrese el nombre del lugar"
										value={formData.nombrelugar}
										onChange={(e) =>
											setFormData({ ...formData, nombrelugar: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor="direccion_lugar">Nombre del Lugar</Label>
									<Input
										id="direccion_lugar"
										placeholder="Ingrese el nombre del lugar"
										value={formData.direccionlugar}
										onChange={(e) =>
											setFormData({
												...formData,
												direccionlugar: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<Label htmlFor="aforo_total">Aforo Total del Lugar</Label>
									<Input
										type="number"
										id="aforo_total"
										placeholder="Ingrese el aforo total del lugar"
										value={formData.aforototallugar}
										onChange={(e) =>
											setFormData({
												...formData,
												aforototallugar: Number(e.target.value),
											})
										}
									/>
								</div>
							</div>
							<Button type="submit" className="mt-4 bg-[#2c457e] hover:bg-[#2c457e]/90">
								Agregar Lugar
							</Button>
						</form>
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
}
