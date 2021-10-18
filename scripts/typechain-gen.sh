#!/usr/bin/env bash

rm -rf abis
rm -rf artifacts
rm -rf types/ethers-contracts

hardhat compile

cp -r artifacts/contracts abis
cp -r artifacts/@openzeppelin abis/@openzeppelin
find abis -name '*.dbg.json' -delete

typechain --target=ethers-v5 'abis/**/*.json'

rm -rf abis
rm -rf artifacts
