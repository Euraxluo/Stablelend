"use client";
import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    Group,
    Stack,
    Text,
    ThemeIcon,
    Title,
    useMantineTheme,
} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import NavigationBar from "@/components/NavigationBar";

export default function Home() {
    const theme = useMantineTheme();
    const desktopMatches = useMediaQuery("(min-width: 48em)");
    const mobileMatches = useMediaQuery("(min-width: 28em)");
    const x = Array(10)
        .fill(0)
        .map((_, index) => (
            `orange.${index}`
        ));
    console.log(x)
    return (
        <Box
            component="header"
            py={{base: "12rem", md: "16rem"}}
            style={{position: "relative"}}
        >
            <NavigationBar
                style={{position: "absolute", zIndex: 9, top: 0, left: 0, right: 0}}
            />
            <Container size="lg" style={{position: "relative", zIndex: 2}}>
                <Stack align="center" gap="0">
                    <Flex>
                        <Title>
                        <h1>Stablelend</h1>
                        </Title>
                        <h4>Points</h4>
                    </Flex>
                    <Text size="lg" c="gray.7" ta="center">
                        <h2> A native lending platform on Rooch</h2>
                    </Text>
                    <Text size="lg" c="gray.7" ta="center">
                        Leveraging Bitcoin assets, Rooch native chain assets, and assets from other chains 
                    </Text>
                    <Text size="lg" c="gray.7" ta="center">
                        to enable low-cost collateralized borrowing and stablecoin minting.
                    </Text>
                </Stack>
            </Container>
        </Box>
    );
}
