module.exports={
    presets: [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "entry"
            }
        ]
    ],
    env: {
    test: {
      plugins: ["@babel/plugin-transform-modules-commonjs"]
    }
  }
}
