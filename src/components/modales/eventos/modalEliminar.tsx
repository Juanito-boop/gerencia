import { Evento } from "@/app/home/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { ReactNode, useState } from "react";

interface ModalInfoProps {
	children: ReactNode;
	elemento: Evento;
	key?: number
}

export default function ModalEliminar({ children, elemento }: Readonly<ModalInfoProps>) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild className="flex-shrink-0 w-full">
				{children}
			</DialogTrigger>
			<DialogContent className="mx-auto p-4">
				<DialogTitle>
					<CardTitle className="text-2xl font-bold text-[#2c457e]">Eliminar Evento</CardTitle>
				</DialogTitle>
			</DialogContent>
		</Dialog>
	)
}