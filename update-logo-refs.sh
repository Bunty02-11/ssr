#!/bin/bash

# This script updates all references to bd8bf9c117ab50f7f8421 to logoSrc in the app directory
find /Users/sagarsingh/Desktop/prism/torando/FE/app -type f -name "*.js" -exec sed -i '' 's/bd8bf9c117ab50f7f8421="/logoSrc="/g' {} \;
