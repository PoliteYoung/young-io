export type Locale = 'en' | 'zh';

export const homeCopy = {
  en: {
    lang: 'en',
    titleHeadline: 'Researcher and Research Engineer',
    description: 'Researcher and Research Engineer working on Digital Humans, Computer Graphics, XR systems, and AI infrastructure.',
    nav: {
      home: 'Home', research: 'Research', projects: 'Projects', publications: 'Publications', experience: 'Experience', writing: 'Writing',
    },
    languageLabel: '切换至中文',
    languageShort: '中文',
    heroIndex: 'Y/O — 001',
    affiliationCode: 'HKUST(GZ)',
    publicationLinks: { doi: 'DOI', arxiv: 'arXiv', github: 'GitHub' },
    identityTicker: '01 / IO / YOUNG / YANG / INPUT / OUTPUT /',
    status: 'Identity core · v0.2',
    heroEyebrow: ['Human identity', 'Digital identity'],
    heroTitle: ['I build the systems', 'behind digital humans.'],
    affiliationRole: 'PhD Student',
    heroIntro: 'I work where digital-human research meets the engineering and infrastructure required to make it real — from reconstruction and avatar systems to GPU environments, motion capture, and XR platforms.',
    explore: 'Explore the work',
    profileTags: {
      label: 'Verified profiles',
      github: 'github',
      linkedin: 'linkedin',
      orcid: 'orcid',
      scholar: 'scholar',
      scholarValue: 'publications',
      openreview: 'openreview',
      openreviewValue: 'peer review',
      resume: 'cv',
      resumeValue: 'print view',
    },
    portraitAlt: "Portrait of Yao-Dong 'Polite Young' Yang",
    portraitId: 'Y/O — PORTRAIT 001',
    scroll: 'SCROLL TO COMPILE',
    sections: {
      position: '01 / POSITION',
      positionLead: 'Not one role. A working intersection.',
      positionLines: ['Research asks the question.', 'Engineering makes it possible.', 'Infrastructure keeps it real.'],
      research: '02 / RESEARCH FIELD',
      researchTitle: ['A connected', 'capability system.'],
      researchIntro: 'Capabilities are presented as relationships, not a wall of software logos. Each field connects scientific questions to implementation and operation.',
      projects: '03 / PROJECT RECORD',
      projectsTitle: 'Evidence before exhibition.',
      projectsIntro: 'Young.io is currently reconstructing project history from repositories, papers, resumes, and primary notes. Projects will appear only when role, dates, outcomes, and sources can be traced.',
      projectsStatus: 'Phase 0 · collection in progress',
      publications: '03 / PUBLICATIONS',
      publicationsTitle: ['Published work.', 'Traceable records.'],
      publicationsIntro: 'Records are compiled from Google Scholar and checked against DOI registries and DBLP. Preprints and final proceedings are represented as one work, not duplicated.',
      education: '04 / EXPERIENCE',
      educationTitle: ['Work and study.', 'A traceable path.'],
      educationIntro: 'Professional experience and education are compiled from public LinkedIn and researcher records.',
      professionalExperienceTitle: 'Professional Experience',
      educationHistoryTitle: 'Education',
      writing: '05 / WRITING',
      writingTitle: 'Notes from the bridge.',
      writingIntro: 'Future writing will connect research practice, technical systems, and the quieter work of keeping complex environments usable.',
      writingEmpty: 'NO PUBLIC NOTES YET',
      writingEmptyDetail: 'Silence is better than manufactured expertise.',
    },
    identityMeanings: [
      'Connects Yang, personal identity, growth, and continuous learning.',
      'Connects input/output, binary 1/0, and the phonetic readings behind the brand.',
    ],
    footerEyebrow: 'Output / connection',
    footerTitle: ['Building an identity', 'that can keep learning.'],
    footerDescription: (name: string) => `Young.io is a living knowledge system for ${name}.`,
    copyright: 'compiled from verified knowledge',
    present: 'Present',
  },
  zh: {
    lang: 'zh-CN',
    titleHeadline: '研究者与研究工程师',
    description: '专注数字人、计算机图形学、XR 系统与 AI 基础设施的研究者和研究工程师。',
    nav: {
      home: '首页', research: '研究', projects: '项目', publications: '发表', experience: '经历', writing: '随笔',
    },
    languageLabel: 'Switch to English',
    languageShort: '英文',
    heroIndex: '人物档案 — 001',
    affiliationCode: '当前院校',
    publicationLinks: { doi: 'DOI', arxiv: 'arXiv', github: 'GitHub' },
    identityTicker: '01 / 一零 / 杨 / 输入 / 输出 / 成长 /',
    status: '身份核心 · 版本 0.2',
    heroEyebrow: ['人类身份', '数字身份'],
    heroTitle: ['我构建数字人', '背后的系统。'],
    affiliationRole: '博士生',
    heroIntro: '我的工作位于数字人研究及其落地所需的工程与基础设施交汇处——从人体重建和虚拟形象系统，到 GPU 环境、动作捕捉与 XR 平台。',
    explore: '探索研究与实践',
    profileTags: {
      label: '公开身份主页',
      github: 'github',
      linkedin: 'linkedin',
      orcid: 'orcid',
      scholar: 'scholar',
      scholarValue: '论文列表',
      openreview: 'openreview',
      openreviewValue: '评审主页',
      resume: '简历',
      resumeValue: '打印版',
    },
    portraitAlt: '杨耀东肖像',
    portraitId: '人物档案 001',
    scroll: '向下探索',
    sections: {
      position: '01 / 定位',
      positionLead: '不止一种角色，而是一个持续运转的交汇点。',
      positionLines: ['研究提出问题。', '工程让它成为可能。', '基础设施让它真正运转。'],
      research: '02 / 研究领域',
      researchTitle: ['彼此连接的', '能力体系。'],
      researchIntro: '这里展示的不是一面软件徽标墙，而是能力之间的关系：每个领域都把科学问题与实现、运行连接起来。',
      projects: '03 / 项目记录',
      projectsTitle: '先有证据，再做展示。',
      projectsIntro: 'Young.io 正在从代码仓库、论文、履历和一手记录中重建项目历史。只有当角色、时间、成果和来源都可追溯时，项目才会在这里公开。',
      projectsStatus: '阶段 0 · 资料整理中',
      publications: '03 / 发表成果',
      publicationsTitle: ['已发表工作。', '可追溯记录。'],
      publicationsIntro: '记录依据公开学术档案整理，并与论文标识及文献数据库交叉核验；预印本和正式论文视为同一项工作，不重复计算。',
      education: '04 / 经历',
      educationTitle: ['工作与求学。', '一条可追溯的路径。'],
      educationIntro: '职业经历与教育经历依据公开职业档案及研究者身份记录整理。',
      professionalExperienceTitle: '职业经历',
      educationHistoryTitle: '教育经历',
      writing: '05 / 随笔',
      writingTitle: '来自交汇处的记录。',
      writingIntro: '未来的文章将连接研究实践、技术系统，以及让复杂环境长期可用的那些不太显眼却重要的工作。',
      writingEmpty: '暂无公开文章',
      writingEmptyDetail: '与其制造观点，不如暂时保持沉默。',
    },
    identityMeanings: [
      'Young 连接 Yang（杨）、个人身份、成长与持续学习。',
      'IO 连接输入与输出、二进制 1/0，以及“一/零”和“幺/洞”的声音。',
    ],
    footerEyebrow: '输出 / 连接',
    footerTitle: ['构建一个', '能够持续学习的身份。'],
    footerDescription: (name: string) => `Young.io 是 ${name} 持续生长的个人知识系统。`,
    copyright: '由经过核验的知识编译生成',
    present: '至今',
  },
} as const;

