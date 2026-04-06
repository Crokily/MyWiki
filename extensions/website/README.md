# website — 静态站点生成

> 需要将 wiki 部署为网站时读取本文件。自包含：检测 → 使用 → 回退。

---

## 检测

满足**全部**两项才可用：

1. `test -f extensions/website/node_modules/.package-lock.json` 返回成功
2. `cd extensions/website && npm run build` 能完成构建

**任一项不满足 → 跳到下方「安装」或「回退」小节。**

---

## 使用（website 可用时）

### 本地开发

```bash
cd extensions/website
npm run dev
```

启动本地开发服务器，默认地址：`http://localhost:3000`。

### 静态构建

```bash
cd extensions/website
npm run build
```

构建产物输出到 `out/`。

### 预览与部署

本地预览：

```bash
cd extensions/website
npx serve out/
```

线上部署：将 `out/` 推送到 Vercel，或上传到任意静态站点托管服务。

### 内容来源

网站在 build 时直接读取 wiki 根目录下的：

- `../../pages/`
- `../../sources/`
- `../../maps/`
- `../../queries/`

不复制内容，不维护第二份数据。

---

## 回退（website 不可用时）

直接在 Obsidian 或任意文本编辑器中阅读 `pages/`、`sources/`、`maps/`、`queries/` 里的 Markdown 文件。

---

## 安装（给人类用户）

```bash
bash extensions/website/init.sh
# 或手动：
cd extensions/website && npm install
```

## 文件说明

| 文件 | 角色 |
|---|---|
| `README.md` | 本文件 |
| `init.sh` | 一次性安装脚本 |
| `package.json` | website 的 npm scripts 与依赖 |
| `next.config.ts` | Next.js 构建配置 |
| `app/` | 路由与页面入口 |
| `lib/` | Markdown / wiki 内容读取与转换逻辑 |
| `components/` | 站点 UI 组件 |
