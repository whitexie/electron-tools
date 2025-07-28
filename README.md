# Electron 图标转换器

一个基于 Web 的工具，用于将图像转换为多平台的 Electron 应用程序图标。

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat&logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?style=flat&logo=tailwind-css)

## ✨ 产品特性

- 🖼️ **多格式支持**: 支持 PNG、JPG、SVG、WebP 输入格式
- 🎯 **多平台输出**: 一键生成 Windows (.ico)、macOS (.icns)、Linux (.png) 图标
- 📦 **批量下载**: ZIP 包形式下载所有平台图标
- 🔒 **隐私安全**: 完全客户端处理，无需服务器上传
- 🌙 **主题支持**: 深色/浅色模式切换
- 📱 **响应式设计**: 适配各种设备屏幕尺寸

## 🎯 支持的图标格式

### Windows (.ico)
- 包含多种嵌入尺寸：16px、24px、32px、48px、64px、128px、256px
- 适配不同显示缩放比例

### macOS (.icns)
- 针对高分辨率显示器优化
- 最高支持 1024px 分辨率

### Linux (.png)
- 多种标准尺寸：16px、32px、48px、64px、128px、256px、512px
- 符合 Linux 桌面环境规范

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 10.13.1+

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境

```bash
# 启动开发服务器 (http://localhost:3000)
pnpm dev
```

### 构建部署

```bash
# 生产构建
pnpm build

# 静态站点生成
pnpm generate

# 预览生产构建
pnpm preview

# 静态文件服务
pnpm serve:static
```

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 监听模式测试
pnpm test:watch

# 测试UI界面
pnpm test:ui

# 类型检查
pnpm typecheck

# 代码检查和修复
pnpm lint
```

## 📁 项目结构

```
├── app/                    # Nuxt 4 源代码目录
│   ├── assets/            # 静态资源
│   │   └── css/          # 样式文件
│   ├── components/        # Vue 组件
│   │   ├── ConverterResultPrewview.vue
│   │   ├── FileUploadZone.vue
│   │   ├── IconConverterMain.vue
│   │   ├── ImagePreview.vue
│   │   ├── PlatformConfigure.vue
│   │   └── __tests__/    # 组件测试
│   ├── composables/       # 组合式函数
│   │   ├── useAlterError.ts
│   │   ├── useConverter.ts
│   │   └── __tests__/    # 组合式函数测试
│   ├── converters/        # 转换器核心逻辑
│   │   ├── icnsGenerator.ts   # macOS icns 生成器
│   │   ├── icoGenerator.ts    # Windows ico 生成器
│   │   ├── imageGenerator.ts  # Linux png 生成器
│   │   ├── index.ts
│   │   └── __tests__/
│   ├── pages/             # 页面路由
│   │   └── index.vue     # 首页
│   ├── types/             # TypeScript 类型定义
│   │   ├── canvas.ts     # Canvas 相关类型
│   │   ├── platform.ts   # 平台配置类型
│   │   ├── services.ts   # 服务接口类型
│   │   └── validation.ts # 验证相关类型
│   ├── utils/             # 工具函数
│   │   ├── file-utils.ts     # 文件处理工具
│   │   ├── image-utils.ts    # 图像处理工具
│   │   └── platform-utils.ts # 平台相关工具
│   └── app.config.ts      # 应用配置
├── public/                # 公共静态文件
├── docs/                  # 项目文档
├── .kiro/                 # Kiro AI助手配置
├── nuxt.config.ts         # Nuxt 配置文件
├── vitest.config.ts       # 测试配置
└── eslint.config.mjs      # ESLint 配置
```

## 🛠️ 技术栈

### 核心框架
- **Nuxt 4**: Vue.js 全栈框架，使用 `app/` 作为源目录
- **Vue 3**: 组合式 API，TypeScript 支持
- **TypeScript**: 严格模式，类型检查启用

### UI 和样式
- **Nuxt UI**: 基于 Headless UI 的组件库
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Nuxt Icon**: 图标系统，支持多种图标集
- **Color Mode**: 深色/浅色主题切换

### 构建和开发工具
- **Vite**: 构建工具和开发服务器
- **pnpm**: 包管理器
- **ESLint**: 代码检查，使用 @antfu/eslint-config
- **TypeScript**: 编译和类型检查

### 测试框架
- **Vitest**: 单元测试框架
- **@testing-library/vue**: Vue 组件测试
- **jsdom**: DOM 环境模拟

### 核心依赖
- **fflate**: ZIP 文件生成
- **Canvas API**: 图像处理和转换

## 🏗️ 架构设计

### 组件组织
- **页面组件**: `pages/` - 路由级别组件
- **功能组件**: `components/` - 可复用 UI 组件
- **布局组件**: 使用 Nuxt 默认布局系统

### 逻辑分层
- **Composables**: 业务逻辑和状态管理
- **Utils**: 纯函数工具，无状态
- **Types**: TypeScript 类型定义
- **Converters**: 图标转换核心逻辑

### 状态管理
- 使用 Vue 3 组合式 API 的 `ref` 和 `reactive`
- Composables 封装状态逻辑
- 无需额外状态管理库（Pinia/Vuex）

## 📝 开发规范

### 命名约定
- **组件**: PascalCase (IconConverterMain.vue)
- **Composables**: camelCase with use前缀 (useConverter.ts)
- **Utils**: kebab-case (file-utils.ts)
- **Types**: camelCase (index.ts)

### 代码约定
- **变量**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **类型**: PascalCase
- **接口**: PascalCase with I前缀（可选）

### 提交规范
使用约定式提交（Conventional Commits）规范：

```
<类型>[可选范围]: <描述>

[可选正文]

[可选脚注]
```

#### 提交类型
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 添加或修改测试
- **chore**: 构建过程或辅助工具的变动

#### 提交示例
```bash
feat(converter): 添加SVG格式支持
fix(ui): 修复深色模式下按钮颜色问题
docs: 更新README中的安装说明
refactor(utils): 优化图像处理工具函数结构
test(converter): 添加PNG转换功能单元测试
```

## 🎯 使用方法

1. **上传图像**: 支持拖拽或点击上传 PNG、JPG、SVG、WebP 格式的图像
2. **预览效果**: 实时预览转换后的图标效果
3. **选择平台**: 选择需要生成的目标平台图标
4. **一键下载**: 点击下载按钮获取 ZIP 格式的图标包

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feat/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加某个特性'`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Nuxt](https://nuxt.com/) - 优秀的 Vue.js 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [fflate](https://github.com/101arrowz/fflate) - 高性能压缩库

---

如果这个项目对您有帮助，请给我们一个 ⭐️ 星标支持！
