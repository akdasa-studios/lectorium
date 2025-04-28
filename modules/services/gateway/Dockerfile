FROM nginx:1.27.2-bookworm

ENV CONFIG_TYPE=dev

# ---------------------------------------------------------------------------- #
#                                   Metadata                                   #
# ---------------------------------------------------------------------------- #

LABEL org.opencontainers.image.description="Gateway for the Lectorium project"
LABEL org.opencontainers.image.source="https://github.com/akdasa-studios/lectorium"

# ---------------------------------------------------------------------------- #
#                                     Build                                    #
# ---------------------------------------------------------------------------- #

WORKDIR /lectorium/gateway
COPY ./services/gateway .

# ---------------------------------------------------------------------------- #
#                                      Run                                     #
# ---------------------------------------------------------------------------- #

CMD ["nginx", "-c", "/lectorium/gateway/nginx.$CONFIG_TYPE.conf", "-g", "daemon off;"]
