import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { WorkflowListItemInterface, WorkflowDetails, WorkflowTemplate, WorkflowModelPayload } from "../models/workflow-definitions";
import useRequest, { RequestConfigInterface, RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { AxiosError, AxiosResponse } from "axios";

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

export const fetchWorkflows = < Data = WorkflowListItemInterface[], Error = RequestErrorInterface>(
    limit: number,
    offset: number,
    shouldFetch: boolean = true
) : RequestResultInterface<Data, Error> => {  
    let requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset
        },
        url: store.getState().config.endpoints.workflows
    };
    
    const {
        data,
        error,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>( shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate,
        response
    };
}

export const fetchWorkflowsById = (id: string) : Promise<any> => {
    let requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.workflows + "/" + id
    };

    return httpClient(requestConfig).then((response)=>{
        return Promise.resolve(response.data as WorkflowDetails)
    }).catch((error) => {
        return Promise.reject(`Failed to retrieve workflow details - ${ error }`);
    });
}

export const deleteWorkflowById = (id: string) : Promise<any> => {
    let requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.workflows + "/" + id
    }

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
}

export const addWorkflowModel = (data: WorkflowModelPayload) => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.workflows
    }
    return httpClient(requestConfig).then((response: AxiosResponse) => {
        return Promise.resolve(response.data);
    })
    .catch((error: AxiosError) => {
        console.log(error?.response)
        return Promise.reject(error?.response?.data);
    });
}

/**
 * Updates a Workflow Model.
 *
 * @param id - Workflow Model ID.
 * @param data - Update Data.
 *
 * @returns updated workflow model.
 */

export const updateWorkflowModel = (id: string, data: WorkflowModelPayload) => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.workflows}/${id}`
    };

    return httpClient(requestConfig)
            .then((response: AxiosResponse) => {
                if (response.status !== 200) {
                    return Promise.reject(`An error occurred. The server returned ${response.status}`);
                }
    
                return Promise.resolve(response.data);
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error?.response?.data);
            });
}
