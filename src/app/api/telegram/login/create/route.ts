import { NextResponse } from 'next/server';

import {
  createTelegramLoginSession,
  getTelegramConfig,
  getTelegramDeepLink,
} from '@/lib/telegram';

export const runtime = 'nodejs';

export async function POST() {
  const config = await getTelegramConfig();
  if (!config.enabled || !config.loginEnabled || !config.botToken || !config.botUsername) {
    return NextResponse.json({ error: 'Telegram 登录未启用' }, { status: 400 });
  }

  const session = await createTelegramLoginSession();
  return NextResponse.json({
    token: session.token,
    expiresAt: session.expiresAt,
    botUsername: config.botUsername,
    deepLink: getTelegramDeepLink(config.botUsername, `login_${session.token}`),
  });
}
