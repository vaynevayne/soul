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
  - 不要选 major minor, 让系统默认选择 patch
- pnpm run version-packages // 修改 package.json 的 version
- pnpm install // 修改 lock 文件
- git add .
- git commit -m 'feat(core): Table add Settings'
- git push
- 通过 github action 自动发布到 npm
