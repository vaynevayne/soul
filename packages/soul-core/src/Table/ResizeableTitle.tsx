import { Resizable } from 'react-resizable';

export const ResizeableTitle = (props) => {
  const { onResize, width, onResizeStart, onResizeStop, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
    >
      <th {...restProps} />
    </Resizable>
  );
};
