// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

module launch_points::earn_points {

    use std::string::{Self, String};
    use std::option;
    use std::u64;
    use moveos_std::type_table::key;
    use rooch_framework::coin_store;
    use rooch_framework::coin_store::{CoinStore};

    use moveos_std::event::emit;
    use moveos_std::tx_context::sender;
    use moveos_std::table;
    use moveos_std::table::Table;
    use moveos_std::object::{Self, };
    use moveos_std::signer;
    use moveos_std::object::{Object, ObjectID};
    use moveos_std::timestamp;
    use moveos_std::account;
    use moveos_std::event_queue::{Self, Subscriber};
    use moveos_std::type_info;
    use rooch_framework::account_coin_store;
    use rooch_framework::coin;
    use rooch_framework::coin::{CoinInfo, Coin};
    use bitcoin_move::bbn::{Self, BBNStakeSeal};
    use bitcoin_move::bitcoin;
    use bitcoin_move::utxo::{Self, UTXO, value, TempStateDropEvent};

    struct HelloMessage has key, store {
        text: string::String
    }

    entry fun say_hello(owner: &signer) {
        let hello = HelloMessage { text: string::utf8(b"Hello Rooch!") };
        account::move_resource_to(owner, hello);
    }

    fun ok(): bool {
        return true
    }


    const DEPLOYER: address = @launch_points;

    const MaxAssertWeight: u64 = 10;
    const PerDaySeconds: u32 = 86400;
    const PerHourSeconds: u32 = 3600;
    const ReleaseDays: u32 = 50;

    struct SLP has key, store {}

    const COIN_TOTAL_SUPPLY: u128 = 100_0000_0000_0000;
    const COIN_NAME: vector<u8> = b"StableLend Pont";
    const COIN_SYMBOL: vector<u8> = b"SLP";
    const COIN_ICON_URL: vector<u8> = b"";

    struct Vault has store, key {
        coin_info: Object<CoinInfo<SLP>>,
        coin_store: Table<String, ObjectID>,
    }

    struct StakingAsset has key {
        vault: Object<Vault>,
        stake_value: Table<String, u64>,
        stake_table: Table<ObjectID, address>,
        release_per_second: u128,
        last_update_time: u64,
        total_weight: u64,
        start_time: u64,
        end_time: u64,
        crc: u128,
    }


    fun init() {
        register_subscriber();
        deploy_staking_asset();
    }

    struct SubscriberInfo has key {
        subscriber: Object<Subscriber<TempStateDropEvent>>,
    }

    fun register_subscriber() {
        let subscriber = event_queue::subscribe<TempStateDropEvent>(type_info::type_name<StakeState>());
        account::move_resource_to(&signer::module_signer<StakeState>(), SubscriberInfo {
            subscriber
        });
    }

    fun deploy_staking_asset() {
        assert!(!account::exists_resource<StakingAsset>(DEPLOYER), ErrorAlreadyDeployed);
        let now_seconds = timestamp::now_seconds();
        account::move_resource_to(&signer::module_signer<SLP>(),
            StakingAsset {
                vault: object::new(Vault {
                    coin_store: table::new(),
                    coin_info: coin::register_extend<SLP>(
                        string::utf8(COIN_NAME),
                        string::utf8(COIN_SYMBOL),
                        option::some(string::utf8(COIN_ICON_URL)),
                        0u8,
                    ),
                }),
                stake_value: table::new(),
                stake_table: table::new(),
                release_per_second: COIN_TOTAL_SUPPLY / ((PerDaySeconds * ReleaseDays) as u128),
                last_update_time: now_seconds,
                total_weight: 0,
                start_time: now_seconds,
                end_time: now_seconds + ((PerDaySeconds * ReleaseDays) as u64),
                crc: 0,
            });
    }

    fun update_crc(staking_asset: &mut StakingAsset, current_time: u64) {
        let elapsed_time = current_time - staking_asset.last_update_time;
        if (elapsed_time == 0 || staking_asset.total_weight == 0) return;

        let release_rate = staking_asset.release_per_second;
        let reward = release_rate * (elapsed_time as u128);
        staking_asset.crc = staking_asset.crc + reward / (staking_asset.total_weight as u128);
        staking_asset.last_update_time = current_time;
    }


