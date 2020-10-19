/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { FunctionComponent } from "react";
import { ApplicationList } from "./application-list";
import { Application } from "../../models";

/**
 * Proptypes for the all applications component.
 */
interface AllApplicationsProps {
    allApps: Application[];
    loading: boolean;
    onAppNavigate: (id: string, url: string) => void;
    onListRefresh: () => void;
    onSearchQueryClear: () => void;
    searchQuery: string;
    showFavourites?: boolean;
}

/**
 * All applications component.
 *
 * @return {JSX.Element}
 */
export const AllApplications: FunctionComponent<AllApplicationsProps> = (
    props: AllApplicationsProps
): JSX.Element => {
    const { allApps, onAppNavigate, onListRefresh, onSearchQueryClear, loading, searchQuery, showFavourites } = props;

    return (
        <ApplicationList
            apps={ allApps }
            showFavourites={ showFavourites }
            searchQuery={ searchQuery }
            loading={ loading }
            onAppNavigate={ onAppNavigate }
            onListRefresh={ onListRefresh }
            onSearchQueryClear={ onSearchQueryClear }
        />
    );
};

/**
 * All applications component default props.
 */
AllApplications.defaultProps = {
    showFavourites: true
};
