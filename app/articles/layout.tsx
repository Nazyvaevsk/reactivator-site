import PagesHeader from "../PagesHeader";
export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <div className="relative min-h-screen bg-black text-white"><PagesHeader />{children}</div>;
}