    struct UserStake has key, store {
        stake: Table<ObjectID, Stake>,
    }

    struct Stake has key, store {
        asset_type: String,
        asset_value: u64,
        weight: u64,
        gain: u128,
    }


    const ErrorWrongDeployer: u64 = 1;
    const ErrorAlreadyDeployed: u64 = 2;
    const ErrorWrongFarmTime: u64 = 3;
    const ErrorGainIsZero: u64 = 4;
    const ErrorTotalWeightIsZero: u64 = 5;
    const ErrorDivideZero: u64 = 6;
    const ErrorWrongTotalWeight: u64 = 7;
    const ErrorWrongTimestamp: u64 = 8;
    const ErrorWrongHarvestIndex: u64 = 9;
    const ErrorNotAlive: u64 = 10;
    const ErrorAlreadyStaked: u64 = 11;
    const ErrorNotStaked: u64 = 12;
    const ErrorAssetExist: u64 = 13;
    const ErrorBitcoinClientError: u64 = 14;
    const ErrorWrongTimeRange: u64 = 15;


    struct StakeState has store, drop {}

    public entry fun stake_utxo(
        signer: &signer,
        asset: &mut Object<UTXO>,
    ) {
        assert!(!utxo::contains_temp_state<StakeState>(asset), ErrorAlreadyStaked);
        utxo::add_temp_state(asset, StakeState {});
        let utxo_value = value(object::borrow(asset));
        do_stake<UTXO>(signer, object::id(asset), utxo_value, 5);
    }

    public entry fun stake_coin<CoinAssert: key+store>(
        signer: &signer,
        amount: u256,
    ) {
        let asset = account_coin_store::withdraw<CoinAssert>(signer, amount);
        let coin_value = coin::value(&asset);
        let assert_value = ((coin_value / (coin::decimals(coin::coin_info<CoinAssert>()) as u256)) as u64);
        let coin_type_name = key<CoinAssert>();

        let staking_asset = account::borrow_mut_resource<StakingAsset>(DEPLOYER);
        let vault = object::borrow_mut(&mut staking_asset.vault);

        if (table::contains(&vault.coin_store, coin_type_name)) {
            let coin_store_id = *table::borrow(&mut vault.coin_store, coin_type_name);
            let coin_store_obj = object::borrow_mut_field<
                Vault,
                ObjectID,
                Object<CoinStore<CoinAssert>>
            >(
                &mut staking_asset.vault,
                coin_store_id
            );
            coin_store::deposit(coin_store_obj, asset);
            do_stake<Coin<CoinAssert>>(signer, coin_store_id, assert_value, 1);
        }else {
            let coin_store_obj = coin_store::create_coin_store<CoinAssert>();
            let coin_store_id = object::id(&coin_store_obj);
            table::add(&mut vault.coin_store, coin_type_name, coin_store_id);
            coin_store::deposit(&mut coin_store_obj, asset);
            object::add_field(&mut staking_asset.vault, coin_store_id, coin_store_obj);
            do_stake<Coin<CoinAssert>>(signer, coin_store_id, assert_value, 1);
        };
    }


    public entry fun stake_bbn(
        signer: &signer,
        asset: &mut Object<BBNStakeSeal>,
    ) {
        assert!(!bbn::contains_temp_state<StakeState>(asset), ErrorAlreadyStaked);
        bbn::add_temp_state(asset, StakeState {});
        let bbn_stake_seal = object::borrow(asset);
        let stake_value = bbn::staking_value(bbn_stake_seal);

        let asset_weight = 2;
        let btc_time = bitcoin::get_bitcoin_time();
        if (btc_time > (bbn::staking_time(bbn_stake_seal) as u32)) {
            let lock_hour = ((bbn::staking_time(bbn_stake_seal) as u32) - btc_time) / PerHourSeconds;
            asset_weight = asset_weight + u64::min(u64::sqrt((lock_hour as u64)), MaxAssertWeight - asset_weight);
        };
        do_stake<BBNStakeSeal>(signer, object::id(asset), stake_value, asset_weight);
    }

