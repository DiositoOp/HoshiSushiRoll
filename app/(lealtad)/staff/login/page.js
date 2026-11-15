import { redirect } from 'next/navigation';
import { currentStaff, homeFor } from '@/lib/auth';
import { Logo } from '@/components/ui';
import LoginForm from './LoginForm';
import { STAFF_APP } from '@/lib/appMeta';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Acceso del personal · Hoshito', ...STAFF_APP };

export default async function LoginPage() {
  const staff = await currentStaff();
  if (staff) redirect(homeFor(staff.role));
  return (
    <main className="screen white">
      <Logo size={88} />
      <h1 className="display h1">Acceso del personal</h1>
      <LoginForm />
    </main>
  );
}
