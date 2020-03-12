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

import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { HttpMethods, Claim, AddExternalClaim, ClaimsGetParams } from "../models";
import { AxiosHttpClient } from "@wso2is/http";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Add a local claim
 * @param data Adds this data
 */
export const addLocalClaim = (data: Claim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.localClaims,
        data
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 201) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
              return Promise.reject(error?.response?.data);  
            } else {
                return Promise.reject("An error occurred while adding the local claim")
            }
        });
};

/**
 * Get all the local claims
 */
export const getAllLocalClaims = (params: ClaimsGetParams): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.localClaims,
        params
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
               return Promise.reject(error?.response?.data); 
            } else {
                return Promise.reject("An error occurred while fetching the local claims.")
            }   
        });
};

/**
 * Gets the local claim with the given ID
 * @param id The id of the local claim
 */
export const getAClaim = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.localClaims}/${id}`
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while fetching the local claim.")
            } 
        });
};

/**
 * Update a Local Claim ID with the given data
 * @param id Local Claim ID
 * @param data Updates with this data
 */
export const updateAClaim = (id: string, data: Claim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ServiceResourcesEndpoint.localClaims}/${id}`,
        data
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while updating the local claim.");
            } 
        });
};

/**
 * Deletes the local claim with the given ID
 * @param id Local Claim ID
 */
export const deleteAClaim = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.localClaims}/${id}`
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("Amn error occurred while deleting the local claim.")
            }     
        });
};

/**
 * Add a claim dialect
 * @param data Adds this data
 */
export const addDialect = (dialectURI: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.claims,
        data: {
            dialectURI
        }
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 201) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while adding the dialect.")
            }
        });
};

/**
 * Get the Claim Dialect with the given ID
 * @param id Claim Dialect ID
 */
export const getADialect = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.claims}/${id}`
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while fetching the dialect.")
            }
        });
};

/**
 * Get all the claim dialects
 */
export const getDialects = (params: ClaimsGetParams): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.claims,
        params
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while fetching dialects.")
            }
            
        });
};

/**
 * Update the claim dialect with the given ID
 * @param id Claim Dialect ID
 * @param data Updates with this data
 */
export const updateADialect = (id: string, dialectURI: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ServiceResourcesEndpoint.claims}/${id}`,
        data: {
            dialectURI
        }
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while updating the dialect.");
            }
            
        });
};

/**
 * Delete the claim dialect with the given ID
 * @param id Claim Dialect ID
 */
export const deleteADialect = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.claims}/${id}`
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while deleting the dialect.")
            }
            
        });
};

/**
 * Create an external claim
 * @param dialectID Claim Dialect ID
 * @param data Adds this data
 */
export const addExternalClaim = (dialectID: string, data: AddExternalClaim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}`,
        data
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 201) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
               return Promise.reject(error?.response?.data); 
            } else {
                return Promise.reject("Ann error occurred while add the external claim.");
            }
        });
};

/**
 * Get all the external claims
 * @param dialectID Claim Dialect ID
 */
export const getAllExternalClaims = (dialectID: string, params: ClaimsGetParams): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.externalClaims?.replace("{}", dialectID)}`,
        params
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error) {
                return Promise.reject(error?.response?.data);
            } else {
                return Promise.reject("An error occurred while fetching external claims.");
            }
        });
};

/**
 * Gets the external claim with the given ID for the given dialect
 * @param dialectID Claim Dialect ID
 * @param claimID External Claim ID
 */
export const getAnExternalClaim = (dialectID: string, claimID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}/${claimID}`
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
             if (error) {
                 return Promise.reject(error?.response?.data);
             } else {
                 return Promise.reject("An error occurred while fetching the external claim.");
             }
        });
};

/**
 * Update an external claim
 * @param dialectID Dialect ID
 * @param claimID External Claim ID
 * @param data Updates with this data
 */
export const updateAnExternalClaim = (dialectID: string, claimID: string, data: AddExternalClaim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}/${claimID}`,
        data
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
             if (error) {
                 return Promise.reject(error?.response?.data);
             } else {
                 return Promise.reject("An error occurred while updating the external claim.");
             }
        });
};

/**
 * Delete an external claim
 * @param dialectID Dialect ID
 * @param claimID Claim ID
 */
export const deleteAnExternalClaim = (dialectID: string, claimID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}/${claimID}`
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
             if (error) {
                 return Promise.reject(error?.response?.data);
             } else {
                 return Promise.reject("An error occurred while deleting the external claim.");
             }
        });
};
