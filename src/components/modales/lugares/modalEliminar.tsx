import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
	DialogDescription,
	DialogHeader,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { backend_url } from "@/constantes";
import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ModalInfoProps {
	children: ReactNode;
	elemento: Lugar;
	key?: number;
}

export interface Lugar {
	id_lugar: string;
	nombrelugar: string;
	direccionlugar: string;
	aforototallugar: number;
}

export default function ModalEliminar({ children, elemento }: Readonly<ModalInfoProps>) {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		console.log("Iniciando handleDelete");
		if (!isConfirmEnabled || isDeleting) {
			console.log("Eliminación bloqueada: ", { isConfirmEnabled, isDeleting });
			return;
		}
		
		setIsDeleting(true);
		try {
			console.log("Ejecutando fetch DELETE");
			const response = await fetch(`${backend_url}/lugares/${elemento.id_lugar}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
				},
			});

			if (!response.ok) {
				throw new Error("Error al eliminar el lugar");
			}
			
			console.log("Eliminación exitosa");
		} catch (error) {
			console.error("Error eliminando el lugar:", error);
		} finally {
			setIsDeleting(false);
			setOpen(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		setIsConfirmEnabled(value === elemento.nombrelugar);
	};

	const handleOpenChange = (newOpen: boolean) => {
		console.log("handleOpenChange llamado", { newOpen, isDeleting });
		if (!newOpen) {
			setInputValue("");
			setIsConfirmEnabled(false);
		}
		setOpen(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogContent className="mx-auto p-4">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-[#2c457e]">
						Eliminar Lugar
					</DialogTitle>
					<DialogDescription className="mt-2 text-sm text-gray-500">
						Esta acción no se puede deshacer a menos que lo vuelva a crear.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-4">
					<p className="text-sm text-gray-700">
						Por favor, escriba el nombre del lugar <strong>{elemento.nombrelugar}</strong> para confirmar.
					</p>
					<Input
						className="mt-2"
						placeholder="Nombre del lugar"
						value={inputValue}
						onChange={handleInputChange}
					/>
				</div>
				<DialogFooter className="mt-6 flex justify-end">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						className="ml-2"
						onClick={handleDelete}
						disabled={!isConfirmEnabled || isDeleting}
					>
						{isDeleting ? "Eliminando..." : "Eliminar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
