import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import { useHearthSync } from "./hooks/useHearthSync";

const BG   = "#2D1B4E";
const CARD = "#F0EBD8";
const CARDD= "#E8E0CC";
const AC   = "#1A4A2E";
const ACL  = "#2A7A48";
const SUB  = "#C9973A";
const TX   = "#1A0A2E";
const TM   = "#5A4A7A";
const SH   = "0 2px 14px rgba(0,0,0,0.18)";
const SS   = "0 1px 6px rgba(0,0,0,0.12)";

const COLORS = [
  { name:"Blush Pink",     hex:"#C4748A", light:"#F5D5DF" },
  { name:"Terracotta",     hex:"#B5634A", light:"#F2D9D0" },
  { name:"Peach",          hex:"#C8845A", light:"#F5DDD0" },
  { name:"Amber",          hex:"#B8832A", light:"#EEDDC0" },
  { name:"Sage",           hex:"#5C8060", light:"#C2D9C3" },
  { name:"Ocean Blue",     hex:"#3A6E9E", light:"#C0D8EE" },
  { name:"Slate",          hex:"#4F6D94", light:"#C8D5E8" },
  { name:"Tyrian Purple",  hex:"#6B2FA0", light:"#DCC8F0" },
  { name:"Heather",        hex:"#7A6AA8", light:"#D0CAEC" },
  { name:"Rose",           hex:"#A8636D", light:"#EAD0D3" },
  { name:"Danny Phantom",  hex:"#39D97A", light:"#C0F5D8" },
  { name:"Midnight Black", hex:"#2A2A35", light:"#C8C8D8" },
  { name:"Aqua",           hex:"#2AA8A8", light:"#C0EEEE" },
];

const mc = mb => COLORS[mb?.ci ?? 0];
const isAdm = (uid, mbs) => mbs.find(m => m.id === uid)?.role === "admin";
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtD = s => { if(!s) return ""; const [,m,d] = s.split("-"); return MO[+m-1] + " " + (+d); };
const fmtT = t => { if(!t) return ""; const [h,mn] = t.split(":"); const hr=+h; return (hr>12?hr-12:hr||12)+":"+mn+(hr>=12?"pm":"am"); };

const IS = {width:"100%",padding:"11px 14px",border:"1.5px solid #E8E0CC",borderRadius:10,fontSize:14,background:"#E8E0CC",color:"#1A0A2E",fontFamily:"'Nunito',sans-serif",outline:"none",marginTop:6};
function Inp({value,onChange,placeholder,type="text",rows}){
  if(rows) return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{...IS,resize:"none"}}/>;
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={IS}/>;
}
function Lbl({children}){return <div style={{fontSize:13,fontWeight:600,color:"#5A4A7A",marginTop:14}}>{children}</div>;}
function Btn({onClick,children,ghost,danger,small}){
  const bg=danger?"#9B3030":ghost?"transparent":"#1A4A2E";
  return <button onClick={onClick} style={{width:"100%",background:bg,color:ghost?"#5A4A7A":"#fff",border:ghost?"1.5px solid #E8E0CC":"none",borderRadius:12,padding:small?"9px":"13px",fontSize:small?13:15,fontWeight:700,cursor:"pointer",marginTop:10,fontFamily:"'Nunito',sans-serif"}}>{children}</button>;
}
function Empty({icon,text}){return <div style={{textAlign:"center",padding:"40px 0",color:"#5A4A7A",fontSize:14}}><div style={{fontSize:32,marginBottom:8}}>{icon}</div>{text}</div>;}
function Av({member,size=28}){
  const c=mc(member);
  return <div style={{background:c.light,border:"1.5px solid "+c.hex,borderRadius:"50%",width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.48,flexShrink:0}}>{member?.emoji}</div>;
}

