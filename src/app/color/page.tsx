import Header from "~/components/sections/header";

const ColorTest = () => {
  return (
    <>
      <Header />
      <div className="flex h-screen items-center justify-center gap-2">
        <div className="flex h-20 items-center justify-center rounded-md bg-primary p-4 text-primary-foreground">
          text-primary-foreground bg-primary
        </div>
        <div className="flex h-20 items-center justify-center rounded-md bg-background p-4 text-foreground">
          text-foreground bg-background
        </div>
        <div className="flex h-20 items-center justify-center rounded-md bg-secondary p-4 text-secondary-foreground">
          text-secondary-foreground bg-secondary
        </div>
        <div className="flex h-20 items-center justify-center rounded-md bg-border p-4 text-foreground">
          text-foreground bg-border
        </div>
      </div>
    </>
  );
};

export default ColorTest;
