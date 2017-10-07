module.exports = {
	networks: {
		development: {
			host: "localhost",
			port: 8545,
			network_id: "*",
			// 1 finney deployment cost:
			gas: 1000000,
			gasPrice: 1000000000
		},
		cml: {
			host: "insurhack.cmlteam.com",
			port: 8545,
			network_id: "*",
			// 10 finney deployment cost:
			gas: 1000000,
			gasPrice: 1000000000
		}
	}
};
