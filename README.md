docker run -d --env-file ./.env --network=umbrel_main_network --restart=unless-stopped --name telegram meienberger/lnd-telegram


base64 -w0 