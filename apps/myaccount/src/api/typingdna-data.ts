import { IdentityClient } from "@wso2/identity-oidc-js";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../store";
import * as https from "https";

const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());


/**
 * This API is used to retrieve the QR code URL of the authenticated user.
 */
export const DeleteTypingPatterns = (): Promise<any> => {

    const requestConfig = {
            headers: {
                "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
                "Content-Type": "application/json"
            },
            method: HttpMethods.DELETE,
            url: store.getState().config.endpoints.typingDNAMe
        };

        return httpClient(requestConfig)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(`An error occurred. The server returned ${response.status}`);
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });

};

export const IsTypingDNAEnabled = (): Promise<boolean> => {
    const requestConfig = {
            headers: {
                "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.typingDNAServer
        };
    return httpClient(requestConfig)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.resolve(true);
                }
                else if (response.data.enabled == true){
                    return Promise.resolve(true)
                }
                else{
                    return Promise.resolve(false);

                }
            })
            .catch(() => {
                Promise.resolve(false);
            });
};



