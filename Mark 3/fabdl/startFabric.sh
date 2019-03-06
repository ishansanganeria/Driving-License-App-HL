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
echo

#########################################

set -ev 
echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode install -n fabdl -v 1.0 -p "$CC_SRC_PATH" -l "$LANGUAGE"
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode instantiate -o orderer.example.com:7050 -C mychanneldl -n fabdl -l "$LANGUAGE" -v 1.0 -c '{"Args":[""]}' -P "OR ('OrgdlMSP.member','OrguidaiMSP.member')"
echo

sleep 5

#########################################


echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgpanMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgpan.example.com/users/Admin@orgpan.example.com/msp" clipan peer chaincode install -n fabpan -v 1.0 -p "$CC_SRC_PATH" -l "$LANGUAGE"
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgpanMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgpan.example.com/users/Admin@orgpan.example.com/msp" clipan peer chaincode instantiate -o orderer.example.com:7050 -C mychannelpan -n fabpan -l "$LANGUAGE" -v 1.0 -c '{"Args":[""]}' -P "OR ('OrgpanMSP.member','OrguidaiMSP.member')"
echo

sleep 5

#########################################


echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgppMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgpp.example.com/users/Admin@orgpp.example.com/msp" clipp peer chaincode install -n fabpp -v 1.0 -p "$CC_SRC_PATH" -l "$LANGUAGE"
echo

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgppMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgpp.example.com/users/Admin@orgpp.example.com/msp" clipp peer chaincode instantiate -o orderer.example.com:7050 -C mychannelpp -n fabpp -l "$LANGUAGE" -v 1.0 -c '{"Args":[""]}' -P "OR ('OrgppMSP.member','OrguidaiMSP.member')"
echo

sleep 5

#########################################


cd ../fabdl
node enrollAdmin.js
node registerUser.js
node crtuser.js
# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"CreateUserAccount","Args":["9660440353","Pulkit","Gupta","Male","05/11/1998","20","pulkit@gmail.com","#25656565","#995959"]}'

# sleep 5


# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"AddBaseData2","Args":["9660440353","Nagendra","Gupta","India","Indaia","5355315","AB+"]}'

# sleep 5



# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"AadharApply","Args":["9660440353","12/12/12","12:20"]}'

# sleep 5

# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"AddAddressData","Args":["9660440353","L-106 Agrasen","patparganj","delhi","110095","delhi"]}'

# sleep 5

# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"ApproveApplication","Args":["9660440353","12/12/12","12:20"]}'

# sleep 5

# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"ApplyDL","Args":["9660440353"]}'

# sleep 5

# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"ApplyPP","Args":["9660440353"]}'

# sleep 5

# docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" clidl peer chaincode invoke -o orderer.example.com:7050 -C mychanneldl -n fabdl -c '{"function":"ApplyPAN","Args":["9660440353"]}'