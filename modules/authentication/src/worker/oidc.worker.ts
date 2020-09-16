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

import { AxiosError, AxiosResponse } from "axios";
import { WebWorker } from "./web-worker";
import {
    API_CALL,
    API_CALL_ALL,
    AUTH_REQUIRED,
    CUSTOM_GRANT,
    END_USER_SESSION,
    GET_SERVICE_ENDPOINTS,
    GET_USER_INFO,
    INIT,
    LOGOUT,
    REQUEST_ERROR,
    REQUEST_FINISH,
    REQUEST_START,
    REQUEST_SUCCESS,
    SIGNED_IN,
    SIGN_IN
} from "../constants";
import { SignInResponse, WebWorkerClass, WebWorkerClientConfigInterface, WebWorkerInterface, SignInResponseWorker } from "../models";
import { generateFailureDTO, generateSuccessDTO } from "../utils";

const ctx: WebWorkerClass<any> = self as any;

let webWorker: WebWorkerInterface;

ctx.onmessage = ({ data, ports }) => {
    const port = ports[0];

    switch (data.type) {
        case INIT:
            try {
                const config: WebWorkerClientConfigInterface = { ...data.data };
                config.httpClient = {
                    ...config.httpClient,
                    requestErrorCallback: onRequestErrorCallback,
                    requestFinishCallback: onRequestFinishCallback,
                    requestStartCallback: onRequestStartCallback,
                    requestSuccessCallback: onRequestSuccessCallback
                };
                webWorker = WebWorker.getInstance(config);
                port.postMessage(generateSuccessDTO());
            } catch (error) {
                port.postMessage(generateFailureDTO(error));
            }

            break;
        case SIGN_IN:
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));
            } else {
                if (data?.data?.code || data?.data?.pkce) {
                    webWorker.setAuthCode(data.data.code, data?.data?.sessionState, data?.data?.pkce);
                }
                webWorker
                    .signIn()
                    .then((response: SignInResponseWorker) => {
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
            }

            break;
        case API_CALL:
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!webWorker.isSignedIn()) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));
            } else {
                webWorker
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
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!webWorker.isSignedIn()) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));
            } else {
                webWorker
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
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!webWorker.isSignedIn()) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));
            } else {
                webWorker
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
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!webWorker.isSignedIn() && data.data.signInRequired) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));

                break;
            }

            webWorker
                .customGrant(data.data)
                .then((response) => {
                    port.postMessage(generateSuccessDTO(response));
                })
                .catch((error) => {
                    port.postMessage(generateFailureDTO(error));
                });

            break;
        case END_USER_SESSION:
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!webWorker.isSignedIn() && data.data.signInRequired) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));

                break;
            }

            webWorker
                .endUserSession()
                .then((response) => {
                    port.postMessage(generateSuccessDTO(response));
                })
                .catch((error) => {
                    port.postMessage(generateFailureDTO(error));
                });
            break;
        case GET_SERVICE_ENDPOINTS:
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            webWorker.getServiceEndpoints().then(response => {
                port.postMessage(generateSuccessDTO(response));
            }).catch(error => {
                port.postMessage(generateFailureDTO(error));
            });

            break;
        case GET_USER_INFO:
            if (!webWorker) {
                port.postMessage(generateFailureDTO("Worker has not been initiated."));

                break;
            }

            if (!webWorker.isSignedIn() && data.data.signInRequired) {
                port.postMessage(generateFailureDTO("You have not signed in yet."));

                break;
            }

            try {
                port.postMessage(generateSuccessDTO(webWorker.getUserInfo()));
            } catch (error) {
                port.postMessage(generateFailureDTO(error));
            }

            break;
        default:
            port?.postMessage(generateFailureDTO(`Unknown message type ${data?.type}`));
    }
};

const onRequestStartCallback = () => {
    ctx.postMessage({ type: REQUEST_START });
};

const onRequestSuccessCallback = (response: AxiosResponse) => {
    ctx.postMessage({ data: JSON.stringify(response ?? ""), type: REQUEST_SUCCESS });
};

const onRequestFinishCallback = () => {
    ctx.postMessage({ type: REQUEST_FINISH });
};

const onRequestErrorCallback = (error: AxiosError) => {
    const errorObject = { ...error };
    delete errorObject.toJSON;
    ctx.postMessage({ data: JSON.stringify(errorObject ?? ""), type: REQUEST_ERROR });
};

export default {} as typeof Worker & { new (): Worker };
