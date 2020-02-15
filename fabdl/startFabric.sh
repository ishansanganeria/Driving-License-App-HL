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
CC_DL_PATH=github.com/fabdl
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
echo "##############  Installing chaincode fabuidai on peer0.orguidai  ##############"
echo "###############################################################################"
echo
docker exec cliuidai peer chaincode install -n fabuidai -v 1.0 -p "$CC_UIDAI_PATH" -l golang
echo

echo
echo "###############################################################################"
echo "#################  Installing chaincode fabdl on peer0.orgdl  #################"
echo "###############################################################################"
echo
docker exec clidl peer chaincode install -n fabdl -v 1.0 -p "$CC_DL_PATH" -l golang
echo

echo
echo "###############################################################################"
echo "############ Installing chaincode fabboth on peer0.org{uidai,dl}  #############"
echo "###############################################################################"
echo
docker exec cliuidai peer chaincode install -n fabboth -v 1.0 -p "$CC_BOTH_PATH" -l golang
docker exec clidl peer chaincode install -n fabboth -v 1.0 -p "$CC_BOTH_PATH" -l golang
echo

echo
echo "###############################################################################################"
echo "##################  Instantaiting the chaincode on channel 'channelboth'   ####################"
echo "###############################################################################################"
echo
docker exec clidl peer chaincode instantiate -o orderer.example.com:7050 -C channelboth -n fabboth -l golang -v 1.0 -c '{"Args":[""]}' -P "OR ('OrgdlMSP.member','OrguidaiMSP.member')"
echo

echo
echo "###############################################################################################"
echo "##################   Instantaiting the chaincode on channel 'channeldl'   #####################"
echo "###############################################################################################"
echo
docker exec clidl peer chaincode instantiate -o orderer.example.com:7050 -C channeldl -n fabdl -l golang -v 1.0 -c '{"Args":[""]}' -P "OR ('OrgdlMSP.member')"
echo

echo
echo "################################################################################################"
echo "##################  Instantaiting the chaincode on channel 'channeluidai'   ####################"
echo "################################################################################################"
echo
docker exec cliuidai peer chaincode instantiate -o orderer.example.com:7050 -C channeluidai -n fabuidai -l golang -v 1.0 -c '{"Args":[""]}' -P "OR ('OrguidaiMSP.member')"
echo
sleep 5

echo
echo "################################################################################################"
echo "#####################    Running a blank code to invoke remaining CCs    #######################"
echo "################################################################################################"
echo

docker exec cliuidai peer chaincode invoke -o orderer.example.com:7050 -C channelboth -n fabboth -c '{"function":"BlankRun","Args":[""]}'

cd ../nodeserver
npm install -i
npm rebuild

# cd nodejsfiles
# rm -rf hfc-key-store

# echo
# echo "################################################################################################"
# echo "#######################  Enrolling admin for organization Orguidai    #########################"
# echo "################################################################################################"
# echo
# node enrollAdmin.js OrguidaiMSP

# echo
# echo "################################################################################################"
# echo "#######################  Enrolling admin for organization  Orgdl       #########################"
# echo "################################################################################################"
# echo
# node enrollAdmin.js OrgdlMSP

# echo
# echo "################################################################################################"
# echo "########################  Enrolling user for organization  Orguidai   ##########################"
# echo "################################################################################################"
# echo
# node registerUser.js OrguidaiMSP

# echo
# echo "################################################################################################"
# echo "########################  Enrolling user for organization    Orgdl    ##########################"
# echo "################################################################################################"
# echo
# node registerUser.js OrgdlMSP

# cd ..
# node server.js
