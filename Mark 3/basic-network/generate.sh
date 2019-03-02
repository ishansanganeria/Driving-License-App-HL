#!/bin/sh

export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_DL=mychanneldl
CHANNEL_PP=mychannelpp
CHANNEL_PAN=mychannelpan

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# generate crypto material
echo

cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi
echo

echo
# generate genesis block for orderer
configtxgen -profile OrdererGenesis -outputBlock ./config/genesis.block 
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi
echo


echo
# generate channel configuration transaction
configtxgen -profile Channel_dl_uidai -outputCreateChannelTx ./config/${CHANNEL_DL}.tx -channelID $CHANNEL_DL
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi
echo

echo
# generate channel configuration transaction
configtxgen -profile Channel_pp_uidai -outputCreateChannelTx ./config/${CHANNEL_PP}.tx -channelID $CHANNEL_PP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi
echo

echo
# generate channel configuration transaction
configtxgen -profile Channel_pan_uidai -outputCreateChannelTx ./config/${CHANNEL_PAN}.tx -channelID $CHANNEL_PAN
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi
echo


echo
# generate anchor peer transaction
configtxgen -profile Channel_dl_uidai -outputAnchorPeersUpdate ./config/OrguidaiMSPanchors_${CHANNEL_DL}.tx -channelID $CHANNEL_DL -asOrg OrguidaiMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrguidaiMSP..."
  exit 1
fi
echo

configtxgen -profile Channel_dl_uidai -outputAnchorPeersUpdate ./config/OrgdlMSPanchors_${CHANNEL_DL}.tx -channelID $CHANNEL_DL -asOrg OrgdlMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrgdlMSP..."
  exit 1
fi
echo

############################
configtxgen -profile Channel_pp_uidai -outputAnchorPeersUpdate ./config/OrguidaiMSPanchors_${CHANNEL_PP}.tx -channelID $CHANNEL_PP -asOrg OrguidaiMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrguidaiMSP..."
  exit 1
fi
echo

configtxgen -profile Channel_pp_uidai -outputAnchorPeersUpdate ./config/OrgppMSPanchors_${CHANNEL_PP}.tx -channelID $CHANNEL_PP -asOrg OrgppMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrgppMSP..."
  exit 1
fi
echo

############################

configtxgen -profile Channel_pan_uidai -outputAnchorPeersUpdate ./config/OrguidaiMSPanchors_${CHANNEL_PAN}.tx -channelID $CHANNEL_PAN -asOrg OrguidaiMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrguidaiMSP..."
  exit 1
fi
echo

configtxgen -profile Channel_pan_uidai -outputAnchorPeersUpdate ./config/OrgpanMSPanchors_${CHANNEL_PAN}.tx -channelID $CHANNEL_PAN -asOrg OrgpanMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrgpanMSP..."
  exit 1
fi
echo
