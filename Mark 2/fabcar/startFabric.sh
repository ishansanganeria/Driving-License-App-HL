#!/bin/bash

service docker status > /dev/null 2>&1
if [ $? -ne 0 ] 
then
   echo
   echo "Service Docker is not active. Activating it"
   echo
   service docker restart
fi

# set -e
LANGUAGE=${1:-"golang"}
CC_SRC_PATH=github.com/fabdl

docker rm -f $(docker ps -aq) > /dev/null 2>&1
docker network prune -f

function clearContainers() {
  CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer0.*.fabdl.*/) {print $1}')
  if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
    echo "---- No containers available for deletion ----"
  else
    docker rm -f $CONTAINER_IDS
  fi
}

function removeUnwantedImages() {
  DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer0.*.fabdl.*/) {print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" == " " ]; then
    echo "---- No images available for deletion ----"
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi
}

clearContainers
removeUnwantedImages

rm -rf ./hfc-key-store


cd ../basic-network
./start.sh

echo
docker-compose -f ./docker-compose.yml up -d cli
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode install -n fabdl -v 1.0 -p "$CC_SRC_PATH" -l "$LANGUAGE"
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabdl -l "$LANGUAGE" -v 1.0 -c '{"Args":[""]}' -P "OR ('OrgdlMSP.member','Org2MSP.member')"
echo

sleep 5

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"CreateBaseRecord","Args":["865219083334","Ishan","Sanganeria","Male","05/11/1998","20","8108152250","sdkasbdkhab@gmail.com"]}'
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"AddBaseData2","Args":["865219083334","Rajendra","Sanganeria","India","Indaia","5355315","AB+"]}'
echo


# printf "Start by installing required packages run 'npm install'\n"
# printf "Then run 'node enrollAdmin.js', then 'node registerUser'\n\n"
# printf "The 'node invoke.js' will fail until it has been updated with valid arguments\n"
# printf "The 'node query.js' may be run at anytime once the user has been registered\n\n"
