'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ANY_STAFF, requireRole } from '@/lib/auth';
import { confirmVisit, createLinkCode, deliverReward, getRestaurant, manualStamp, rejectVisit } from '@/lib/rules';

async function context() {
  const staff = await requireRole(ANY_STAFF);
  return { staff, r: await getRestaurant() };
}

export async function confirmAction(formData) {
  const { staff, r } = await context();
  await confirmVisit(Number(formData.get('visitId')), staff, r);
  revalidatePath('/caja');
}

export async function rejectAction(formData) {
  const { staff, r } = await context();
  await rejectVisit(Number(formData.get('visitId')), staff, r);
  revalidatePath('/caja');
}

export async function deliverAction(formData) {
  const { staff, r } = await context();
  await deliverReward(Number(formData.get('rewardId')), staff, r);
  revalidatePath('/caja');
}

export async function manualStampAction(formData) {
  const { staff, r } = await context();
  const tel = String(formData.get('tel') || '');
  const result = await manualStamp(String(formData.get('customerId')), staff, r);
  redirect(`/caja?tel=${tel}&aviso=${result.ok ? 'sello' : 'limite'}`);
}

export async function linkCodeAction(formData) {
  const { staff } = await context();
  const tel = String(formData.get('tel') || '');
  await createLinkCode(String(formData.get('customerId')), staff);
  redirect(`/caja?tel=${tel}`);
}
