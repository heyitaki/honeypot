import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';

describe('Free money contract', function () {
  it('Deposit method', async function () {
    const [owner] = await ethers.getSigners();
    // console.log(owner);
    const freeMoneyContract = await ethers.getContractFactory('FreeMoney');
    const freeMoney = await freeMoneyContract.deploy();
    await freeMoney.deposit({ value: 5 });
    expect(await waffle.provider.getBalance(freeMoney.address)).to.equal(5);
    console.log(await waffle.provider.getBalance(freeMoney.address));
  });
});