    struct StakeEvent has copy, drop {
        asset_id: ObjectID,
        asset_type: String,
        asset_value: u64,
        asset_weight: u64,
        account: address,
        timestamp: u64
    }

    fun do_stake<T>(
        signer: &signer,
        asset_id: ObjectID,
        asset_value: u64,
        asset_weight: u64
    ) {
        process_expired_stake();
        let user_address = signer::address_of(signer);
        let asset_type = key<T>();
        let staking_asset = account::borrow_mut_resource<StakingAsset>(DEPLOYER);
        let now_seconds = timestamp::now_seconds();
        assert!(staking_asset.start_time <= now_seconds, ErrorWrongFarmTime);
        assert!(staking_asset.end_time > now_seconds, ErrorWrongFarmTime);
        update_crc(staking_asset, now_seconds);
        staking_asset.total_weight = staking_asset.total_weight + asset_weight;

        if (!account::exists_resource<UserStake>(user_address)) {
            let stacknft = object::new_account_named_object(user_address, UserStake {
                stake: table::new()
            });
            object::transfer(stacknft, user_address);
        };
        let stacknft = object::borrow_mut_object_extend<UserStake>(
            object::account_named_object_id<UserStake>(user_address)
        );
        let user_stake = object::borrow_mut(stacknft);
        table::add(
            &mut user_stake.stake,
            asset_id,
            Stake {
                asset_type,
                asset_value,
                weight: asset_weight,
                gain: 0,
            }
        );
        table::add(&mut staking_asset.stake_table, asset_id, user_address);
        let asset_total_stake_value = *table::borrow_mut(&mut staking_asset.stake_value, asset_type);
        asset_total_stake_value = asset_total_stake_value + asset_value;

        emit(StakeEvent {
            asset_id,
            asset_type,
            asset_value,
            asset_weight,
            account: user_address,
            timestamp: now_seconds
        });
    }

    public fun process_expired_stake() {
        let subscriber_info = account::borrow_mut_resource<SubscriberInfo>(DEPLOYER);
        let event = event_queue::consume(&mut subscriber_info.subscriber);
        if (option::is_some(&event)) {
            let event = option::destroy_some(event);
            let (asset_id, _, _) = utxo::unpack_temp_state_drop_event(event);
            process_invalid_assets(asset_id);
        }
    }


    fun is_asset_staked(asset_id: ObjectID): bool {
        let staking_asset = account::borrow_resource<StakingAsset>(DEPLOYER);
        if (table::contains(&staking_asset.stake_table, asset_id)) {
            return true
        };
        return false
    }

    struct RemoveExpiredEvent has copy, drop {
        asset_id: ObjectID,
        asset_type: String,
        account: address,
    }

    public entry fun process_invalid_assets(asset_id: ObjectID) {
        if (!is_asset_staked(asset_id) ||
            object::exists_object_with_type<UTXO>(asset_id) ||
            object::exists_object_with_type<BBNStakeSeal>(asset_id)
        ) {
            return
        };
        let staking_asset = account::borrow_mut_resource<StakingAsset>(DEPLOYER);
        let user_address = table::remove(&mut staking_asset.stake_table, asset_id);
        let stacknft = object::borrow_mut_object_extend<UserStake>(
            object::account_named_object_id<UserStake>(user_address)
        );
        let user_stake = object::borrow_mut(stacknft);
        let Stake {
            asset_type,
            asset_value,
            weight: _,
            gain: _
        } = table::remove(&mut user_stake.stake, asset_id);
        let assert_stake_amount = *table::borrow_mut(&mut staking_asset.stake_value, asset_type);
        assert_stake_amount = assert_stake_amount - asset_value;
        emit(RemoveExpiredEvent {
            asset_id,
            asset_type,
            account: user_address,
        });
    }
}