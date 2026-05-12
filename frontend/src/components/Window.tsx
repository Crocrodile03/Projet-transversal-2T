import { useState, useRef, useEffect } from 'react'
import styles from './Window.module.css'

type WindowProps = {
  title: string
  children: React.ReactNode
  initialX: number
  initialY: number
  zIndex?: number
  onFocus?: () => void
}

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
type AnimState = 'idle' | 'squishing' | 'stretching' | 'wiggle-max' | 'wiggle-restore'

const SPRING   = 0.07
const DAMPING  = 0.85
const MAX_ANGLE = 10

function Window({ title, children, initialX, initialY, zIndex = 10, onFocus }: WindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [size, setSize] = useState({ width: 340, height: 300 })
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const prevSizePos = useRef({ position: { x: initialX, y: initialY }, size: { width: 340, height: 300 } })
  const [animState, setAnimState] = useState<AnimState>('idle')
  const [dragging, setDragging] = useState(false)
  const [grabOrigin, setGrabOrigin] = useState({ x: 50, y: 20 })
  const [rotation, setRotation] = useState(0)

  const dragOffset     = useRef({ x: 0, y: 0 })
  const prevMouseX     = useRef(0)
  const resizeStart    = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0, width: 0, height: 0 })
  const rotRef         = useRef(0)
  const angVelRef      = useRef(0)
  const isDraggingRef  = useRef(false)
  const rafRef         = useRef<number | null>(null)

  useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }, [])

  function startPhysicsLoop() {
    if (rafRef.current !== null) return
    function loop() {
      angVelRef.current += -SPRING * rotRef.current
      angVelRef.current *= DAMPING
      rotRef.current += angVelRef.current
      setRotation(rotRef.current)

      const settled = !isDraggingRef.current
        && Math.abs(rotRef.current) < 0.05
        && Math.abs(angVelRef.current) < 0.05

      if (settled) {
        rotRef.current = 0
        angVelRef.current = 0
        setRotation(0)
        rafRef.current = null
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  function handleMaximize(e: React.MouseEvent) {
    e.stopPropagation()
    if (maximized) {
      setPosition(prevSizePos.current.position)
      setSize(prevSizePos.current.size)
      setMaximized(false)
      setAnimState('wiggle-restore')
    } else {
      prevSizePos.current = { position: { ...position }, size: { ...size } }
      setPosition({ x: 0, y: 0 })
      setSize({ width: window.innerWidth, height: window.innerHeight })
      setMaximized(true)
      setAnimState('wiggle-max')
    }
  }

  function handleMinimize(e: React.MouseEvent) {
    e.stopPropagation()
    if (minimized) {
      setMinimized(false)
      setAnimState('stretching')
    } else {
      setMinimized(true)
      setAnimState('squishing')
    }
  }

  function onAnimationEnd() {
    setAnimState('idle')
  }

  function onDragMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    setDragging(true)
    isDraggingRef.current = true
    const grabX = ((e.clientX - position.x) / size.width) * 100
    const grabY = e.clientY - position.y
    setGrabOrigin({ x: grabX, y: grabY })
    angVelRef.current += (grabX - 50) / 50 * 8
    prevMouseX.current = e.clientX
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y }
    startPhysicsLoop()

    function onMouseMove(e: MouseEvent) {
      const vx = e.clientX - prevMouseX.current
      prevMouseX.current = e.clientX
      angVelRef.current += vx * 0.02
      angVelRef.current = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angVelRef.current))
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y })
    }
    function onMouseUp() {
      setDragging(false)
      isDraggingRef.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onResizeMouseDown(e: React.MouseEvent, edge: ResizeEdge) {
    e.preventDefault()
    e.stopPropagation()
    resizeStart.current = { mouseX: e.clientX, mouseY: e.clientY, x: position.x, y: position.y, width: size.width, height: size.height }

    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - resizeStart.current.mouseX
      const dy = e.clientY - resizeStart.current.mouseY
      let { x, y, width, height } = resizeStart.current

      if (edge.includes('e')) width  = Math.max(200, width + dx)
      if (edge.includes('s')) height = Math.max(120, height + dy)
      if (edge.includes('w')) { width  = Math.max(200, width - dx);  x = x + dx }
      if (edge.includes('n')) { height = Math.max(120, height - dy); y = y + dy }

      setSize({ width, height })
      setPosition({ x, y })
    }
    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const animClass = animState === 'squishing'      ? styles.squish
                  : animState === 'stretching'     ? styles.stretch
                  : animState === 'wiggle-max'     ? styles.wiggleMax
                  : animState === 'wiggle-restore' ? styles.wiggleRestore
                  : ''
  const dragClass      = dragging ? styles.grabbed : ''
  const maxClass       = maximized ? styles.maximized : ''
  const transformOrigin = maximized ? 'center center' : `${grabOrigin.x}% ${grabOrigin.y}px`
  const currentTransform = maximized ? 'none' : `scale(${dragging ? 1.03 : 1}) rotate(${rotation}deg)`

  return (
    <div
      className={`${styles.window} ${animClass} ${dragClass} ${maxClass}`}
      style={maximized
        ? { left: 0, top: 0, width: '100vw', zIndex: zIndex + 100, transformOrigin, transform: currentTransform }
        : { left: position.x, top: position.y, width: size.width, zIndex, transformOrigin, transform: currentTransform }
      }
      onMouseDown={onFocus}
      onAnimationEnd={onAnimationEnd}
    >
      <div className={styles.resizeN} onMouseDown={e => onResizeMouseDown(e, 'n')} />
      <div className={styles.titleBar} onMouseDown={onDragMouseDown}>
        <span className={styles.titleText}>{title}</span>
        <div className={styles.winButtons}>
          <button className={styles.minimize} onMouseDown={e => e.stopPropagation()} onClick={handleMinimize}>_</button>
          <button className={styles.maximize} onMouseDown={e => e.stopPropagation()} onClick={handleMaximize}>{maximized ? '❐' : '◻'}</button>
          <button className={styles.close} onMouseDown={e => e.stopPropagation()}>&#x2715;</button>
        </div>
      </div>
      {!minimized && (
        <div className={styles.content} style={{ height: maximized ? window.innerHeight - 28 : size.height - 28, overflow: 'auto' }}>
          {children}
        </div>
      )}
      <div className={styles.resizeS}  onMouseDown={e => onResizeMouseDown(e, 's')} />
      <div className={styles.resizeE}  onMouseDown={e => onResizeMouseDown(e, 'e')} />
      <div className={styles.resizeW}  onMouseDown={e => onResizeMouseDown(e, 'w')} />
      <div className={styles.resizeNE} onMouseDown={e => onResizeMouseDown(e, 'ne')} />
      <div className={styles.resizeNW} onMouseDown={e => onResizeMouseDown(e, 'nw')} />
      <div className={styles.resizeSE} onMouseDown={e => onResizeMouseDown(e, 'se')} />
      <div className={styles.resizeSW} onMouseDown={e => onResizeMouseDown(e, 'sw')} />
    </div>
  )
}

export default Window
