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

import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import WorkerFile from "./oidc.worker";
import {
    API_CALL,
    API_CALL_ALL,
    AUTHORIZATION_CODE,
    AUTH_REQUIRED,
    CUSTOM_GRANT,
    END_USER_SESSION,
    GET_SERVICE_ENDPOINTS,
    GET_USER_INFO,
    INIT,
    LOGOUT,
    PKCE_CODE_VERIFIER,
    REQUEST_ERROR,
    REQUEST_FINISH,
    REQUEST_START,
    REQUEST_SUCCESS,
    SESSION_STATE,
    SIGNED_IN,
    SIGN_IN,
    LOGOUT_URL
} from "../constants";
import {
    AuthCode,
    CustomGrantRequestParams,
    HttpClient,
    Message,
    ResponseMessage,
    ServiceResourcesType,
    SignInResponse,
    UserInfo,
    WebWorkerClientInterface,
    WebWorkerConfigInterface,
    WebWorkerSingletonClientInterface,
    SignInResponseWorker
} from "../models";
import { getAuthorizationCode } from "../utils";

/**
 * This is a singleton class that allows authentication using the OAuth 2.0 protocol.
 *
 * - To get an instance of this class, use the `getInstance()` method.
 * - To initiate the authentication flow, follow the following procedure:
 * 	1. Initialize the object by calling the `initialize(config)` method. You will have to
 * 		pass a config object as an argument. To know more, checkout the `initialize()` method.
 * 	2. To get *the authorization code* from the callback URL and continue the authentication flow,
 * 		call the `listenForAuthCode()` method. In an SPA, this should be called in the page rendered by the
 * 		callback URL.
 * 	2. Kick off the authentication flow by calling the `signIn()` method.
 *
 * @example
 * Example:
 *
 * ```
 * 	var oAuth = Wso2OAuth.OAuth.getInstance();
 * 		oAuth.initialize({
 * 			clientHost: "https://localhost:9443/",
 * 			clientID: "70gph7I55ioGi5FqhLPz8JvxZCEa",
 * 			serverOrigin: "https://localhost:9443",
 * 			baseUrls: ["https://localhost:9443"],
 * 			origin: origin,
 * 			callbackURL: "https://localhost:9443/worker",
 * 			enablePKCE: true,
 * 			scope: ["SYSTEM", "openid"],
 * 		}).then(response=>{
 * 			console.log(response);
 *
 *			oAuth.listenForAuthCode().then(response=>{
 * 				console.log(response);
 * 			}).catch(error=>{
 * 				console.error(error)
 * 			});
 * 		}).catch(error=>{
 * 			console.error(error)
 * 		});
 *
 *
 * ```
 */
