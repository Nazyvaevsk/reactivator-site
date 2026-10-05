import PagesHeader from "../PagesHeader";
import KnowledgeBackground from "./KnowledgeBackground";
import styles from "./KnowledgeHero.module.css";

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell + " text-white"}>
      <KnowledgeBackground />
      <PagesHeader />
      {children}
    </div>
  );
}
