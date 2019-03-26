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
CC_UIDAI_PATH=github.com/fabuidai
CC_BOTH_PATH=github.com/fabboth

docker rm -f $(docker ps -aq) > /dev/null 2>&1
docker network prune -f

function clearContainers() {
  CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer0.*.fab*.*/) {print $1}')
  if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
    echo "---- No containers available for deletion ----"
  else
    docker rm -f $CONTAINER_IDS
  fi
}

function removeUnwantedImages() {
  DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer0.*.fab*.*/) {print $3}')
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
echo "###############################################################################"
echo "############ Installing chaincode fabuidai on peer0.orguidai  ##############"
echo "###############################################################################"
echo
docker exec cliuidai peer chaincode install -n fabuidai -v 1.0 -p "$CC_UIDAI_PATH" -l "$LANGUAGE"
echo


echo
echo "###############################################################################"
echo "############ Installing chaincode fabboth on peer0.orguidai  ##############"
echo "###############################################################################"
echo
docker exec cliuidai peer chaincode install -n fabboth -v 1.0 -p "$CC_BOTH_PATH" -l "$LANGUAGE"
echo

echo
echo "###############################################################################"
echo "############ Installing chaincode fabboth on peer0.orgdl  ##############"
echo "###############################################################################"
echo
docker exec clidl peer chaincode install -n fabboth -v 1.0 -p "$CC_BOTH_PATH" -l "$LANGUAGE"
echo

echo
echo "######################################################################"
echo "##################  Instantaiting the chaincode on channel 'channelboth'   ####################"
echo "######################################################################"
echo
docker exec cliuidai peer chaincode instantiate -o orderer.example.com:7050 -C channelboth -n fabboth -l "$LANGUAGE" -v 1.0 -c '{"Args":[""]}' -P "OR ('OrgdlMSP.member','OrguidaiMSP.member')"
echo
exit

echo
echo "######################################################################"
echo "##################  Instantaiting the chaincode on channel 'channeluidai'   ####################"
echo "######################################################################"
echo
docker exec cliuidai peer chaincode instantiate -o orderer.example.com:7050 -C channeluidai -n fabuidai -l "$LANGUAGE" -v 1.0 -c '{"Args":[""]}' -P "OR ('OrguidaiMSP.member')"
echo

sleep 5

docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cliuidai peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"CreateBaseRecord","Args":["865219083334","Ishan","Sanganeria","Male","05/11/1998","20","8108152250","sdkasbdkhab@gmail.com"]}'

# cd ../fabdl
# node enrollAdmin.js

# echo
# sleep 3
# node registerUser.js

# echo
# sleep 3
# node createUserAccountDummy.js

# set -e
# echo
# sleep 3
# node createUserAccount.js

# echo
# sleep 3
# node addRTO.js 

# echo
# sleep 3
# node addOfficer.js

# echo
# sleep 3
# node addAddressData.js 

# echo
# sleep 3
# node addBaseData2.js 

# echo
# sleep 3
# node addVehicle.js 

# echo
# sleep 3
# node licenseApply.js 

# echo
# sleep 3
# node addTestResult.js 

# echo
# sleep 3
# node approveApplication.js

# echo
# sleep 3
# node addTicket.js

# echo
# sleep 3
# node suspendLicense.js

# echo
# sleep 3
# node isLicenseActive.js

# echo
# sleep 3
# node fetchListOfTickets.js

# echo
# sleep 3
# node fetchTestResults.js

# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"CreateBaseRecord","Args":["865219083334","Ishan","Sanganeria","Male","05/11/1998","20","8108152250","sdkasbdkhab@gmail.com"]}'
# # echo

# # sleep 5


# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"AddBaseData2","Args":["865219083334","Rajendra","Sanganeria","India","Indaia","5355315","AB+"]}'
# # echo

# # sleep 3

# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"AddVehicle","Args":["865219083334","asd","asd","asd","asd","asd","asd"]}'
# # echo

# # sleep 3

# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"AddAddressData","Args":["865219083334","mumbai","delhi","aligarh","110095","delhi"]}'
# # echo

# # sleep 3

# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"AddRTO","Args":["100000","Add line 1","Add line 2","cityyy","stateeee","2155112"]}'
# # echo
# # sleep 3


# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"AddOfficer","Args":["Cop","Singh","652910866634","Female","05/99/2016","45","8108162250","abcd@asjd.com","100000"]}'
# # echo
# # sleep 3


# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"AddTicket","Args":["215512","865219083334","8108162250","drinking","05/11/1975","4AM","India","false"]}'
# # echo
# # sleep 3

# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"LicenseApply","Args":["865219083334","Learning","0xagsjdfsd"]}'
# # echo
# # sleep 3

# # echo
# # docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C channelboth
 -n fabdl -c '{"function":"AddTestResult","Args":["865219083334","Written","78","100","40","8108162250","L865219083334"]}'
# # echo
# # sleep 3