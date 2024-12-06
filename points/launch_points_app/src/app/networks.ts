// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

import { getRoochNodeUrl } from '@roochnetwork/rooch-sdk';
import { createNetworkConfig } from '@roochnetwork/rooch-sdk-kit';

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
	mainnet: {
		url: getRoochNodeUrl('mainnet'),
		variables: {
			contractAddr: '0xe4ca4b1a52adce45fe6ba790dc2b4c581a23123d8dff9e21f9c40ab75a3a256b',
			contractVersion: 'v1'
		},
	},
	testnet: {
		url: getRoochNodeUrl('testnet'),
		variables: {
			contractAddr: '0xe4ca4b1a52adce45fe6ba790dc2b4c581a23123d8dff9e21f9c40ab75a3a256b',
			contractVersion: 'v1'
		},
	},
	localnet: {
		url: getRoochNodeUrl('localnet'),
		variables: {
			contractAddr: '0xe4ca4b1a52adce45fe6ba790dc2b4c581a23123d8dff9e21f9c40ab75a3a256b',
			contractVersion: 'v1'
		},
	},
});

export { networkConfig, useNetworkVariable, useNetworkVariables };