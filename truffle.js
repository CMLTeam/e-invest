module.exports = {
	networks: {
		development: {
			host: "localhost",
			port: 8545,
			network_id: "*",
			// 10 finney deployment cost:
			gas: 1000000,
			gasPrice: 10000000000
		}
	}
};
