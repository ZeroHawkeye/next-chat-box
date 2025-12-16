import { Outlet } from "@tanstack/react-router"
import { AppLayout } from "@/components/layout"
import "@/styles/globals.css"

function App() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default App
