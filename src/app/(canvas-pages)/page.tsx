import Canvas from "@/components/canvas";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className=" items-center justify-items-center min-h-screen gap-16 ">
      <Header />
      <Canvas />
    </div>
  );
}
