# 项目结构和组织

## 目录结构

### 根目录
```
├── app/                    # Nuxt 4 源代码目录
├── docs/                   # 项目文档
├── .kiro/                  # Kiro AI助手配置
├── .nuxt/                  # Nuxt构建缓存（自动生成）
├── .output/                # 构建输出（自动生成）
├── node_modules/           # 依赖包
├── package.json            # 项目配置和依赖
├── nuxt.config.ts          # Nuxt配置文件
├── vitest.config.ts        # 测试配置
└── eslint.config.mjs       # ESLint配置
```

### app/ 目录结构
```
app/
├── assets/                 # 静态资源
│   └── css/               # 样式文件
├── components/            # Vue组件
│   └── IconConverterMain.vue  # 主转换器组件
├── composables/           # 组合式函数
│   ├── useIconConverter.ts    # 图标转换逻辑
│   ├── usePngConverter.ts     # PNG转换专用
│   └── __tests__/            # 组合式函数测试
├── pages/                 # 页面路由
│   └── index.vue          # 首页
├── types/                 # TypeScript类型定义
│   ├── index.ts           # 主要类型导出
│   ├── canvas.ts          # Canvas相关类型
│   ├── platform.ts        # 平台配置类型
│   ├── services.ts        # 服务接口类型
│   └── validation.ts      # 验证相关类型
├── utils/                 # 工具函数
│   ├── index.ts           # 工具函数导出
│   ├── file-utils.ts      # 文件处理工具
│   ├── image-utils.ts     # 图像处理工具
│   └── platform-utils.ts  # 平台相关工具
└── app.config.ts          # 应用配置
```

## 架构模式

### 组件组织
- **页面组件**: `pages/` - 路由级别组件
- **功能组件**: `components/` - 可复用UI组件
- **布局组件**: 使用Nuxt默认布局系统

### 逻辑分层
- **Composables**: 业务逻辑和状态管理
- **Utils**: 纯函数工具，无状态
- **Types**: TypeScript类型定义
- **Services**: 外部API和复杂业务逻辑

### 状态管理
- 使用Vue 3组合式API的`ref`和`reactive`
- Composables封装状态逻辑
- 无需额外状态管理库（Pinia/Vuex）

## 命名约定

### 文件命名
- **组件**: PascalCase (IconConverterMain.vue)
- **Composables**: camelCase with use前缀 (useIconConverter.ts)
- **Utils**: kebab-case (file-utils.ts)
- **Types**: camelCase (index.ts)

### 代码约定
- **变量**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **类型**: PascalCase
- **接口**: PascalCase with I前缀（可选）

## 测试组织

### 测试文件位置
- 组合式函数测试: `composables/__tests__/`
- 组件测试: 与组件同目录或专用`__tests__`文件夹
- 工具函数测试: `utils/__tests__/`

### 测试命名
- 测试文件: `*.test.ts` 或 `*.spec.ts`
- 测试描述: 使用中文或英文，保持一致性

## 导入规范

### 路径别名
- `~` 或 `@`: 指向 `app/` 目录
- 相对路径: 同级或子级文件
- 绝对路径: 跨目录引用

### 导入顺序
1. Node.js内置模块
2. 第三方依赖
3. Nuxt/Vue相关
4. 项目内部模块（按层级排序）

### 自动导入
- Composables自动导入
- Utils自动导入
- 组件自动注册
- 类型需要显式导入
