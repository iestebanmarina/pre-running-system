import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import ExerciseCatalog from './pages/ExerciseCatalog'
import ExerciseTest from './pages/ExerciseTest'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/assessment" replace />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exercises" element={<ExerciseCatalog />} />
        <Route path="/test-exercises" element={<ExerciseTest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
