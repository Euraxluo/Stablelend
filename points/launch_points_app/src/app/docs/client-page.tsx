"use client";

import {useState} from "react";
import NavigationBar from "@/components/NavigationBar";
import {Box, Flex, Title, Select, ActionIcon, Collapse, Container} from '@mantine/core';
import { IconChevronDown, IconLanguage } from '@tabler/icons-react';
import {useRouter} from 'next/navigation';
import MermaidChart from "@/app/docs/MermaidChart";

export default function ClientDocPage(
  {
    contentHTML,
    tocHTML,
    initialLang,
  }: {
    contentHTML: string;
    tocHTML: string;
    initialLang: string;
  }) {
  const [mobileTocExpanded, setMobileTocExpanded] = useState(false);
  const [lang, setLang] = useState(initialLang);
  const router = useRouter();

  function handleLanguageChange(value: string) {
    setLang(value);
    router.push(`/docs?lang=${value}`);
  }

  const chart = `
  graph TB
    subgraph "Core Components"
        A[UTXO/NFT Pool]
        B[UPOOL Tokens]
        C[slUSD Stablecoin]
        D[UPC Token]
    end

    subgraph "DeFi Services"
        E[Decentralized Exchange]
        F[Lending Platform]
        G[Automated Market Maker]
        H[Synthetic Assets]
        I[Derivatives Platform]
        J[Liquidity Mining]
    end

    subgraph "Auxiliary Services"
        K[UTXO Lottery]
        L[UTXO Index Fund]
        M[Yield Aggregator]
        N[Insurance Pool]
    end

    subgraph "Governance & Infrastructure"
        O[DAO Governance]
        P[Cross-chain Bridge]
        Q[UTXO Sharding]
        R[Risk Management]
        S[Price Oracles]
    end

    A -->|Deposit| B
    A -->|Collateralize| C
    A -->|Back| D
    B -->|Stake| J
    C -->|Trade| E
    C -->|Borrow| F
    D -->|Absorb Volatility| C
    E <-->|Provide Liquidity| G
    F -->|Create Contracts| I
    G -->|Provide Liquidity| H
    J -->|Incentivize| B
    K -->|Utilize| A
    L -->|Invest| A
    M -->|Optimize Returns| F
    N -->|Protect| F
    O -->|Govern| A
    O -->|Govern| B
    O -->|Govern| C
    O -->|Govern| D
    P -->|Integrate| A
    Q -->|Optimize| A
    R -->|Monitor & Adjust| F
    R -->|Monitor & Adjust| I
    R -->|Monitor & Adjust| N
    S -->|Provide Price Data| E
    S -->|Provide Price Data| F
    S -->|Provide Price Data| H
    S -->|Provide Price Data| I

    UTXO[UTXO/NFT Holders] -->|Deposit| A
  `

  return (
    <>
      <NavigationBar/>

      <Container size="lg" py="lg">
        <Flex gap="xl" direction={{base: "column", sm: "row"}}>
          <Box
            flex="none"
            w="16rem"
            pt={{base: "0", sm: "3.8rem"}}
            component="aside"
            visibleFrom="md"
          >
            <Box style={{position: "sticky", top: "1rem"}}>
              <Flex justify="space-between" align="center" mb="xs">
                <Title order={3}>目录</Title>
                <Select
                  value={lang}
                  onChange={(value: string | null) => handleLanguageChange(value ?? initialLang)}
                  data={[
                    {value: 'en', label: 'English'},
                    {value: 'zh', label: '中文'},
                  ]}
                />
              </Flex>
              <div
                className="toc"
                dangerouslySetInnerHTML={{__html: tocHTML}}
              />
            </Box>
          </Box>
          <Box flex={1}>
            <Box
              bg="white"
              style={{ position: "sticky", top: 0, zIndex: 1 }}
              hiddenFrom="md"
              mb="lg"
              py="md"
              px="md"
            >
              <Flex align="center" justify="space-between">
                <Flex align="center" style={{ flex: 1 }}>
                  <Title order={3} style={{ marginRight: '1rem' }}>目录</Title>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setMobileTocExpanded(!mobileTocExpanded)}
                    aria-label={mobileTocExpanded ? "收起目录" : "展开目录"}
                  >
                    <IconChevronDown
                      style={{
                        transform: `rotate(${mobileTocExpanded ? "180deg" : "0deg"})`,
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </ActionIcon>
                </Flex>
                <Select
                  value={lang}
                  onChange={(value: string | null) => handleLanguageChange(value ?? initialLang)}
                  data={[
                    { value: 'en', label: 'English' },
                    { value: 'zh', label: '中文' },
                  ]}
                  styles={(theme) => ({
                    input: {
                      '&:focus': {
                        borderColor: theme.colors.blue[6],
                      },
                    },
                  })}
                />
              </Flex>
              <Collapse in={mobileTocExpanded}>
                <Box mt="md" className="toc" dangerouslySetInnerHTML={{ __html: tocHTML }} />
              </Collapse>
            </Box>
            <Box
              id="content"
              component="article"
              dangerouslySetInnerHTML={{__html: contentHTML}}
              style={{
                maxWidth: '800px',
                overflow: 'hidden',
                wordWrap: 'break-word',
                fontSize: '16px'
              }}
            />
          </Box>
        </Flex>

        <Box style={{marginTop: '3rem'}}>
          <MermaidChart chart={chart}/>
        </Box>
      </Container>
    </>
  );
}

