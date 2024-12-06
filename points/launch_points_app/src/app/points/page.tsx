'use client'

import {useState, useMemo, useEffect} from 'react'
import {
  Anchor,
  Box,
  Card,
  Center,
  CloseButton,
  Container,
  Flex,
  Grid,
  Input,
  Table,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import Link from 'next/link'

import NavigationBar from '@/components/NavigationBar'

import {
  IconSearch,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react'
import {getTokenInfo, TokenInfo} from '@/app/earn/util'
import {useCurrentAddress, useRoochClient, useRoochClientQuery} from '@roochnetwork/rooch-sdk-kit'
import {useNetworkVariable} from '@/app/networks'
import {AnnotatedMoveStructView} from '@roochnetwork/rooch-sdk/src/client/types/generated'
import {formatBalance} from '@/utils/balance'


export default function Portfolio() {
  const client = useRoochClient()
  const addr = useCurrentAddress()
  const contractAddr = useNetworkVariable('contractAddr')
  const [balance, setBalance] = useState(0)
  const [RGasBalance, setRGasBalance] = useState(0)
  const contractVersion = useNetworkVariable('contractVersion')

  useEffect(() => {
    if (!addr) {
      return
    }

    client.getStates({
      accessPath: `/resource/${addr.genRoochAddress().toHexAddress()}/${contractAddr}::grow_information_${contractVersion}::UserVoteInfo`,
      stateOption: {
        decode: true
      }
    }).then((result) => {
      if (result.length > 0 && result[0].decoded_value) {
        const view = (((result[0].decoded_value?.value['value'] as AnnotatedMoveStructView).value['vote_info']) as AnnotatedMoveStructView).value['handle'] as AnnotatedMoveStructView
        const id = view.value['id']

        client.listStates({
          accessPath: `/table/${id}`,
          stateOption: {
            decode: true
          }
        }).then((result) => {
          let count = 0
          const items = result.data.map((item) => {
            const view = item.state.decoded_value!.value
            const vote = Number(view!['value'])
            count += vote
            return {
              id: view!['name'] as string,
              value: vote
            }
          })
          console.log(result)
        })
        console.log(view.value['id'])
      }
      console.log(result)
    })

    client.getBalance({owner: addr.genRoochAddress().toStr(), coinType: '0x3::gas_coin::RGas'}).then((result) => {
      setRGasBalance(Math.floor(Number(result.balance) / Math.pow(10, result.decimals)))
    })

    getTokenInfo(client, contractAddr).then((result) => {
      client
        .getBalance({
          coinType: result.coinInfo.type,
          owner: addr.genRoochAddress().toStr(),
        })
        .then((result) => {
          setBalance(Number(result.balance))
        })
    })
  }, [client, contractAddr, addr, contractVersion])
  return (
    <>
      <NavigationBar/>

      <Container size="lg" py="xl">
        <Box>
          <Title order={3}>My Portfolio</Title>
          <Grid mt="md" gutter="lg">
            <Grid.Col span={{base: 12, xs: 6, md: 3}}>
              <Card radius="lg" withBorder>
                <Flex align="center" justify="space-between">
                  <Title order={6} c="gray.7">
                    $GROW Balance
                  </Title>
                </Flex>
                <Text size="2rem" lh="2.5rem" mt="4">
                  {balance === 0 ? '-' : formatBalance(balance)}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{base: 12, xs: 6, md: 3}}>
              <Card radius="lg" withBorder>
                <Flex align="center" justify="space-between">
                  <Title order={6} c="gray.7">
                    $RGAS Balance
                  </Title>
                </Flex>
                <Text size="2rem" lh="2.5rem" mt="4">
                  {RGasBalance === 0 ? '-' : formatBalance(RGasBalance)}
                </Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{base: 12, xs: 6, md: 3}}>
              <Card radius="lg" withBorder>
                <Flex align="center" justify="space-between">
                  <Title order={6} c="gray.7">
                    $SLP Balance
                  </Title>
                </Flex>
                <Text size="2rem" lh="2.5rem" mt="4">
                  {RGasBalance === 0 ? '-' : formatBalance(RGasBalance)}
                </Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{base: 12, xs: 6, md: 3}}>
              <Card radius="lg" withBorder>
                <Flex align="center" justify="space-between">
                  <Title order={6} c="gray.7">
                    $Sats
                  </Title>
                </Flex>
                <Text size="2rem" lh="2.5rem" mt="4">
                  {RGasBalance === 0 ? '-' : formatBalance(RGasBalance)}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </>
  )
}
