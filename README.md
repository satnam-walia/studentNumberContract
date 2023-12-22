# Laboratoire 3 - Ethereum

## Installation du projet
1. Installer nodejs et npm (https://nodejs.org/en/download)
2. Installer ganache (https://trufflesuite.com/ganache/)
3. Ouvrir une invite de commande dans le dossier du projet
4. Entrer: `npm install -g truffle`
5. Entrer: `npm install web3`

## Lancer le projet
1. Lancer ganache et créer un réseau
2. Ouvrir une invite de commande dans le dossier du projet
3. Lancer le broker: `node client\broker.js`
4. Lancer le subscriber avec son adresse ethereum et son topic: `node client\subscriber.js 0x123467489abdef TEST`
5. Lancer le publisher: `node client\publisher.js 0xabcdef0123456789 TEST`
6. Lancer le subscriber pour unsubscribe avec son adresse ethereum et son topic: `node client\subscriber.js 0x123467489abdef TEST unsubscribe`
