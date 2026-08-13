# Young.io 内容维护指南

Young.io 的维护原则是：**事实只存一次，身份解释只存一次，各个输出页面只读取，不再各自保存一份个人内容。**

## 1. 数据归属

| 内容类型 | 唯一维护位置 | 示例 |
| --- | --- | --- |
| 可核验事实 | `knowledge/` | 姓名、机构、职位、地点、经历、教育、论文、链接 |
| 身份定位与解释 | `identity/` | headline、positioning、个人介绍、品牌含义、职业主线 |
| 页面和渠道用语 | `website/astro/src/i18n/` | 导航名称、栏目标题、按钮、打印提示 |
| 长文章和人工审核稿 | `content/` | 文章、说明文、待发布文稿 |
| 页面呈现 | `website/astro/` | 布局、组件、样式；不得重新保存个人事实 |

不要因为首页、中文页或简历需要不同表达，就把同一事实复制到页面组件或 i18n 文件。事实或身份表达的中英文版本应在其所属的 canonical YAML 记录内维护。

## 2. 本地化字段

需要中英文输出的字段使用统一结构：

```yaml
title:
  en: English title
  zh: 中文标题
```

数组也采用同样方式：

```yaml
highlights:
  en:
    - English item
  zh:
    - 中文条目
```

`website/astro/src/lib/knowledge.ts` 负责校验 YAML，并通过 `getPublicIdentity(locale)` 向页面提供已经本地化的数据。Astro 组件不应再自行维护 ID 到中文文案的映射表。

## 3. 修改现有内容

### 修改事实

1. 在 `knowledge/` 中找到对应的稳定 ID。
2. 修改字段，并同步检查 `source`、`verified`、`status`、`visibility`。
3. 若证据不足，使用：

```yaml
verified: false
status: needs verification
```

4. 不要为了让网站显示而把未核验记录标成公开且已核验。

### 修改身份定位或介绍

- 首页与简历共用的核心表达维护在 `identity/core.yaml`。
- 单段职业经历的贡献解释维护在 `identity/experience-narrative.yaml`。
- 写作边界与语气维护在 `identity/writing-style.md` 等说明文件。
- Markdown 文件用于解释规则；不要再次完整抄写 `identity/core.yaml` 中的机器可读文案。

### 修改页面标签

只有不属于个人知识或身份叙事的界面文字放入：

- `website/astro/src/i18n/home.ts`
- `website/astro/src/i18n/resume.ts`

例如“代表性发表成果”“打印 / 保存为 PDF”属于页面标签；姓名、地点、简介、机构和品牌解释不属于页面标签。

## 4. 添加板块或记录

### 添加一条经历

1. 在 `knowledge/experience.yaml` 的 `experience` 数组中添加记录，并分配唯一、稳定的 `id`。
2. 填写中英文字段和完整元数据。
3. 在 `identity/experience-narrative.yaml` 中添加相同 `experience_id` 的解释记录。
4. 页面会通过 `getPublicIdentity(locale)` 自动得到本地化后的经历。

构建校验会阻止以下情况：

- 重复 ID；
- 公开记录未经核验；
- 公开经历缺少对应身份解释；
- 身份解释引用不存在的经历。

### 添加教育、论文或能力方向

分别在以下文件中添加带稳定 ID 的记录：

- 教育：`knowledge/education.yaml`
- 论文：`knowledge/publications.yaml`
- 能力方向：`knowledge/experience.yaml` 的 `capability_domains`

如果现有页面已经展示该集合，新记录会自动进入输出；如果要创建全新的页面板块，再在页面组件中消费 `getPublicIdentity(locale)` 返回的数据，不要直接读取和解释原始 YAML。

### 添加全新的数据类型

例如新增项目板块：

1. 先在 `knowledge/` 定义 canonical YAML 结构和稳定 ID。
2. 为重要记录加入来源、核验状态与可见性元数据。
3. 在 `website/astro/src/lib/knowledge.ts` 增加 schema、读取、隐私过滤、本地化转换和关系校验。
4. 将该集合加入 `getPublicIdentity(locale)` 的返回值。
5. 页面只消费这个统一接口。
6. 若需要解释层，再在 `identity/` 建立以事实 ID 为外键的叙事记录。

推荐的数据流：

```text
knowledge facts ─┐
                 ├─> validation + localization ─> getPublicIdentity(locale) ─> pages / resume
identity meaning ┘

i18n UI labels ────────────────────────────────────────────────────────> pages / resume
```

## 5. 隐私和发布条件

浏览器和公开生成物只能接收同时满足以下条件的记录：

```yaml
visibility: public
verified: true
status: verified
```

`private`、`internal` 和 `confidential` 数据不得进入浏览器 bundle、公开示例、生成文档、日志或截图。公开发布前仍须人工审核。

## 6. 每次维护后的检查

在仓库根目录运行：

```bash
pnpm check
pnpm build
```

提交或发布前还应检查：

1. 是否把事实重复写进组件或 i18n；
2. 中英文是否都已填写；
3. ID 关系是否完整；
4. 是否有 `needs verification` 项；
5. 页面和简历是否只显示适合公开的内容。
