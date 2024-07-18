// @see: https://cz-git.qbenben.com/zh/guide
const fs = require("fs");
const path = require("path");

const scopes = fs
  .readdirSync(path.resolve(__dirname, "src"), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name.replace(/s$/, ""));

/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [commit => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 108],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "subject-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "wip"
      ]
    ]
  },
  prompt: {
    messages: {
      type: "选择你要提交的类型 :",
      scope: "选择一个提交范围（可选）:",
      customScope: "请输入自定义的提交范围 :",
      subject: "填写简短精炼的变更描述 :\n",
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: "选择关联issue前缀（可选）:",
      customFooterPrefixs: "输入自定义issue前缀 :",
      footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      confirmCommit: "是否提交或修改commit ?"
    },
    types: [
      { value: "feat", name: "特性:   🚀  新特性、新功能", emoji: "🚀" },
      { value: "fix", name: "修复:   🧩  修复bug", emoji: "🧩" },
      { value: "docs", name: "文档:   📚  文档修改", emoji: "📚" },
      { value: "style", name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: "🎨" },
      { value: "refactor", name: "重构:   ♻️  代码重构", emoji: "♻️" },
      { value: "perf", name: "性能:    ⚡️  改善性能", emoji: "⚡️" },
      { value: "test", name: "测试:   ✅  测试用例修改", emoji: "✅" },
      { value: "build", name: "构建:   📦️  变更项目构建或外部依赖", emoji: "📦️" },
      { value: "ci", name: "集成:   🎡  更改持续集成软件的配置文件和 package 中的 scripts 命令", emoji: "🎡" },
      { value: "revert", name: "回退:   ⏪️  回滚到上一个版本", emoji: "⏪️" },
      { value: "chore", name: "其他:   🔨  变更构建流程或辅助工具", emoji: "🔨" },
      { value: "wip", name: "开发:   🕔  正在开发中", emoji: "🕔" }
    ],
    useEmoji: true,
    scopes: [...scopes],
    customScopesAlign: "bottom",
    emptyScopesAlias: "empty",
    customScopesAlias: "custom",
    allowBreakingChanges: ["feat", "fix"]
  }
};
