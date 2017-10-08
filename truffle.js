module.exports = {
	networks: {
		development: {
			host: "localhost",
			port: 8545,
			network_id: "*",
			// 1.5 finney deployment cost:
			gas: 1500000,
			gasPrice: 1000000000
		},
		cml: {
			host: "insurhack.cmlteam.com",
			port: 8545,
			network_id: "*",
			// 15 finney deployment cost:
			gas: 1500000,
			gasPrice: 10000000000
		}
	}
};
