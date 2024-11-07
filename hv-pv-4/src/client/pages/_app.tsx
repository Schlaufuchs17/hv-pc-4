//## Revisar que no de problemas
import type { AppProps } from 'next/app';
import '../client/style.css';  // Ajusta la ruta según la ubicación exacta de style.css

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;



/*_app.tsx da una especie de soporte a Next.js a manejar estilos 
y configuraciones específicas que afectan a todas las páginas que
vayamos necesitando. 
Una vez creado, los estilos se  deberian cargar correctamente y 
el error en index.tsx sobre styles debería 
resolverse.
*/