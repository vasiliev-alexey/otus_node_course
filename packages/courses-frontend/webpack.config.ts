import { GitRevisionPlugin } from "git-revision-webpack-plugin";
import "webpack-dev-server";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import * as webpack from "webpack";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import * as path from "path";

const gitRevisionPlugin = new GitRevisionPlugin();
const envPluginProd = new webpack.EnvironmentPlugin([]);

const envPluginDev = new webpack.EnvironmentPlugin([]);

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const Dotenv = require("dotenv-webpack");

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const getTsConfigName = (mode: string) =>
  mode === "production" ? "tsconfig.prod.json" : "tsconfig.dev.json";
const webpackConfig = (
  env: {
    production: boolean;
    development: boolean;
  },
  arg: {
    mode: string;
  }
): Configuration => ({
  entry: "./src/index.tsx",

  devServer: {
    historyApiFallback: true,
    hot: true,
    open: "google-chrome",
    headers: {
      "Access-Control-Allow-Origin": "http://localhost",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
    proxy: {
      "*": {
        target: "http://localhost:4000/",
      },
    },
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    //@ts-ignore
    plugins: [
      new TsconfigPathsPlugin({
        configFile: getTsConfigName(arg.mode),
      }),
    ],
  },
  output: {
    path: path.join(
      __dirname,
      arg.mode === "production" ? "../courses-backend/public" : "dist"
    ),

    filename: "index.js",
  },

  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-react",
            "@babel/preset-env",
            "@babel/preset-typescript",
          ],
          plugins: ["@babel/plugin-transform-runtime"],
        },
        exclude: /dist/,
      },

      {
        test: /\.(sass|scss|css)$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },

      { test: /\.(mp3)$/, loader: "file-loader" },
      {
        test: /\.(jpg|svg|png)$/,
        loader: "url-loader",
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,

        type: "asset/resource",
      },
    ],
  },

  plugins: [
    gitRevisionPlugin,
    arg.mode === "production"
      ? envPluginProd
      : new Dotenv({
          safe: true,
          path: path.resolve(__dirname, ".env"),
        }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.version()),
      COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
      BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      LASTCOMMITDATETIME: JSON.stringify(
        gitRevisionPlugin.lastcommitdatetime()
      ),

      "process.env.PRODUCTION": env.production || !env.development,
      "process.env.NAME": JSON.stringify(require("../../package.json").name),
      "process.env.VERSION": JSON.stringify(
        require("../../package.json").version
      ),
    }),
    new HtmlWebpackPlugin({
      pluginId: "HtmlWebpackPlugin",
      template: "./public/index.html",
      favicon: "./public/img/course-64.png",
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./src/**/*.{ts,tsx}", // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
      },
      typescript: {
        tsconfig: getTsConfigName(arg.mode),
        configFile: getTsConfigName(arg.mode),
      },
    }),
  ],
});

export default webpackConfig;
