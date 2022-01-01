const config = {
  mode: "production",
  entry: {
    background: "./src/background.mts",
    content: "./src/content.mts",
  },
  module: {
    rules: [
      {
        test: /\.[cm]?[jt]sx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};

export default config;
