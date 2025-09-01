import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <main className="bg-[var(--theme-color-8)] h-full">
      <Navbar />
      {children}
    </main>
  );
}
