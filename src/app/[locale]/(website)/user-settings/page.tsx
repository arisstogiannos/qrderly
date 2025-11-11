import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/db';
import UserSettings from './UserSettings';
export default async function page() {
  const user = (await auth())?.user;

  if (!user?.id) {
    redirect('/login');
  }

  const settings = await db.settings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!settings) {
    redirect('/login');
  }

  return <UserSettings settings={settings} userId={user.id} />;
}
