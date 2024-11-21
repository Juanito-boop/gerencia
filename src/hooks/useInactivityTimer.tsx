import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useInactivityTimer = (logoutCallback: () => void, timeout: number = 60000) => {
	useEffect(() => {
		let timer: NodeJS.Timeout;

		const resetTimer = () => {
			clearTimeout(timer);
			timer = setTimeout(logoutCallback, timeout);
		};

		const handleActivity = () => resetTimer();

		// Escuchar eventos de actividad del usuario
		window.addEventListener('mousemove', handleActivity);
		window.addEventListener('keydown', handleActivity);

		// Iniciar el temporizador al cargar el hook
		resetTimer();

		// Limpiar cuando el componente se desmonta
		return () => {
			clearTimeout(timer);
			window.removeEventListener('mousemove', handleActivity);
			window.removeEventListener('keydown', handleActivity);
		};
	}, [logoutCallback, timeout]);
};

export default useInactivityTimer;
