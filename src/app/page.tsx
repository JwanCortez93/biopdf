import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user) redirect("/dashboard");
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex-center flex-col text-center">
        <div className="mx-auto mb-4 flex-center max-w-fit space-x-2 overflow-hidden rounded-full border border-gray-200 bg-background px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-background/50">
          <p className="text-sm font-semibold text-gray-700">
            BioPDF is now public!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chat with your <span className="text-primary">documents</span> in
          seconds.
        </h1>
        <p className="mt-5 max-w-prose text-primary-foreground sm:text-lg">
          BioPDF allows you to have conversation with any PDF document. Simply
          upload your file and start asking questions right away.
        </p>
        <Link href={"/dashboard"} target="_blank">
          <Button size={"lg"} className="mt-5">
            Get started! <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </MaxWidthWrapper>
      <div>
        <div>
          <div className="mx-auto max-w-6xl px-6 lg:px-8 mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-white p-2 ring-1 ring-inset ring-primary lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src={"/app-preview.jpg"}
                width={1364}
                height={866}
                alt="Preview"
                quality={100}
                className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto my-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-muted-foreground sm:text-5xl">
              Start chatting in minutes
            </h2>
            <p className="mt-4 text-lg text-muted">
              Chatting to your PDF files has never been easier
            </p>
          </div>
        </div>
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 1</span>
              <span className="text-xl font-semibold">
                {" "}
                Sign up for an account
              </span>
              <span className="mt-2 text-muted">
                Either starting out with a free plan or choose our{" "}
                <Link
                  className="text-primary underline underline-offset-2"
                  href={"/pricing"}
                >
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 2</span>
              <span className="text-xl font-semibold">
                {" "}
                Upload your PDF file
              </span>
              <span className="mt-2 text-muted">
                We&apos;ll process your file and make it ready for you to chat
                with.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 3</span>
              <span className="text-xl font-semibold">
                {" "}
                Start asking questions
              </span>
              <span className="mt-2 text-muted">
                It&apos;s that simple. Try out BioPDF today - it really takes
                less than a minute.
              </span>
            </div>
          </li>
        </ol>
        <div>
          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8 mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-white p-2 ring-1 ring-inset ring-primary lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src={"/upload-preview.jpg"}
                  width={1419}
                  height={732}
                  alt="Uploading Preview"
                  quality={100}
                  className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
