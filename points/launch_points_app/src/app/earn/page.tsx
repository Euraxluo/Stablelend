"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Text,
  Title,
} from "@mantine/core";
import NavigationBar from "@/components/NavigationBar";
import {getTokenInfo, TokenInfo} from "./util";
import {useCurrentAddress, useRoochClient, useRoochClientQuery} from "@roochnetwork/rooch-sdk-kit";
import {useEffect, useState} from "react";
import {useNetworkVariable} from "../networks";
import {WalletConnectModal} from '@/components/connect-model'
import {formatBalance} from '@/utils/balance'
import {StakeCard} from "@/components/stake-card";

export default function GrowPage() {
  const client = useRoochClient();
  const addr = useCurrentAddress();
  const [showConnectModel, setShowConnectModel] = useState(false);
  const contractAddr = useNetworkVariable("contractAddr");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    getTokenInfo(client, contractAddr).then((result) => {
      setTokenInfo(result);
      setTimeRemaining(result.data.timeRemaining);
    });
  }, [client, contractAddr]);

  useEffect(() => {
    if (!addr || !tokenInfo) {
      return
    }
    client
      .getBalance({
        coinType: tokenInfo.coinInfo.type,
        owner: addr.genRoochAddress().toStr() || "",
      })
      .then((result) => {
        setBalance(Number(result.balance));
      });

  }, [addr, tokenInfo])

  useEffect(() => {
    if (!tokenInfo) {
      return;
    }
    const interval = setInterval(() => {
      const now = Date.now() / 1000;
      setTimeRemaining(tokenInfo?.data.endTime - now);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [tokenInfo]);

  const formatTimeRemaining = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days} : ${hours} : ${minutes} : ${secs}`;
  };

  const {data: utxos} = useRoochClientQuery("queryUTXO", {
    filter: {
      owner: addr?.toStr() || "",
    },
  });

  return (
    <>
      <NavigationBar/>
      <WalletConnectModal
        isOpen={showConnectModel}
        onClose={() => setShowConnectModel(false)}
      />
      <Container pt="1rem" pb="4rem" size="lg">
        <Card radius="lg" p="lg" bg="gray.0" mb="2rem">
          <Flex justify="space-between">
            <Box>
              <Title order={4} fw="500">
                UTXO Earn
              </Title>
              <Text mt="4" c="gray.7" style={{display: "flex"}}>
                <span style={{minWidth: "150px"}}>Time Remaining :</span>
                <span>
                                    {tokenInfo ? formatTimeRemaining(timeRemaining) : '-'}
                                </span>
              </Text>
              <Text mt="4" c="gray.7" style={{display: "flex"}}>
                <span style={{minWidth: "150px"}}>Total stake :</span>
                <span>{tokenInfo ? formatBalance(tokenInfo?.data.assetTotalValue) : '-'} stas</span>
              </Text>
              {
                balance > 0 ?
                  <Text mt="4" c="gray.7" style={{display: "flex"}}>
                    <span style={{minWidth: "150px"}}>Earn Poins :</span>
                    <span>
                      <Title order={4} fw="500"> 
                        {formatBalance(balance)} $SLP
                      </Title> 
                    </span>
                  </Text>
                  : <></>
              }
            </Box>
            <Box ta="right">
              <StakeCard
                target={"self"}
                assets={
                  utxos?.data.map((item) => {
                    return {
                      id: item.id,
                      value: item.value.value,
                    };
                  }) || []
                }
              />
            </Box>
          </Flex>
        </Card>

        <Card radius="lg" p="lg" bg="gray.0" mb="2rem">
          <Flex justify="space-between">
            <Box>
              <Title order={4} fw="500">
                $SLPs UTXO Earn Info
              </Title>
              <Text mt="4" c="gray.7" style={{display: "flex"}}>
                <span style={{minWidth: "150px"}}>Time Remaining :</span>
                <span>
                  {tokenInfo ? formatTimeRemaining(timeRemaining) : '-'}
                </span>
              </Text>
              <Text mt="4" c="gray.7" style={{display: "flex"}}>
                <span style={{minWidth: "150px"}}>Total stake :</span>
                <span>{tokenInfo ? formatBalance(tokenInfo?.data.assetTotalValue) : '-'} stas</span>
              </Text>
              {
                balance > 0 ?
                  <Text mt="4" c="gray.7" style={{display: "flex"}}>
                    <span style={{minWidth: "150px"}}>Earn Poins :</span>
                    <span>
                      <Title order={4} fw="500"> 
                        {formatBalance(balance)} $SLP
                      </Title> 
                    </span>
                  </Text>
                  : <></>
              }
            </Box>
            <Box ta="right">
              <StakeCard
                target={"self"}
                assets={
                  utxos?.data.map((item) => {
                    return {
                      id: item.id,
                      value: item.value.value,
                    };
                  }) || []
                }
              />
            </Box>
          </Flex>
        </Card>
      </Container>
    </>
  );
}
