import { NextRequest, NextResponse } from 'next/server';

import { getAuthInfoFromCookie } from '@/lib/auth';
import {
  createTelegramBindSession,
  getTelegramBinding,
  getTelegramConfig,
  getTelegramDeepLink,
} from '@/lib/telegram';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = await getTelegramConfig();
  const binding = await getTelegramBinding(authInfo.username);
  return NextResponse.json({
    enabled: config.enabled && config.bindingEnabled && Boolean(config.botToken),
    botUsername: config.botUsername,
    binding,
  });
}

export async function POST(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = await getTelegramConfig();
  if (!config.enabled || !config.bindingEnabled || !config.botToken) {
    return NextResponse.json({ error: 'Telegram Bot 未启用' }, { status: 400 });
  }

  const session = await createTelegramBindSession(authInfo.username);
  return NextResponse.json({
    code: session.code,
    expiresAt: session.expiresAt,
    botUsername: config.botUsername,
    deepLink: config.botUsername ? getTelegramDeepLink(config.botUsername, `bind_${session.code}`) : '',
  });
}
