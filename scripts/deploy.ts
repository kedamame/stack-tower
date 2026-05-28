import hre from 'hardhat';

async function main() {
  console.log('Deploying StackTowerLeaderboard to', hre.network.name, '...');
  const contract = await hre.viem.deployContract('StackTowerLeaderboard');
  console.log('Deployed to:', contract.address);
  console.log('\nAdd to .env.local and Vercel environment variables:');
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contract.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
