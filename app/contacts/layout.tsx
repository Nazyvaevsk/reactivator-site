import PagesHeader from "../PagesHeader";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PagesHeader />
      {children}
    </>
  );
}