function LoadingScreen() {
  return (
    <div style={{background:"#2D1B4E",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Nunito:wght@400;500;600;700&display=swap');"}</style>
      <div style={{textAlign:"center",color:"#C9973A"}}>
        <div style={{fontSize:44}}>🕯️</div>
        <div style={{marginTop:10,fontFamily:"'Lora',serif",fontSize:16}}>Lighting the hearth...</div>
      </div>
    </div>
  );
}

function AuthScreen() {
  const { session, loading, signIn, signUp } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("signin");
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const error = mode === "signin" ? await signIn(email) : await signUp(email);
      if (error) setMessage(error);
      else setMessage("✓ Check your email for the magic link");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{background:"#2D1B4E",minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Nunito:wght@400;500;600;700&display=swap');"}</style>
      <div style={{width:"100%",maxWidth:340}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:52,marginBottom:16}}>🕯️</div>
          <h1 style={{fontFamily:"'Lora',serif",fontSize:32,fontWeight:600,color:"#F0EBD8",margin:"0 0 8px"}}>Hearth</h1>
          <p style={{color:"#C9973A",fontSize:14,margin:0}}>A cozy home for your family</p>
        </div>
        <form onSubmit={handleAuth}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
            style={{...IS,background:"rgba(255,255,255,0.1)",color:"#F0EBD8",border:"1.5px solid rgba(255,255,255,0.2)"}}/>
          <button type="submit" style={{width:"100%",background:"#1A4A2E",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:10,fontFamily:"'Nunito',sans-serif"}}>
            {mode === "signin" ? "Send Magic Link" : "Sign Up"} →
          </button>
        </form>
        {message && (
          <div style={{marginTop:16,padding:"12px 14px",background:"rgba(255,255,255,0.1)",borderRadius:8,color:"#F0EBD8",fontSize:13,textAlign:"center",border:"1px solid rgba(255,255,255,0.2)"}}>
            {message}
          </div>
        )}
        <div style={{marginTop:24,textAlign:"center"}}>
          <button onClick={() => {setMode(mode==="signin"?"signup":"signin"); setMessage("");}}
            style={{background:"none",border:"none",color:"#C9973A",fontSize:13,cursor:"pointer",textDecoration:"underline",fontFamily:"'Nunito',sans-serif"}}>
            {mode === "signin" ? "New to Hearth? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeTab({data, user}) {
  const member = data.members.find(m => m.id === user);
  const upcoming = data.events.filter(ev => new Date(ev.date) >= new Date()).slice(0,3);
  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,color:"#1A0A2E",marginBottom:4}}>
          Welcome home, {member?.name || "friend"} 🕯️
        </div>
        <div style={{fontSize:13,color:"#5A4A7A"}}>
          {data.familyName}
        </div>
      </div>
      <div style={{background:"#E8E0CC",borderRadius:14,padding:"16px",marginBottom:16}}>
        <div style={{fontFamily:"'Lora',serif",fontSize:15,fontWeight:600,color:"#1A0A2E",marginBottom:10}}>Upcoming Events</div>
        {upcoming.length === 0
          ? <Empty icon="📅" text="No upcoming events"/>
          : upcoming.map(ev => (
            <div key={ev.id} style={{padding:"8px 0",borderBottom:"1px solid #F0EBD8",fontSize:14,color:"#1A0A2E"}}>
              <strong>{ev.title}</strong>
              <span style={{marginLeft:8,fontSize:12,color:"#5A4A7A"}}>{fmtD(ev.date)}</span>
            </div>
          ))
        }
      </div>
      <div style={{background:"#E8E0CC",borderRadius:14,padding:"16px"}}>
        <div style={{fontFamily:"'Lora',serif",fontSize:15,fontWeight:600,color:"#1A0A2E",marginBottom:10}}>Announcements</div>
        {data.announcements.length === 0
          ? <Empty icon="📌" text="No announcements"/>
          : data.announcements.slice(0,3).map((a,i) => (
            <div key={i} style={{padding:"8px 0",borderBottom:"1px solid #F0EBD8",fontSize:14,color:"#1A0A2E"}}>{a.text}</div>
          ))
        }
      </div>
    </div>
  );
}

