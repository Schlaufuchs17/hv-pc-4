import './styles/style.css';
//import '../styles/globals.css';

export const metadata = {
  title: 'Chatbot Next',
  description: 'Aplicación de chat en tiempo real con Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
