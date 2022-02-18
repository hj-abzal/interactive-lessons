/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

// eslint-disable-next-line no-undef
module.exports = () => {
    return {
        devtool: 'eval-source-map',
        context: __dirname,
        entry: {
            main: path.resolve(__dirname, './src/index.tsx')
            // add only if needed
            // polyfills: path.resolve(__dirname, "./src/polyfills.ts"),
        },
        target: 'web',
        mode: 'development',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[fullhash].bundle.js',
            publicPath: production ? './' : '/',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.svg'],
            alias: {
                // eslint-disable-next-line no-undef
                '@': path.resolve(__dirname, './src')
            }
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },

                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader'
                },

                {
                    test: /\.(png|jpeg|jpg|gif|webp)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.svg$/,
                    exclude: [
                        path.resolve(__dirname, 'src', 'codgen')
                    ],
                    use: [
                        {
                            loader: '@svgr/webpack',
                            options: {
                                svgoConfig: {
                                  plugins: {
                                    removeViewBox: false
                                  }
                                }
                              }
                        },
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: '[name].[hash:7].[ext]',
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    include: [
                        path.resolve(__dirname, 'src', 'codgen')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 100,
                                name: '[name].[hash:7].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/, 
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\all-images\.ts$/,
                    loader: 'file-replace-loader',
                    options: {
                        condition: 'if-replacement-exists',
                        replacement: process.env.IMAGES_CONFIG_PATH || '',
                        async: true,
                    }
                }
            ]
        },
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/public/index.html'),
            }),
            new WebpackCdnPlugin({
                modules: [
                    {
                        name: 'react',
                        var: 'React',
                        path: production ?
                            'umd/react.production.min.js' :
                            'umd/react.development.js'
                    },
                    {
                        name: 'react-dom',
                        var: 'ReactDOM',
                        path: production ?
                            'umd/react-dom.production.min.js' :
                            'umd/react-dom.development.js'
                    }
                ],
                publicPath: '/node_modules'
            }),
            new ForkTsCheckerWebpackPlugin(),
            new webpack.DefinePlugin({
                'ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            })
        ],
        devServer: {
            port: 3001,
            historyApiFallback: true,
            open: true,
        }
    };
};
