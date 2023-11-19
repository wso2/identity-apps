/**  
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useSelector } from "react-redux";
import { AppState } from "../store/index";
import { OrganizationType } from "../constants/organization-constants";

/**
 * This is a React hook that returns the type of the organization.
 *
 * @returns The type of the organization.
 */
export const useGetCurrentOrganizationType = (): OrganizationType => {
    return useSelector(
        (state: AppState) => state.organization.organizationType
    );
};
