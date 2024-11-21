import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { ReactNode, useState } from "react";

interface ModalInfoProps {
  children: ReactNode;
  elemento: Lugar;
  key?: number
}

export interface Lugar {
  id_lugar: string;
  nombrelugar: string;
  direccionlugar: string;
  aforototallugar: number;
}


export default function ModalInfo({ children, elemento }: Readonly<ModalInfoProps>) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex-shrink-0 w-full">
        {children}
      </DialogTrigger>
      <DialogContent className="mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto border-none max-h-[90%]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#2c457e]">{elemento.nombrelugar}</CardTitle>
            <Badge variant="secondary">{`ID: ${elemento.id_lugar}`}</Badge>
          </CardHeader>
          <CardContent className="space-y-4 [&>div>span>strong]:text-[#2c457e]">
            <p className="flex gap-x-2"><MapPin />{elemento.direccionlugar}</p>
            <div className="flex items-center space-x-2">
              <span><strong>Aforo total: </strong>{elemento.aforototallugar}</span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}