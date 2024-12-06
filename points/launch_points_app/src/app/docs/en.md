# Stablelend Protocol Whitepaper

## Table of Contents

1. [Introduction](#1-introduction)
2. [Protocol Overview](#2-protocol-overview)
3. [UTXO and Asset Management](#3-utxo-and-asset-management)
4. [Stablelend Tokens: slUSD and UPC](#4-stablelend-tokens-slusd-and-upc)
5. [Lending and Borrowing Mechanism](#5-lending-and-borrowing-mechanism)
6. [UTXO Financial Ecosystem (UFES)](#6-utxo-financial-ecosystem-ufes)
7. [Collateral and Leverage System](#7-collateral-and-leverage-system)
8. [Risk Management and Liquidation](#8-risk-management-and-liquidation)
9. [Governance and Future Development](#9-governance-and-future-development)
10. [Milestones and Roadmap](#10-milestones-and-roadmap)
11. [Conclusion](#11-conclusion)

## 1. Introduction

Stablelend: Revolutionizing Bitcoin DeFi

Stablelend is an innovative decentralized finance (DeFi) protocol built on the Rooch Network - a cutting-edge Layer 2
solution tailored for Bitcoin. Leveraging Rooch's advanced stacking technology, Stablelend achieves unprecedented low
friction and high efficiency in the Bitcoin DeFi space.

Key Advantages:

1. Seamless Bitcoin Integration: Stablelend directly utilizes the security and value of Bitcoin UTXOs, allowing users to
   participate in DeFi activities without the need for token conversions.
2. Low Interaction Friction: Thanks to Rooch's Layer 2 technology, Stablelend significantly reduces transaction fees and
   confirmation times, offering near-instantaneous transaction experiences.
3. Rich DeFi Functionality: Users can engage in complex financial operations such as lending, borrowing, staking, and
   liquidity mining - activities that were previously challenging to implement on the traditional Bitcoin network.
4. High Scalability: Stablelend's modular design allows for easy integration of new financial products and services,
   providing unlimited possibilities for future innovations.
5. Security and Reliability: Inheriting the robust security of the Bitcoin network while leveraging Rooch's advanced
   technology to provide an additional layer of protection.

Stablelend is redefining Bitcoin's role in the DeFi landscape, offering users a low-barrier, high-efficiency, and
feature-rich financial ecosystem. Whether you're a Bitcoin holder or a DeFi enthusiast, Stablelend opens up a new world
of opportunities, bridging the gap between Bitcoin's inherent value and the innovative world of decentralized finance.

By harnessing the power of Rooch's Layer 2 solution, Stablelend is set to unlock the full potential of Bitcoin in the
DeFi space, providing a seamless, efficient, and expansive protocol that caters to both seasoned crypto users and
newcomers alike.

## 2. Protocol Overview

Stablelend is designed to provide a comprehensive suite of DeFi services centered around Bitcoin UTXOs and Rooch network
assets. The key features of the protocol include:

1. UTXO and Rooch asset collateralization
2. A novel stablecoin (slUSD) backed by a diverse collateral pool
3. UPC tokens representing leveraged long positions on the collateral
4. Lending and borrowing services
5. A dynamic collateral management system
6. Liquidation mechanisms to maintain system stability
7. A comprehensive UTXO Financial Ecosystem (UFES)

## 3. UTXO and Asset Management

### 3.1 Supported Collateral Types

Stablelend supports multiple types of collateral:

1. Bitcoin UTXOs (self-locked in user wallets)
2. Babylon staking assets
3. Rooch native assets
4. BRC-20 tokens and other extended protocol assets

### 3.2 UTXO Collateralization Process

When users collateralize their Bitcoin UTXOs:

1. UTXOs remain in the user's wallet but are self-locked
2. No on-chain Bitcoin transaction occurs for collateralization
3. The locked status is managed and verified by the Stablelend protocol on the Rooch network

### 3.3 Rooch Asset Collateralization

Rooch native assets and other supported tokens:

1. Are directly locked in the Stablelend smart contract on the Rooch network
2. Serve as primary liquidation assets in case of undercollateralization

### 3.4 Collateral Valuation and Monitoring

The protocol continuously monitors the value of collateralized assets:

1. Utilizes oracles for real-time price feeds
2. Adjusts collateral requirements based on market volatility
3. Triggers liquidation processes when necessary to maintain system stability

## 4. Stablelend Tokens: slUSD and UPC

### 4.1 slUSD Stablecoin

slUSD is the protocol's stablecoin, designed to maintain a 1:1 peg with the US Dollar:

1. Backed by the diverse collateral pool of UTXOs and Rooch assets
2. Minted when users deposit collateral and borrow against it
3. Burned when loans are repaid

### 4.2 UPC Token

UPC represents a tokenized leveraged long position on the collateral pool:

1. Absorbs price fluctuations of the underlying assets
2. Allows users to gain leveraged exposure to the collateral pool's performance
3. Price is dynamically adjusted based on the collateral pool's value and slUSD supply

### 4.3 Token Relationship and Pricing Model

The relationship between slUSD and UPC is governed by the following equation:

$$
\text{Total Collateral Value} = \text{slUSD Supply} + \text{UPC Market Cap}
$$

The UPC price is calculated as:

$$
\text{UPC Price} = \frac{\text{Total Collateral Value} - \text{slUSD Supply}}{\text{UPC Supply}}
$$

## 5. Lending and Borrowing Mechanism

### 5.1 Borrowing Process

1. Users deposit collateral (UTXOs or Rooch assets)
2. The protocol calculates the maximum borrowing capacity based on the collateral value and current market conditions
3. Users can borrow slUSD up to their borrowing capacity
4. Interest rates are dynamically adjusted based on utilization rates and market demand

### 5.2 Repayment and Liquidation

1. Users can repay their loans at any time
2. If the collateral value falls below the required threshold, the liquidation process is triggered
3. Liquidators can repay the loan and claim a portion of the collateral as a reward

## 6. UTXO Financial Ecosystem (UFES)

The UFES is a comprehensive suite of financial services built around the Stablelend protocol:

1. Decentralized Exchange (DEX) for trading slUSD, UPC, and other assets
2. Yield farming opportunities for liquidity providers
3. Synthetic asset creation using slUSD as collateral
4. Options and futures markets for hedging and speculation
5. UTXO-based lottery and prediction markets
6. Cross-chain bridges for interoperability with other blockchain networks

## 7. Collateral and Leverage System

### 7.1 Collateral Ratios

The protocol maintains different collateral ratios for various asset types:

1. Bitcoin UTXOs: 150% minimum collateral ratio
2. Rooch native assets: 120% minimum collateral ratio
3. Other supported assets: Varies based on liquidity and volatility

### 7.2 Leverage Mechanism

Users can gain leveraged exposure to the collateral pool through UPC tokens:

1. Maximum leverage is determined by the overall system stability and individual asset types
2. Leverage is automatically adjusted based on market conditions to maintain system solvency

## 8. Risk Management and Liquidation

### 8.1 Risk Parameters

The protocol employs various risk management strategies:

1. Dynamic collateral requirements
2. Utilization-based interest rate model
3. Gradual liquidation process to minimize market impact
4. Insurance fund to cover potential shortfalls

### 8.2 Liquidation Process

1. Liquidation is triggered when a position's collateral ratio falls below the minimum threshold
2. Liquidators repay a portion of the outstanding debt and receive a discount on the collateral
3. The process continues until the position is fully liquidated or brought back above the minimum collateral ratio

## 9. Governance and Future Development

Stablelend employs a decentralized governance model:

1. UPOOL token holders can participate in governance decisions
2. Proposals for protocol upgrades, parameter adjustments, and new features can be submitted and voted on
3. A tiered governance structure ensures both rapid response to urgent matters and thoughtful consideration of long-term
   changes

## 10. Milestones and Roadmap

### Phase 1: Foundation (Q4 2024 - Q1 2025)

- Launch of core Stablelend protocol on Rooch testnet
- Implementation of UTXO collateralization mechanism
- Development of slUSD stablecoin and UPC token
- Basic lending and borrowing functionality

### Phase 2: Expansion (Q1 2025 - Q4 2025)

- Mainnet launch of Stablelend protocol
- Integration with major Bitcoin wallets for seamless UTXO locking
- Launch of Decentralized Exchange (DEX) for slUSD and UPC trading
- Implementation of yield farming and liquidity mining programs

### Phase 3: Ecosystem Growth (Q1 2026 - Q4 2026)

- Introduction of synthetic assets backed by slUSD
- Launch of options and futures markets
- Development of cross-chain bridges for increased interoperability
- Implementation of UTXO-based lottery and prediction markets

### Phase 4: Advanced Features (Q1 2027 - Q4 2027)

- Introduction of leveraged trading capabilities
- Launch of UTXO index funds and structured products
- Implementation of advanced risk management tools
- Development of institutional-grade services and API

### Phase 5: Expansion (Q1 2028 onwards)

- Expansion of supported assets to include global cryptocurrencies and tokenized real-world assets
- Integration with traditional finance systems for increased adoption
- Development of user-friendly mobile applications for wider accessibility
- Continuous improvement of protocol efficiency and security

## 11. Conclusion

Stablelend represents a significant step forward in bringing advanced DeFi capabilities to the Bitcoin ecosystem. By
leveraging the security of Bitcoin UTXOs and the flexibility of the Rooch network, Stablelend offers a comprehensive
suite of financial services while maintaining the core principles of decentralization and security. As the protocol
evolves and expands, it has the potential to bridge the gap between traditional finance and the world of
cryptocurrencies, unlocking new opportunities for users worldwide.

