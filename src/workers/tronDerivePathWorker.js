import {TronWeb} from 'tronweb';

onmessage = function (event) {
  const {mnemonic, startingIndex} = event.data;
  const finalResp = [];
  const startIndex = startingIndex ?? 0;
  const endIndex = startIndex + 50;
  for (let i = startIndex; i <= endIndex; i++) {
    const derivePath = `m/44'/195'/0'/${i}/0`;
    const wallet = TronWeb.fromMnemonic(mnemonic, derivePath);
    finalResp.push({
      privateKey: wallet?.privateKey?.substring(2),
      address: wallet.address?.toString(),
      derivePath,
    });
  }

  postMessage({deriveAddresses: finalResp});
};
