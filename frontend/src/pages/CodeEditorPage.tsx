import { Navbar } from '../components/layout/Navbar'
import { ProblemSidebar } from '../components/coding/ProblemSidebar'
import { CodeEditorPanel } from '../components/coding/CodeEditorPanel'
import { HintsPanel } from '../components/coding/HintsPanel'

export function CodeEditorPage() {
  return (
    <div className="h-screen flex flex-col bg-base">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 flex-shrink-0 overflow-hidden">
          <ProblemSidebar />
        </div>

        <div className="flex-1 overflow-hidden">
          <CodeEditorPanel />
        </div>

        <div className="w-72 flex-shrink-0 overflow-hidden">
          <HintsPanel />
        </div>
      </div>
    </div>
  )
}
