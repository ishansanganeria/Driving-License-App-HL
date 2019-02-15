export CHANNEL_NAME=mychannel
export IMAGE_TAG=1.3.0
export COMPOSE_PROJECT_NAME=hackathon_mark1

service docker status > /dev/null 2>&1
if [ $? -ne 0 ] 
then
    echo
    echo "Service Docker is not active. Activating it"
    echo
    service docker restart
fi

# REMOVE AND PREVIOUSLY EXISITING CRYPTOGRAPHIC MATERIAL
rm -rf crypto-config
rm -rf channel-artifacts

docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml down --volumes

docker rm -f $(docker ps -aq) > /dev/null 2>&1
docker network rm $(docker network ls -q)
docker volume prune -f


echo 
echo "#####################################################################"
echo "#############  Generating Cryptographic Materials  ##################"
echo "#####################################################################"
echo

./cryptogen generate --config=./crypto-config.yaml
mkdir channel-artifacts

echo
echo "#####################################################################"
echo "#############          Creating Genesis Block      ##################"
echo "#####################################################################"
echo
./configtxgen -profile SingleOrgOrdererGenesis -outputBlock ./channel-artifacts/genesis.block -channelID $CHANNEL_NAME

echo
echo "######################################################################"
echo "##### Generating channel configuration transaction 'channel.tx' ######"
echo "######################################################################"
echo

./configtxgen -profile SingleOrgChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

echo
echo "######################################################################"
echo "#################     Running docker containers     ##################"
echo "######################################################################"
echo

docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml up -d

echo 

# docker exec -it cli bash
docker exec cli scripts/cli_script.sh