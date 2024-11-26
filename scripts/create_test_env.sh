#!/bin/bash

# Specify the content to be written to the .env.local file
ENV_CONTENT="# TEST\nBACKEND_BASEURL = http://197.243.20.222:8080\nBACKEND_URL = http://197.243.20.222:8080/api/v2\nNEXT_PUBLIC_BACKEND_API = http://197.243.20.222:8080/api/v2\nPORT = 5700\nNEXT_PUBLIC_ENCRYPTION_KEY = 0123456789abcdef0123456789abcdef"

# Check if .env.local file exists
if [ -f .env.local ]; then
    # If the file exists, override its contents
    echo -e "$ENV_CONTENT" > .env.local
    echo "Existing .env.local file updated."
else
    # If the file doesn't exist, create it and write the content
    echo -e "$ENV_CONTENT" > .env.local
    echo ".env.local file created."
fi
