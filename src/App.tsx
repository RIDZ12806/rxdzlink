import { useState, useEffect } from 'react'

function App() {
  const [content, setContent] = useState<React.ReactNode>(null)

  useEffect(() => {
    // هنا نستدعي المكونات الرئيسية من مشروعك
    import('./routes').then(module => {
      setContent(<module.default />)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {content || <div>Loading...</div>}
    </div>
  )
}

export default App
