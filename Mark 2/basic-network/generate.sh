#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=mychannel

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# generate crypto material
echo

echo 
echo "#####################################################################"
echo "#############  Generating Cryptographic Materials  ##################"
echo "#####################################################################"
echo
cryptogen generate --config=./crypto-config.yaml

if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

echo
echo "#####################################################################"
echo "#############          Creating Genesis Block      ##################"
echo "#####################################################################"
echo
configtxgen -profile OneOrgOrdererGenesis -outputBlock ./config/genesis.block -channelID testchannel
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi
echo

echo
echo "######################################################################"
echo "##### Generating channel configuration transaction 'channel.tx' ######"
echo "######################################################################"
echo
configtxgen -profile OneOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

echo
echo "######################################################################"
echo "################# Defining Anchor Peers for Orgdl ORG ###################"
echo "######################################################################"
echo
configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./config/OrgdlMSPanchors.tx -channelID $CHANNEL_NAME -asOrg OrgdlMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrgdlMSP..."
  exit 1
fi
echo
