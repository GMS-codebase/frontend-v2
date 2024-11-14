#!/bin/bash



# Specify the content to be written to the .env.local file
ENV_CONTENT="# TEST\nBACKEND_BASEURL = http://10.10.77.42:8082\nBACKEND_URL = http://10.10.77.42:8082/api/v2\nNEXT_PUBLIC_BACKEND_API = http://10.10.77.42:8082/api/v2"

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
