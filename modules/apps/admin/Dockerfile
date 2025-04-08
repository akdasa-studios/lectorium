# ---------------------------------------------------------------------------- #
#                                     Base                                     #
# ---------------------------------------------------------------------------- #

FROM node:22.10.0-bookworm AS base

WORKDIR /akd-stidios/lectorium/apps/admin
COPY package*.json ./
RUN npm install

COPY . .

# ---------------------------------------------------------------------------- #
#                                     Build                                    #
# ---------------------------------------------------------------------------- #

FROM base AS build
RUN npm run build-only -- --base=/admin/

# ---------------------------------------------------------------------------- #
#                                    Release                                   #
# ---------------------------------------------------------------------------- #

FROM nginx:latest AS release

LABEL org.opencontainers.image.description="Admin service for Lectorium"
LABEL org.opencontainers.image.source="https://github.com/akdasa-studios/lectorium"

COPY --from=build /akd-stidios/lectorium/apps/admin/dist /usr/share/nginx/html/admin
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]