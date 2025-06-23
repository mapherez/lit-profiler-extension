import { useEffect, useState } from 'react'

// Chrome typings are not included
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any

type Mode = 'auto' | 'force-on' | 'force-off'

export function DevModeToggle() {
  const [mode, setMode] = useState<Mode>('auto')

  useEffect(() => {
    chrome?.storage?.local.get(['devMode']).then((result: { devMode?: Mode }) => {
      if (result?.devMode) {
        setMode(result.devMode)
      }
    })
  }, [])

  useEffect(() => {
    chrome?.storage?.local.set({ devMode: mode }).catch(() => {})
    document.body.dataset.mode = mode
  }, [mode])

  return (
    <div className="dev-mode-toggle">
      <label>
        Mode:
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="auto">Auto</option>
          <option value="force-on">Force On</option>
          <option value="force-off">Force Off</option>
        </select>
      </label>
    </div>
  )
}

export default DevModeToggle
