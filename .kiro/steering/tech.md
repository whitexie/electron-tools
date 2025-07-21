# 技术栈和构建系统

## 核心技术栈

### 前端框架
- **Nuxt 4**: Vue.js全栈框架，使用`app/`作为源目录
- **Vue 3**: 组合式API，TypeScript支持
- **TypeScript**: 严格模式，类型检查启用

### UI和样式
- **Nuxt UI**: 基于Headless UI的组件库
- **Tailwind CSS**: 实用优先的CSS框架，使用Vite插件
- **Nuxt Icon**: 图标系统，支持多种图标集
- **Color Mode**: 深色/浅色主题切换

### 构建和开发工具
- **Vite**: 构建工具和开发服务器
- **pnpm**: 包管理器（版本10.13.1+）
- **ESLint**: 代码检查，使用@antfu/eslint-config
- **TypeScript**: 编译和类型检查

### 测试框架
- **Vitest**: 单元测试框架
- **@testing-library/vue**: Vue组件测试
- **jsdom**: DOM环境模拟

### 核心依赖
- **jszip**: ZIP文件生成和下载
- **Canvas API**: 图像处理和转换

## 常用命令

### 开发环境
```bash
# 安装依赖
pnpm install

# 启动开发服务器 (http://localhost:3000)
pnpm dev

# 类型检查
pnpm build  # 包含类型检查
```

### 构建和部署
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

### 测试
```bash
# 运行所有测试
pnpm test

# 监听模式测试
pnpm test:watch

# 测试UI界面
pnpm test:ui
```

## 配置要点

### Nuxt配置
- SSR禁用，使用静态生成
- 严格TypeScript模式
- 自动导入composables和utils
- 组件自动注册

### 构建配置
- Nitro静态预设
- 预渲染根路由
- Vite插件集成Tailwind CSS

### 开发规范
- 所有文档和注释都使用简体中文
- 使用组合式API
- TypeScript严格模式
- ESLint自动修复
- 测试驱动开发（TDD）

## 提交规范

### 提交消息格式
使用约定式提交（Conventional Commits）规范：

```
<类型>[可选范围]: <描述>

[可选正文]

[可选脚注]
```

### 提交类型
- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构（既不是新功能也不是修复）
- **perf**: 性能优化
- **test**: 添加或修改测试
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI/CD配置文件和脚本的变动

### 范围示例
- **converter**: 图标转换功能
- **ui**: 用户界面组件
- **utils**: 工具函数
- **types**: 类型定义
- **config**: 配置文件

### 提交示例
```bash
# 新功能
feat(converter): 添加SVG格式支持

# 修复bug
fix(ui): 修复深色模式下按钮颜色问题

# 文档更新
docs: 更新README中的安装说明

# 重构
refactor(utils): 优化图像处理工具函数结构

# 测试
test(converter): 添加PNG转换功能单元测试
```

### 提交最佳实践
- 使用现在时态："添加功能"而不是"已添加功能"
- 首行不超过50个字符
- 如需详细说明，在空行后添加正文
- 一次提交只做一件事
- 提交前运行测试确保代码质量
