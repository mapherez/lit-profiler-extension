import DevModeToggle from './components/DevModeToggle'
import ComponentTree from './components/ComponentTree'
import './App.css'

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Lit Profiler</h1>
        <DevModeToggle />
      </header>
      <ComponentTree />
    </div>
  )
}
