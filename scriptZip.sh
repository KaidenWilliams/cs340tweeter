
###############   MAKE NEW NODEJS #########################

#!/bin/bash


# Exit on any error
set -e

# Source server configuration
source tweeter-server/.server

echo "Starting build and deployment process..."

# 1. Ensure we're in the right directory
if [[ ! -d "tweeter-shared" ]] || [[ ! -d "tweeter-server" ]]; then
    echo "Error: Must be run from tweeter-web-starter directory"
    exit 1
fi

# 2. Build tweeter-shared
echo "Building tweeter-shared..."
cd tweeter-shared
npm run build
cd ..

# 3. Build tweeter-server
echo "Building tweeter-server..."
cd tweeter-server
npm install
npm run build
cd ..


# 4. Handle entire node_modules replacement - CAN BE PUT IN IF NEEDED
# echo "Replacing entire node_modules in nodejs folder..."
# # First, remove the old nodejs/node_modules if it exists
# if [ -d "tweeter-server/nodejs/node_modules" ]; then
#     rm -rf "tweeter-server/nodejs/node_modules"
# fi

# # Copy the entire node_modules directory
# echo "Copying node_modules from tweeter-server to nodejs folder..."
# cp -r "tweeter-server/node_modules" "tweeter-server/nodejs/"



# 5. Handle tweeter-shared module replacement
echo "Updating tweeter-shared in server node_modules..."
SHARED_PATH="tweeter-shared"
SERVER_MODULES_PATH="tweeter-server/nodejs/node_modules/tweeter-shared"


# Remove existing tweeter-shared if it exists
if [ -d "$SERVER_MODULES_PATH" ]; then
    rm -rf "$SERVER_MODULES_PATH"
fi

# Copy new tweeter-shared
cp -r "$SHARED_PATH" "$SERVER_MODULES_PATH"



# 6. Create nodejs.zip in tweeter-server folder
cd tweeter-server
echo "Creating nodejs.zip in tweeter-server folder..."
if [ -f "nodejs.zip" ]; then
    echo "Removing existing nodejs.zip..."
    rm nodejs.zip
fi

# 7. Zip the file
python -c "
import os
import zipfile

directory_to_zip = 'nodejs'
output_zip_file = 'nodejs.zip'

with zipfile.ZipFile(output_zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(directory_to_zip):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.join(directory_to_zip, os.path.relpath(file_path, directory_to_zip))
            zipf.write(file_path, arcname)

if os.path.exists(output_zip_file):
    print('Zip file created successfully:', output_zip_file)
else:
    print('Failed to create zip file')
"

echo "nodejs.zip has been created in: $(pwd)/nodejs.zip"


# Check if nodejs.zip exists
if [ ! -f "nodejs.zip" ]; then
    echo "Error: nodejs.zip not found in $(pwd)"
    exit 1
fi


# 8. Update lambda with new zipped node.js
MSYS_NO_PATHCONV=1 aws lambda publish-layer-version \
    --layer-name "tweeterLambdaLayer" \
    --zip-file fileb://nodejs.zip \
    --compatible-runtimes nodejs20.x \
    --region $REGION \
    --output json > /dev/null

LATEST_VERSION=$(MSYS_NO_PATHCONV=1 aws lambda list-layer-versions \
    --layer-name "tweeterLambdaLayer" \
    --region $REGION \
    --query 'LayerVersions[0].Version' \
    --output text 2>/dev/null)



# 8. Update LAMBDALAYER_ARN in .server file with new version
echo "Updating LAMBDALAYER_ARN version..."
# Extract base ARN (everything before the version number)
BASE_ARN=$(echo $LAMBDALAYER_ARN | sed 's/:[0-9]*$//')
NEW_ARN="${BASE_ARN}:${LATEST_VERSION}"

# Update .server file
sed -i.bak "s|LAMBDALAYER_ARN='.*'|LAMBDALAYER_ARN='${NEW_ARN}'|" .server
rm .server.bak

cd ..  # Return to tweeter-web-starter directory
echo "Build and deployment process completed successfully!"





###############   MAKE NEW DIST #########################


# 2. CD into tweeter-server
cd tweeter-server

# 3. If dist.zip exists, delete it
if [ -f "dist.zip" ]; then
    echo "Removing existing dist.zip..."
    rm dist.zip
fi

# 4. Use Python to zip the contents of the dist folder
echo "Creating dist.zip..."
python -c "
import shutil
import os

dist_dir = 'dist'
output_zip = 'dist.zip'

if os.path.exists(dist_dir):
    shutil.make_archive(output_zip.replace('.zip', ''), 'zip', dist_dir)
    if os.path.exists(output_zip):
        print(f'dist.zip has been created in: {os.getcwd()}')
    else:
        print('Error: Failed to create dist.zip')
        exit(1)
else:
    print(f'Error: {dist_dir} directory not found')
    exit(1)
"

echo "Process completed successfully!"
cd ..