"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icon";
const navigation = [["/dashboard", "Dashboard", "grid"], ["/courses", "My Courses", "book"], ["/diagnosis", "Course Diagnosis", "scan"], ["/opportunities", "AI Opportunities", "bulb"], ["/studio", "Creation Studio", "studio"], ["/projects", "My Projects", "folder"]];
export function AppShell({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const [open, setOpen] = useState(false);
 const title = navigation.find(([href]) => href === pathname || pathname.startsWith(href + "/"))?.[1] || "Teacher Hub AI";
 return <div className="app-shell"><a className="skip-link" href="#main">Skip to content</a>
 {open && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
 <aside className={`sidebar ${open ? "is-open" : ""}`}><Link href="/dashboard" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><Icon name="spark" size={25} /></span><span>teacher hub<span className="brand-ai">AI</span><small>Inspired teaching. New possibilities.</small></span></Link><div className="workspace-label">YOUR WORKSPACE</div><nav aria-label="Main navigation">{navigation.map(([href, label, icon]) => <Link key={href} href={href} className={`nav-link ${(pathname === href || pathname.startsWith(href + "/")) ? "active" : ""}`} aria-current={(pathname === href || pathname.startsWith(href + "/")) ? "page" : undefined} onClick={() => setOpen(false)}><Icon name={icon} />{label}{(pathname === href || pathname.startsWith(href + "/")) && <span className="active-dot" />}</Link>)}</nav><div className="sidebar-bottom"><div className="sidebar-note"><Icon name="spark" /><h3>Great teaching starts<br />with curiosity.</h3><p>Explore what AI could make possible in your classroom.</p><Link href="/diagnosis">Take the first step <Icon name="arrow" size={16} /></Link></div><div className="workspace-profile"><span className="avatar">P</span><span>Professor workspace<small>Local demonstration</small></span></div></div></aside>
 <div className="workspace"><header className="topbar"><div className="topbar-title"><button className="mobile-menu icon-button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name="menu" /></button><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div><div className="topbar-right"><span className="preview-label"><span /> Platform preview</span><span className="avatar light">P</span></div></header><main id="main" className="main-content" tabIndex={-1}>{children}</main><footer className="footer"><span>Thoughtfully built for the way you teach.</span><span>Teacher Hub AI · Early preview</span></footer></div></div>;
}

