import UploadButton from "./UploadButton";

const Dashboard = () => {
  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-muted pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-secondary-foreground">
          My files
        </h1>
        <UploadButton />
      </div>
      <div className=""></div>
    </main>
  );
};

export default Dashboard;
