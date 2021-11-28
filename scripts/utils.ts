import { ethers } from 'hardhat';

export const eth = (amt: number) => ethers.utils.parseEther(amt.toString());
