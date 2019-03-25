# set -ev

bash generate.sh
docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d

sleep 1

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx --outputBlock /etc/hyperledger/configtx/channel.block
echo
sleep 5

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrguidaiMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orguidai.example.com/msp" peer0.orguidai.example.com peer channel join -b /etc/hyperledger/configtx/channel.block
echo

sleep 5

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel join -b /etc/hyperledger/configtx/channel.block
echo