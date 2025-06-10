import { ethers } from 'ethers';
import FanArenaABI from '../../artifacts/contracts/FanArena.sol/FanArena.json';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
const CONTRACT_ABI = FanArenaABI.abi;

export interface Proposal {
  id: number;
  title: string;
  description: string;
  voteCountFor: number;
  voteCountAgainst: number;
  startTime: number;
  endTime: number;
  active: boolean;
  creator: string;
}

// Mock data for development (will be replaced by contract calls)
export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 0,
    title: "Increase Community Fund Allocation for Marketing",
    description: "This proposal aims to increase the budget for marketing campaigns to attract more users and partners to the Fan Arena platform. We believe a stronger marketing push will significantly grow our community and user base.",
    voteCountFor: 12500,
    voteCountAgainst: 3000,
    startTime: Date.now() / 1000 - 3600 * 24 * 2, // 2 days ago
    endTime: Date.now() / 1000 + 3600 * 24 * 5, // 5 days from now
    active: true,
    creator: "0xabcdef1234567890abcdef1234567890abcdef"
  },
  {
    id: 1,
    title: "Implement a New User Onboarding Tutorial",
    description: "We propose to develop and implement a comprehensive interactive tutorial for new users to improve their first-time experience and reduce confusion when navigating the platform and participating in voting.",
    voteCountFor: 8000,
    voteCountAgainst: 1500,
    startTime: Date.now() / 1000 - 3600 * 24 * 10, // 10 days ago
    endTime: Date.now() / 1000 - 3600 * 24 * 3, // 3 days ago
    active: false,
    creator: "0x1234567890abcdef1234567890abcdef123456"
  },
  {
    id: 2,
    title: "Partnership with XYZ Sports League",
    description: "A proposal to form an official partnership with the XYZ Sports League, bringing their fan base to Fan Arena and introducing exclusive voting opportunities related to their league decisions.",
    voteCountFor: 15000,
    voteCountAgainst: 500,
    startTime: Date.now() / 1000 - 3600 * 24 * 1, // 1 day ago
    endTime: Date.now() / 1000 + 3600 * 24 * 6, // 6 days from now
    active: true,
    creator: "0x9876543210fedcba9876543210fedcba987654"
  },
];

export const getContract = (provider: ethers.BrowserProvider | null) => {
  if (!provider) {
    // In a real application, you might want to handle this error more gracefully
    // or provide a default read-only provider.
    console.warn("No provider given to getContract. Returning a read-only contract instance.");
    // Return a read-only contract instance if no provider is available
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, new ethers.JsonRpcProvider("http://localhost:8545"));
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

export const getSignerContract = async (provider: ethers.BrowserProvider) => {
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
