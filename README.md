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

发布到 npm 步骤:

- pnpm run changeset // 修改 changeset.md
  1.  changed & unchanged enter
  2.  major 不选 enter
  3.  minor 不选 enter
  4.  Summary 随便写
  5.  desired changeset ? true
- pnpm run version-packages // 修改 package.json 的 version
- pnpm install // 修改 lock 文件
- git add .
- git commit -m 'feat(core): Table add Settings'
- git push
- 通过 github action 自动发布到 npm

业务项目
pnpm unlink ~/wmqj/soul/packages/soul-core
pnpm unlink ~/wmqj/soul/packages/soul-utils
pnpm add @soul/core @soul/utils
