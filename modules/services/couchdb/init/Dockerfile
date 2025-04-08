# ---------------------------------------------------------------------------- #
#                                     Build                                    #
# ---------------------------------------------------------------------------- #

FROM node:22-alpine3.19 AS builder
WORKDIR /akd-studios/lectorium/database/bootstrap
COPY . .
RUN npm install && npm run build

# ---------------------------------------------------------------------------- #
#                                    Release                                   #
# ---------------------------------------------------------------------------- #

FROM node:22-alpine3.19 AS release
LABEL org.opencontainers.image.description="Database Boootstrap for the Lectorium project"
LABEL org.opencontainers.image.source="https://github.com/akdasa-studios/lectorium"

WORKDIR /akd-studios/lectorium/database/bootstrap
COPY --from=builder /akd-studios/lectorium/database/bootstrap .
CMD ["npm", "run", "migrate"]
