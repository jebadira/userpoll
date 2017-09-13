var PATHS = {
    "production": "",
    "images": "",
    "imagesPublic": "",
    "filesPublic": "",
    "scripts": ""
};
var webpack = require('webpack');
module.exports = {
    entry: __dirname + "/src/webparts/userPoll/flux/containers/PollContainer.jsx",
    output: {
        path: __dirname + "/src/webparts/userPoll/dist/",
        //filename: "scripts/[name].bundle.js",
        filename : "scripts/7b7b360225a24f25928d8c1b67aa74b1.js",
        //library : "User Poll",
        library : "7b7b360225a24f25928d8c1b67aa74b1",
        libraryTarget: "window"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.less']
    },
    module: {
        rules: [
            {
                test: /\require.js$/,
                loader: "script-loader"
            },
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                loader: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 25000,
                            outputPath: PATHS.images,
                            publicPath: PATHS.imagesPublic
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            progressive: true,
                            optimizationLevel: 7,
                            interlaced: false,
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            }
                        },
                    },
                ]
            },
            /*
            consider putting this in later but only when we have more files.  dont want to include too many things.
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "script-loader"
            }*/

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "sass-loader",
                    }

                ]
            },
            {
                test: /.*\.(less)$/i,
                use: [{
                    loader: "style-loader"
                },
                {
                    loader: "css-loader",
                    options: {
                        modules : true
                    }
                }
                ,{
                    loader: "less-loader"
                }
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /.*\.(tsx|jsx|ts|js)$/i,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ["env", {
                                    "targets": {
                                        "browsers": ["last 3 versions", ">1%"]
                                    },
                                    useBuiltIns: true,
                                }
                                ],
                               // ["es2017"],
                               // ["es2016"],
                                ["es2015", {"modules" : false}],
                                ["react"],
                            ],
                            plugins: [
                                "transform-es2015-modules-commonjs",
                                "syntax-dynamic-import"
                            ]
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
        "process.env": { 
            NODE_ENV: JSON.stringify("production") 
        }
        })
    ],
    amd: {
        jQuery: true,
       // requirejs: true
    },
    resolve: {
        alias: {
            //requirejs: __dirname + "/src/webparts/webPortal/vendor/scripts/require.js",

        }
    },
    watch: true,
}