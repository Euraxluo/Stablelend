"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  Box,
  Container,
  Anchor,
  Flex,
  Button,
  UnstyledButton,
  Stack,
  Drawer, Text,
} from "@mantine/core";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import LogoSVG from "@/assets/logo.svg";

import {IconMenu2} from "@tabler/icons-react";
import {useCurrentAddress} from "@roochnetwork/rooch-sdk-kit";
import {shortAddress} from "@/utils/address";
import {WalletConnectModal} from "./connect-model";
import {useState} from "react";
import {IconBrandTelegram} from "@tabler/icons-react";

function DesktopNavigationBar({style}: { style?: Object }) {
  const currentAddress = useCurrentAddress();
  const pathname = usePathname();

  const [showConnectModel, setShowConnectModel] = useState(false);

  return (
    <Box style={style}>
      <WalletConnectModal
        isOpen={showConnectModel}
        onClose={() => setShowConnectModel(false)}
      />
      <Container size="lg">
        <Flex py="md" align="center" gap="lg">
          <Link href="/">
            <LogoSVG height={50}/>
          </Link>
          <Anchor
            component={Link}
            href="/"
            c="dark"
            underline="never"
            fw={pathname === "/" ? "500" : "400"}
          >
            Home
          </Anchor>

          <Anchor
            component={Link}
            href="/docs"
            c="dark"
            underline="never"
            fw={pathname === "/docs" ? "500" : "400"}
          >
            Docs
          </Anchor>
          <Anchor
            component={Link}
            href="/points"
            c="dark"
            underline="never"
          >
            <Text display="inline-flex" style={{alignItems: 'flex-end'}}
                  fw={pathname === "/points" ? "500" : "400"}
            >
              $SLP
              <Text
                component="span"
                size="xs"
                style={{
                  verticalAlign: 'bottom',
                  marginBottom: '0.125rem',
                  marginLeft: '-0.125rem'
                }}
                fw={pathname === "/points" ? "500" : "400"}
              >
                oints
              </Text>
            </Text>
          </Anchor>
          <Button
            ml="auto"
            component={Link}
            href="/earn"
            radius="md"
            fullWidth={false}
            variant={pathname === "/earn" ? "light" : "transparent"}
          >
            {/*'filled' | 'light' | 'outline' | 'transparent' | 'white' | 'subtle' | 'default' | 'gradient';*/}
            <Text component="span" fw={700}>Earn</Text>
            &nbsp;
            <Text display="inline-flex" style={{alignItems: 'flex-end'}}>
              $SLP
              <Text
                component="span"
                size="xs"
                style={{
                  verticalAlign: 'bottom',
                  marginBottom: '0.125rem',
                  marginLeft: '-0.125rem'
                }}
              >
                oints
              </Text>
            </Text>
          </Button>
          <Button
            radius="md"
            onClick={() => {
              setShowConnectModel(currentAddress === undefined);
            }}
          >
            {currentAddress
              ? shortAddress(currentAddress.toStr())
              : "Connect Wallet"}
          </Button>
          <Anchor c="dark" href={"https://t.me/Stablelend"}>
            <IconBrandTelegram/>
          </Anchor>
        </Flex>
      </Container>
    </Box>
  );
}

function MobileNavigationBar({style}: { style?: Object }) {
  const [opened, {open, close}] = useDisclosure(false);
  const pathname = usePathname();

  const currentAddress = useCurrentAddress();
  const [showConnectModel, setShowConnectModel] = useState(false);

  return (
    <Box style={style}>
      <WalletConnectModal
        isOpen={showConnectModel}
        onClose={() => setShowConnectModel(false)}
      />
      <Container size="lg">
        <Flex py="md" align="center" gap="lg">
          <Link href="/">
            <LogoSVG height={56}/>
          </Link>

          <UnstyledButton
            ml="auto"
            onClick={open}
            style={{display: "flex", alignItems: "center"}}
          >
            <IconMenu2/>
          </UnstyledButton>

          <Button
            radius="md"
            onClick={() => {
              setShowConnectModel(currentAddress === undefined);
            }}
          >
            {currentAddress
              ? shortAddress(currentAddress.toStr())
              : "Connect Wallet"}
          </Button>
          <Anchor c="dark" href={"https://t.me/Stablelend"}>
            <IconBrandTelegram/>
          </Anchor>
        </Flex>
      </Container>

      <Drawer opened={opened} onClose={close} title="Menu">
        <Stack gap="sm">
          <Button
            component={Link}
            href="/"
            variant={pathname === "/" ? "filled" : "outline"}
          >
            Home
          </Button>

          <Button
            component={Link}
            href="/docs"
            variant={pathname === "/docs" ? "filled" : "outline"}
          >
            Docs
          </Button>
          <Button
            component={Link}
            href="/points"
            variant={pathname === "/stake" ? "filled" : "outline"}
          >
            $SLPs
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}

export default function NavigationBar({style}: { style?: Object }) {
  const mobileMatches = useMediaQuery("(max-width: 48em)");

  if (mobileMatches) {
    return <MobileNavigationBar style={style}/>;
  }

  return <DesktopNavigationBar style={style}/>;
}
