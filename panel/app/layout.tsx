import './globals.css';

export const metadata = {
  title: 'Metrica.AI | Premium Media Studio',
  description: 'Yapay Zeka Destekli 16D Kurumsal Medya Sentez Platformu',
  icons: {
    icon: '/logo.png', // public klasöründeki logon artık tarayıcı ikonu (favicon) oldu!
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}