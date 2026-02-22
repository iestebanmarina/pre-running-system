import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
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
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
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
