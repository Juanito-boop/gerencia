import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { backend_url } from "@/constantes";
import { Dialog } from "@radix-ui/react-dialog";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface ModalInfoProps {
  children: ReactNode;
  user_id: string;
  username: string;
  key?: number
}

export default function ModalCreacion({ children, username, user_id }: Readonly<ModalInfoProps>) {
  const [open, setOpen] = useState(false);
  const [allLugares, setAllLugares] = useState<Array<{ id_lugar: string; nombrelugar: string; direccionlugar: string; aforototallugar: number; }>>([]);
  const [formData, setFormData] = useState({
    nombre_evento: '',
    descripcion_evento: '',
    organizador_evento: username,
    lugar_evento: '',
    fecha_evento: '',
    hora_evento: '',
    valor_evento: '',
    id_usuario: user_id,
    id_lugar: '',
    fecha_finalizacion: '',
    hora_finalizacion: ''
  });
  const fetchLugares = useCallback(async () => {
    const response = await fetch(`${backend_url}/lugares`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const lugares = await response.json().catch(() => []);
    setAllLugares(lugares);
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
    fetchLugares();
  }, [fetchLugares]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => {
      if (id === 'fecha_evento') {
        return {
          ...prev,
          fecha_evento: value,
          hora_evento: value
        };
      }
      if (id === 'fecha_finalizacion') {
        return {
          ...prev,
          fecha_finalizacion: value,
          hora_finalizacion: value
        };
      }

      return {
        ...prev,
        [id]: value
      };
    });
  };
  const handleLugarChange = (value: string) => {
    const selectedLugar = allLugares.find(lugar => lugar.id_lugar === value);

    if (selectedLugar) {
      setFormData(prev => ({
        ...prev,
        id_lugar: selectedLugar.id_lugar,
        lugar_evento: selectedLugar.nombrelugar
      }));
    }
  };

  const handleSubmit = async () => {
    const eventJSON = {
      ...formData,
      valor_evento: parseFloat(formData.valor_evento)
    };

    console.log('Creando evento:', eventJSON);

    try {
      const response = await fetch(`${backend_url}/eventos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventJSON)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Evento creado exitosamente:', data);
      alert('Evento creado exitosamente');
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error al crear el evento:', error);
      alert('Hubo un error al crear el evento. Por favor, intenta nuevamente.');
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
					<DialogContent className="mx-auto p-4 min-w-[60%]">
						<Card className="flex flex-col h-full border-none">
							<CardHeader className="flex-shrink-0">
								<CardTitle>Crear Nuevo Evento</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<form className="grid grid-cols-2 gap-2">
									<div className="space-y-4 [&>div]:space-y-1 [&>div>Input]:border-[#2c457e] [&>div>Textarea]:border-[#2c457e] [&>div>Input:disabled]:border-[#ea3433]">
										<div>
											<Label htmlFor="nombre_evento">Nombre del Evento</Label>
											<Input id="nombre_evento" placeholder="Ingrese el título del evento" value={formData.nombre_evento} onChange={handleInputChange} />
										</div>
										<div>
											<Label htmlFor="descripcion_evento">Descripción</Label>
											<Textarea id="descripcion_evento" placeholder="Describa el evento" value={formData.descripcion_evento} onChange={handleInputChange} />
									</div>
									<div>
										<Label htmlFor="id_lugar">Lugar del Evento</Label>
										<Select onValueChange={handleLugarChange} value={formData.id_lugar}>
											<SelectTrigger className="w-full">
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
									<div className="space-y-4 [&>div]:space-y-1 [&>div>Input]:border-[#2c457e] [&>div>section>Input]:border-[#2c457e] [&>div>Textarea]:border-[#2c457e] [&>div>button]:border-[#2c457e]">
											<div>
												<Label htmlFor="organizador_evento">Organizador del Evento</Label>
												<Input id="organizador_evento" value={username} disabled />
											</div>
										<div className="grid grid-flow-col grid-cols-1 grid-rows-2 gap-2">
											<section className="space-y-1">
												<Label htmlFor="fecha_evento">Fecha y Hora inicio</Label>
												<Input id="fecha_evento" type="datetime-local" value={formData.fecha_evento} onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
											</section>
											<section className="space-y-1">
												<Label htmlFor="fecha_finalizacion">Fecha y Hora finalización</Label>
												<Input id="fecha_finalizacion" type="datetime-local" value={formData.fecha_finalizacion} onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
											</section>
										</div>
										<div>
											<Label htmlFor="valor_evento">Valor del Evento</Label>
											<Input id="valor_evento" type="number" min={0} value={formData.valor_evento} onChange={handleInputChange} />
										</div>
									</div>
								</form>
							</CardContent>
							<CardFooter className="flex-shrink-0">
								<Button onClick={handleSubmit}>Crear Evento</Button>
							</CardFooter>
						</Card>
					</DialogContent>
      </Dialog>
    </>
  )
}