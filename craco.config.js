// Source: https://react-pdf.org/advanced#webpack-config
// Related: https://github.com/diegomura/react-pdf/issues/1926#issuecomment-1180228351

const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          module: "empty",
          dgram: "empty",
          dns: "mock",
          fs: "empty",
          http2: "empty",
          net: "empty",
          tls: "empty",
          child_process: "empty",
          process: require.resolve("process/browser"),
          zlib: require.resolve("browserify-zlib"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          buffer: require.resolve("buffer"),
          asset: require.resolve("assert"),
        },
      },
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ],
    },
  },
};
