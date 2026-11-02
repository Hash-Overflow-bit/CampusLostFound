import React, { useState, useCallback } from "react";
import "./herosection.css";
import SEO from "../seo/SEO";
import { useAuth } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import ReportItemForm from "../reportForm/ReportItemForm";
import { authValidationUtils } from "../../utils/authValidation";
import ItemsList from "../items/ItemsList";
import LogoLoop from "../../animation/LogoLoop";
import PuLogo from "../../assets/Pu.png";
import NustLogo from "../../assets/Nust.png";
import FastLogo from "../../assets/Fast.png";
import UetLogo from "../../assets/UET.png";
import ComsatsLogo from "../../assets/Comsats.png";
import IbaLogo from "../../assets/IBA.png";
import QauLogo from "../../assets/QAU.png";
import GikiLogo from "../../assets/giki.png";
import UmtLogo from "../../assets/UMT.png";

const universityLogos=[PuLogo,NustLogo,FastLogo,UetLogo,ComsatsLogo,IbaLogo,QauLogo,GikiLogo,UmtLogo].map((src,i)=>({src,alt:`Partner campus ${i+1}`}));

const Herosection=React.memo(()=>{
 const [showReportForm,setShowReportForm]=useState(false); const [searchValue,setSearchValue]=useState("");
 const {user,isAuthenticated,isEmailVerified}=useAuth(); const navigate=useNavigate();
 const handleReportItemClick=useCallback(()=>{if(showReportForm){setShowReportForm(false);return;}const validation=authValidationUtils.validateReportAccess(user,isAuthenticated,isEmailVerified);if(isAuthenticated&&user&&user.uid&&isEmailVerified){setShowReportForm(true);return;}if(!validation.canReport){validation.errors.forEach(error=>{if(error.action==="redirect_login"&&!isAuthenticated)navigate("/login",{state:{message:error.message,from:"report-item",redirectTo:"/"}});else if(error.action==="show_alert")alert(error.message);});return;}setShowReportForm(true);},[user,isAuthenticated,isEmailVerified,navigate,showReportForm]);
 const browse=()=>document.querySelector(".items-list-container")?.scrollIntoView({behavior:"smooth",block:"start"});
 return <>
  <SEO title="Campus Lost Found | Find what matters" description="A student-first lost and found network for university campuses." url="https://campus-lost-found-lac.vercel.app/" />
  <main className="clf-home">
   <section className="clf-hero">
    <div className="clf-doodle clf-doodle-one">↝</div><div className="clf-doodle clf-doodle-two">✦</div>
    <div className="clf-hero-copy">
     <div className="clf-eyebrow"><span>●</span> Built for university communities</div>
     <h1>Lost something?<br/><span>Your campus can help</span><br/>bring it back.</h1>
     <p>A friendly lost-and-found network where verified students report, discover and reunite with the things that matter.</p>
     <div className="clf-hero-actions">
      <button className="clf-primary" onClick={handleReportItemClick}>{showReportForm?"Close report":"Report lost item"}<span>↗</span></button>
      <button className="clf-secondary" onClick={browse}>I found something <span>→</span></button>
     </div>
     <div className="clf-trust"><div className="clf-faces"><span>H</span><span>A</span><span>M</span></div><strong>Students helping students</strong><small> · private campus network</small></div>
    </div>
    <div className="clf-hero-art" aria-hidden="true">
      <div className="clf-art-card clf-art-lost"><span className="clf-art-label">LOST</span><div className="clf-object">🎧</div><strong>Headphones</strong><small>Library · 2h ago</small></div>
      <div className="clf-art-card clf-art-found"><span className="clf-art-label">FOUND</span><div className="clf-object">🔑</div><strong>Keys</strong><small>Block C · today</small></div>
      <div className="clf-match-pill">✦ possible match <b>86%</b></div>
    </div>
    <div className="clf-clouds"><i></i><i></i><i></i><i></i><i></i></div>
   </section>

   <section className="clf-stats">
    <div><b>43+</b><span>campuses</span></div><div><b>18</b><span>items migrated</span></div><div><b>100%</b><span>student focused</span></div><div><b>Free</b><span>for students</span></div>
   </section>

   <section className="clf-how">
    <div className="clf-section-copy"><span className="clf-kicker">Simple by design</span><h2>From “oh no” to<br/><em>found it.</em></h2><p>Report in minutes. We keep sensitive details private and surface useful campus matches.</p></div>
    <div className="clf-steps"><article><b>01</b><div>✎</div><h3>Report it</h3><p>Add a photo, public location and a few useful details.</p></article><article><b>02</b><div>✦</div><h3>Get matches</h3><p>Our campus-scoped matching system compares lost and found reports.</p></article><article><b>03</b><div>✓</div><h3>Reconnect</h3><p>Verify ownership safely, then arrange the return.</p></article></div>
   </section>

   <section className="clf-search-zone">
    <div><span className="clf-kicker">Happening on campus</span><h2>See what students<br/>have reported.</h2></div>
    <label className="clf-search"><span>⌕</span><input value={searchValue} onChange={e=>setSearchValue(e.target.value)} placeholder="Search items by title" /></label>
   </section>
  </main>

  <section className="clf-logo-strip"><p>Connecting students across Pakistani universities</p><div className="clf-logo-loop"><LogoLoop logos={universityLogos} speed={80} direction="left" logoHeight={42} gap={48} pauseOnHover scaleOnHover fadeOut fadeOutColor="#fffbd7" ariaLabel="Pakistani universities"/></div></section>
  {showReportForm&&<section className="report-form-section"><ReportItemForm onClose={()=>setShowReportForm(false)} onSubmit={()=>setShowReportForm(false)}/></section>}
  <ItemsList searchQuery={searchValue}/>
 </>;
});
Herosection.displayName="Herosection"; export default Herosection;
