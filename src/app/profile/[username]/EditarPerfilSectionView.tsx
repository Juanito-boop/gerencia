import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backend_url } from "@/constantes";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const client = new S3Client({
  forcePathStyle: true,
  region: "sa-east-1",
  endpoint: "https://tslibeocsymbvzsvtfkh.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: "bab4af19b9d1764891c392aa0267dc52",
    secretAccessKey: "28f8551905edec357c4e0edc8f6df270690c05d41abffe6873ec8ce469e4bc3e",
  },
});

export default function EditarPerfilSectionView({ username }: { username: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const params = {
        Bucket: 'Avatars',
        Key: file.name,
        Body: file,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(params);
      await client.send(command);

      const uploadedImageUrl = `https://tslibeocsymbvzsvtfkh.supabase.co/storage/v1/object/public/${params.Bucket}/${params.Key}`;
      setImageUrl(uploadedImageUrl);

      alert(`Imagen cargada exitosamente: ${uploadedImageUrl}`);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen.");
    }
  };

  // Cargar la información del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`${backend_url}/perfiles/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const profile = await response.json();

      if (profile && profile.avatar_url) {
        setImageUrl(profile.avatar_url);
      }

      setLoading(false); // Cambiar el estado de carga una vez que los datos estén disponibles
    };

    fetchProfile();
  }, [username]);

  const handleSubmit = async () => {
    if (imageUrl) {
      const response = await fetch(`${backend_url}/perfiles/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (response.ok) {
        alert("Imagen de perfil actualizada.");
      } else {
        alert("Error al actualizar la imagen de perfil.");
      }
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Mostrar Skeleton mientras los datos no están cargados
          <div className="space-y-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-1/2 h-8" />
          </div>
        ) : (
          <form className="space-y-4">
            <div className="flex flex-col">
              <CardHeader>Actualizar Foto de Perfil</CardHeader>
              <input
                type="file"
                name="foto"
                id="foto"
                accept=".jpeg, .png, .svg"
                onChange={handleUploadFile}
              />
              {imageUrl && <img src={imageUrl} alt="Perfil" className="mt-4 w-32 h-32 object-cover" />}
            </div>
            <Button onClick={handleSubmit}>Actualizar Imagen</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}