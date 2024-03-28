/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState, FeatureConfigInterface,getEmptyPlaceholderIllustrations, history } from "../../core";
import { useAPIResourceDetails } from "../api";
import { EditAPIResource } from "../components";
import { APIResourceType, APIResourcesConstants } from "../constants";
import { APIResourceUtils } from "../utils/api-resource-utils";

/**
 * Prop-types for the API resources page component.
 */
type APIResourcesEditPageInterface = IdentifiableComponentInterface;

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
const APIResourcesEditPage: FunctionComponent<APIResourcesEditPageInterface> = (
    props: APIResourcesEditPageInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ apiResourceId, setAPIResourceId ] = useState<string>(null);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const path: string[] = history.location.pathname.split("/");
    const categoryId: string = path[path.length - 2];

    const {
        data: apiResourceData,
        isLoading: isAPIResourceDatatLoading,
        error: apiResourceDataFetchRequestError,
        mutate: updateAPIResource
    } = useAPIResourceDetails(apiResourceId);

    /**
     * The following useEffect is used to set the API resource id from the path
     */
    useEffect(() => {
        setAPIResourceIdFromPath();
    }, []);

    /**
     * The following useEffect is used to handle if the user has the required scopes to update the API resource
     */
    useEffect(() => {
        if (!apiResourceData) {
            return;
        }

        const updateForbidden: boolean = !APIResourceUtils.isAPIResourceUpdateAllowed(featureConfig, allowedScopes);
        const isSytemAPIResource: boolean = APIResourceUtils.isSystemAPI(apiResourceData?.type);

        if (updateForbidden || isSytemAPIResource) {
            setReadOnly(true);
        }
    }, [ apiResourceData ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching the API resource
     */
    useEffect(() => {
        if(apiResourceDataFetchRequestError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResource" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResource" +
                    ".genericError.message")
            }));
        }
    }, [ apiResourceDataFetchRequestError ]);

    /**
     * set API resource id from the URL path
     */
    const setAPIResourceIdFromPath = (): void => {
        const path: string[] = history.location.pathname.split("/");
        const id: string = path[path.length - 1];

        setAPIResourceId(id);
    };

    /**
     * go back to API resources list section
     */
    const handleBackButtonClick = () => {
        if (categoryId === APIResourceType.MANAGEMENT || categoryId === APIResourceType.ORGANIZATION) {
            history.push(APIResourcesConstants.getPaths().get("API_RESOURCES_CATEGORY")
                .replace(":categoryId", categoryId));
        } else {
            history.push(APIResourcesConstants.getPaths().get("API_RESOURCES"));
        }
    };

    return (
        (!isAPIResourceDatatLoading && !apiResourceData) || apiResourceDataFetchRequestError
            ? (<EmptyPlaceholder
                subtitle={ [ t("extensions:develop.apiResource.tabs.apiResourceError.subtitles.0"),
                    t("extensions:develop.apiResource.tabs.apiResourceError.subtitles.1") ] }
                title={ t("extensions:develop.apiResource.tabs.apiResourceError.title") }
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
            />)
            : (<TabPageLayout
                isLoading={ isAPIResourceDatatLoading }
                title={ apiResourceData?.name }
                pageTitle={ t("extensions:develop.apiResource.tabs.title") }
                loadingStateOptions={ {
                    count: 5,
                    imageType: "circular"
                } }
                backButton={ {
                    "data-testid": `${componentId}-back-button`,
                    onClick: handleBackButtonClick,
                    text: categoryId === APIResourceType.MANAGEMENT
                        ? t("pages:rolesEdit.backButton", { type: "Management APIs" })
                        : categoryId === APIResourceType.ORGANIZATION
                            ? t("pages:rolesEdit.backButton", { type: "Organization APIs" })
                            : t("pages:rolesEdit.backButton", { type: "APIs" })
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                pageHeaderMaxWidth={ true }
            >
                <EditAPIResource
                    apiResourceData={ apiResourceData }
                    isAPIResourceDataLoading={ isAPIResourceDatatLoading }
                    featureConfig={ featureConfig }
                    isReadOnly={ isReadOnly }
                    mutateAPIResource={ updateAPIResource }
                />
            </TabPageLayout>)
    );

};

/**
 * Default props for the component.
 */
APIResourcesEditPage.defaultProps = {
    "data-componentid": "api-resource-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default APIResourcesEditPage;
