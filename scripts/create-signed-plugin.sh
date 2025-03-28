#!/bin/bash

echo Building plugin...
yarn install && yarn build

echo Signing plugin...
yarn sign

echo Creating zip file...
cp -r dist novatec-sdg-panel
mkdir -p release && zip -r release/novatec-sdg-panel.zip novatec-sdg-panel
rm -r novatec-sdg-panel
