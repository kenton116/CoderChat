module.exports = {
  context: __dirname + '/app',
  entry: './quiz-chat',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'quiz-chat.js'
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};