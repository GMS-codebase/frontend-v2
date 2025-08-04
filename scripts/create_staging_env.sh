#!/bin/bash



# Specify the content to be written to the .env.local file
ENV_CONTENT="# TEST\nBACKEND_BASEURL = https://api.gms.rtbdev.online\nBACKEND_URL = https://api.gms.rtbdev.online/api/v2\nNEXT_PUBLIC_BACKEND_API = https://api.gms.rtbdev.online/api/v2\nPORT = 5800\nNEXT_PUBLIC_ENCRYPTION_KEY = 0123456789abcdef0123456789abcdef"

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
