# qmd — 混合语义搜索

> 需要搜索 wiki 内容时读取本文件。自包含：检测 → 使用 → 回退。

---

## 检测

满足**全部**三项才可用：

1. `command -v qmd` 有输出
2. 项目根存在 `qmd.yml`
3. `qmd context list` 返回非空列表

**任一项不满足 → 跳到下方「回退」小节。**

---

## 使用（qmd 可用时）

```bash
qmd query "自然语言问题"          # 混合搜索 + 重排，首选
qmd search "精确短语" -c pages   # 按 collection 限定
qmd get "pages/xxx.md" --full   # 读文件带元信息
```

可用 collections：`pages`、`sources`、`maps`、`queries`、`raw`。

`rg` / `fd` 仍作为**精确字符串**匹配的补充。

### 索引更新

新建或修改 ≥ 3 个文件后，在 git commit 前执行：

```bash
qmd embed
```

---

## 回退（qmd 不可用时）

```bash
rg -l "pattern" pages sources maps queries
rg "pattern" -C 2 pages/
fd -e md . pages sources maps queries
```

---

## 安装（给人类用户）

```bash
npm install -g @tobilu/qmd
bash extensions/qmd/init.sh
```

## 文件说明

| 文件 | 角色 |
|---|---|
| `README.md` | 本文件 |
| `qmd.yml` | qmd 配置（项目根的 `qmd.yml` 是指向此文件的符号链接） |
| `init.sh` | 一次性初始化脚本 |
