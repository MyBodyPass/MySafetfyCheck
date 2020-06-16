module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    "semi": "off",
    "max-len": ["warn", { "code": 120 }],
    "no-warning-comments": "warn",
    "import/extensions": "off"
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
