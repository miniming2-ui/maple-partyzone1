import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { db } from '../../../lib/firebase';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';

const cooldown = new Map();

export async function GET() {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const data = snap.docs.map(d => d.data());
  return NextResponse.json(data);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 });

  const userId = session.user.email || session.user.id || session.user.name;
  const now = Date.now();
  const last = cooldown.get(userId);
  if (last && now - last < 300000) {
    const remain = Math.ceil((300000 - (now - last)) / 1000);
    return NextResponse.json({ error: `5분 쿨타임 남음 (${remain}초)` }, { status: 429 });
  }

  const body = await req.json();
  const { content, level } = body;
  if (!content) return NextResponse.json({ error: '내용 없음' }, { status: 400 });

  await addDoc(collection(db, 'posts'), {
    user: session.user.name || session.user.email,
    content,
    level,
    createdAt: new Date().toISOString()
  });

  cooldown.set(userId, now);
  return NextResponse.json({ message: 'OK' });
}
