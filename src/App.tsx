import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { MissionProvider } from './context/MissionContext'
import { GrainOverlay } from './components/layout/GrainOverlay'
import { SceneTransition } from './components/layout/SceneTransition'
import { RequireStep } from './routes/RequireStep'
import { Briefing } from './pages/Briefing'
import { Landing } from './pages/Landing'
import { Planner } from './pages/Planner'
import { SelectCrew } from './pages/SelectCrew'
import { SelectOperation } from './pages/SelectOperation'

export default function App() {
  const location = useLocation()

  return (
    <MissionProvider>
      <GrainOverlay />
      <SceneTransition key={location.pathname} />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/operation" element={<SelectOperation />} />
        <Route path="/location" element={<Navigate to="/operation" replace />} />

        <Route
          path="/planner"
          element={
            <RequireStep when={(m) => Boolean(m.operation && m.location)} fallback="/operation">
              <Planner />
            </RequireStep>
          }
        />

        <Route
          path="/crew"
          element={
            <RequireStep when={(m) => Boolean(m.location)} fallback="/operation">
              <SelectCrew />
            </RequireStep>
          }
        />

        <Route
          path="/briefing"
          element={
            <RequireStep when={(m) => m.crew.length > 0} fallback="/crew">
              <Briefing />
            </RequireStep>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MissionProvider>
  )
}