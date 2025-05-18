import { BrowserRouter, Route, Routes, } from "react-router-dom";

//Pages;
import Homepage from "./pages/homepage/Homepage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
