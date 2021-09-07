/* eslint-disable max-len */
/* eslint-disable sort-keys */
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

import { HttpMethods, ProfileInfoInterface } from "@wso2is/core/models";
import { OAuth } from "@wso2is/oauth-web-worker";
import { store } from "../../core";
import { OrganisationListInterface , UserListInterface } from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = OAuth.getInstance().httpRequest;

/**
 * Retrieve the list of users that are currently in the system.
 *
 * @returns {Promise<UserListInterface>} a promise containing the user list.
 */
  export const getUsersList = (count: number, startIndex: number, filter: string, attributes: string, domain: string):
    Promise<UserListInterface> => {

    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            attributes,
            count,
            domain,
            filter,
            startIndex
        },
        url: store.getState().config.endpoints.users
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as UserListInterface);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

export const getOrganisationList = (count: number, startIndex: number, filter: string,
                                    attributes: string, domain: string, includePermissions?: boolean):
                                    Promise<OrganisationListInterface> => {

    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,

        params: {
            limit: count,
            offset: startIndex,
            $filter: filter,
            attributes: attributes,
            includePermissions: includePermissions? includePermissions: true
        },
        url: store.getState().config.endpoints.organisations
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as OrganisationListInterface);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};



export const getOrganizationPermition = (filter: string):
    Promise<OrganisationListInterface> => {

const requestConfig = {
  headers: {
   "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
   "Content-Type": "application/json"
  },
  method: HttpMethods.GET,

params: {
  $filter: filter,
  includePermissions: true
},
  url: store.getState().config.endpoints.organisations
};

return httpClient(requestConfig)
  .then((response) => {
    return Promise.resolve(response.data as OrganisationListInterface);
  })
  .catch((error) => {
   return Promise.reject(error);
  });
};

/**
 * Retrieve the list of user stores that are currently in the system.
 *
 * @returns {Promise<any>} a promise containing the user store list.
 */
export const getOrgStoreList = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.orgStores
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};


/**
 * Add new Organization.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const addOrganization = (data: object): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.organisations
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error.code.replace("-",""));
        });
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const assignRoleUsers = (data: object, orgId: string): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.organisations + "/" + orgId + "/roles"
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error.code.replace("-",""));
        });
};

/**
 * Delete organisation.
 *
 * @param organisation id
 *
 * @returns {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteOrganisation = (orgId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.organisations + "/" + orgId
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error.code.replace("-",""));
        });
};

/**
 * Add role to new user.
 *
 * @param {string} groupId - Group ID.
 * @param {object} data - Request payload
 * @returns {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const addUserRole = (data: object, groupId: string): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.groups + "/" + groupId
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update bulks of roles
 *
 * @param data request payload
 * @returns {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateUserRoles = (data: object): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.bulk
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the user information through user id.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getUserDetails = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.users + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as ProfileInfoInterface);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
};

export const getOrganisationDetails = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.organisations + "/" + id + "?includePermissions=" + true
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param userId - Organisation ID.
 * @param data - Data to be updated.
 * @return {Promise<any>} a promise containing the response.
 */
export const updateOrgInfo = (orgId: string, data: object): Promise<any> => {

    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.organisations + "/" + orgId
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error.code.replace("-",""));
        });
};


/**
 * Patch the include sub organisation
 *
 * @param userId - Organisation ID.
 * @param roleId - Organisation Role ID.
 * @param userID - Organisation user ID.
 * @return {Promise<any>} a promise containing the response.
 */
export const includeSubOrg = (orgId: string, roleId: string, userId: string, data: object): Promise<any> => {

    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.organisations + "/" + orgId + "/roles/" + roleId + "/users/" + userId
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(`Failed to update the include sub organisation - ${error}`);
        });
};


/**
 * Retrieve the user information through user id.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getRolesList = (filter: string, attributes: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            domain: filter,
            attributes: attributes
        },
        url: store.getState().config.endpoints.groups
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get the roleId using the role name.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getRoleId = (filter: string, attributes: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter: filter,
            attributes: attributes
        },
        url: store.getState().config.endpoints.groups
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
};

/**
 * Get the members' list using the roleId.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getMembersByRole = (count: number, startIndex: number, filter: string, orgId: string, roleId: string, attributes: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit: count,
            offset: startIndex,
            filter: filter,
            attributes: attributes
        },
        url: `${store.getState().config.endpoints.organisations}/${orgId}/roles/${roleId}/users`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
};


/**
 * Revoke a member from a role.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const revokeUserFromRole = (orgId: string, roleId: string, userId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.organisations}/${orgId}/roles/${roleId}/users/${userId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
};

