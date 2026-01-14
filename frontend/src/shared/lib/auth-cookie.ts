'use server'

import { cookies } from 'next/headers';

export async function setRefreshTokenFromHeader(response: Response) {
    const strCookie = response.headers.get('set-cookie');

    if (!strCookie) return;

    const match = strCookie.match(/refreshToken=([^;]+)/);
    const tokenValue = match ? match[1] : null;

    if (tokenValue) {
        (await cookies()).set({
            name: 'refreshToken',
            value: tokenValue,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        });
    }
}