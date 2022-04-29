import fs from "fs";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack, { Configuration } from "webpack";
import { merge, mergeWithCustomize, unique } from "webpack-merge";
import nxReactWebpackConfig from "@nrwl/react/plugins/webpack.js";

const I18N_DIR = path.resolve(__dirname, "node_modules", "@wso2is", "i18n", "dist", "bundle");
const metaFiles = fs.readdirSync(I18N_DIR);

const metaFile = metaFiles ? metaFiles.filter(file => file.startsWith("meta"))[ 0 ] : null;
const metaHash = metaFile ? metaFile.split(".")[ 1 ] : null;

module.exports = (config: Configuration, context) => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nxReactWebpackConfig(config);

    const isProduction = config.mode === "production";
    const template = context.buildOptions?.index ?? context.options.index;

    config = merge(config, {
        entry: {
            init: [ "@babel/polyfill", "./src/init/init.ts" ],
            main: "./src/index.tsx"
        }
    });

    config.plugins.push(
        new HtmlWebpackPlugin({
            filename: path.join(process.cwd(), "apps", "myaccount", "build", "myaccount", "index.html"),
            hash: true,
            minify: false,
            template: path.join(process.cwd(), template),
            themeHash: "test"
        })
    );

    // Remove the current html plugin added by NX
    const indexHtmlWebpackPluginIndex = config.plugins.findIndex((plugin) =>
        plugin.constructor.name === "IndexHtmlWebpackPlugin");

    if (indexHtmlWebpackPluginIndex !== -1) {
        config.plugins.splice(indexHtmlWebpackPluginIndex, 1);
    }

    config.node = {
        ...config.node,
            // provides the global variable named "global"
            global: true
    };

    config.resolve = merge(config.resolve, {
        alias: {
            // Can get rid of the relative paths when using the custom render function.
            // https://testing-library.com/docs/react-testing-library/setup/#configuring-jest-with-test-utils
            "@unit-testing": path.resolve(__dirname, "test-configs/utils"),
            react: path.resolve("node_modules/react")
        },
        extensions: [ ".json" ],
        // In webpack 5 automatic node.js polyfills are removed.
        // Node.js Polyfills should not be used in front end code.
        // https://github.com/webpack/webpack/issues/11282
        fallback: {
            buffer: false,
            fs: false
        }
    });

    config.module.rules.unshift({
        test: /\.worker\.(ts|js)$/,
        use: {
            loader: "worker-loader",
            options: {
                inline: true
            }
        }
    });

    config = mergeWithCustomize({
        customizeArray: unique(
            "plugins",
            [ "DefinePlugin" ],
            (plugin) => plugin.constructor && plugin.constructor.name
        )
    })(
        config,
        {
            plugins: [
                new webpack.DefinePlugin({
                    "process.env": {
                        metaHash: JSON.stringify(metaHash),
                        NODE_ENV: "\"development\"",
                        NX_CLI_SET: "\"true\"",
                        NX_WORKSPACE_ROOT: "\"/Users/user/Desktop/wso2/portal-rearchitecture/identity-apps\"",
                        NX_TERMINAL_OUTPUT_PATH: "\"/Users/user/Desktop/wso2/portal-rearchitecture/identity-apps/node_modules/.cache/nx/terminalOutputs/66fda8e075ff9c198d18be9eefe4fad4c31485c57d81cdf2d3efd2fb16ceafeb\"",
                        NX_FORWARD_OUTPUT: "\"true\"",
                        NX_TASK_TARGET_PROJECT: "\"myaccount\"",
                        NX_TASK_HASH: "\"66fda8e075ff9c198d18be9eefe4fad4c31485c57d81cdf2d3efd2fb16ceafeb\""
                    }
                }),
                new webpack.ProvidePlugin({
                    process: "process/browser"
                })
            ]
        }
    );

    return {
        stats: "children",
        ...config
    };
};
