"use client"
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import useInactivityTimer from '../hooks/useInactivityTimer';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // Iniciar el temporizador de inactividad con 1 minuto (60000 ms)
  useInactivityTimer(handleLogout, 60000);

  return <Component {...pageProps} />;
};

export default MyApp;
