import { redirect } from "next/navigation";
import { getFileById } from "../../_actions/file.actions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import PDFRenderer from "../_components/PDFRenderer";
import ChatWrapper from "../_components/ChatWrapper";

const FilePage = async ({ params }: { params: { fileId: string } }) => {
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect(`auth-callback?origin=dashboard/${fileId}`);

  const file = await getFileById({ fileId, userId: user.id });

  if (!file) {
    redirect("/not-found?origin=dashboard&type=file");
  }

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:flex xl:pl-6">
            <PDFRenderer />
          </div>
        </div>
        <div className="shrink-0 flex-[0.75] border-t border-muted-foreground lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

export default FilePage;
