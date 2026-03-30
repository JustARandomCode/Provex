import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { AboutPage } from './pages/AboutPage'
import { CodingArenaPage } from './pages/CodingArenaPage'
import { CodeEditorPage } from './pages/CodeEditorPage'
import { StudyPlatformPage } from './pages/StudyPlatformPage'
import { LessonPage } from './pages/LessonPage'
import { QuizPage } from './pages/QuizPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/coding" element={<CodingArenaPage />} />
        <Route path="/coding/editor" element={<CodeEditorPage />} />
        <Route path="/study" element={<StudyPlatformPage />} />
        <Route path="/study/lesson" element={<LessonPage />} />
        <Route path="/study/quiz" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
