'use server';

import crypto from 'node:crypto';

const secret = process.env.TABLE_ENCRYPTION_KEY ?? '';

export async function encryptTable(tableId: string) {
  const payload = tableId;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64url');
  return token;
}

export async function decryptTable(encryptedTableId: string, businessName: string) {
  const decoded = Buffer.from(encryptedTableId, 'base64url').toString();
  const [payload, hmac] = decoded.split(':');
  const [table, businessNameUrl] = payload.split('|');

  if (businessName !== businessNameUrl) return null;

  const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (expectedHmac !== hmac) return null;

  return table;
}
