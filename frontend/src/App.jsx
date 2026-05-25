import  { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <>
       <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#4F46E5", secondary: "#fff" } },
        }}
      />
       <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default App;
