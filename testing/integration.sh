#/bin/bash

echo "Cleaning up..."
rm -r files/artemis

curl http://localhost:8080/api/v1/demo

echo
echo "Creating namespace... waiting for 5 seconds..."
mkdir files/artemis
sleep 5
curl http://localhost:8080/api/v1/demo

echo
echo "Adding first track... waiting for 20 seconds..."
cp "artemis/The Place Between Stars.mp3" "files/artemis/The Place Between Stars.mp3"
sleep 20
curl http://localhost:8080/api/v1/demo/artemis

echo
echo "Adding second track... waiting for 20 seconds..."
cp "artemis/Hale-Bopp.mp3" "files/artemis/Hale-Bopp.mp3"
sleep 20
curl http://localhost:8080/api/v1/demo/artemis

echo
echo "Adding third track... waiting for 20 seconds..."
cp "artemis/Mars.mp3" "files/artemis/Mars.mp3"
sleep 20
curl http://localhost:8080/api/v1/demo/artemis
