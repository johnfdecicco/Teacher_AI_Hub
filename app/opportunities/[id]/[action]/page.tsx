import { notFound, redirect } from "next/navigation";
import { recommendations } from "@/lib/opportunities";
import { OpportunityPreview } from "@/components/opportunity-preview";
import { SimulationTemplatePending } from "@/components/simulations/template-pending";

export function generateStaticParams() {
  return recommendations.flatMap(item => ["learn", "build"].map(action => ({ id: item.id, action })));
}

export default async function Page({ params }: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await params;
  const recommendation = recommendations.find(item => item.id === id);
  if (!recommendation || (action !== "learn" && action !== "build")) notFound();
  if (recommendation.category === "Simulation") {
    if (recommendation.id === "investment-committee") redirect("/studio/investment-committee");
    if (action === "learn") redirect(`/opportunities/${id}/build`);
    return <SimulationTemplatePending recommendation={recommendation} />;
  }
  return <OpportunityPreview recommendation={recommendation} action={action} />;
}
