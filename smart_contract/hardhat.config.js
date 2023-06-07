 // https://eth-sepolia.g.alchemy.com/v2/CAb80bNX8IyBxEaQvuhpU6GgOCrrUqqf
 require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/CAb80bNX8IyBxEaQvuhpU6GgOCrrUqqf',
      accounts: ['33092447ab610e99e7e2f77c129d87bbee7c7ea3713aecfe527419870c1deb32'],
    },
  },
};