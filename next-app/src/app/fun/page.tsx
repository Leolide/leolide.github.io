import { Navbar } from "@/components/layout/Navbar";
import Fun3DClient from "./fun3d/Fun3DClient";

export const metadata = {
  title: "Fun | Lide Li",
  description:
    "Lide's story outside of work: architecture, stickers, community, and more.",
};

export default function FunStoryPage() {
  return (
    <>
      {/* 手写字体 + 中日字体：3D 故事页专用，只在这里加载 */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Mansalva&family=Cormorant+Upright:wght@400;500;600&family=Chiron+GoRound+TC:wght@300;400;500;700&family=Permanent+Marker&family=Liu+Jian+Mao+Cao&display=swap"
      />
      {/* Navbar stays put through loading and page transitions */}
      <Navbar variant="overlay" />
      <Fun3DClient />
    </>
  );
}
