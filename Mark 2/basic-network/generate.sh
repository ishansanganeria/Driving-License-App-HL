export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH

export CHANNEL_BOTH=channelboth
export CHANNEL_UIDAI=channeluidai
export CHANNEL_DL=channeldl

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

mkdir config crypto-config

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
sleep 2

echo
echo "#####################################################################"
echo "#############          Creating Genesis Block      ##################"
echo "#####################################################################"
echo
configtxgen -profile OrdererGenesis -outputBlock ./config/genesis.block -channelID testchannel
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi
echo
sleep 2

echo
echo "###########################################################################"
echo "##### Generating channel configuration transaction 'channeluidai.tx' ######"
echo "###########################################################################"
echo
configtxgen -profile ChannelOrgUidai -outputCreateChannelTx ./config/channeluidai.tx -channelID $CHANNEL_UIDAI
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi
sleep 2

echo
echo "###########################################################################"
echo "##### Generating channel configuration transaction 'channeldl.tx' ######"
echo "###########################################################################"
echo
configtxgen -profile ChannelOrgDl -outputCreateChannelTx ./config/channeldl.tx -channelID $CHANNEL_DL
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi
sleep 2

echo
echo "###########################################################################"
echo "##### Generating channel configuration transaction 'channelboth.tx' ######"
echo "###########################################################################"
echo
configtxgen -profile ChannelBothOrgs -outputCreateChannelTx ./config/channelboth.tx -channelID $CHANNEL_BOTH
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi
sleep 2

echo
echo "############################################################################"
echo "################# Defining Anchor Peers for Orguidai ORG ###################"
echo "############################################################################"
echo
configtxgen -profile ChannelBothOrgs -outputAnchorPeersUpdate ./config/OrguidaiMSPanchors.tx -channelID $CHANNEL_BOTH -asOrg OrguidaiMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrgdlMSP..."
  exit 1
fi
sleep 2

echo
echo "#########################################################################"
echo "################# Defining Anchor Peers for Orgdl ORG ###################"
echo "#########################################################################"
echo
configtxgen -profile ChannelBothOrgs -outputAnchorPeersUpdate ./config/OrgdlMSPanchors.tx -channelID $CHANNEL_BOTH -asOrg OrgdlMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for OrgdlMSP..."
  exit 1
fi
echo
