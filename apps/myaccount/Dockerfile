# syntax = docker/dockerfile:1.0-experimental
# -------------------------------------------------------------------------------------
# Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
#
# This software is the property of WSO2 LLC. and its suppliers, if any.
# Dissemination of any information or reproduction of any material contained
# herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
# You may not alter or remove any copyright or other notice from copies of this content.
#
# -------------------------------------------------------------------------------------

FROM node:lts-alpine as builder

WORKDIR /identity-apps

RUN npm i -g npm@6.14.13

COPY myaccount .

FROM nginx:alpine

COPY --from=builder /identity-apps /usr/share/nginx/html
