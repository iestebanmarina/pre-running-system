import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import ExerciseCatalog from './pages/ExerciseCatalog'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/assessment" replace />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/exercises" element={<ExerciseCatalog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
