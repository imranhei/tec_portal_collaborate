const withMT = require("@material-tailwind/react/utils/withMT");
const { colors } = require("@mui/material");

module.exports = withMT({
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});