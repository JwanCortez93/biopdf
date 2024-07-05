import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { createUser, findUser } from "../_actions/user.actions";

const AuthCallbackPage = async ({
  searchParams,
}: {
  searchParams: { origin?: string };
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    redirect("/");
  }

  let userDB = await findUser(user.id);

  if (!userDB) {
    userDB = await createUser({ email: user.email, id: user.id });
  }

  redirect(searchParams.origin ? `/${searchParams.origin}` : "/dashboard");
};

export default AuthCallbackPage;
