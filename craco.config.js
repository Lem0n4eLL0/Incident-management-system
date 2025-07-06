const path = require('path');

const resolvePath = (p) => path.resolve(__dirname, p);

module.exports = {
  webpack: {
    alias: {
      '@components': resolvePath('./src/components'),
      '@utils': resolvePath('./src/utils'),
      '@layout': resolvePath('./src/layout'),
      '@pages': resolvePath('./src/pages'),
      '@services': resolvePath('./src/services'),
      '@ui': resolvePath('./src/components/ui'),
      '@custom-types': resolvePath('./src/types'),
      '@constants': resolvePath('./src/constants'),
      '@types': resolvePath('./src/types'),
    },
  },
};
