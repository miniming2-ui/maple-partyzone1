'use client'
import { useEffect, useState, useRef } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Page(){
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [level, setLevel] = useState('10~30');
  const [info, setInfo] = useState('');
  const ref = useRef();

  useEffect(()=>{
    // Polling every 2s (simple approach) - for real-time use Firestore SDK in client
    let mounted = true;
    async function load(){
      const r = await fetch('/api/chat');
      if(!mounted) return;
      const data = await r.json();
      setMessages(data || []);
      if(ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }
    load();
    const t = setInterval(load, 2000);
    return ()=>{ mounted=false; clearInterval(t); }
  },[]);

  async function sendMessage(){
    if(!session) return alert('디스코드 로그인 후 이용해주세요');
    if(!text.trim()) return;
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ content: text, level })
    });
    const j = await res.json();
    if(!res.ok){ setInfo('⚠️ ' + (j.error||'오류')); return; }
    setText('');
    setInfo('✅ 모집글 등록됨 (5분 쿨타임 적용)');
    setTimeout(()=>setInfo(''),4000);
  }

  return (
    <div style={{minHeight:'100vh', background: 'linear-gradient(180deg,#fff,#fff7f2)', padding:'24px', fontFamily: 'system-ui, Noto Sans KR, Arial'}}>
      <header style={{maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:56,height:56,borderRadius:12,background:'#ffe7d9',display:'flex',alignItems:'center',justifyContent:'center'}}><strong style={{color:'#ff7f50'}}>MP</strong></div>
          <div>
            <h1 style={{margin:0,color:'#ff7f50'}}>메이플 파티존</h1>
            <div style={{fontSize:13,color:'#6b7280'}}>같이 사냥할 파티원을 빠르게 모집해요</div>
          </div>
        </div>
        <div>
          {session ? (
            <button onClick={()=>signOut()} style={{padding:'8px 12px', borderRadius:8}}>로그아웃 ({session.user.name})</button>
          ) : (
            <button onClick={()=>signIn('discord')} style={{background:'#5865F2', color:'white', padding:'8px 12px', borderRadius:8}}>Discord로 로그인</button>
          )}
        </div>
      </header>

      <main style={{maxWidth:1100, margin:'18px auto'}}>
        <div style={{background:'rgba(255,255,255,0.9)', padding:12, borderRadius:12, display:'flex', gap:8, flexWrap:'wrap'}}>
          {['10~30','30~50','50~80','80~100','100~130','130 이상'].map((t,i)=> (
            <button key={t} style={{padding:'8px 12px', borderRadius:10, border: i===0 ? '2px solid #ffd0b3':'1px solid #f0f0f0', background: i===0 ? '#fff7f5':'white'}}>{t}</button>
          ))}
        </div>

        <section style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginTop:16}}>
          <div style={{background:'white', padding:16, borderRadius:14}}>
            <div style={{fontWeight:700, fontSize:18, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>채팅형 모집</div>
              <div><small style={{color:'#6b7280'}}>실시간 모집 채팅 (메시지는 게시글로 저장됩니다)</small></div>
            </div>

            <div ref={ref} id="chat-window" style={{height:420, overflowY:'auto', marginTop:12, paddingRight:6}}>
              {messages.length===0 && <div style={{padding:12, borderRadius:8, background:'#fff7f5', border:'1px dashed #ffd0b3'}}>아직 모집글이 없습니다.</div>}
              {messages.map((m,i)=> (
                <div key={i} style={{padding:10, borderRadius:10, marginBottom:10, background:'#fffaf6', border:'1px solid rgba(255,219,201,0.6)'}}>
                  <div style={{fontSize:12, color:'#6b7280'}}>[{m.level}] {m.user} · {new Date(m.createdAt).toLocaleString()}</div>
                  <div style={{marginTop:6, fontWeight:600}}>{m.content}</div>
                </div>
              ))}
            </div>

            <div style={{display:'flex', gap:8, marginTop:12}}>
              <select value={level} onChange={(e)=>setLevel(e.target.value)} style={{padding:8, borderRadius:8}}>
                {['10~30','30~50','50~80','80~100','100~130','130 이상'].map(l=> <option key={l}>{l}</option>)}
              </select>
              <input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && sendMessage()} placeholder='모집글을 입력하세요 (예: 3명 구합니다... )' style={{flex:1,padding:10,borderRadius:8,border:'1px solid #eee'}} />
              <button onClick={sendMessage} style={{background:'#ff7f50', color:'white', padding:'10px 14px', borderRadius:8}}>보내기</button>
            </div>
            {info && <div style={{marginTop:8,color:'#6b7280'}}>{info}</div>}
          </div>

          <aside style={{display:'flex', flexDirection:'column', gap:12}}>
            <div style={{padding:12, borderRadius:12, background:'white'}}>공지: 가을 이벤트 - 경험치 버프!</div>
            <div style={{padding:12, borderRadius:12, background:'white'}}>광고 배너 (관리자에서 편집)</div>
            <div style={{padding:12, borderRadius:12, background:'white'}}>빠른채팅 열기</div>
          </aside>
        </section>
      </main>
    </div>
  )
}
