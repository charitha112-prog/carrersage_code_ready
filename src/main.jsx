import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, BarChart3, BookOpen, Check, ChevronDown, ChevronRight,
  CircleUserRound, Clock3, Code2, Database, FileText, Home, Lightbulb,
  LogOut, Mail, Menu, MessageSquare, Phone, Play, Search, Send, Settings2,
  ShieldCheck, Sparkles, Target, Upload, User, X, Eye, EyeOff, Building2, Pause, Square, CheckCircle2,
  ClipboardList, BrainCircuit, Mic, Trophy, Download, Share2, LockKeyhole, Linkedin
} from "lucide-react";
import { APP_DATA } from "./data";
import { api, clearSession, saveSession } from "./api";
import "./styles.css";

const COLORS = { navy:"#1A3263", blue:"#547792", cream:"#EFD2B0", yellow:"#FFC570" };
const currentAccount = () => { try { return JSON.parse(localStorage.getItem("cs-user") || "null"); } catch { return null; } };
const currentName = () => currentAccount()?.username || APP_DATA.user.name;
async function logoutCurrentSession() { try { if(localStorage.getItem("cs-token")) await api("/auth/logout",{method:"POST"}); } catch {} finally { clearSession(); window.location.assign("/"); } }
const applyDashboard = result => { const d=result.dashboard||result; if(d) Object.assign(APP_DATA.dashboard,d); if(Object.prototype.hasOwnProperty.call(result,"resume")){if(result.resume) APP_DATA.resume={...APP_DATA.resume,...result.resume,roleAlignment:result.resume.roleAlignmentList||[]}; else APP_DATA.resume={...APP_DATA.resume,fileName:"",score:null,atsScore:null,technicalSkills:[],softSkills:[],otherSkills:[],roleAlignment:[],matchedKeywords:[],missingKeywords:[]};} };
const applyProgress = result => { if(result?.recentActivity) APP_DATA.preparation.recentActivity=result.recentActivity; };

function Logo({ compact=false }) {
  return <div className={`brand ${compact ? "compact" : ""}`}>
    <div className="leaf-logo" aria-hidden="true"><span/><span/><span/></div>
    {!compact && <span>CareerSage</span>}
  </div>
}

function Glass({children, className="", ...props}) { return <section className={`glass ${className}`} {...props}>{children}</section> }

function ProgressRing({value, label="/ 100", size=118}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return <div className="ring" style={{"--p":`${safe}%`, width:size, height:size}}>
    <div className="ring-inner"><strong>{value == null ? "—" : value}%</strong><span>{label}</span></div>
  </div>
}

function Sidebar({page, setPage}) {
  const items = [
    ["home","Home",Home], ["preparation","Preparation",Target],
    ["interview","Interview",MessageSquare], ["progress","Progress",BarChart3]
  ];
  return <aside className="sidebar">
    <Logo />
    <nav>
      {items.map(([id,label,Icon]) => <button key={id} className={page===id ? "active":""} onClick={()=>setPage(id)}>
        <Icon size={21}/><span>{label}</span>
      </button>)}
      <div className="resume-nav" aria-label="Resume tools">
        <div className="resume-nav-title"><FileText size={19}/><span>Resume</span></div>
        <div className="resume-nav-links">
          <button className={["upload","analyzing","done"].includes(page)?"active":""} aria-current={["upload","analyzing","done"].includes(page)?"page":undefined} onClick={()=>setPage("upload")}><Upload size={18}/><span>Upload / Replace</span></button>
        </div>
      </div>
    </nav>
    <div className="side-bottom">
      <button onClick={()=>setPage("profile")}><User size={20}/>Profile</button>
      <button onClick={logoutCurrentSession}><LogOut size={20}/>Logout</button>
    </div>
  </aside>
}

function UserPill({setPage}) {
  const account=currentAccount();
  return <div className="workspace-actions">
    <button className="resume-kitten" onClick={()=>setPage("upload")} title="Choose a new resume">
      <span className="kitten-circle"><video autoPlay loop muted playsInline aria-label="CareerSage graduation kitten"><source src="/kitten-loop.mp4" type="video/mp4"/><img src="/graduation-kitten.gif" alt="CareerSage graduation kitten" /></video></span>
      <span className="resume-kitten-label">New Resume</span>
    </button>
    <div className="user-pill"><CircleUserRound size={20}/><span>{account?.username||APP_DATA.user.name}</span><ChevronDown size={15}/></div>
    <button className="header-logout" onClick={logoutCurrentSession}><LogOut size={17}/><span>Logout</span></button>
  </div>
}

function AppShell({page,setPage,children,headerTitle,headerSubtitle,headerAction}) {
  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage}/>
    <main className="workspace">
      <div className={`workspace-top ${headerTitle ? "has-page-heading" : ""}`}>
        {headerTitle && <div className="workspace-heading"><h1>{headerTitle}</h1><p>{headerSubtitle}</p></div>}
        <div className="workspace-top-right">{headerAction}<UserPill setPage={setPage}/></div>
      </div>
      {children}
    </main>
  </div>
}

function Landing({go}) {
  return <div className="public-page landing">
    <header className="public-nav"><Logo/><div className="nav-links"><a href="#about">About</a><a href="#features">Features</a><a href="#contact">Contact</a><button onClick={go}>Get Started <ArrowRight size={17}/></button></div></header>
    <div className="landing-orb orb-a"/><div className="landing-orb orb-b"/>
    <Glass className="landing-card">
      <Logo/>
      <h1>Know where you stand.<br/>Know what to do next.</h1>
      <p>Insights, guidance and practice —<br/>all in one place.</p>
      <button className="primary big" onClick={go}>Get Started <ArrowRight/></button>
    </Glass>
  </div>
}

function Login({goCreate, onLogin, goLanding}) {
  const [identity,setIdentity]=useState(()=>localStorage.getItem("cs-login-identifier")||""); const [password,setPassword]=useState(""); const [remember,setRemember]=useState(true); const [show,setShow]=useState(false); const [error,setError]=useState("");
  const submit=async()=>{setError(""); if(!identity.trim()||!password){setError("Enter your email or phone number and password.");return;} try{const session=await api("/auth/login",{method:"POST",body:JSON.stringify({identifier:identity,password})});saveSession(session);if(remember)localStorage.setItem("cs-login-identifier",identity.trim());else localStorage.removeItem("cs-login-identifier");onLogin(session.user)}catch(e){setError(e.message)}};
  return <div className="public-page login-page"><div className="login-deco deco-1"/><div className="login-deco deco-2"/><div className="login-left"><Logo/><blockquote>Careers aren’t a destination,<br/>they’re a journey.<br/>Let’s build yours together.</blockquote><div className="sticky">Think of us like a<br/>senior you can<br/>always ask. ♡</div></div><Glass className="login-card"><Logo/><h1>Welcome to CareerSage</h1><p>Let’s get to know you before we get started.</p><label className="field"><Mail size={22}/><span><b>Email, phone or username</b><input value={identity} onChange={e=>setIdentity(e.target.value)} placeholder="Enter your email, phone or username" autoComplete="username"/></span></label><label className="field"><LockKeyhole size={22}/><span><b>Password</b><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password"/></span><button className="icon-btn" type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={20}/>:<Eye size={20}/>}</button></label><div className="login-options"><label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Remember sign-in ID on this device</label><button onClick={()=>setError("For this demo, create a new account if you can’t remember your password.")}>Forgot password?</button></div>{error&&<div className="form-error" role="alert">{error}</div>}<button className="primary wide" onClick={submit}>Log In <ArrowRight/></button><div className="form-switch">Don’t have an account? <button onClick={goCreate}>Create an account</button></div><button className="back-home" onClick={goLanding}>← Back to home</button></Glass></div>
}

