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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, UserAvatar } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppConstants, history } from "../../core";
import { getOrganisationDetails } from "../api";
import { EditOrganisation } from "../components";


/**
 * User Edit page.
 *
 * @return {React.ReactElement}
 */
const OrganisationEditPage = (): ReactElement => {

    const dispatch = useDispatch();

    const [ organisationProfile, setOrganisationProfile ] = useState([]);
    const [ isOrganisationDetailsRequestLoading, setIsOrganisationDetailsRequestLoading ] = useState<boolean>(false);
    const [ organisationType, setOrganisationType ] = useState<any>([]);
    const [ organisationDisplayName, setOrganisationDisplayName] = useState<string>("");

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const getOrganisation = (id: string) => {
        setIsOrganisationDetailsRequestLoading(true);

        getOrganisationDetails(id)
            .then((response) => {
                setOrganisationProfile(response.data);
                if (response.data.attributes) {
                    setOrganisationType(findValueByKey(response.data.attributes, "Type"));
                }
                setOrganisationDisplayName(response.data.name);
            })
            .catch((error) => {
                // TODO add to notifications
                if(error.code == "ORG-60048"){
                    dispatch(addAlert({
                        description: "This Organisation id does not exist.",
                        level: AlertLevels.ERROR,
                        message: "Invalid Organisation id."
                    }));

                    setTimeout(() => {
                        history.push(AppConstants.PATHS.get("ORGANISATIONS"));
                    }, 1000);
                }
            })
            .finally(() => {
                setIsOrganisationDetailsRequestLoading(false);
            });
    };

    const handleOrganisationUpdate = (id: string) => {
        getOrganisation(id);
    };

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];
        getOrganisation(id);
    }, []);

    const handleBackButtonClick = () => {
        history.push(AppConstants.PATHS.get("ORGANISATIONS"));
    };

    const findValueByKey = (attributes, key): void => {
        const match = attributes.filter(function (attributes) {
            return attributes.key === key;
        });
        return match[0] ? match[0].value : "";
    };

    return (
        <PageLayout
            isLoading={ isOrganisationDetailsRequestLoading }
            title={ organisationDisplayName }
            description={ organisationType }
            image={ (
                <UserAvatar
                    name={ organisationDisplayName }
                    size="tiny"
                    floated="left"
                />
            ) }
            backButton={ {
                "data-testid": "user-mgt-edit-user-back-button",
                onClick: handleBackButtonClick,
                text: "Back to Organisations"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditOrganisation 
                organisation={ organisationProfile } 
                handleOrganisationUpdate={ handleOrganisationUpdate }/>
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OrganisationEditPage;
