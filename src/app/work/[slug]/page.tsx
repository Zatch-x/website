import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudyProjects, getProject } from "@/data/portfolio";
import { site } from "@/data/site";
import CaseStudy from "@/components/work/CaseStudy";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return caseStudyProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case study · ${site.name}`,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = caseStudyProjects.findIndex((p) => p.slug === project.slug);
  const next = caseStudyProjects[(index + 1) % caseStudyProjects.length];

  return <CaseStudy project={project} index={index} total={caseStudyProjects.length} next={next} />;
}
