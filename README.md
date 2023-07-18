Usage

install

```jsx
pnpm add @soul/core @soul/utils
```

需要引入相关 css

```jsx
import "react-contexify/dist/ReactContexify.css"
import "react-resizable/css/styles.css"
```

完成后的总结:

- 应该将这个带有 order ,函数(透传给 table)等的全量数组作为 allColumns(唯一目的是提供 render 函数) + 剔除函数之外的 allColumns(剔除函数以便作为 state 存储,回显) 来传给 SettingModal,
- 而不是直接使用 table 的 columns + State, 因为 State 是残缺的, 导致 column 上有的,State 可能没有, 设置属性时,不能使用. 读取 order 时,没有 order, 给 order 一个默认值也很难, 不如直接在配置表里指定默认值
- 无论使用数组还是对象作为 State, 得是全量的
- 结论: State 得是 数组 全量 内部直接受控非受控使用, 至于权限, 再传入 Modal 时过滤就行

发布到 npm 步骤:

- pnpm run changeset // 修改 changeset.md
  1.  全选 changed & unchanged enter
  2.  不选 enter major
  3.  不选 enter minor
  4.  Summary 随便写
  5.  desired changeset ? true
- pnpm run version-packages // 修改 package.json 的 version
- pnpm install // 修改 lock 文件
- git add .
- git commit -m 'feat(core): Table add Settings'
- git push
- 通过 github action 自动发布到 npm

业务项目
pnpm remove @soul/core @soul/utils
pnpm link ~/wmqj/soul/packages/soul-core
pnpm link ~/wmqj/soul/packages/soul-utils

pnpm unlink ~/wmqj/soul/packages/soul-core
pnpm unlink ~/wmqj/soul/packages/soul-utils
pnpm add @soul/core @soul/utils