function CreateAccount({goLogin,onCreate}) {
 const [form,setForm]=useState({username:"",email:"",phone:"",password:"",confirm:""}); const [show,setShow]=useState(false); const [error,setError]=useState(""); const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
 const submit=async()=>{setError(""); if(Object.values(form).some(v=>!v.trim()))return setError("Please complete all required fields."); if(form.password.length<8)return setError("Your password must contain at least 8 characters."); if(form.password!==form.confirm)return setError("Your passwords don’t match. Please try again."); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))return setError("Enter a valid email address."); if(!/^[+0-9 ()-]{8,18}$/.test(form.phone))return setError("Enter a valid phone number."); try{const session=await api("/auth/register",{method:"POST",body:JSON.stringify({username:form.username,email:form.email,phone:form.phone,password:form.password})});saveSession(session);onCreate(session.user)}catch(e){setError(e.message)} };
 return <div className="public-page login-page"><div className="login-deco deco-1"/><div className="login-deco deco-2"/><div className="login-left"><Logo/><blockquote>Careers aren’t a destination,<br/>they’re a journey.<br/>Let’s build yours together.</blockquote><div className="sticky">Think of us like a<br/>senior you can<br/>always ask. ♡</div></div><Glass className="login-card create-card"><Logo/><h1>Create your account</h1><p>Let’s get to know you and start your journey.</p>{[["username","Username",User,"Enter your username"],["email","Email Address",Mail,"Enter your email address"],["phone","Phone Number",Phone,"Enter your phone number"]].map(([k,l,I,ph])=><label className="field" key={k}><I size={21}/><span><b>{l}</b><input value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph}/></span></label>)}{[["password","Password","Create a password (at least 8 characters)"],["confirm","Confirm Password","Re-enter your password"]].map(([k,l,ph])=><label className="field" key={k}><LockKeyhole size={21}/><span><b>{l}</b><input type={show?"text":"password"} value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph}/></span><button className="icon-btn" type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={19}/>:<Eye size={19}/>}</button></label>)}{error&&<div className="form-error" role="alert">{error}</div>}<button className="primary wide" onClick={submit}>Create Account <ArrowRight/></button><div className="form-switch">Already have an account? <button onClick={goLogin}>Log In</button></div></Glass></div>
}

function ResumeUpload({setPage}) {
 const [file,setFile]=useState(null); const [dragging,setDragging]=useState(false); const [shot,setShot]=useState(false); const [error,setError]=useState(""); const [githubLinks,setGithubLinks]=useState(""); const inputRef=useRef(); const timerRef=useRef(null);
 useEffect(()=>()=>clearTimeout(timerRef.current),[]);
 const select=f=>{if(!f)return;setError("");if(!/\.(pdf|docx)$/i.test(f.name)){setError("Please choose a PDF or DOCX file.");return;}if(f.size>10*1024*1024){setError("Your file must be 10 MB or smaller.");return;}setFile(f);setShot(false);};
 const selectSample=async()=>{try{const response=await fetch("/sample-resume.pdf");if(!response.ok)throw new Error();select(new File([await response.blob()],"Sample_Resume.pdf",{type:"application/pdf"}))}catch{setError("The sample resume could not be loaded. Please browse for a file.")}};
 const dropFile=e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files?.[0];if(f)select(f);};
 const launch=async()=>{if(shot)return;setShot(true);setError("");const body=new FormData();body.append("file",file);body.append("github_links",githubLinks);try{const result=await api("/resumes",{method:"POST",body});APP_DATA.resume={...APP_DATA.resume,...result.analysis,fileName:result.fileName,roleAlignment:result.analysis.roleAlignmentList};applyDashboard(await api("/dashboard"));timerRef.current=setTimeout(()=>setPage("analyzing"),1200)}catch(e){setShot(false);setError(e.message)}};
 return <AppShell page="upload" setPage={setPage}>
   <PageTitle title={`Good to see you, ${currentName().split(" ")[0]} 👋`} subtitle="Let’s get started with your resume."/>
   <Glass className={`upload-card ${file?"basket-state":""}`}>
     <input ref={inputRef} type="file" accept=".pdf,.docx" onChange={e=>select(e.target.files?.[0])} hidden/>
     {!file ? <>
       <div className="upload-kitten-preview" aria-label="CareerSage kitten animation">
         <video autoPlay loop muted playsInline aria-label="Graduation kitten holding a resume"><source src="/kitten-loop.mp4" type="video/mp4"/><img src="/graduation-kitten.gif" alt="Graduation kitten holding a resume" /></video>
       </div>
       <FileText className="upload-file-mark" size={36} strokeWidth={1.6}/><h2>Upload your resume</h2><p>Drop your file here or click to browse</p>
       <div className={`dropzone ${dragging?"dragging":""}`} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={dropFile} onClick={()=>inputRef.current?.click()}><button className="primary" type="button">Browse Files</button><span>PDF • DOCX (Max 10MB)</span></div>
       <button className="sample-link" onClick={selectSample}><Lightbulb size={17}/> Not sure? Try a sample resume <ArrowRight size={17}/></button>
     </> : <>
       <div className={`basket-scene ${shot?"shot-active":""}`}>
         <div className="hoop-backboard"><div className="backboard-square"/></div>
         <div className="hoop-net" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
         <div className="hoop-rim" aria-hidden="true"/>
         <div className="basket-target" onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";e.currentTarget.classList.add("target-hover")}} onDragLeave={e=>e.currentTarget.classList.remove("target-hover")} onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove("target-hover");launch()}} title="Drop the resume into the basket" aria-label="Basket target"/>
         <div className={`pdf-token ${shot?"pdf-shot":""}`} draggable={!shot} onDragStart={e=>{e.dataTransfer.setData("text/plain",file.name);e.dataTransfer.effectAllowed="move"}} onClick={()=>{if(!shot)setError("Drag the resume into the basket to make the shot.")}} title="Drag this resume into the basket"><FileText size={29}/><small>{/\.pdf$/i.test(file.name)?"PDF":"FILE"}</small></div>
       </div>
       <h2>{shot?"Good shot! 🏀":"Ready for the shot?"}</h2>
       <p>{shot?"Nice shot! Your resume is heading to analysis.":"Drag your resume into the basketball hoop."}</p>
       <div className="selected-file"><FileText size={17}/><span title={file.name}>{file.name}</span><button disabled={shot} onClick={()=>{setFile(null);setShot(false);setError("")}}>Change file</button></div>
       <label className="github-entry"><Code2 size={18}/><span><b>GitHub repositories (optional)</b><input value={githubLinks} onChange={e=>setGithubLinks(e.target.value)} placeholder="Paste GitHub repo links, separated by commas" disabled={shot}/></span></label>
     </>}
     {error&&<div className="form-error" role="alert">{error}</div>}
   </Glass>
 </AppShell>
}

function PageTitle({title,subtitle,action}) {
  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}

function Analyzing({setPage}) {
  const [progress,setProgress]=useState(0);
  const steps=["Reading your resume...","Understanding your experience...","Analyzing your skills...","Finding areas you can strengthen...","Preparing your personalized career dashboard..."];
  useEffect(()=>{const t=setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(t);setTimeout(()=>setPage("done"),350);return 100}return p+4}),35);return()=>clearInterval(t)},[]);
  const active=Math.min(4,Math.floor(progress/21));
  return <AppShell page="resume" setPage={setPage}>
    <PageTitle title="Analyzing your resume..." subtitle="I’m going through your resume and preparing your personalized insights."/>
    <Glass className="analysis-card">
      <div className="steps">{steps.map((s,i)=><div className={i<active?"done":i===active?"current":""} key={s}><span>{i<active?<Check size={16}/>:i+1}</span><label>{s}</label></div>)}</div>
      <ProgressRing value={progress} label=""/>
    </Glass>
    <div className="time-note"><Clock3 size={20}/> This won’t take long. Good things take a little time! <Sparkles size={18}/></div>
  </AppShell>
}

function Done({setPage}) {
  return <AppShell page="resume" setPage={setPage}>
    <div className="done-wrap"><Glass className="done-card"><div className="done-check"><Check size={55}/></div><h1>Your resume is analyzed!</h1><p>I’ve gone through your resume and prepared your personalized career dashboard.</p><button className="primary big" onClick={()=>setPage("home")}>View My Dashboard <ArrowRight/></button></Glass></div>
  </AppShell>
}

