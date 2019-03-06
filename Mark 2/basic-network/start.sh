# set -ev

bash generate.sh

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.orgdl.example.com couchdb

export FABRIC_START_TIMEOUT=1
sleep ${FABRIC_START_TIMEOUT}

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
echo

sleep 5

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel join -b mychannel.block
echo