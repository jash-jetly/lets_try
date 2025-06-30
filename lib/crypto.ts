import * as Crypto from 'expo-crypto';

export const generatePassphrase = (): string[] => {
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
    'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'against', 'agency',
    'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm',
    'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost',
    'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing',
    'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle',
    'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna',
    'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve',
    'april', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed',
    'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art',
    'article', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist',
    'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract',
    'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average',
    'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward'
  ];
  
  const passphrase: string[] = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    passphrase.push(words[randomIndex]);
  }
  return passphrase;
};

export const encryptPassphrase = async (passphrase: string[]): Promise<string> => {
  const passphraseString = passphrase.join(' ');
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    passphraseString,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
};

export const generateRandomIndices = (total: number, count: number): number[] => {
  const indices: number[] = [];
  while (indices.length < count) {
    const randomIndex = Math.floor(Math.random() * total);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices.sort((a, b) => a - b);
};