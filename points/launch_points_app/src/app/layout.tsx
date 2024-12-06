import {createTheme, MantineProvider, ColorSchemeScript} from "@mantine/core";
import RoochDappProvider from "./rooch-dapp-provider";
import "@fontsource/ibm-plex-sans/200.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@mantine/core/styles.css";
import "./layout.css";

type Props = {
    children: React.ReactNode;
};

const theme = createTheme({
    fontFamily: "IBM Plex Sans, sans-serif",
    colors: {
        theme1: [
            "#fff4e6",
            "#ffe8cc",
            "#ffd8a8",
            "#ffc078",
            "#ffa94d",
            "#ff922b",
            "#fd7e14",
            "#f76707",
            "#e8590c",
            "#d9480f",
        ]
    },
    primaryColor: "theme1",
    primaryShade: 6,
    components: {
        Container: {
            defaultProps: {
                style: {
                    width: "100%",
                },
            },
        },
    },
});
export default function RootLayout({children}: Props) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <title>StableLend Points</title>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <link rel="shortcut icon" type="image/png" href="/favicon3.png"/>
            <ColorSchemeScript/>
        </head>
        <body>
        <MantineProvider theme={theme}>
            <RoochDappProvider>{children}</RoochDappProvider>
        </MantineProvider>
        </body>
        </html>
    );
}
