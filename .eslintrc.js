// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ["plugin:vue/essential", "@vue/prettier"],
  // required to lint *.vue files
  plugins: ["vue"],
  // check if imports actually resolve
  settings: {
    "import/resolver": {
      webpack: {
        config: "build/webpack.base.config.js",
      },
    },
  },
  rules: {
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: [
          "state", // for vuex state
          "acc", // for reduce accumulators
          "e", // for e.returnvalue
        ],
      },
    ],
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // others
    "no-console": "off",
    "comma-dangle": ["error", "only-multiline"],
    "import/no-webpack-loader-syntax": "off",
    "import/first": "off",
    "linebreak-style": ["off", "windows"],
    "no-trailing-spaces": 0,
  },
  globals: {
    window: true,
    document: true,
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getCurrentPages: true,
  },
};