function Dashboard({setPage}) {
  const d=APP_DATA.dashboard; const [expanded,setExpanded]=useState(""); const [statDetail,setStatDetail]=useState(""); const [,setDataReady]=useState(false);
  useEffect(()=>{Promise.all([api("/dashboard").then(applyDashboard),api("/progress").then(applyProgress)]).finally(()=>setDataReady(true))},[]);
  const labels={skills:"Your Skill Analysis",roles:"Top Role Matches",activity:"Recent Activity",strengths:"Strengths",improve:"Areas to Improve",steps:"Next Steps"};
  return <AppShell page="home" setPage={setPage} headerTitle={`Welcome back, ${currentName().split(" ")[0]}! 👋`} headerSubtitle="Here’s your personalized career overview." headerAction={<div className="sticky-note"><Lightbulb/><span>Small steps today, bigger opportunities tomorrow.</span></div>}>
    <div className="dashboard-page page-fit">
      <div className="stat-grid dashboard-stats">
        <Glass><CardHead icon={<FileText/>} title="Resume Score" link="View Analysis" onClick={()=>setPage("resume")}/><div className="stat-with-note"><ProgressRing value={APP_DATA.resume.score} size={88}/><span>A strong foundation!<br/>Keep building further.</span></div></Glass>
        <Glass className="clickable-stat" role="button" tabIndex={0} onClick={()=>setStatDetail("skills")}><h3><BarChart3/> Skills Identified</h3><div className="stat-number-with-icon"><div><strong className="big-number">{d.skillsIdentified ?? APP_DATA.resume.technicalSkills.length}</strong><span>key skills · view list</span></div></div></Glass>
        <Glass className="clickable-stat" role="button" tabIndex={0} onClick={()=>setStatDetail("roles")}><h3><Target/> Recommended Roles</h3><div className="stat-number-with-icon"><div><strong className="big-number">{d.recommendedRoles}</strong><span>roles · view list</span></div></div></Glass>
        <Glass><h3><BookOpen/> Preparation Status</h3><div className="stat-with-note"><ProgressRing value={d.preparationStatus} size={88}/><span>You’re on the right track!<br/>Keep practicing.</span></div></Glass>
      </div>
      <div className="home-row home-row-main">
        <Glass><CardHead icon={<BarChart3/>} title="Skills Found in Resume" link="View More" onClick={()=>setExpanded("skills")}/>{d.skillAnalysis.slice(0,5).map(([n])=><div className="detail-list-row" key={n}><span className="list-symbol">✓</span><div><b>{n}</b><small>Detected in your latest resume</small></div></div>)}{!d.skillAnalysis.length&&<p>Upload a resume to see detected skills.</p>}</Glass>
        <Glass><CardHead icon={<Target/>} title="Top Role Matches" link="View All" onClick={()=>setExpanded("roles")}/>{d.roleMatches.slice(0,3).map(([n,v],i)=><div className="role-row" key={n}><b>{i+1}</b><span>{n}<i className="role-meter"><i style={{width:`${v}%`}}/></i></span><strong>{v}%</strong></div>)}</Glass>
        <Glass><CardHead icon={<Clock3/>} title="Recent Activity" link="View All" onClick={()=>setExpanded("activity")}/>{APP_DATA.preparation.recentActivity.length?APP_DATA.preparation.recentActivity.slice(0,3).map((x,i)=><div className="activity-row" key={`${x[0]}-${i}`}><span className={`activity-icon activity-${i}`}><Check size={16}/></span><span>Practiced: {x[0]}</span><small>{x[4]}</small></div>):<p>No practice answers yet. Start an interview to track progress.</p>}</Glass>
      </div>
      <div className="home-row home-row-bottom">
        <Glass><CardHead icon={<Sparkles/>} title="Strengths" link="View More" onClick={()=>setExpanded("strengths")}/>{d.strengths.slice(0,3).map((x,i)=><div className="detail-list-row" key={x}><span className="list-symbol">{["✦","▦","↗"][i]}</span><div><b>{x}</b><small>Matched in the latest resume analysis</small></div></div>)}</Glass>
        <Glass><CardHead icon={<BarChart3/>} title="Areas to Improve" link="View More" onClick={()=>setExpanded("improve")}/>{d.areasToImprove.slice(0,3).map((x,i)=><div className="detail-list-row" key={x}><span className="list-symbol">{["◈","☁","◷"][i]}</span><div><b>{x}</b><small>Add this keyword only when it reflects your experience</small></div></div>)}</Glass>
        <Glass><CardHead icon={<Check/>} title="Next Steps" link="View More" onClick={()=>setExpanded("steps")}/>{d.nextSteps.slice(0,3).map((x,i)=><div className="detail-list-row" key={x}><span className="step-number">{i+1}</span><div><b>{x}</b></div></div>)}</Glass>
      </div>
    </div>
    {statDetail&&<DetailModal title={statDetail==="skills"?"Skills Identified":"Recommended Roles"} onClose={()=>setStatDetail("")}><div className="expanded-list">{statDetail==="skills"? (APP_DATA.resume.technicalSkills||[]).map(x=><div className="detail-list-row" key={x}><span className="list-symbol">✓</span><div><b>{x}</b><small>Detected in your latest resume</small></div></div>):d.roleMatches.map(([n,v],i)=><div className="role-row" key={n}><b>{i+1}</b><span>{n}<i className="role-meter"><i style={{width:`${v}%`}}/></i></span><strong>{v}%</strong></div>)}</div></DetailModal>}
    {expanded&&<DetailModal title={labels[expanded]} onClose={()=>setExpanded("")}><div className="expanded-list">
      {expanded==="skills"&&d.skillAnalysis.map(([n])=><div className="detail-list-row" key={n}><span className="list-symbol">✓</span><div><b>{n}</b><small>Detected in your latest resume</small></div></div>)}
      {expanded==="roles"&&d.roleMatches.map(([n,v],i)=><div className="role-row" key={n}><b>{i+1}</b><span>{n}<i className="role-meter"><i style={{width:`${v}%`}}/></i></span><strong>{v}%</strong></div>)}
      {expanded==="activity"&&(APP_DATA.preparation.recentActivity.length?APP_DATA.preparation.recentActivity.map((x,i)=><div className="activity-row" key={`${x[0]}-${i}`}><span className={`activity-icon activity-${i%3}`}><Check size={16}/></span><span>Practiced: {x[0]}</span><small>{x[4]}</small></div>):<p>No practice answers yet.</p>)}
      {expanded==="strengths"&&d.strengths.map(x=><div className="detail-list-row" key={x}><span className="list-symbol">✦</span><div><b>{x}</b><small>Matched in the latest resume analysis</small></div></div>)}
      {expanded==="improve"&&d.areasToImprove.map(x=><div className="detail-list-row" key={x}><span className="list-symbol">◈</span><div><b>{x}</b><small>Add this keyword only when it reflects your experience</small></div></div>)}
      {expanded==="steps"&&d.nextSteps.map((x,i)=><div className="detail-list-row" key={x}><span className="step-number">{i+1}</span><div><b>{x}</b></div></div>)}
    </div></DetailModal>}
  </AppShell>
}


