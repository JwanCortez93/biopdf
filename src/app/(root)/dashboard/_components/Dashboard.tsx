import { File } from "@prisma/client";
import { Ghost } from "lucide-react";
import PDFCard from "./PDFCard";
import UploadButton from "./UploadButton";

const Dashboard = ({ files }: { files: File[] | undefined }) => {
  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-muted pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-secondary-foreground">
          My files
        </h1>
        <UploadButton />
      </div>
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-secondary-foreground md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-secondary-foreground rounded-lg bg-secondary shadow transition hover:shadow-lg"
              >
                <PDFCard file={file} />
              </li>
            ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center text-secondary-foreground gap-2">
          <Ghost className="h-8 w-8 " />
          <h3 className="font-semibold text-xl">You have no files yet.</h3>
          <p>Let&apos;s upload your first PDF</p>
        </div>
      )}
      <div className=""></div>
    </main>
  );
};

export default Dashboard;
