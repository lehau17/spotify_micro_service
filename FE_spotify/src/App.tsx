import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { GlobalProvider } from "./globalContext/GlobalContext";
import useRoutesElements from "./routes/useRoutesElements";
import { ToastContainer } from "react-toastify";

function App() {
  const queryClient = new QueryClient();

  const routesElements = useRoutesElements();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        {routesElements}
        <ToastContainer />
      </GlobalProvider>
    </QueryClientProvider>
  );
}

export default App;
