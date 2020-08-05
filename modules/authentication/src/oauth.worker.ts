/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
    API_CALL,
    API_CALL_ALL,
    AUTH_CODE,
    AUTH_REQUIRED,
    CUSTOM_GRANT,
    INIT,
    LOGOUT,
    REVOKE_TOKEN,
    SIGNED_IN,
    SIGN_IN,
    GET_SCOPE
} from "./constants";
import { OAuthWorker as OAuthWorkerClass, OAuthWorkerInterface, SignInResponse } from "./models";
import { OAuthWorker } from "./oauth-worker";
import { generateFailureDTO, generateSuccessDTO } from "./utils";

const ctx: OAuthWorkerClass<any> = self as any;

let oAuthWorker: OAuthWorkerInterface;

ctx.onmessage = ({ data, ports }) => {
    const port = ports[0];

    switch (data.type) {
        case INIT:
            try {
                oAuthWorker = OAuthWorker.getInstance(data.data);
                port.postMessage(generateSuccessDTO());
            } catch (error) {
                port.postMessage(generateFailureDTO(error));
            }

            break;
        case SIGN_IN:
            if (!oAuthWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));
            } else {
                oAuthWorker
                    .initOPConfiguration()
                    .then(() => {
                        if (data.data.code) {
                            oAuthWorker.setAuthCode(data.data.code);
                        }
                        oAuthWorker
                            .signIn()
                            .then((response: SignInResponse) => {
                                if (response.type === SIGNED_IN) {
                                    port.postMessage(
                                        generateSuccessDTO({
                                            data: response.data,
                                            type: SIGNED_IN
                                        })
                                    );
                                } else {
                                    port.postMessage(
                                        generateSuccessDTO({
                                            code: response.code,
                                            pkce: response.pkce,
                                            type: AUTH_REQUIRED
                                        })
                                    );
                                }
                            })
                            .catch((error) => {
                                port.postMessage(generateFailureDTO(error));
                            });
                    })
                    .catch((error) => {
                        port.postMessage(generateFailureDTO(error));
                    });
            }

            break;
        case API_CALL:
            if (!oAuthWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!oAuthWorker.isSignedIn()) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));
            } else {
                oAuthWorker
                    .httpRequest(data.data)
                    .then((response) => {
                        port.postMessage(generateSuccessDTO(response));
                    })
                    .catch((error) => {
                        port.postMessage(generateFailureDTO(error));
                    });
            }

            break;
        case API_CALL_ALL:
            if (!oAuthWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!oAuthWorker.isSignedIn()) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));
            } else {
                oAuthWorker
                    .httpRequestAll(data.data)
                    .then((response) => {
                        port.postMessage(generateSuccessDTO(response));
                    })
                    .catch((error) => {
                        port.postMessage(generateFailureDTO(error));
                    });
            }

            break;
        case LOGOUT:
            if (!oAuthWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!oAuthWorker.isSignedIn()) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));
            } else {
                oAuthWorker
                    .signOut()
                    .then((response) => {
                        if (response) {
                            port.postMessage(generateSuccessDTO(response));
                        } else {
                            port.postMessage(generateFailureDTO("Received no response"));
                        }
                    })
                    .catch((error) => {
                        port.postMessage(generateFailureDTO(error));
                    });
            }

            break;
        case CUSTOM_GRANT:
            if (!oAuthWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!oAuthWorker.isSignedIn() && data.data.signInRequired) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));

                break;
            }

            oAuthWorker
                .customGrant(data.data)
                .then((response) => {
                    port.postMessage(generateSuccessDTO(response));
                })
                .catch((error) => {
                    port.postMessage(generateFailureDTO(error));
                });

            break;
        case REVOKE_TOKEN:
            if (!oAuthWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!oAuthWorker.isSignedIn() && data.data.signInRequired) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));

                break;
            }

            oAuthWorker
                .revokeToken()
                .then((response) => {
                    port.postMessage(generateSuccessDTO(response));
                })
                .catch((error) => {
                    port.postMessage(generateFailureDTO(error));
                });
            break;
        case GET_SCOPE:
            if (!oAuthWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!oAuthWorker.isSignedIn() && data.data.signInRequired) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));

                break;
            }

            port.postMessage(oAuthWorker.getScope());

            break;
        default:
            port.postMessage(generateFailureDTO(`Unknown message type ${data?.type}`));
    }
};

export default {} as typeof Worker & { new (): Worker };
