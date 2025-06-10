import hre from "hardhat";

async function main() {
  const FanArena = await hre.ethers.getContractFactory("FanArena");
  const fanArena = await FanArena.deploy();

  await fanArena.waitForDeployment();

  console.log(
    `FanArena contract deployed to ${fanArena.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 