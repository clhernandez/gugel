#!/usr/bin/env bash

sudo apt-get update
sudo apt-get install -y wget

# install mongodb
# sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
# echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
# sudo apt-get install -y mongodb-org

#install nodejs
sudo apt-get install -y nodejs
sudo apt-get install -y npm
# sudo service mongod start

#install docker dependencies
sudo apt-get install linux-image-generic-lts-trusty
sudo reboot