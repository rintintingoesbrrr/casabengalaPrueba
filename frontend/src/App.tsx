import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero        from "./components/Hero";
import EventInfo   from "./components/EventInfo";
import Registration from "./components/Registration";

// ─── Home page (Hero + EventInfo with Gallery inside) ────────────────────────
function Home() {
  return (
    <div className="app-scroll-container" style={{ height: "100vh", overflowY: "scroll" }}>
      <Hero />
      <EventInfo />
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/registro"  element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}