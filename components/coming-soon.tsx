import Link from "next/link";
import { Icon } from "./icon";
export function ComingSoon({ title, description, icon }: { title: string; description: string; icon: string }) {
 return <><div className="page-heading"><div><p className="eyebrow">YOUR TEACHING WORKSPACE</p><h1>{title}</h1><p>{description}</p></div></div><section className="empty-state"><span className="empty-icon"><Icon name={icon} size={34} /></span><span className="badge">Coming soon</span><h2>A little more possibility is on the way.</h2><p>This part of Teacher Hub AI is still taking shape. For now, add your course information and explore a sample diagnosis preview.</p><Link href="/diagnosis" className="button primary">Diagnose a Course <Icon name="arrow" size={17} /></Link><Link href="/dashboard" className="text-link">Back to Dashboard</Link></section></>;
}
