module.exports = {
  entry: './src/app/index.js',
	devtool: 'inline-source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
};