function CardHead({icon,title,link,onClick}) { return <div className="card-head"><h2>{icon}{title}</h2>{link&&<button onClick={onClick}>{link} <ArrowRight size={16}/></button>}</div> }
function DetailModal({title,children,onClose}) {
  useEffect(()=>{const onKey=e=>{if(e.key==="Escape")onClose()};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="glass detail-modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2>{title}</h2><button className="modal-close" onClick={onClose} aria-label="Close"><X/></button></div>{children}</section></div>
}
function Bar({label,value}) { return <div className="bar-row"><span>{label}</span><div><i style={{width:`${value}%`}}/></div><b>{value}%</b></div> }
function Pills({items}) { return <div className="pills">{items.map(x=><span key={x}>{x}</span>)}</div> }

function ResumeAnalysis({setPage}) {
  const [r,setResume]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [reload,setReload]=useState(0);
  useEffect(()=>{let active=true;setLoading(true);setError("");api("/resumes/latest/analysis").then(result=>{if(!active)return;const next={...result.analysis,fileName:result.fileName,roleAlignment:result.analysis.roleAlignmentList||[]};APP_DATA.resume=next;setResume(next);setLoading(false)}).catch(e=>{if(!active)return;if(e.status===404){APP_DATA.resume={...APP_DATA.resume,fileName:"",score:null,technicalSkills:[],softSkills:[],otherSkills:[],roleAlignment:[],matchedKeywords:[],missingKeywords:[],suggestedKeywords:[],insights:[],suggestions:[]};setResume(null)}else setError(e.message);setLoading(false)});return()=>{active=false}},[reload]);
  if(loading)return <AppShell page="resume" setPage={setPage}><PageTitle title="Resume Analysis" subtitle="Loading your saved resume analysis…"/><Glass className="resume-state-card" role="status"><div className="resume-state-icon"><FileText/></div><h2>Loading your analysis</h2><p>Your saved resume analysis will appear here.</p></Glass></AppShell>;
  if(error)return <AppShell page="resume" setPage={setPage}><PageTitle title="Resume Analysis" subtitle="We couldn’t load your saved resume analysis."/><Glass className="resume-state-card" role="alert"><div className="resume-state-icon resume-state-error"><FileText/></div><h2>Analysis couldn’t be loaded</h2><p>{error}</p><div className="resume-state-actions"><button className="primary" onClick={()=>setReload(v=>v+1)}>Try again <ArrowRight/></button><button className="secondary" onClick={()=>setPage("upload")}>Upload a resume <Upload/></button></div></Glass></AppShell>;
  if(!r)return <AppShell page="resume" setPage={setPage}><PageTitle title="Resume Analysis" subtitle="Your resume insights will be ready after you upload a resume."/><Glass className="resume-state-card"><div className="resume-state-icon"><FileText/></div><h2>No resume analysis yet</h2><p>Upload a PDF or DOCX resume to see your score, detected skills, role matches, and improvement suggestions.</p><button className="primary" onClick={()=>setPage("upload")}>Upload a resume <Upload/></button></Glass></AppShell>;
  const downloadReport=()=>{const report=["CareerSage Resume Analysis",`Overall Resume Score: ${r.score}/100`,"", "Quick Insights:",...r.insights.map((x,i)=>`${i+1}. ${x}`),"","Suggestions:",...r.suggestions.map((x,i)=>`${i+1}. ${x}`)].join("\n");const url=URL.createObjectURL(new Blob([report],{type:"text/plain"}));const a=document.createElement("a");a.href=url;a.download="CareerSage-Resume-Report.txt";a.click();URL.revokeObjectURL(url);};
  const shareReport=async()=>{try{if(navigator.share)await navigator.share({title:"CareerSage Resume Analysis",text:`My demo resume score is ${r.score}/100.`,url:window.location.href});else if(navigator.clipboard){await navigator.clipboard.writeText(window.location.href);alert("CareerSage page link copied.");}else alert("You can share this page using the browser address bar.");}catch{}}
  const checks=r.writingChecks||{};
  return <AppShell page="resume" setPage={setPage}>
    <PageTitle title="Resume Analysis" subtitle="Here’s a detailed breakdown of your resume." action={<div className="actions"><button className="secondary" onClick={downloadReport}><Download/> Download Report</button><button className="secondary" onClick={shareReport}><Share2/> Share</button></div>}/>
    <div className="analysis-grid resume-analysis-grid">
      <Glass><CardHead icon={<FileText/>} title="Overall Resume Score"/><div className="score-panel"><ProgressRing value={r.score}/><div>{[["Content Quality",r.contentQuality],["Skill Relevance",r.skillRelevance],["Role Alignment",r.roleAlignment],["Clarity & Structure",r.clarity]].map(([n,v])=><Bar key={n} label={n} value={v}/>)}</div></div></Glass>
      <Glass><CardHead icon={<Lightbulb/>} title="Quick Insights"/>{r.insights.map((x,i)=><div className="insight" key={x}><span>{i+1}</span><p>{x}</p></div>)}</Glass>
      <Glass className="span-2 writing-checks-card"><CardHead icon={<CheckCircle2/>} title="Readability, consistency & grammar"/><p className="muted-copy">Automated checks help spot extraction problems and common writing issues. Review suggestions before changing your resume.</p><div className="writing-checks-grid">
        <WritingCheck title="Readable text" check={checks.readability} fallback="No readability details are available for this saved analysis." metrics={checks.readability?.wordCount!=null?`${checks.readability.wordCount} words · about ${checks.readability.averageSentenceWords} words per sentence`:""}/>
        <WritingCheck title="Consistency" check={checks.consistency} fallback="No consistency details are available for this saved analysis."/>
        <WritingCheck title="Grammar & punctuation" check={checks.grammar} fallback="No grammar details are available for this saved analysis."/>
      </div><small className="writing-checks-note">{checks.grammar?.note||"Basic automated checks are not a complete grammar proofread."}</small></Glass>
      <Glass className="span-2"><CardHead icon={<BarChart3/>} title="Skills Analysis"/><div className="skill-cols"><SkillGroup title="Technical Skills" items={r.technicalSkills}/><SkillGroup title="Soft Skills" items={r.softSkills}/><SkillGroup title="Other Skills" items={r.otherSkills}/></div></Glass>
      <Glass><CardHead icon={<Search/>} title="Keyword Match"/><Metric label="Matched Keywords" value={r.matchedKeywords}/><Metric label="Missing Keywords" value={r.missingKeywords}/><Metric label="Suggested Keywords" value={r.suggestedKeywords}/></Glass>
      <Glass><CardHead icon={<Target/>} title="Role Alignment"/>{r.roleAlignment.map(x=><div className="role-detail" key={x.role}><b>{x.role}</b><strong>{x.score}%</strong><span>{x.skills}</span></div>)}</Glass>
      <Glass><CardHead icon={<Sparkles/>} title="Suggestions to Improve"/>{r.suggestions.map((x,i)=><div className="suggestion" key={x}><b>{i+1}</b><span>{x}</span></div>)}</Glass>
      <Glass className="span-2"><CardHead icon={<Code2/>} title="GitHub Repositories"/>{r.githubLinks?.length?<div className="github-repo-list">{r.githubLinks.map(link=><a key={link} href={link} target="_blank" rel="noreferrer"><Code2 size={17}/><span>{link.replace(/^https:\/\/github\.com\//,"")}</span><ArrowRight size={15}/></a>)}</div>:<p className="muted-copy">No GitHub repository links found. Add them with your next resume upload to display them here.</p>}</Glass>
      <JobMatchPanel/>
    </div>
  </AppShell>
}

function WritingCheck({title,check,fallback,metrics=""}) {
 const value=check||{}; const state=value.status||"Not available";
 const needsReview=/review/i.test(state);
 return <section className={`writing-check ${needsReview?"needs-review":"looks-good"}`}><div className="writing-check-head"><b>{title}</b><span>{state}</span></div><p>{value.message||fallback}</p>{metrics&&<small>{metrics}</small>}{value.issues?.length>0&&<ul>{value.issues.map((issue,i)=><li key={`${i}-${issue}`}>{issue}</li>)}</ul>}</section>
}

function JobMatchPanel() {
 const [form,setForm]=useState({company:"",title:"",description:"",source_url:""}); const [matches,setMatches]=useState([]); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 useEffect(()=>{api("/matches/jobs").then(setMatches).catch(()=>{})},[]);
 const update=(key,value)=>setForm(v=>({...v,[key]:value}));
 const submit=async e=>{e.preventDefault();setError("");setLoading(true);try{const result=await api("/matches/jobs",{method:"POST",body:JSON.stringify(form)});setMatches(list=>[result,...list].slice(0,10));setForm(v=>({...v,description:"",source_url:""}))}catch(ex){setError(ex.message)}finally{setLoading(false)}};
 return <Glass className="span-2 job-match-card"><CardHead icon={<Target/>} title="Company & Job Match"/><p className="muted-copy">Compare the latest resume with a job description. For a LinkedIn listing, paste its link and the job description below; CareerSage does not scrape LinkedIn.</p>
   <form className="job-match-form" onSubmit={submit}><label>Company<input required maxLength="120" value={form.company} onChange={e=>update("company",e.target.value)} placeholder="Company name"/></label><label>Job title<input required maxLength="120" value={form.title} onChange={e=>update("title",e.target.value)} placeholder="Role title"/></label><label className="job-description-field">Job description<textarea required minLength="30" maxLength="20000" value={form.description} onChange={e=>update("description",e.target.value)} placeholder="Paste the skills and responsibilities from the listing (at least 30 characters)."/></label><label className="job-url-field">LinkedIn job link (optional)<input type="url" value={form.source_url} onChange={e=>update("source_url",e.target.value)} placeholder="https://www.linkedin.com/jobs/view/..."/></label>{error&&<div className="form-error" role="alert">{error}</div>}<button className="primary" disabled={loading}>{loading?"Matching…":"Match this job"} <ArrowRight size={17}/></button></form>
   {matches.length>0&&<div className="job-match-results"><h3>Saved matches</h3>{matches.map((match,i)=><article className="job-match-result" key={`${match.createdAt||i}-${match.company}-${match.title}`}><div className="job-match-heading"><div><b>{match.title}</b><span>{match.company}</span></div><strong>{match.score}% match</strong></div><div className="job-match-skills"><span><b>Matched:</b> {match.matchedSkills?.join(", ")||"None detected"}</span><span><b>To build:</b> {match.missingSkills?.join(", ")||"No skill gaps detected"}</span></div>{match.sourceUrl&&<a href={match.sourceUrl} target="_blank" rel="noreferrer">Open LinkedIn job listing <ArrowRight size={14}/></a>}<small>{match.note}</small></article>)}</div>}
 </Glass>
}

function SkillGroup({title,items}) {return <div><h4>{title}</h4><div className="skill-tags">{items.map(x=><span key={x}>{x}</span>)}</div></div>}
function Metric({label,value}) {return <div className="metric"><span>{label}</span><div className="metric-tags">{value.map(x=><em key={x}>{x}</em>)}</div></div>}

function Preparation({setPage}) {
  const [tab,setTab]=useState("overview"); const [upcomingExpanded,setUpcomingExpanded]=useState(false); const p=APP_DATA.preparation; const [,setLoaded]=useState(false);
  useEffect(()=>{Promise.all([api("/dashboard"),api("/progress"),api("/interview/questions")]).then(([dashboard,progress,questions])=>{
    applyDashboard(dashboard); applyProgress(progress);
    const group=key=>Object.values(questions.reduce((out,row)=>{const name=row[key];if(!out[name])out[name]={name,count:0};out[name].count++;return out},{}));
    p.categories=group("category");p.companies=group("company");p.topics=group("topic");
    p.mockTests=[{name:"All interview questions",meta:`${questions.length} curated questions`},{name:"Technical practice",meta:`${questions.filter(x=>x.category==="Technical").length} questions`},{name:"Behavioral practice",meta:`${questions.filter(x=>x.category==="Behavioral").length} questions`}];
    p.questionCount=questions.length;p.answerCount=progress.summary.answers;p.latestScore=progress.summary.averageScore;
    setLoaded(true);
  }).catch(()=>setLoaded(true))},[]);
  if(tab==="activity") return <ActivityPage items={p.recentActivity} setTab={setTab} setPage={setPage}/>;
  if(tab==="technical") return <QuestionBank title="Interview Questions" subtitle="Browse the curated questions and filter by category or difficulty." items={p.categories} icon={<Code2/>} filterType="category" setTab={setTab} setPage={setPage}/>;
  if(tab==="topic") return <QuestionBank title="Topic-wise Questions" subtitle="Choose a subject represented in the current starter dataset." items={p.topics||[]} icon={<BrainCircuit/>} filterType="topic" setTab={setTab} setPage={setPage}/>;
  if(tab==="company") return <QuestionBank title="Company-wise Questions" subtitle="Browse the sample questions tagged to each company." items={p.companies} icon={<Building2/>} filterType="company" setTab={setTab} setPage={setPage} company/>;
  if(tab==="mock") return <MockTests tests={p.mockTests} setTab={setTab} setPage={setPage}/>;
  return <AppShell page="preparation" setPage={setPage} headerTitle="Interview Preparation" headerSubtitle="Practice, improve and get interview ready with personalized questions." headerAction={<div className="sticky-note"><Lightbulb/><span>Focused practice today, confidence tomorrow.</span></div>}>
    <div className="prep-overview page-fit">
      <div className="prep-top-row">
        <Glass><CardHead icon={<BarChart3/>} title="Practice Progress"/><div className="score-panel prep-readiness"><ProgressRing value={APP_DATA.dashboard.preparationStatus} size={88}/><div><p>Answers submitted <b>{p.answerCount??0}</b></p><p>Curated questions <b>{p.questionCount??0}</b></p><p>Latest answer score <b>{p.latestScore??0}%</b></p></div></div></Glass>
        <Glass><CardHead icon={<ClipboardList/>} title="Upcoming Practice Sections" link="Expand" onClick={()=>setUpcomingExpanded(true)}/>{p.mockTests.map((x,i)=><button className="prep-plan-item" key={x.name} onClick={()=>setTab("mock")}><span className="prep-item-icon">{i===0?"▣":i===1?"▦":"⌘"}</span><span><b>{x.name}</b><small>{x.meta}</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<Clock3/>} title="Recent Practice Activity" link="View All" onClick={()=>setTab("activity")}/><div className="practice-activity-scroll" role="region" aria-label="Recent practice activity" tabIndex={0}>{p.recentActivity.map((x,i)=><div className="activity-row" key={`${x[0]}-${i}`}><span className={`activity-icon activity-${i%3}`}><Check size={16}/></span><span>Practiced: {x[0]}</span><small>{x[4]}</small></div>)}{!p.recentActivity.length&&<p>Submit an answer in interview practice to start tracking your activity.</p>}</div></Glass>
      </div>
      <div className="prep-bottom-row">
        <Glass><CardHead icon={<Code2/>} title="Question Categories" link="View All" onClick={()=>setTab("technical")}/>{p.categories.slice(0,4).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("technical")}><Code2/><span><b>{x.name}</b><small>{x.count} questions</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<Building2/>} title="Company Tags" link="View All" onClick={()=>setTab("company")}/>{p.companies.slice(0,4).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("company")}><span className="company-mark">{x.name[0]}</span><span><b>{x.name}</b><small>{x.count} questions</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<BrainCircuit/>} title="Topics in the Dataset" link="View All" onClick={()=>setTab("topic")}/>{(p.topics||[]).slice(0,4).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("topic")}><BrainCircuit/><span><b>{x.name}</b><small>{x.count} questions</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<ClipboardList/>} title="Mock Tests" link="View All" onClick={()=>setTab("mock")}/>{p.mockTests.slice(0,3).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("mock")}><ClipboardList/><span><b>{x.name}</b><small>{x.meta}</small></span><ChevronRight/></button>)}</Glass>
      </div>
    </div>
    {upcomingExpanded&&<DetailModal title="Upcoming Practice Sections" onClose={()=>setUpcomingExpanded(false)}>{p.mockTests.map((x,i)=><button className="previous-question-row" key={x.name} onClick={()=>{setUpcomingExpanded(false);setTab("mock")}}><b>{i+1}</b><span><strong>{x.name}</strong><br/>{x.meta}</span><ChevronRight/></button>)}</DetailModal>}
  </AppShell>
}

function ActivityPage({items,setTab,setPage}) {
  return <AppShell page="preparation" setPage={setPage}><PageTitle title="Recent Practice Activity" subtitle="Review your latest practice sessions and scores." action={<button className="secondary" onClick={()=>setTab("overview")}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back to Preparation</button>}/><Glass className="activity-page-card" role="region" aria-label="All recent practice activity" tabIndex={0}>{items.map((x,i)=><div className="activity-page-row" key={`${x[0]}-${i}`}><span className={`activity-icon activity-${i%3}`}><Check/></span><div><b>{x[0]}</b><small>{x[1]} difficulty · {x[2]} answer · {x[4]}{x[5]>0?` · ${formatDuration(x[5])}`:""}</small></div><strong>{x[3]}</strong></div>)}{!items.length&&<p>No answers submitted yet. Start an interview practice session to build your history.</p>}</Glass></AppShell>
}

function QuestionBank({title,subtitle,items,icon,setTab,setPage,company=false,filterType="category"}) {
  const [q,setQ]=useState(""); const [difficulty,setDifficulty]=useState(""); const [selectedFilter,setSelectedFilter]=useState(""); const [questions,setQuestions]=useState([]);
  useEffect(()=>{const params=new URLSearchParams();if(selectedFilter)params.set(filterType,selectedFilter);else if(filterType==="category")params.set("category","Technical");if(difficulty)params.set("difficulty",difficulty);api(`/interview/questions?${params}`).then(setQuestions).catch(()=>setQuestions([]))},[filterType,selectedFilter,difficulty]);
  const visible=questions.filter(row=>row.question.toLowerCase().includes(q.toLowerCase()));
  return <AppShell page="preparation" setPage={setPage}>
    <PageTitle title={title} subtitle={subtitle} action={<button className="secondary" onClick={()=>setTab("overview")}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back</button>}/>
    <Glass className="bank">
      <div className="search-row"><div className="searchbox"><Search size={19}/><input placeholder="Search questions..." value={q} onChange={e=>setQ(e.target.value)}/></div><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="">All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
      <div className="question-scroll-label browse-filter-label">{company?"Companies":"Topics"}<span>{items.length} available</span><small>Scroll to browse and select a filter</small>{selectedFilter&&<button className="clear-bank-filter" onClick={()=>setSelectedFilter("")}>Clear selection</button>}</div>
      <div className="bank-grid bank-filter-grid" role="region" aria-label={`${company?"Company":"Topic"} filters`} tabIndex={0}>{items.filter(x=>x.name.toLowerCase().includes(q.toLowerCase())).map(x=><button className={`bank-card ${selectedFilter===x.name?"is-selected":""}`} aria-pressed={selectedFilter===x.name} key={x.name} onClick={()=>setSelectedFilter(selectedFilter===x.name?"":x.name)}><div className="bank-icon">{company?<Building2/>:icon}</div><div><h3>{x.name}</h3><p>{x.count} questions</p></div><ArrowRight/></button>)}</div>
      <div className="question-scroll-label">Questions <span>{visible.length} shown</span><small>Scroll this list to browse questions</small></div>
      <div className="bank-grid bank-question-grid" role="region" aria-label={`${title} question list`} tabIndex={0}>{visible.map(row=><button className="bank-card" key={row.id} onClick={()=>{sessionStorage.setItem("cs-selected-question",row.question);setPage("interview")}}><div className="bank-icon">{company?<Building2/>:icon}</div><div><h3>{row.question}</h3><p>{row.category} · {row.difficulty}{row.company!=="General"?` · ${row.company}`:""}</p></div><ArrowRight/></button>)}</div>
      {!visible.length&&<p>No questions match these filters.</p>}
    </Glass>
  </AppShell>
}

function MockTests({tests,setTab,setPage}) {
  return <AppShell page="preparation" setPage={setPage}>
    <PageTitle title="Mock Tests" subtitle="Test yourself under realistic interview conditions." action={<button className="secondary" onClick={()=>setTab("overview")}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back</button>}/>
    <div className="mock-grid">{tests.map((x,i)=><Glass key={x.name}><div className="mock-icon"><ClipboardList/></div><h2>{x.name}</h2><p>{x.meta}</p><button className="primary wide" onClick={()=>setPage("interview")}>Start Practice <Play size={18}/></button></Glass>)}</div>
  </AppShell>
}

function ProgressPage({p,setPage,back}) {
  const [live,setLive]=useState(null);
  useEffect(()=>{api("/progress").then(setLive).catch(()=>{})},[]);
  const chart=live?.progress||[];
  const answerCount=live?.summary?.answers ?? 0;
  const score=live?.summary?.averageScore ?? 0;
  const averageTime=live?.summary?.averageTimeSeconds;
  return <AppShell page="progress" setPage={setPage} headerTitle="Your Progress" headerSubtitle="See how your preparation is improving over time." headerAction={<><div className="sticky-note"><Lightbulb/><span>Consistency today, success tomorrow.</span></div><button className="secondary back-prep" onClick={back||(()=>setPage("preparation"))}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back to Preparation</button></>}>
    <div className="progress-page page-fit">
      <div className="progress-grid progress-compact-grid">
        <Glass className="progress-chart-card"><CardHead icon={<BarChart3/>} title="Progress Overview"/><BigChart data={chart}/></Glass>
        <Glass className="summary-card"><CardHead icon={<Trophy/>} title="Practice Summary"/><div className="summary-list"><div><span className="summary-icon">▤</span><section><b>{answerCount}</b><span>Questions attempted</span></section></div><div><span className="summary-icon summary-green">◎</span><section><b>{score}%</b><span>Latest accuracy</span></section></div><div><span className="summary-icon summary-purple">◷</span><section><b>{formatDuration(averageTime)}</b><span>Avg. time / question</span></section></div></div></Glass>
      </div>
    </div>
  </AppShell>
}

function formatDuration(value) {
  if(value==null||!Number.isFinite(Number(value))) return "—";
  const seconds=Math.max(0,Math.round(Number(value)));
  return seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m ${String(seconds%60).padStart(2,"0")}s`;
}

function MiniChart({data}) { return <div className="mini-chart">{data.map(x=><div key={x.week}><div className="dot" style={{bottom:`${x.accuracy}%`}}/><div className="chart-line" style={{height:`${x.accuracy}%`}}/><span>{x.week.replace("Week ","W")}</span></div>)}</div> }
function BigChart({data}) {
  const max=100, w=760, h=330, left=46, top=28, bottom=40, usableH=h-top-bottom, usableW=w-left-20;
  const pts=data.map((x,i)=>({x:left+(usableW/(Math.max(1,data.length-1)))*i,y:top+usableH-(x.accuracy/max)*usableH,...x}));
  const path=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const area=`${path} L ${pts[pts.length-1]?.x||left},${h-bottom} L ${pts[0]?.x||left},${h-bottom} Z`;
  return <div className="big-chart animated-chart"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Weekly preparation accuracy graph" preserveAspectRatio="none"><defs><linearGradient id="progressFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6e83ff" stopOpacity=".34"/><stop offset="100%" stopColor="#6e83ff" stopOpacity=".03"/></linearGradient><linearGradient id="progressBars" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1f56c7"/><stop offset="100%" stopColor="#8fc5f5" stopOpacity=".38"/></linearGradient></defs>{[0,25,50,75,100].map(v=>{const y=top+usableH-(v/max)*usableH;return <g key={v}><line x1={left} x2={w-8} y1={y} y2={y} className="chart-grid-line"/><text x="4" y={y+5} className="chart-axis-label">{v}</text></g>})}<path d={area} fill="url(#progressFill)" className="chart-area-fill"/><path d={path} className="chart-trend-line" pathLength="100"/>{pts.map((p,i)=><g key={p.week} className="chart-data-point" style={{animationDelay:`${i*.18}s`}}><rect x={p.x-18} y={p.y} width="36" height={h-bottom-p.y} rx="18" fill="url(#progressBars)"/><circle cx={p.x} cy={p.y} r="7"/><rect x={p.x-29} y={p.y-39} width="58" height="25" rx="12" className="chart-label-bg"/><text x={p.x} y={p.y-22} textAnchor="middle" className="chart-value-label">{p.accuracy}%</text><text x={p.x} y={h-9} textAnchor="middle" className="chart-week-label">{p.week}</text></g>)}</svg></div>
}

function Interview({setPage}) {
  const bankQuestion=sessionStorage.getItem("cs-selected-question")||"";
  const [answer,setAnswer]=useState(""); const [started,setStarted]=useState(false); const [paused,setPaused]=useState(false); const [count,setCount]=useState(0); const [showPrevious,setShowPrevious]=useState(false); const [chatExpanded,setChatExpanded]=useState(false); const [ended,setEnded]=useState(false); const [selected,setSelected]=useState(1); const [seconds,setSeconds]=useState(0); const [feedback,setFeedback]=useState(""); const [questions,setQuestions]=useState([APP_DATA.interview.question,"Why do you want to work at this company?","What are your key strengths?","Explain a challenging project you worked on.","How do you approach debugging a difficult issue?","Describe a time you worked with a team.","What is one technical concept you recently learned?","How would you improve a slow application?","Tell me about a mistake and what you learned.","Where do you want to grow professionally?"]); const [questionLimit,setQuestionLimit]=useState("all");
  const questionTimer=useRef({elapsedMs:0,startedAt:null});
  const startQuestionClock=()=>{questionTimer.current.startedAt=performance.now()};
  const pauseQuestionClock=()=>{const clock=questionTimer.current;if(clock.startedAt!==null){clock.elapsedMs+=performance.now()-clock.startedAt;clock.startedAt=null}};
  const practiceQuestions=questionLimit==="all"?questions:questions.slice(0,Number(questionLimit));
  useEffect(()=>{api("/interview/questions").then(rows=>{if(rows.length){const list=rows.map(q=>q.question);setQuestions(bankQuestion?[bankQuestion,...list.filter(x=>x!==bankQuestion)]:list)}sessionStorage.removeItem("cs-selected-question")}).catch(()=>{})},[]);
  useEffect(()=>{if(!started||paused||ended)return;const id=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(id)},[started,paused,ended]);
  const fmt=n=>`${String(Math.floor(n/3600)).padStart(2,"0")}:${String(Math.floor(n/60)%60).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
  const send=async()=>{if(!answer.trim()||ended||!started||paused)return;const clock=questionTimer.current;const elapsedMs=clock.elapsedMs+(clock.startedAt===null?0:performance.now()-clock.startedAt);const time_taken_seconds=Math.max(.1,Math.round(elapsedMs/100)/10);try{const result=await api("/interview/answers",{method:"POST",body:JSON.stringify({question:practiceQuestions[selected-1],answer,time_taken_seconds})});setFeedback(`${result.score}% — ${result.feedback}`);setCount(c=>c+1);setAnswer("");if(selected>=practiceQuestions.length){questionTimer.current={elapsedMs:0,startedAt:null};setEnded(true);setStarted(false);setPaused(false)}else{setSelected(selected+1);questionTimer.current={elapsedMs:0,startedAt:performance.now()}}}catch(e){setFeedback(e.message)}};
  const stopInterview=()=>{pauseQuestionClock();setStarted(false);setPaused(false);setEnded(true);setFeedback("Interview stopped. Your submitted answers have been saved.")};
  const submitInterview=()=>{pauseQuestionClock();setStarted(false);setPaused(false);setEnded(true);setFeedback("Interview submitted. Your submitted answers have been saved.")};
  const restartInterview=()=>{setEnded(false);setStarted(true);setPaused(false);setSeconds(0);setCount(0);setSelected(1);setAnswer("");setFeedback("");questionTimer.current={elapsedMs:0,startedAt:performance.now()}};
  const choose=n=>{setSelected(n);questionTimer.current={elapsedMs:0,startedAt:started&&!paused?performance.now():null};};
  const togglePause=()=>{if(paused)startQuestionClock();else pauseQuestionClock();setPaused(v=>!v)};
  return <AppShell page="interview" setPage={setPage} headerTitle="Practice Interview" headerSubtitle="A realistic interview experience, tailored for you." headerAction={<div className="sticky-note"><Lightbulb/><span>Practice today, confidence tomorrow.</span></div>}>
    <div className={`interview-page page-fit ${chatExpanded?"chat-expanded":""}`}>
      <div className="interview-top-row">
        <Glass className="interview-progress-card"><CardHead icon={<BarChart3/>} title="Interview Progress"/><div className="interview-progress-inner"><ProgressRing value={Math.round(count/practiceQuestions.length*100)} size={112}/><div><p>Questions Attempted <b>{count}</b></p><p>Total Questions <b>{practiceQuestions.length}</b></p><p>Time Spent <b>{started?fmt(seconds):"—"}</b></p></div></div></Glass>
        <Glass className="current-session-card"><CardHead icon={<Clock3/>} title="Current Session"/><strong className="session-timer">{fmt(seconds)}</strong>{!started&&!ended&&<button className="primary wide" onClick={()=>{questionTimer.current={elapsedMs:0,startedAt:performance.now()};setStarted(true);setPaused(false)}}><Play size={18}/>Start Interview</button>}{started&&<><div className="session-running-label"><span className={paused?"paused-dot":"running-dot"}/>{paused?"Interview Paused":"Interview Running"}</div><div className="session-actions"><button className="secondary" onClick={togglePause}>{paused?<Play size={16}/>:<Pause size={16}/>} {paused?"Resume":"Pause"}</button><button className="danger" onClick={stopInterview}><Square size={15}/> Stop</button><button className="primary" onClick={submitInterview}><CheckCircle2 size={16}/> Submit</button></div></>}{ended&&<><p className="session-finished-label">{feedback.startsWith("Interview stopped")?"Interview stopped":"Interview submitted"}</p><button className="primary wide" onClick={restartInterview}><Play size={18}/>Restart Interview</button></>}</Glass>
        <Glass className="session-settings-card"><CardHead icon={<Settings2/>} title="Session Settings"/><label>Category<select><option>Resume-based</option><option>Technical</option><option>Behavioral</option></select></label><label>Difficulty<select><option>Medium</option><option>Easy</option><option>Hard</option></select></label><label>Interview Type<select><option>Technical</option><option>Behavioral</option><option>Mixed</option></select></label><label>Questions<select value={questionLimit} onChange={e=>{setQuestionLimit(e.target.value);setSelected(1);setCount(0);setEnded(false)}}><option value="all">All {questions.length} questions</option><option value="5">5 questions</option></select></label></Glass>
      </div>
      <div className="interview-bottom-row">
        <Glass className="interview-chat-card"><CardHead icon={<MessageSquare/>} title="Interview Chat" link={chatExpanded?"Back to dashboard":"Expand chat"} onClick={()=>setChatExpanded(v=>!v)}/><div className="interview-chat-scroll"><div className="interview-message"><span className="ai-badge">Guide</span><div><b>Practice prompt</b><p>Take your time. Include the context, your actions, and the result.</p></div></div><div className="interview-message"><span className="ai-badge">Q</span><div><b>{started?`Question ${selected}:`:"Here’s your first question:"}</b><p>{practiceQuestions[selected-1]}</p>{feedback&&<small>{feedback}</small>}</div></div>{count>0&&<div className="interview-message user-message"><span className="ai-badge">You</span><div><b>Answer submitted</b><p>Your response has been added to this practice session.</p></div></div>}</div><div className="interview-answer"><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder={paused?"Resume the interview to submit an answer...":"Type your answer here..."} disabled={!started||paused||ended}/><button className="record-button" title="Voice answers are not enabled in this MVP" onClick={()=>setFeedback("Voice recording is not enabled in this MVP. Type your answer to continue.")}><Mic/></button><button className="send" onClick={send} disabled={!started||paused||ended||!answer.trim()} aria-label="Submit answer"><Send/></button></div></Glass>
        <div className="interview-right-stack"><Glass className="question-navigator"><CardHead icon={<FileText/>} title="Question Navigator"/><div className="question-number-grid">{practiceQuestions.map((_,i)=><button key={i} className={`${selected===i+1?"current":""} ${i<count?"attempted":""}`} onClick={()=>choose(i+1)}>{i+1}</button>)}</div><div className="question-legend"><span><i className="legend-current"/>Current</span><span><i/>Not Attempted</span><span><i className="legend-attempted"/>Attempted</span><span><i className="legend-skipped"/>Skipped</span></div></Glass>
          <Glass className="previous-questions"><CardHead icon={<Clock3/>} title="Previous Questions" link="View All" onClick={()=>setShowPrevious(true)}/>{practiceQuestions.slice(0,4).map((q,i)=><button className="previous-question-row" key={q} onClick={()=>choose(i+1)}><b>{i+1}</b><span>{q}</span><ChevronRight/></button>)}</Glass>
        </div>
      </div>
    </div>
    {showPrevious&&<DetailModal title="All Interview Questions" onClose={()=>setShowPrevious(false)}>{practiceQuestions.map((q,i)=><button className="previous-question-row" key={q} onClick={()=>{choose(i+1);setShowPrevious(false)}}><b>{i+1}</b><span>{q}</span><ChevronRight/></button>)}</DetailModal>}
  </AppShell>
}

function KeyboardIcon(){return <span style={{fontSize:16}}>⌨</span>}

function Profile({setPage}) {
  const [linkedin,setLinkedin]=useState(null); const [linkedinError,setLinkedinError]=useState(""); const [linkedinBusy,setLinkedinBusy]=useState(false);
  useEffect(()=>{api("/linkedin/status").then(setLinkedin).catch(e=>setLinkedinError(e.message));const result=new URLSearchParams(location.search).get("linkedin");if(result){setLinkedinError(result==="connected"?"LinkedIn profile connected successfully.":result==="cancelled"?"LinkedIn connection was cancelled.":"LinkedIn could not connect. Check the app setup and try again.");history.replaceState({},"",location.pathname)}},[]);
  const connect=async()=>{setLinkedinBusy(true);setLinkedinError("");try{const response=await api("/linkedin/connect",{method:"POST"});window.location.assign(response.authorizationUrl)}catch(e){setLinkedinError(e.message);setLinkedinBusy(false)}};
  const disconnect=async()=>{setLinkedinBusy(true);try{await api("/linkedin/disconnect");setLinkedin(v=>({...v,connected:false,profile:null}))}catch(e){setLinkedinError(e.message)}finally{setLinkedinBusy(false)}};
  const profile=linkedin?.profile;
  return <AppShell page="profile" setPage={setPage}>
    <PageTitle title="Profile" subtitle="Manage your account and connected career tools."/>
    <div className="profile-integrations">
      <Glass className="profile-card"><Logo/><h2>{currentName()}</h2><p>{currentAccount()?.email || APP_DATA.user.email}</p><p>{currentAccount()?.phone || APP_DATA.user.phone}</p><button className="secondary" onClick={logoutCurrentSession}>Log out</button></Glass>
      <Glass className="linkedin-card">
        <div className="linkedin-card-top"><div className="linkedin-brand-icon"><Linkedin size={24}/></div><div><span className="linkedin-eyebrow">PROFILE CONNECTION</span><h2>LinkedIn</h2></div><span className={`linkedin-status ${linkedin?.connected?"is-connected":""}`}><i/>{linkedin?.connected?"Connected":linkedin?"Not connected":"Checking status"}</span></div>
        <p className="linkedin-intro">Bring your professional profile into CareerSage and use LinkedIn job posts as references for tailored matching.</p>
        {profile?<div className="linkedin-connected-profile">{profile.picture?<img src={profile.picture} alt=""/>:<div className="linkedin-avatar-fallback"><CircleUserRound size={25}/></div>}<div><b>{profile.name||"LinkedIn member"}</b>{profile.email&&<span>{profile.email}</span>}<span className="linkedin-profile-caption">Profile details shared with CareerSage</span></div></div>:<div className="linkedin-empty-state"><div className="linkedin-empty-icon"><CircleUserRound size={25}/></div><div><b>{linkedin?"Connect your professional profile":"Checking LinkedIn connection"}</b><span>{linkedin?"You’ll approve access on LinkedIn before any profile details are imported.":"Your connection status will appear here shortly."}</span></div></div>}
        <div className="linkedin-benefits"><div><Check size={16}/><span>Import your authorized name, photo, and email</span></div><div><Check size={16}/><span>Keep your resume and company/job matches in CareerSage</span></div></div>
        {linkedinError&&<div className={linkedinError.includes("successfully")?"linkedin-notice":"form-error"} role="status">{linkedinError}</div>}
        {linkedin?.configured===false&&<div className="linkedin-setup-hint"><b>Connection setup needed</b><span>This app needs its LinkedIn Developer credentials and approved callback URL configured before you can connect.</span></div>}
        <div className="linkedin-actions"><button className="primary linkedin-connect-button" disabled={linkedinBusy||!linkedin?.configured} onClick={linkedin?.connected?disconnect:connect}>{linkedinBusy?"Please wait…":linkedin?.connected?"Disconnect LinkedIn":"Connect LinkedIn"}<Linkedin size={17}/></button>{linkedin?.connected&&<button className="secondary" disabled={linkedinBusy} onClick={connect}>Reconnect</button>}</div>
        <div className="linkedin-jobs-bridge"><div><b>Found a role on LinkedIn?</b><span>Paste the job description and link to compare it with your latest resume.</span></div><button onClick={()=>setPage("resume")}>Match a job <ArrowRight size={16}/></button></div>
        <div className="linkedin-privacy"><ShieldCheck size={17}/><span>You approve LinkedIn sign-in. CareerSage stores only the basic profile details LinkedIn returns; it does not store your LinkedIn password or access token. Job listings are not scraped.</span></div>
      </Glass>
    </div>
  </AppShell>
}

function App(){
 const [page,setPage]=useState("landing"); const [signedIn,setSignedIn]=useState(false); const [ready,setReady]=useState(false);
 useEffect(()=>{if(localStorage.getItem("cs-token")){api("/auth/me").then(async({user})=>{localStorage.setItem("cs-user",JSON.stringify(user));APP_DATA.user={name:user.username,email:user.email,phone:user.phone};setSignedIn(true);try{const r=await api("/resumes/latest/analysis");APP_DATA.resume={...APP_DATA.resume,...r.analysis,fileName:r.fileName,roleAlignment:r.analysis.roleAlignmentList};applyDashboard(await api("/dashboard"));setPage(new URLSearchParams(location.search).has("linkedin")?"profile":"home")}catch{setPage("upload")}}).catch(()=>{clearSession();setSignedIn(false)}).finally(()=>setReady(true))}else setReady(true)},[]);
 const onAuth=account=>{APP_DATA.user.name=account.username;APP_DATA.user.email=account.email;APP_DATA.user.phone=account.phone;setSignedIn(true);api("/dashboard").then(applyDashboard).catch(()=>{});api("/progress").then(applyProgress).catch(()=>{});api("/resumes/latest/analysis").then(r=>{APP_DATA.resume={...APP_DATA.resume,...r.analysis,fileName:r.fileName,roleAlignment:r.analysis.roleAlignmentList};setPage("home")}).catch(()=>setPage("upload"));};
 if(!ready)return <div className="public-page"><p>Connecting to CareerSage…</p></div>;
 if(page==="landing") return <Landing go={()=>setPage("login")}/>;
 if(page==="login") return <Login goCreate={()=>setPage("create")} onLogin={onAuth} goLanding={()=>setPage("landing")}/>;
 if(page==="create") return <CreateAccount goLogin={()=>setPage("login")} onCreate={onAuth}/>;
 if(page==="upload") return signedIn?<ResumeUpload setPage={setPage}/>:<Landing go={()=>setPage("login")}/>;
 if(page==="analyzing") return <Analyzing setPage={setPage}/>;
 if(page==="done") return <Done setPage={setPage}/>;
 if(!signedIn && !["landing","login","create"].includes(page)) return <Landing go={()=>setPage("login")}/>;
 if(page==="home") return <Dashboard setPage={setPage}/>;
 if(page==="resume") return <ResumeAnalysis setPage={setPage}/>;
 if(page==="preparation") return <Preparation setPage={setPage}/>;
 if(page==="interview") return <Interview setPage={setPage}/>;
 if(page==="progress") return <ProgressPage p={APP_DATA.preparation} setPage={setPage} back={()=>setPage("preparation")}/>;
 if(page==="profile") return <Profile setPage={setPage}/>;
 return <Landing go={()=>setPage("login")}/>;
}
createRoot(document.getElementById("root")).render(<App/>);
