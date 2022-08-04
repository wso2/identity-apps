/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { UserstoreConstants } from "@wso2is/core/constants";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, PageLayout, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { AppConstants, history } from "../../core";
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
 * @param {UserStoresEditPageInterface & RouteComponentProps<RouteParams>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const UserStoresEditPage: FunctionComponent<UserStoresEditPageInterface> = (
    props: UserStoresEditPageInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const userStoreId = match.params.id;

    const [ userStore, setUserStore ] = useState<UserStore>(null);
    const [ type, setType ] = useState<UserstoreType>(null);
    const [ properties, setProperties ] = useState<CategorizedProperties>(null);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Fetches the userstore by its id
     */
    const getUserStore = () => {
        getAUserStore(userStoreId).then(response => {
            setUserStore(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                            ".description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.userstores.notifications.fetchUserstores.genericError.message")
                }
            ));
        });
    };

    useEffect(() => {
        getUserStore();
    }, []);

    useEffect(() => {
        if (userStore) {
            getAType(userStore?.typeId, null).then((response) => {
                setType(response);
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description
                        || t("console:manage.features.userstores.notifications.fetchUserstoreMetadata." +
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.userstores.notifications.fetchUserstoreMetadata" +
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
     * The tab panes
     */
    const panes = [
        {
            menuItem:  t ("console:manage.features.userstores.pageLayout.edit.tabs.general"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditBasicDetailsUserStore
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
                : t("console:manage.features.userstores.pageLayout.edit.tabs.connection"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditConnectionDetails
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
            menuItem: t("console:manage.features.userstores.pageLayout.edit.tabs.user"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditUserDetails
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
            menuItem:  t("console:manage.features.userstores.pageLayout.edit.tabs.group"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <EditGroupDetails
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
        <PageLayout
            image={
                (<GenericIcon
                    bordered
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
            description={ t("console:manage.features.userstores.pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t ("console:manage.features.userstores.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <ResourceTab
                panes={ panes }
                onTabChange={ () => {
                    // Re-fetch userstore details on every tab change to try to get the latest available updated
                    // userstore properties due to the asynchronous nature of userstore operations.
                    // TODO: Remove once the userstore operations are made synchronous.
                    getUserStore();
                } }
                data-testid={ `${ testId }-tabs` }
            />
        </PageLayout>
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
