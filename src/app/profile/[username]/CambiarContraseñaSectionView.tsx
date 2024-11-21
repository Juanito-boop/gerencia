import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backend_url } from "@/constantes";

export default function CambiarContraseñaSectionView({ username }: { username: string }) {
  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newPassword = (event.target as any).newPass.value;

    try {
      const response = await fetch(`${backend_url}/usuarios/${username}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username, newPassword }),
      });

      if (!response.ok) {
        alert("Error al cambiar la contraseña.");
        return;
      }

      alert("Contraseña cambiada exitosamente.");
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      alert("Error al cambiar la contraseña.");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cambiar de Contraseña</CardTitle>
      </CardHeader>
      <CardContent>
        <section className="flex flex-col">
          <form className="space-y-4 max-w-[45%]" onSubmit={handleChangePassword}>
            <div className="flex flex-col">
              <CardHeader>Actualizar Contraseña</CardHeader>
              <input type="text" name="newPass" id="newPass" className="p-3 border mb-5" placeholder="Ingresa una nueva contraseña" />
              <Button type="submit">Cambiar Contraseña</Button>
            </div>
          </form>
          <form className="space-y-4 max-w-[45%]"></form>
        </section>
      </CardContent>
    </Card>
  )
}