'use server';

import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { q } from '@/lib/db';
import { getRestaurant, logEvent } from '@/lib/rules';

export async function savePromo(formData) {
  const staff = await requireRole(['owner', 'dev']);
  const r = await getRestaurant();
  const goal = Math.min(20, Math.max(2, parseInt(formData.get('stamps_goal'), 10) || r.stamps_goal));
  const label = String(formData.get('reward_label') || '').trim().slice(0, 60) || r.reward_label;
  let url = String(formData.get('google_review_url') || '').trim().slice(0, 500);
  if (url && !/^https:\/\//i.test(url)) url = '';

  await q('update restaurants set stamps_goal = $2, reward_label = $3, google_review_url = $4 where id = $1', [r.id, goal, label, url]);
  await logEvent(q, { restaurantId: r.id, type: 'config', detail: `Promoción: ${goal} visitas = ${label}`, staffId: staff.id });
  redirect('/admin/promocion?ok=1');
}
