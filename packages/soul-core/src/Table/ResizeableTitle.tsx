import {useState} from "react"
import {Resizable} from "react-resizable"

export const ResizeableTitle = (props) => {
  const {onResize, width, onClick, ...restProps} = props
  const [resizing, setIsResizing] = useState(false)

  const onResizeStart = (e) => {
    console.log("start resize")
    setIsResizing(true)

    e.stopPropagation()
    e.preventDefault()
  }

  const onResizeStop = () => {
    console.log("end resize")
    setTimeout(() => {
      setIsResizing(false)
    })
  }

  if (!width) {
    return <th onClick={onClick} {...restProps} />
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
    >
      <th
        onClick={(...args) => {
          if (!resizing && onClick) {
            onClick(...args)
          }
        }}
        {...restProps}
      />
    </Resizable>
  )
}
