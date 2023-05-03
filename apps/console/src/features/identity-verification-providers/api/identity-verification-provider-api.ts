import { IDVPListResponseInterface } from "../models";
import { HttpMethods, AcceptHeaderValues } from "@wso2is/core/models";
import { store } from "../../core";
import {AsgardeoSPAClient} from "@asgardeo/auth-react";
import useRequest,{RequestConfigInterface, RequestErrorInterface, RequestResultInterface} from "../../core/hooks/use-request";


const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

export const deleteIDVP = (id: string): Promise<any> => {
    return Promise.resolve();
}

const APPLICATION_JSON = "application/json";
/**
 * Gets the IdP list with limit and offset.
 *
 // * @deprecated Use `useIdentityProviderList` hook instead.
 * @param limit - Maximum Limit of the IdP List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 *
 * @returns A promise containing the response.
 */
export const getIdentityVerificationProviderList = (
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string
): Promise<IDVPListResponseInterface> => {

    const requestConfig = {
        headers: {
            "Accept": APPLICATION_JSON,
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": APPLICATION_JSON
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset,
            requiredAttributes
        },
        url: store.getState().config.endpoints.identityVerificationProviders
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get IdP list from: "));
            }

            return Promise.resolve(response.data as IDVPListResponseInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};



/**
 * Hook to get the identity verification provider list with limit and offset.
 *
 * @param limit - Maximum Limit of the identity verification provider List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 *
 * @returns Requested IDPs
 */
export const useIdentityVerificationProviderList = <Data = IDVPListResponseInterface, Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": AcceptHeaderValues.APP_JSON
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset,
            requiredAttributes
        },
        url: store.getState().config.endpoints.identityVerificationProviders
    };
    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
