import { ethers } from 'hardhat';
import { eth } from './utils';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const FM = await ethers.getContractFactory('FreeMoney');
  const fm = await FM.deploy({ value: eth(0.1) });
  console.log('Contract address:', fm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
