import { NextResponse } from 'next/server';

import { getTelegramConfig } from '@/lib/telegram';

export const runtime = 'nodejs';

export async function GET() {
  const config = await getTelegramConfig();
  return NextResponse.json({
    enabled: config.enabled && Boolean(config.botToken),
    botUsername: config.botUsername,
    loginEnabled: config.loginEnabled,
    bindingEnabled: config.bindingEnabled,
    notificationsEnabled: config.notificationsEnabled,
  });
}
