#!/bin/bash

# Fail if any command fails
set -e

echo -e "Setting up NVM and ZX...\n\n"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash > /dev/null

{
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
} > /dev/null

{
    nvm install 16 || nvm use 16
    npm i -g zx
} > /dev/null

echo -e "\nDone\n\n"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

zx $SCRIPT_DIR/main.mjs