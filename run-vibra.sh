#!/bin/bash

# Install Go if not installed
if ! command -v go &> /dev/null
then
    echo "Go is not installed. Installing Go..."
    # You may need to adjust this based on the OS
    wget https://golang.org/dl/go1.16.5.linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin
fi

# Install Node.js and npm if not installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Installing Node.js and npm..."
    # You may need to adjust this based on the OS
    curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Clone the repository (assuming you've pushed this to a GitHub repo)
git clone https://github.com/yourusername/vibra-app.git
cd vibra-app

# Build and run the Go server
echo "Building and running the Go server..."
go build -o vibra-server
./vibra-server &

# Install dependencies and run the Electron app
echo "Installing dependencies and running the Electron app..."
npm install
npm start
