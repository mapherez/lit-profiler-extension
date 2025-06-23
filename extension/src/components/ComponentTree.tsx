import { useEffect, useState } from 'react'

interface NodeInfo {
  id: number
  tag: string
  isLit: boolean
  element: Element
  updated: boolean
}

function getInitialNodes(): NodeInfo[] {
  const elements = Array.from(document.body.querySelectorAll('*'))
  return elements.map((el, i) => ({
    id: i,
    tag: el.tagName.toLowerCase(),
    isLit: el.tagName.includes('-'),
    element: el,
    updated: false,
  }))
}

export default function ComponentTree() {
  const [nodes, setNodes] = useState<NodeInfo[]>([])
  const [showRaw, setShowRaw] = useState(false)
  const [selected, setSelected] = useState<NodeInfo | null>(null)

  useEffect(() => {
    setNodes(getInitialNodes())

    const observer = new MutationObserver((mutations) => {
      const updated = new Set<Element>()
      for (const m of mutations) {
        if (m.target instanceof Element) {
          updated.add(m.target)
        }
      }
      if (updated.size > 0) {
        setNodes((prev) =>
          prev.map((n) => ({
            ...n,
            updated: updated.has(n.element) || n.updated,
          })),
        )
        setTimeout(() => {
          setNodes((prev) => prev.map((n) => ({ ...n, updated: false })))
        }, 1500)
      }
    })

    observer.observe(document.body, { attributes: true, childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  const renderProps = (el: Element) => {
    const props: Record<string, unknown> = {}
    for (const attr of Array.from(el.attributes)) {
      props[attr.name] = attr.value
    }
    if (showRaw) {
      return <pre>{JSON.stringify(props, null, 2)}</pre>
    }
    const entries = Object.entries(props).filter(([, v]) =>
      ['string', 'number', 'boolean'].includes(typeof v),
    )
    return (
      <ul>
        {entries.map(([k, v]) => (
          <li key={k}>
            {k}: {String(v)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="component-tree">
      <h2>Component Tree</h2>
      <ul>
        {nodes.map((n) => (
          <li
            key={n.id}
            className={`${!n.isLit ? 'non-lit' : ''} ${n.updated ? 'updated' : ''}`}
            onClick={() => setSelected(n)}
          >
            {n.tag} {!n.isLit && <span>(non-Lit)</span>}
          </li>
        ))}
      </ul>
      {selected && (
        <div className="props-panel">
          <h3>Props</h3>
          <label>
            <input type="checkbox" checked={showRaw} onChange={(e) => setShowRaw(e.target.checked)} />
            Raw View
          </label>
          {renderProps(selected.element)}
        </div>
      )}
      <button className="export-button" disabled title="Coming Soon: Export profiling session" onClick={() => exportDataToJson()}>
        Export JSON
      </button>
    </div>
  )
}

export function exportDataToJson() {
  // Placeholder for future export functionality
  console.log('exportDataToJson stub')
}
