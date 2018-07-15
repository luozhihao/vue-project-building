const path = require('path');
const fs = require('fs')
const utils = require('./build/utils');

const webpack = require('webpack')

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

// 用于做相应的merge处理
const merge = require('webpack-merge');

let baseUrl = '/tmcwx/';

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {

	// 项目部署的基础路径
  	// 我们默认假设你的应用将会部署在域名的根部，
  	// 比如 https://www.my-app.com/
  	// 如果你的应用时部署在一个子路径下，那么你需要在这里
  	// 指定子路径。比如，如果你的应用部署在
  	// https://www.foobar.com/my-app/
 	// 那么将这个值改为 `/my-app/`
    baseUrl: baseUrl,


    // 将构建好的文件输出到哪里
    outputDir: 'dist',

    // 放置静态资源的地方 (js/css/img/font/...)
    // assetsDir: 'assets',

    // 是否在保存的时候使用 `eslint-loader` 进行检查。
  	// 有效的值：`ture` | `false` | `"error"`
  	// 当设置为 `"error"` 时，检查出的错误会触发编译失败。
    lintOnSave: false,

    // 使用带有浏览器内编译器的完整构建版本
    // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
    // compiler: false,

    // babel-loader 默认会跳过 node_modules 依赖。
    // 通过这个选项可以显式转译一个依赖。
    transpileDependencies: [/* string or regex */],

    // 是否为生产环境构建生成 source map？
    productionSourceMap: true,

    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
    chainWebpack: config => {
    	/*config
    		.entry('app')
    		.clear()
    		.add(path.resolve(__dirname, 'src/index.js'))
    		.end()*/
    },
    configureWebpack: config => {
    	/*if (process.env.NODE_ENV === 'stage') {
    		// console.log(config);
    	} else {
    		console.log(123);
    	}*/

    	config.entry = utils.getEntries();

		config.plugins = [
		    new VueLoaderPlugin(),
		    new LodashModuleReplacementPlugin(),
		   	new webpack.DefinePlugin({
		     	'process.env': {
		     		NODE_ENV: JSON.stringify(process.env.NODE_ENV),
		     		BASE_URL: baseUrl,
		     	}
		   	}),
		   	...utils.htmlPlugin(),
		   	new webpack.HotModuleReplacementPlugin(),
		    new webpack.optimize.OccurrenceOrderPlugin(), //为模块指定id
		    new webpack.NoEmitOnErrorsPlugin(),
		    new FriendlyErrorsPlugin()
		]
    },

    // CSS 相关选项
    css: {

    	// 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    	// 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    	extract: false,

    	// 是否开启 CSS source map？
    	sourceMap: false,

    	// 为预处理器的 loader 传递自定义选项。比如传递给
    	// sass-loader 时，使用 `{ sass: { ... } }`。
    	loaderOptions: {
    		sass: {
	        	data: fs.readFileSync('src/assets/variables.less', 'utf-8')
	      	}
    	},

    	// 为所有的 CSS 及其预处理文件开启 CSS Modules。
    	// 这个选项不会影响 `*.vue` 文件。
    	modules: false,
    },

    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,

    // PWA 插件的选项。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
    pwa: {},

    // 配置 webpack-dev-server 行为。
    devServer: {
    	historyApiFallback: {
	      	rewrites: [
	        	{ from: new RegExp(baseUrl + 'flight'), to: baseUrl + 'flight.html' },
	        	{ from: new RegExp(baseUrl + 'car'), to: baseUrl + 'car.html' },
	      	]
	    },
    	open: false,
    	host: '127.0.0.1',
    	port: 8082,
    	https: false,
    	hotOnly: false,

    	// 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    	proxy: null, // string | Object
    	before: app => {
    		const ip = require('./build/lib/ip');
    		const uri = `http://${ip}`;

    		// handle fallback for HTML5 history API
    		/*app.use(require('connect-history-api-fallback')({
    		    rewrites: [
			        { from: baseUrl + "flight", to: baseUrl + '/flight.html' },
			        { from: baseUrl + "car", to: baseUrl + '/car.html' },
			    ]
    		}))*/

    		console.log('> Listening at ' + uri + '\n')
    	},
    	after: app => {

    	}
    },

    // 三方插件的选项
    pluginOptions: {
    	// ...
    }
}