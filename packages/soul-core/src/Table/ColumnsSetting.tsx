import {SettingOutlined} from "@ant-design/icons"
import {Button, Spin, Tooltip} from "antd"
import {FC, Suspense, lazy, memo, useState} from "react"
const SettingModal2 = lazy(() => import("./SettingModal2"))

export type SettingButtonProps = {
  radioGroup?: string[]
}

const ColumnsSetting: FC<SettingButtonProps> = ({radioGroup}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Tooltip title="列配置">
        <Button
          type="text"
          onClick={() => setOpen(true)}
          size="small"
          icon={<SettingOutlined />}
        ></Button>
      </Tooltip>

      {/* 还未 open, 内部的 useEffect 就会执行,所以手动控制 */}
      {open ? (
        <Suspense fallback={<Spin></Spin>}>
          <SettingModal2
            open={open}
            radioGroup={radioGroup}
            onOpenChange={(nextOpen) => setOpen(nextOpen)}
          ></SettingModal2>
        </Suspense>
      ) : null}
    </>
  )
}

export default memo(ColumnsSetting)