export const WebWorkerClient: WebWorkerSingletonClientInterface = (function(): WebWorkerSingletonClientInterface {
    /**
     * The private member variable that holds the reference to the web worker.
     */
    let worker: Worker;
    /**
     * The private member variable that holds the instance of this class.
     */
    let instance: WebWorkerClientInterface;
    /**
     * The private boolean member variable that specifies if the `initialize()` method has been called or not.
     */
    let initialized: boolean = false;
    /**
     * The private boolean member variable that specifies if the user is signed in or not.
     */
    let signedIn: boolean = false;
    /**
     * HttpClient handlers
     */
    let httpClientHandlers: HttpClient;

    /**
     * @private
     *
     * @returns {string} Removes the path parameters and returns the URL.
     *
     * @example
     * `https://localhost:9443?code=g43dhkj243wghdgwedew65&session=34khkg2g`
     * will be stripped to `https://localhost:9443`
     */
    const removeAuthorizationCode = (): string => {
        const url = location.href;

        return url.replace(/\?code=.*$/, "");
    };

    /**
     * @private
     *
     * Checks if the authorization code is present in the URL or not.
     *
     * @returns {boolean} Authorization code presence status.
     */
    const hasAuthorizationCode = (): boolean => {
        return !!getAuthorizationCode();
    };

    /**
     * @private
     *
     * Sends a message to the web worker and returns the response.
     *
     * T - Request data type.
     *
     * R - response data type.
     *
     * @param {Message} message - The message object
     * @param {number} timeout The number of seconds to wait before timing the request out. - optional
     *
     * @returns {Promise<R>} A promise that resolves with the obtained data.
     */
    const communicate = <T, R>(message: Message<T>, timeout?: number): Promise<R> => {
        const channel = new MessageChannel();

        worker.postMessage(message, [channel.port2]);

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject("Operation timed out");
            }, timeout ?? 10000);

            return (channel.port1.onmessage = ({ data }: { data: ResponseMessage<string> }) => {
                clearTimeout(timer);
                data.success ? resolve(JSON.parse(data.data)) : reject(JSON.parse(data.error));
            });
        });
    };

    /**
     * Allows using custom grant types.
     *
     * @param {CustomGrantRequestParams} requestParams Request Parameters.
     *
     * @returns {Promise<AxiosResponse|boolean>} A promise that resolves with a boolean value or the request
     * response if the the `returnResponse` attribute in the `requestParams` object is set to `true`.
     */
    const customGrant = (
        requestParams: CustomGrantRequestParams
    ): Promise<typeof requestParams["returnResponse"] extends true ? AxiosResponse : boolean | SignInResponse> => {
        if (!initialized) {
            return Promise.reject("The object has not been initialized yet");
        }

        if (!signedIn && requestParams.signInRequired) {
            return Promise.reject("You have not signed in yet");
        }

        const message: Message<CustomGrantRequestParams> = {
            data: requestParams,
            type: CUSTOM_GRANT
        };

        return communicate<
            CustomGrantRequestParams,
            typeof requestParams["returnResponse"] extends true ? AxiosResponse : boolean | SignInResponse
        >(message)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     *
     * Send the API request to the web worker and returns the response.
     *
     * @param {AxiosRequestConfig} config The Axios Request Config object
     *
     * @returns {Promise<AxiosResponse>} A promise that resolves with the response data.
     */
    const httpRequest = <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        if (!initialized) {
            return Promise.reject("The object has not been initialized yet");
        }

        if (!signedIn) {
            return Promise.reject("You have not signed in yet");
        }

        const message: Message<AxiosRequestConfig> = {
            data: config,
            type: API_CALL
        };

        return communicate<AxiosRequestConfig, AxiosResponse<T>>(message)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     *
     * Send multiple API requests to the web worker and returns the response.
     * Similar `axios.spread` in functionality.
     *
     * @param {AxiosRequestConfig[]} config The Axios Request Config object
     *
     * @returns {Promise<AxiosResponse>[]} A promise that resolves with the response data.
     */
    const httpRequestAll = <T = any>(configs: AxiosRequestConfig[]): Promise<AxiosResponse<T>[]> => {
        if (!initialized) {
            return Promise.reject("The object has not been initialized yet");
        }

        if (!signedIn) {
            return Promise.reject("You have not signed in yet");
        }

        const message: Message<AxiosRequestConfig[]> = {
            data: configs,
            type: API_CALL_ALL
        };

        return communicate<AxiosRequestConfig[], AxiosResponse<T>[]>(message)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * Initializes the object with authentication parameters.
     *
     * @param {ConfigInterface} config The configuration object.
     *
     * @returns {Promise<boolean>} Promise that resolves when initialization is successful.
     *
     * The `config` object has the following attributes:
     * ```
     * 	var config = {
     * 		authorizationType?: string //optional
     * 		clientHost: string
     * 		clientID: string
     *    	clientSecret?: string //optional
     * 		consentDenied?: boolean //optional
     * 		enablePKCE?: boolean //optional
     *		prompt?: string //optional
     *		responseMode?: "query" | "form-post" //optional
     *		scope?: string[] //optional
     *		serverOrigin: string
     *		tenant?: string //optional
     *		tenantPath?: string //optional
     *		baseUrls: string[]
     *		callbackURL: string
     *	}
     * ```
     */
    const initialize = (config: WebWorkerConfigInterface): Promise<boolean> => {
        if (config.authorizationType && typeof config.authorizationType !== "string") {
            return Promise.reject("The authorizationType must be a string");
        }

        if (!(config.baseUrls instanceof Array)) {
            return Promise.reject("baseUrls must be an array");
        }

        if (config.baseUrls.find((baseUrl) => typeof baseUrl !== "string")) {
            return Promise.reject("Array elements of baseUrls must all be string values");
        }

        if (typeof config.signInRedirectURL !== "string") {
            return Promise.reject("The sign-in redirect URL must be a string");
        }

        if (typeof config.signOutRedirectURL !== "string") {
            return Promise.reject("The sign-out redirect URL must be a string");
        }

        if (typeof config.clientHost !== "string") {
            return Promise.reject("The clientHost must be a string");
        }

        if (typeof config.clientID !== "string") {
            return Promise.reject("The clientID must be a string");
        }

        if (config.clientSecret && typeof config.clientSecret !== "string") {
            return Promise.reject("The clientString must be a string");
        }

        if (config.consentDenied && typeof config.consentDenied !== "boolean") {
            return Promise.reject("consentDenied must be a boolean");
        }

        if (config.enablePKCE && typeof config.enablePKCE !== "boolean") {
            return Promise.reject("enablePKCE must be a boolean");
        }

        if (config.prompt && typeof config.prompt !== "string") {
            return Promise.reject("The prompt must be a string");
        }

        if (config.responseMode && typeof config.responseMode !== "string") {
            return Promise.reject("The responseMode must be a string");
        }

        if (config.responseMode && config.responseMode !== "form_post" && config.responseMode !== "query") {
            return Promise.reject("The responseMode is invalid");
        }

        if (config.scope && !(config.scope instanceof Array)) {
            return Promise.reject("scope must be an array");
        }

        if (config.scope && config.scope.find((aScope) => typeof aScope !== "string")) {
            return Promise.reject("Array elements of scope must all be string values");
        }

        if (typeof config.serverOrigin !== "string") {
            return Promise.reject("serverOrigin must be a string");
        }

        httpClientHandlers = {
            isHandlerEnabled: true,
            requestErrorCallback: null,
            requestFinishCallback: null,
            requestStartCallback: null,
            requestSuccessCallback: null
        };

        worker.onmessage = ({ data }) => {
            switch (data.type) {
                case REQUEST_ERROR:
                    httpClientHandlers?.requestErrorCallback &&
                        httpClientHandlers?.requestErrorCallback(JSON.parse(data.data ?? ""));
                    break;
                case REQUEST_FINISH:
                    httpClientHandlers?.requestFinishCallback && httpClientHandlers?.requestFinishCallback();
                    break;
                case REQUEST_START:
                    httpClientHandlers?.requestStartCallback && httpClientHandlers?.requestStartCallback();
                    break;
                case REQUEST_SUCCESS:
                    httpClientHandlers?.requestSuccessCallback &&
                        httpClientHandlers?.requestSuccessCallback(JSON.parse(data.data ?? ""));
                    break;
            }
        };

        const message: Message<WebWorkerConfigInterface> = {
            data: config,
            type: INIT
        };

        return communicate<WebWorkerConfigInterface, null>(message)
            .then(() => {
                initialized = true;

                return Promise.resolve(true);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * @private
     *
     * Sends the authorization code and authenticates the user.
     *
     * @returns {Promise<UserInfo>} Promise that resolves on successful authentication.
     */
    const sendAuthorizationCode = (): Promise<UserInfo> => {
        const authCode = getAuthorizationCode();
        const sessionState = new URL(window.location.href).searchParams.get(SESSION_STATE);

        const message: Message<AuthCode> = {
            data: {
                code: authCode,
                pkce: sessionStorage.getItem(PKCE_CODE_VERIFIER),
                sessionState: sessionState
            },
            type: SIGN_IN
        };

        history.pushState({}, document.title, removeAuthorizationCode());
        sessionStorage.removeItem(PKCE_CODE_VERIFIER);
        sessionStorage.removeItem(AUTHORIZATION_CODE);

        return communicate<AuthCode, SignInResponseWorker>(message)
            .then((response) => {
                if (response.type === SIGNED_IN) {
                    signedIn = true;

                    sessionStorage.setItem(LOGOUT_URL, response.data.logoutUrl);

                    const data = response.data;
                    delete data.logoutUrl;
                    return Promise.resolve(data);
                }

                return Promise.reject(
                    "Something went wrong during authentication. " +
                        "Failed during signing in after getting the authorization code."
                );
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * Initiates the authentication flow.
     *
     * @returns {Promise<UserInfo>} A promise that resolves when authentication is successful.
     */
    const signIn = (): Promise<UserInfo> => {
        if (initialized) {
            if (hasAuthorizationCode() || sessionStorage.getItem(PKCE_CODE_VERIFIER)) {
                return sendAuthorizationCode();
            } else {
                const message: Message<null> = {
                    data: null,
                    type: SIGN_IN
                };

                return communicate<null, SignInResponseWorker>(message)
                    .then((response) => {
                        if (response.type === SIGNED_IN) {
                            signedIn = true;

                            sessionStorage.setItem(LOGOUT_URL, response.data.logoutUrl);

                            const data = response.data;
                            delete data.logoutUrl;
                            return Promise.resolve(data);
                        } else if (response.type === AUTH_REQUIRED && response.code) {
                            if (response.pkce) {
                                sessionStorage.setItem(PKCE_CODE_VERIFIER, response.pkce);
                            }

                            location.href = response.code;

                            return Promise.resolve({
                                allowedScopes: "",
                                displayName: "",
                                email: "",
                                username: ""
                            });
                        } else {
                            if (response.type === AUTH_REQUIRED && !response.code) {
                                return Promise.reject(
                                    "Something went wrong during authentication." +
                                        " No authorization url was received." +
                                        JSON.stringify(response)
                                );
                            } else {
                                return Promise.reject(
                                    "Something went wrong during authentication." +
                                        "Unknown response received. " +
                                        JSON.stringify(response)
                                );
                            }
                        }
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
            }
        } else {
            return Promise.reject("Error while signing in. The object has not been initialized yet.");
        }
    };

    /**
     * Initiates the sign out flow.
     *
     * @returns {Promise<boolean>} A promise that resolves when sign out is completed.
     */
    const signOut = (): Promise<boolean> => {
        if (!signedIn) {
            if (sessionStorage.getItem(LOGOUT_URL)) {
                const logoutUrl = sessionStorage.getItem(LOGOUT_URL);
                sessionStorage.removeItem(LOGOUT_URL);
                window.location.href = logoutUrl;

                return Promise.resolve(true);
            }

            return Promise.reject("You have not signed in yet");
        }

        const message: Message<null> = {
            type: LOGOUT
        };

        return communicate<null, string>(message)
            .then((response) => {
                signedIn = false;
                window.location.href = response;

                return Promise.resolve(true);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * Revokes token.
     *
     * @returns {Promise<boolean>} A promise that resolves when revoking is completed.
     */
    const endUserSession = (): Promise<boolean> => {
        if (!signedIn) {
            return Promise.reject("You have not signed in yet");
        }

        const message: Message<null> = {
            type: END_USER_SESSION
        };

        return communicate<null, boolean>(message)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    const getServiceEndpoints = (): Promise<ServiceResourcesType> => {
        const message: Message<null> = {
            type: GET_SERVICE_ENDPOINTS
        };

        return communicate<null, ServiceResourcesType>(message)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

      const getUserInfo = (): Promise<UserInfo> => {
          const message: Message<null> = {
              type: GET_USER_INFO
          };

          return communicate<null, UserInfo>(message)
              .then((response) => {
                  return Promise.resolve(response);
              })
              .catch((error) => {
                  return Promise.reject(error);
              });
      };

    const onHttpRequestSuccess = (callback: (response: AxiosResponse) => void): void => {
        if (callback && typeof callback === "function") {
            httpClientHandlers.requestSuccessCallback = callback;
        }
    };

    const onHttpRequestError = (callback: (response: AxiosError) => void): void => {
        if (callback && typeof callback === "function") {
            httpClientHandlers.requestErrorCallback = callback;
        }
    };

    const onHttpRequestStart = (callback: () => void): void => {
        if (callback && typeof callback === "function") {
            httpClientHandlers.requestStartCallback = callback;
        }
    };

    const onHttpRequestFinish = (callback: () => void): void => {
        if (callback && typeof callback === "function") {
            httpClientHandlers.requestFinishCallback = callback;
        }
    };

    /**
     * @constructor
     *
     * This returns the object containing the public methods.
     *
     * @returns {OAuthInterface} OAuthInterface object
     */
    function Constructor(): WebWorkerClientInterface {
        worker = new WorkerFile();

        return {
            customGrant,
            endUserSession,
            getServiceEndpoints,
            getUserInfo,
            httpRequest,
            httpRequestAll,
            initialize,
            onHttpRequestError,
            onHttpRequestFinish,
            onHttpRequestStart,
            onHttpRequestSuccess,
            signIn,
            signOut
        };
    }

    return {
        getInstance: (): WebWorkerClientInterface => {
            if (instance) {
                return instance;
            } else {
                instance = Constructor();

                return instance;
            }
        }
    };
})();
