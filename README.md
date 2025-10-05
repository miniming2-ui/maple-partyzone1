# 메이플 파티존 - 실시간 채팅형 버전 (Next.js + NextAuth + Firebase)

이 저장소는 '메이플 파티존'의 작동 가능한 버전입니다.
디스코드 로그인(NextAuth)과 채팅형 모집(파이어스토어 저장) 기능이 포함되어 있으며,
사용자는 로그인 후 채팅창에 모집글을 입력하면 게시글이 저장됩니다. 1인당 5분 쿨타임이 적용됩니다.

## 준비
1. Node.js LTS 설치
2. Firebase 프로젝트 생성 (Firestore 사용)
3. Discord 개발자 포털에서 애플리케이션 생성 후 `CLIENT ID`와 `CLIENT SECRET` 발급

## 환경변수 (.env.local)
```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXTAUTH_URL=https://<your-vercel-domain>.vercel.app
NEXTAUTH_SECRET=some-long-random-secret

FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

## 로컬 실행
1. 저장소 루트에서:
   ```bash
   npm install
   npm run dev
   ```
2. 브라우저에서 `http://localhost:3000` 방문

## 배포
- GitHub에 업로드 후 Vercel에 연결하세요. Vercel에 `.env` 항목들을 추가해야 합니다.
- Discord 개발자 포털의 OAuth 리디렉션 URL에 `https://<your-vercel-domain>.vercel.app/api/auth/callback/discord` 를 등록하세요.
