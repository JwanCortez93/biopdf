import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";

const NotFoundPage = ({
  searchParams,
}: {
  searchParams: { origin?: string; type?: "file" };
}) => {
  const { origin, type } = searchParams;

  return (
    <div className="w-full min-h-screen absolute top-0 z-10  text-primary flex flex-col justify-center items-center gap-6">
      <div className="w-full flex-center gap-4">
        <Frown className="w-20 h-20" />
        <h1 className="text-7xl font-medium">Oops!</h1>
      </div>
      <p className="text-2xl">
        {type === "file"
          ? "The file is not in our database"
          : "There was an unexpected problem, please try again later"}
      </p>
      <Link href={`/${origin}`}>
        <Button>Go back to {origin}</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
