import ProjectLayoutShell from "@/components/dashboard/ProjectLayoutShell";
import { requireOwnedProject } from "@/lib/projects";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project } = await requireOwnedProject(id);

  return (
    <ProjectLayoutShell projectId={project.id} projectSlug={project.slug}>
      {children}
    </ProjectLayoutShell>
  );
}
