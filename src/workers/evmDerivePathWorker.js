import {ethers} from 'ethers';

onmessage = function (event) {
  const {mnemonic, startingIndex} = event.data;
  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, null, `m/44'/60'/0'`);
  const finalResp = [];
  const startIndex = startingIndex ?? 0;
  const endIndex = startIndex + 50;
  for (let i = startIndex; i <= endIndex; i++) {
    const derivePath = `m/44'/60'/0'/${i}/0`;
    const tempWallet = wallet.deriveChild(i).deriveChild(0);
    finalResp.push({
      privateKey: tempWallet.privateKey,
      address: tempWallet.address?.toString(),
      derivePath,
    });
  }

  postMessage({deriveAddresses: finalResp});
};
