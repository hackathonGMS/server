#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

fuser -k -n tcp 3000
rm -rf ~/log/picnic.log
rm -rf ~/log/picnic-error.log

cd /home/ec2-user/picnic_server
yarn start:prod >> /home/ec2-user/log/picnic.log 2>> /home/ec2-user/log/picnic-error.log &
