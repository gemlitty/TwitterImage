# KOKO integration with X
With this tool it would be possible to check posts which mention the ... handle and return an image as a reply.

# TODO before going in production
- Add code to integrate the KOKO image generator in ./src/Integrations/KokoIntegration.ts
- Edit the cronjob scheduler in ./src/app.ts based on the X API call limit
- Edit the bearer token for the X connection in .env
- Edit the X handle in .env
- Edit the X id in .env
- Remove all the code referenced with @REMOVE