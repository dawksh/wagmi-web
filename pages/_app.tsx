import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Toaster } from "react-hot-toast";

const { chains, provider, webSocketProvider } = configureChains(
	[chain.polygonMumbai],
	[
		alchemyProvider({
			// This is Alchemy's default API key.
			// You can get your own at https://dashboard.alchemyapi.io
			apiKey: process.env.NEXT_PUBLIC_ALCHEMY as string,
		}),
		publicProvider(),
	]
);

const { connectors } = getDefaultWallets({
	appName: "Wagmi Signatures",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-indigo-200 via-red-200 to-yellow-100 pt-10">
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider chains={chains}>
					<Component {...pageProps} />
					<Toaster />
				</RainbowKitProvider>
			</WagmiConfig>
		</div>
	);
}

export default MyApp;
