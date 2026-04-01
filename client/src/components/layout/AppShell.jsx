import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../common/CartDrawer";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Header />
      <CartDrawer />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