function CalendarTab({data}) {
  return <div style={{textAlign:"center",padding:"40px 0"}}><Empty icon="📅" text="Calendar coming soon"/></div>;
}
function ChoresTab({data}) {
  return <div style={{textAlign:"center",padding:"40px 0"}}><Empty icon="✅" text="Chores coming soon"/></div>;
}
function ShoppingTab({data}) {
  return <div style={{textAlign:"center",padding:"40px 0"}}><Empty icon="🛒" text="Shopping lists coming soon"/></div>;
}
function GiftsTab({data}) {
  return <div style={{textAlign:"center",padding:"40px 0"}}><Empty icon="🎁" text="Gift tracker coming soon"/></div>;
}
function BusinessTab({data}) {
  return <div style={{textAlign:"center",padding:"40px 0"}}><Empty icon="💼" text="Business studio coming soon"/></div>;
}
function SettingsTab({data, syncData}) {
  const handleSignOut = async () => { await supabase.auth.signOut(); };
  return (
    <div style={{padding:"16px"}}>
      <Lbl>Family Settings</Lbl>
      <div style={{marginTop:12,padding:"14px",background:"#E8E0CC",borderRadius:10,color:"#1A0A2E"}}>
        <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>📱 {data.familyName}</div>
        <div style={{fontSize:13,color:"#5A4A7A"}}>Members: {data.members.length}</div>
        <button onClick={handleSignOut} style={{marginTop:12,padding:"10px 14px",background:"#1A4A2E",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",width:"100%",fontFamily:"'Nunito',sans-serif",fontWeight:700}}>
          Sign Out
        </button>
      </div>
      <Lbl>About Hearth</Lbl>
      <div style={{marginTop:12,fontSize:13,color:"#5A4A7A",padding:"14px",background:"#E8E0CC",borderRadius:10}}>
        <div>Hearth v2.0</div>
        <div>🕯️ A cozy home for your family</div>
        <div style={{marginTop:8}}>hello@whimsilogical.com</div>
      </div>
    </div>
  );
}

const TABS = [
  {id:"home",     icon:"🏠", label:"Home"},
  {id:"calendar", icon:"📅", label:"Calendar"},
  {id:"chores",   icon:"✅", label:"Chores"},
  {id:"shopping", icon:"🛒", label:"Shop"},
  {id:"gifts",    icon:"🎁", label:"Gifts"},
  {id:"business", icon:"💼", label:"Biz", adminOnly:true},
  {id:"settings", icon:"⚙️", label:"More"},
];

export default function HearthApp() {
  const { session, loading } = useSupabaseAuth();
  const { data, syncData } = useHearthSync(session?.user?.id);
  const [tab, setTab] = useState("home");

  if (loading) return <LoadingScreen />;
  if (!session) return <AuthScreen />;
  if (!data) return <LoadingScreen />;

  const userId = session.user.id;
  const member = data.members.find(m => m.id === userId) || data.members[0];
  const color = mc(member);
  const adminUser = isAdm(userId, data.members);
  const visibleTabs = TABS.filter(t => !t.adminOnly || adminUser);
  const activeTab = visibleTabs.find(t => t.id === tab) ? tab : "home";

  return (
    <div style={{background:"#2D1B4E",minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'Nunito',sans-serif",color:"#1A0A2E",position:"relative",paddingBottom:80}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Nunito:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{display:none}"}</style>

      <div style={{background:"rgba(45,27,78,0.95)",backdropFilter:"blur(8px)",padding:"13px 20px 11px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div>
          <div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:600,color:"#F0EBD8"}}>{data.familyName}</div>
          <div style={{fontSize:10,color:"#C9973A",marginTop:1}}>Hearth 🕯️</div>
        </div>
        {member && <div style={{background:color.light,border:"2px solid "+color.hex,borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{member.emoji}</div>}
      </div>

      <div style={{padding:"18px 16px",background:"#F0EBD8",minHeight:"calc(100vh - 140px)"}}>
        {activeTab==="home"     && <HomeTab data={data} user={userId}/>}
        {activeTab==="calendar" && <CalendarTab data={data}/>}
        {activeTab==="chores"   && <ChoresTab data={data}/>}
        {activeTab==="shopping" && <ShoppingTab data={data}/>}
        {activeTab==="gifts"    && <GiftsTab data={data}/>}
        {activeTab==="business" && adminUser && <BusinessTab data={data}/>}
        {activeTab==="settings" && <SettingsTab data={data} syncData={syncData}/>}
      </div>

      <div style={{padding:"24px 16px",fontSize:11,color:"#5A4A7A",textAlign:"center",background:"#F0EBD8"}}>
        <div>© 2025–2026 Whimsilogical LLC</div>
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(45,27,78,0.97)",backdropFilter:"blur(8px)",borderTop:"1px solid rgba(255,255,255,0.1)",display:"flex",zIndex:10}}>
        {visibleTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{flex:1,padding:"9px 2px 11px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,
              borderTop:activeTab===t.id?"3px solid #C9973A":"3px solid transparent",
              color:activeTab===t.id?"#C9973A":"rgba(240,235,216,0.5)",fontFamily:"'Nunito',sans-serif"}}>
            <span style={{fontSize:17}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:activeTab===t.id?700:400}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
