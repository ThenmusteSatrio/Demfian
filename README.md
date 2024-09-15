This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First:
Before you run the program, make sure you have installed Metamask Wallet first in your browser

Second, run:

```bash
npm install
npx hardhat node
npx hardhat ignition deploy .\ignition\modules\deploy.cjs --network localhost
npm run dev
```

Third:
After you successfully run the command npx hardhat ignition deploy .\ignition\modules\deploy.cjs --network localhost then you will get 10 development accounts to use in testing, import several accounts into metamask, use these accounts to sign in to application.

Fourth: 
To mint (upload nft) click the minting navigation button and complete the data based on the form there, and to list on the marketplace go to the profile page by clicking on your profile photo image at the top right of the navbar then select the nft you want to list with Clicking the sell button, to see the NFT listed on the marketplace, go to the marketplace page

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
