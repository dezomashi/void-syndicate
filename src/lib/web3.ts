import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Void Syndicate',
  projectId: '29550af64e25b3cc10d6143b1246afc8',
  chains: [sepolia], 
  ssr: true,
});
