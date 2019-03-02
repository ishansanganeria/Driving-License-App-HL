# set -ev

bash generate.sh

docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d

export FABRIC_START_TIMEOUT=1
sleep ${FABRIC_START_TIMEOUT}

#CREATE 3 CHANNELS
echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel create -o orderer.example.com:7050 -c mychanneldl -f /etc/hyperledger/configtx/mychanneldl.tx
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgpanMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgpan.example.com/msp" peer0.orgpan.example.com peer channel create -o orderer.example.com:7050 -c mychannelpan -f /etc/hyperledger/configtx/mychannelpan.tx
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgppMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgpp.example.com/msp" peer0.orgpp.example.com peer channel create -o orderer.example.com:7050 -c mychannelpp -f /etc/hyperledger/configtx/mychannelpp.tx
echo


sleep 5

#JOIN PEERS TO CHANNEL
echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgpanMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgpan.example.com/msp" peer0.orgpan.example.com peer channel join -b mychannelpan.block
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgppMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgpp.example.com/msp" peer0.orgpp.example.com peer channel join -b mychannelpp.block
echo


echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel join -b mychanneldl.block
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrguidaiMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orguidai.example.com/msp" peer0.orguidai.example.com peer channel join -b mychanneldl.block
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrguidaiMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orguidai.example.com/msp" peer0.orguidai.example.com peer channel join -b mychannelpp.block
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrguidaiMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orguidai.example.com/msp" peer0.orguidai.example.com peer channel join -b mychannelpan.block
echo
