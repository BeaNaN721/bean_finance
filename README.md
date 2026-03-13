# 💰 记账软件 (Bean Finance)

这是一个基于 **NestJS + Vue 3** 开发的个人记账应用程序。它旨在提供一个简单、直观且高效的记账体验。

[演示](./img/记账软件_演示.png)

## 🚀 技术栈

- **后端 (Backend)**:
  - `NestJS` (Node.js 框架)
  - `MariaDB` (数据库)
  - `TypeORM` (ORM 框架)
- **前端 (Frontend)**:
  - `Vue 3` (构建工具 Vite)
  - `Axios` (网络请求)
  - `Element Plus` (UI 组件库)
- **其他**:
  - `TypeScript` 全程开发
  - `pnpm` 包管理

## 🛠 功能亮点

- ✅ **核心 CRUD**: 支持账单的新增、查询、修改与删除。
- ✅ **智能统计**: 自动计算总余额，即时反馈财务状况。
- ✅ **现代交互**: 支持收入/支出分类、备注添加及自定义日期。
- ✅ **界面优雅**: 采用磨砂玻璃质感 UI 设计。

## 📦 快速开始

### 1. 前置准备
确保已安装：
- Node.js (v18+)
- MariaDB
- pnpm

### 2. 启动后端
```bash
cd bean_finance
# 配置数据库连接 (src/app.module.ts)
pnpm run start:dev
```

### 3. 启动前端
```bash
cd bean_finance_frontend
# 安装依赖
pnpm install
# 运行
pnpm run dev
```

## 📝 数据库结构 (Transaction Entity)

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | number | 主键自增 |
| `amount` | int | 金额 (单位：分) |
| `type` | enum | 收入 (income) / 支出 (expense) |
| `category` | string | 账单分类 |
| `note` | string | 备注信息 |
| `recordedAt` | timestamp | 记账时间 |
| `createdAt` | timestamp | 创建时间 |

## 💡 开发心得

- **金额精度**: 为了避免浮点数计算误差，项目全程使用“分”作为整数单位存储，前端展示时再进行格式化处理。
- **前后端联动**: 通过 CORS 配置实现跨域通信，利用 Axios 封装 API 模块，保持代码整洁。
- **响应式 UI**: 利用 Vue 的 `computed` 和 `ref` 实现余额实时自动计算。

---

> 这是一个练手项目，目前支持单机运行，未来计划增加用户鉴权和图表统计功能。

---