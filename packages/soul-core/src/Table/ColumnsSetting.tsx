import {SettingOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import {FC, memo, useState} from "react"
import SettingModal2 from "./SettingModal2"

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
        <SettingModal2
          open={open}
          radioGroup={radioGroup}
          onOpenChange={(nextOpen) => setOpen(nextOpen)}
        ></SettingModal2>
      ) : null}
    </>
  )
}

export default memo(ColumnsSetting)
