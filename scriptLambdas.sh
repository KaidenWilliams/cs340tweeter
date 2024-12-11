###############   CALL SERVER SCRIPTS #########################

cd tweeter-server

./uploadLambdas.sh
sleep 5
./updateLayers.sh