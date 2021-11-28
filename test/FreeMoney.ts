import { expect } from 'chai';
import { ethers } from 'hardhat';

const eth = (amt: number) => ethers.utils.parseEther(amt.toString());

describe('Free money contract', function () {
  it('Deposit', async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const freeMoneyContract = await ethers.getContractFactory('FreeMoney');
    const freeMoney = await freeMoneyContract.deploy();

    await freeMoney.deposit({ value: eth(0.5) });
    expect(await ethers.provider.getBalance(freeMoney.address)).to.be.equal(eth(0.5));

    await freeMoney.connect(addr1).deposit({ value: eth(0.25) });
    expect(await ethers.provider.getBalance(freeMoney.address)).to.be.equal(eth(0.75));

    await freeMoney.connect(addr2).deposit();
    expect(await ethers.provider.getBalance(freeMoney.address)).to.be.equal(eth(0.75));
  });

  it('Withdraw', async function () {
    const [owner, addr1] = await ethers.getSigners();
    const freeMoneyContract = await ethers.getContractFactory('FreeMoney');
    const freeMoney = await freeMoneyContract.deploy();

    // Non-owner withdrawal should fail
    await freeMoney.connect(addr1).deposit({ value: eth(0.5) });
    expect(freeMoney.connect(addr1).withdraw()).to.be.reverted;

    // Owner withdrawal should succeed
    const startBalance = await owner.getBalance();
    await freeMoney.withdraw();
    expect(startBalance).to.be.lt(await owner.getBalance());
    expect(await ethers.provider.getBalance(freeMoney.address)).to.be.equal(0);
  });

  it('Claim', async function () {
    const [owner, addr1] = await ethers.getSigners();
    const freeMoneyContract = await ethers.getContractFactory('FreeMoney');
    const freeMoney = await freeMoneyContract.deploy();

    // Dummy and insufficient value claims should fail
    await freeMoney.deposit({ value: eth(0.5) });
    expect(freeMoney.claim({ value: eth(1) })).to.be.revertedWith('This is a mock call');
    expect(freeMoney.connect(addr1).claim({ value: eth(0.3) })).to.be.revertedWith(
      'Base amount was not provided',
    );

    // Successful claim
    await freeMoney.connect(addr1).claim({ value: eth(1) });
    expect(await ethers.provider.getBalance(freeMoney.address)).to.be.eq(eth(0.47));
  });

  it('E2E', async function () {
    const [owner, addr1] = await ethers.getSigners();
    const freeMoneyContract = await ethers.getContractFactory('FreeMoney');
    const freeMoney = await freeMoneyContract.deploy();

    // Owner deposits, addr1 claims once
    await freeMoney.deposit({ value: eth(0.5) });
    await freeMoney.connect(addr1).claim({ value: eth(1) });
    expect(await ethers.provider.getBalance(freeMoney.address)).to.be.eq(eth(0.47));

    // Owner withdraws
    const startBalance = await owner.getBalance();
    await freeMoney.withdraw();
    expect(startBalance).to.be.lt(await owner.getBalance());
    expect(await ethers.provider.getBalance(freeMoney.address)).to.be.equal(0);

    // addr1 claim should fail
    expect(freeMoney.connect(addr1).claim({ value: eth(1) })).to.be.revertedWith(
      'Deposit more funds',
    );
  });
});
