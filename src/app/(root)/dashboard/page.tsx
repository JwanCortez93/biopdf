import { findUser } from "@/app/(auth)/_actions/user.actions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getFiles } from "../_actions/file.actions";
import Dashboard from "./_components/Dashboard";

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await findUser(user.id);

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const files = await getFiles(dbUser.id);

  return <Dashboard files={files} />;
};

export default DashboardPage;