export const capabilityZh: Record<string, { title: string; summary: string; topics: string[] }> = {
  'digital-humans': {
    title: '数字人',
    summary: '人体重建、人体模型、姿态估计与虚拟形象系统。',
    topics: ['人体重建', 'SMPL / SMPL-X', '3DGS 虚拟形象', '人体姿态估计'],
  },
  'graphics-xr': {
    title: '图形学与 XR',
    summary: '计算机图形学、高斯泼溅、沉浸式系统、动作捕捉与 XR 开发。',
    topics: ['计算机图形学', '高斯泼溅', 'XR / 沉浸式系统', '动作捕捉系统'],
  },
  'research-engineering': {
    title: '科研工程',
    summary: '升级科研代码，让高要求的 GPU 系统能够跨环境复现。',
    topics: ['PyTorch 生态', 'CUDA 迁移', 'GPU 计算', '旧框架迁移'],
  },
  infrastructure: {
    title: 'AI 基础设施',
    summary: '支撑研究的系统层：从 GPU 集群，到 Linux、Windows 环境与科研设施。',
    topics: ['GPU 集群基础设施', 'Linux / Windows 科研环境', '科研设施运行', '科研代码现代化'],
  },
};


export const experienceZh: Record<string, {
  organization: string;
  title: string;
  employmentType: string;
  location: string;
  summary: string;
  highlights: string[];
}> = {
  'minsheng-fintech-back-end-developer': {
    organization: 'Minsheng Fintech',
    title: '后端开发工程师',
    employmentType: '全职',
    location: '中国四川',
    summary: '参与集团内部工具开发，以服务端应用创建为核心，整合可复用的框架组件与个性化配置，为项目团队提供一站式应用创建流程。',
    highlights: ['通过共享内部工具链，支持项目团队创建和配置服务端应用。'],
  },
  'iscas-software-engineer-intern': {
    organization: '中国科学院软件研究所',
    title: '软件工程师',
    employmentType: '实习',
    location: '中国贵州贵阳',
    summary: '使用 Spring Boot 与 MySQL 参与部门门户的后端开发与维护。',
    highlights: ['新增专家观点栏目，并编写 Python 脚本采集其他部门的新闻信息。'],
  },
  'vivedu-software-engineer-intern': {
    organization: '威爱教育VIVEDU',
    title: '软件工程师',
    employmentType: '实习',
    location: '中国四川成都',
    summary: '参与围绕 HTC VIVE 的 VR+教育解决方案，负责项目开发、维护与技术选型。',
    highlights: ['搭建 Jenkins 持续集成环境与 SMB 文件共享服务。', '以开源方案替代商业 VR 直播模块，用户容量提升超过 200%。'],
  },
  'mobotap-software-test-engineer-intern': {
    organization: 'MoboTap',
    title: '软件测试工程师',
    employmentType: '实习',
    location: '中国湖北武汉',
    summary: '参与 Dolphin Browser Android 版本的每周发布测试，并监控日常崩溃日志；领英记录注明该产品拥有 600 万日活跃用户。',
    highlights: ['在 XDA 论坛与设备厂商支持下，复现 10 余个高频崩溃问题。', '在内部 Wiki 中整理并分享模拟用户设备环境的通用方法。'],
  },
};

export const educationZh: Record<string, { institution: string; school?: string; degree: string; field?: string }> = {
  'hkust-gz-phd-compute-media-art': {
    institution: '香港科技大学（广州）',
    school: '信息枢纽',
    degree: '哲学博士',
    field: '计算媒体与艺术',
  },
  'binghamton-university-msc-cs': {
    institution: '宾汉姆顿大学',
    school: '托马斯·J·沃森工程与应用科学学院',
    degree: '理学硕士',
    field: '计算机科学',
  },
  'hubei-university-economics-beng-software-engineering': {
    institution: '湖北经济学院',
    school: '信息管理与统计学院',
    degree: '工学学士',
    field: '软件工程',
  },
};


export const publicationZh: Record<string, { title: string; venue: string; authors: string }> = {
  'degas-3dv-2025': {
    title: 'DEGAS：全身高斯虚拟形象的精细表情',
    venue: '2025 年国际三维视觉大会（3DV）',
    authors: '作者团队（含杨耀东）',
  },
  'hi-reco-cgi-2025': {
    title: 'Hi-Reco：高保真实时对话数字人',
    venue: '国际计算机图形学大会（CGI）',
    authors: '作者团队（含杨耀东）',
  },
};
