import { Logo } from '@/components/ui';
import LinkForm from './LinkForm';

export const metadata = { title: 'Vincular teléfono · Hoshito' };

export default function Vincular() {
  return (
    <main className="screen white">
      <Logo size={88} />
      <h1 className="display h1">Usar mi tarjeta en este teléfono</h1>
      <p className="muted">
        Pide en caja un código de 4 dígitos y escríbelo aquí. Tu tarjeta quedará en este teléfono y dejará de funcionar en el anterior.
      </p>
      <LinkForm />
    </main>
  );
}
