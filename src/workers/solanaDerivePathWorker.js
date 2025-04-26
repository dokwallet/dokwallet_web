import {mnemonicToSeed} from 'bip39';
import {derivePath} from 'ed25519-hd-key';
import {Keypair} from '@solana/web3.js';
import bs58 from 'bs58';

onmessage = async function (event) {
  const {mnemonic, startingIndex} = event.data;
  const finalResp = [];
  const defaultPath = "m/44'/501'/0'/0'";
  const defaultSeed = await mnemonicToSeed(mnemonic);
  const defaultDeriveSeed = derivePath(defaultPath, defaultSeed).key;
  const keyPair = Keypair.fromSeed(defaultDeriveSeed);
  finalResp.push({
    address: keyPair.publicKey.toBase58(),
    privateKey: bs58.encode(keyPair.secretKey),
    derivePath: defaultPath,
  });
  const startIndex = startingIndex ?? 0;
  const endIndex = startIndex + 50;
  for (let i = startIndex; i <= endIndex; i++) {
    const path = `m/44'/501'/${i}'`;
    const seed = await mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath(path, seed).key;
    const keyPair = Keypair.fromSeed(derivedSeed);
    finalResp.push({
      address: keyPair.publicKey.toBase58(),
      privateKey: bs58.encode(keyPair.secretKey),
      derivePath: path,
    });
  }

  postMessage({deriveAddresses: finalResp});
};
