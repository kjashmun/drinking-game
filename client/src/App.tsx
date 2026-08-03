import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './routes/Home'
import Display from './routes/Display'
import Controller from './routes/Controller'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/display" element={<Display />} />
        <Route path="/controller" element={<Controller />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
