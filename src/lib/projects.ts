import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireOwnedProject(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dashboard");
  }

  const { data: project } = await supabase
    .from("invitations")
    .select("id, slug, user_id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    redirect("/dashboard");
  }

  return { user, project };
}
