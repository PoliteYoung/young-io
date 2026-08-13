# Project records

Add one YAML file per substantial project. Use stable IDs and include scope, role, dates, evidence, verification, and visibility.

```yaml
schema_version: 1
project:
  id: stable-project-id
  title:
    en: Project title
    zh: 项目标题
  summary:
    en: Factual one-sentence description
    zh: 一句话事实描述
  role: null
  period:
    start: null
    end: null
  topics: []
  links: []
  source:
    type: repository
    reference: URL or local evidence pointer
  verified: false
  status: needs verification
  visibility: internal
```
