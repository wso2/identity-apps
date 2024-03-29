/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { UserstoreConstants } from "@wso2is/core/constants";
import { IdentityAppsError } from "@wso2is/core/errors";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, ResourceTab, ResourceTabPaneInterface, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../admin-core-v1";
import { getAType, getAUserStore } from "../api";
import {
    EditBasicDetailsUserStore,
    EditConnectionDetails,
    EditGroupDetails,
    EditUserDetails
} from "../components";
import { getDatabaseAvatarGraphic } from "../configs";
import { CONSUMER_USERSTORE, CONSUMER_USERSTORE_ID } from "../constants";
import { CategorizedProperties, UserStore, UserstoreType } from "../models";
import { reOrganizeProperties } from "../utils";

/**
 * Props for the Userstores edit page.
 */
type UserStoresEditPageInterface = TestableComponentInterface;

/**
 * Route parameters interface.
 */
interface RouteParams {
    id: string;
}

/**
 * This renders the userstore edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns User store edit page.
 */
const UserStoresEditPage: FunctionComponent<UserStoresEditPageInterface> = (
    props: UserStoresEditPageInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const userStoreId: string = match.params.id;

    const [ userStore, setUserStore ] = useState<UserStore>(null);
    const [ type, setType ] = useState<UserstoreType>(null);
    const [ properties, setProperties ] = useState<CategorizedProperties>(null);
    const [ isGroupDetailsRequestLoading, setIsGroupDetailsRequestLoading ] = useState<boolean>(undefined);

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    /**
     * Fetches the userstore by its id
     */
    const getUserStore = () => {
        setIsGroupDetailsRequestLoading(true);

        getAUserStore(userStoreId).then((response: UserStore) => {
            setUserStore(response);
        }).catch((error: IdentityAppsError) => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("userstores:notifications.fetchUserstores.genericError" +
                            ".description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("userstores:notifications.fetchUserstores.genericError.message")
                }
            ));
        }).finally(() => {
            setIsGroupDetailsRequestLoading(false);
        });
    };

    useEffect(() => {
        getUserStore();
    }, []);

    useEffect(() => {
        if (userStore) {
            getAType(userStore?.typeId, null).then((response: UserstoreType) => {
                setType(response);
            }).catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description
                        || t("userstores:notifications.fetchUserstoreMetadata." +
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("userstores:notifications.fetchUserstoreMetadata" +
                            ".genericError.message")
                }));
            });
        }
    }, [ userStore ]);

    useEffect(() => {
        if (type) {
            setProperties(reOrganizeProperties(type.properties, userStore.properties));
        }
    }, [ type ]);

    /**
     * Returns if the userstore is readonly or not based on the scopes.
     *
     * @returns If an userstore is Read Only or not.
     */
    const resolveReadOnlyState = (): boolean => {
        return !hasRequiredScopes(featureConfig?.userStores, featureConfig?.userStores?.scopes?.update,
            allowedScopes);
    };

    /**
     * The tab panes
     */
    const panes: ResourceTabPaneInterface[] = [
        {
            menuItem:  t ("userstores:pageLayout.edit.tabs.general"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditBasicDetailsUserStore
                        readOnly={ resolveReadOnlyState() }
                        properties={ properties?.basic }
                        userStore={ userStore }
                        update={ getUserStore }
                        id={ userStoreId }
                        data-testid={ `${ testId }-userstore-basic-details-edit` }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: (userStoreId === CONSUMER_USERSTORE_ID) ? null
                : t("userstores:pageLayout.edit.tabs.connection"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditConnectionDetails
                        readOnly={ resolveReadOnlyState() }
                        update={ getUserStore }
                        type={ type }
                        id={ userStoreId }
                        properties={ properties?.connection }
                        data-testid={ `${ testId }-userstore-connection-details-edit` }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("userstores:pageLayout.edit.tabs.user"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditUserDetails
                        readOnly={ resolveReadOnlyState() }
                        update={ getUserStore }
                        type={ type }
                        id={ userStoreId }
                        properties={ properties?.user }
                        data-testid={ `${ testId }-userstore-user-details-edit` }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem:  t("userstores:pageLayout.edit.tabs.group"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditGroupDetails
                        readOnly={ resolveReadOnlyState() }
                        update={ getUserStore }
                        type={ type }
                        id={ userStoreId }
                        properties={ properties?.group }
                        data-testid={ `${ testId }-userstore-group-details-edit` }
                    />
                </ResourceTab.Pane>
            )
        }
    ];

    return (
        <TabPageLayout
            isLoading= { isGroupDetailsRequestLoading }
            image={
                (<GenericIcon
                    defaultIcon
                    size="x60"
                    relaxed="very"
                    shape="rounded"
                    hoverable={ false }
                    icon={ getDatabaseAvatarGraphic() }
                />)
            }
            title={
                userStore?.name === CONSUMER_USERSTORE
                    ? UserstoreConstants.CUSTOMER_USER_STORE_MAPPING
                    : userStore?.name
            }
            pageTitle={
                userStore?.name === CONSUMER_USERSTORE
                    ? UserstoreConstants.CUSTOMER_USER_STORE_MAPPING
                    : userStore?.name
            }
            description={ t("userstores:pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t ("userstores:pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <ResourceTab
                isLoading={ isGroupDetailsRequestLoading }
                panes={ panes }
                onTabChange={ () => {
                    // Re-fetch userstore details on every tab change to try to get the latest available updated
                    // userstore properties due to the asynchronous nature of userstore operations.
                    // TODO: Remove once the userstore operations are made synchronous.
                    getUserStore();
                } }
                data-testid={ `${ testId }-tabs` }
            />
        </TabPageLayout>
    );
};

/**
 * Default props for the component.
 */
UserStoresEditPage.defaultProps = {
    "data-testid": "userstores-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UserStoresEditPage;
