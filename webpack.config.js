/**
 * Use create-react-app to create a new React app.
 * It handles all the configuration and setup for you and has almost all the bells and whistles you need to get started.
 * I havent had to write my own webpack config in years 
 */
module.exports = {
  "output": {
    "filename": "[name].pack.js"
  },
  "module": {
    "rules": [
      {
        "use": {
          "loader": "babel-loader",
          "options": {
            "presets": [
              "babel-preset-env",
              "babel-preset-react"
            ]
          }
        },
        "exclude": /node_modules/,
        "test": /\.js$/
      }
    ]
  },
  "entry": {
    "index": "./index"
  }
};