/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, Popup, ResourceTab, TabPageLayout } from "@wso2is/react-components";
import delay from "lodash-es/delay";
import inRange from "lodash-es/inRange";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Icon, TabProps } from "semantic-ui-react";
import { URLFragmentTypes } from "../../../../admin.applications.v1/models";
import { AppConstants, history } from "../../../../admin-core-v1";
import { getAType, getAUserStore } from "../../../../admin-userstores-v1/api/user-stores";
import { getDatabaseAvatarGraphic } from "../../../../admin-userstores-v1/configs/ui";
import { DISABLED } from "../../../../admin-userstores-v1/constants/user-store-constants";
import {
    CategorizedProperties,
    UserStore,
    UserStoreProperty,
    UserstoreType
} from "../../../../admin-userstores-v1/models/user-stores";
import { reOrganizeProperties } from "../../../../admin-userstores-v1/utils/userstore-utils";
import { getAgentConnections } from "../api";
import { AttributeMappings, SetupGuideTab, UserStoreGeneralSettings } from "../components";
import { RemoteUserStoreConstants } from "../constants";
import { AgentConnectionInterface } from "../models";

/**
 * Props for the Remote user store edit page.
 */
interface RemoteUserStoreEditPageInterface extends TestableComponentInterface, RouteComponentProps { }

/**
 * This renders the userstore edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns The Remote User Store edit page.
 */
const RemoteUserStoreEditPage: FunctionComponent<RemoteUserStoreEditPageInterface> = (
    props: RemoteUserStoreEditPageInterface
): ReactElement => {

    const { match, [ "data-testid" ]: testId } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const userStoreId: string = match.params[ "id" ];

    const [ userStore, setUserStore ] = useState<UserStore>(null);
    const [ userStoreType, setUserStoreType ] = useState<UserstoreType>(null);
    const [ userStoreProperties, setUserStoreProperties ] = useState<CategorizedProperties>(null);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(undefined);
    const [ defaultActiveIndex ] = useState<number>(undefined);
    const [ totalTabs, setTotalTabs ] = useState<number>(undefined);
    const [ disabled, setDisabled ] = useState<string>("");
    const [ isUserStoreLoading, setIsUserStoreLoading ] = useState<boolean>(false);
    const [ isAgentConnectionsRequestLoading, setIsAgentConnectionsRequestLoading ] = useState<boolean>(false);
    const [ , setAgentConnections ] = useState<AgentConnectionInterface[]>([]);

    useEffect(() => {
        if (window.location.hash) {
            return;
        }
        getUserStore();
    }, []);

    // Set the preloaders until user store connections are loaded
    useEffect(() => {
        setIsAgentConnectionsRequestLoading(true);
        getAgentConnections(userStoreId)
            .then((response: AgentConnectionInterface[]) => {
                setAgentConnections(response.filter((connection: AgentConnectionInterface) => connection?.agent));
            })
            .finally(() => {
                setIsAgentConnectionsRequestLoading(false);
            });
    }, [ userStoreId ]);

    useEffect(() => {

        if (!window.location.hash) {
            return;
        }

        if (!userStore) {

            setIsUserStoreLoading(true);

            delay(() => {
                getUserStore();
                setIsUserStoreLoading(false);
            }, 12000);
        }

    }, [ userStore ]);

    useEffect(() => {
        getAType(RemoteUserStoreConstants.OUTBOUND_USER_STORE_TYPE_ID, null)
            .then((response: UserstoreType) => {
                setUserStoreType(response);
            });
    }, []);

    useEffect(() => {
        if (userStoreType) {
            setUserStoreProperties(reOrganizeProperties(userStoreType?.properties, userStore?.properties));
        }
    }, [ userStoreType ]);

    useEffect(() => {
        if (userStore) {
            setDisabled(userStore?.properties?.find(
                (property: UserStoreProperty) => property.name === DISABLED)?.value);
        }
    }, [ userStore ]);

    /**
     * Called when the URL fragment updates.
     */
    useEffect( () => {

        if(totalTabs === undefined || window.location.hash.includes(URLFragmentTypes.VIEW) ||
            isEmpty(window.location.hash)) {

            if (isEmpty(window.location.hash)) {
                handleActiveTabIndexChange(1);

                return;
            }

            if (totalTabs === undefined || isEmpty(window.location.hash)) {
                return;
            }

            const urlFragment: string[] = window.location.hash.split("#" + URLFragmentTypes.TAB_INDEX);

            if (urlFragment.length === 2 && isEmpty(urlFragment[0]) && /^\d+$/.test(urlFragment[1])) {

                const tabIndex: number = parseInt(urlFragment[1], 10);

                if (inRange(tabIndex, 0, totalTabs)) {
                    if (tabIndex === activeTabIndex) {
                        return;
                    }
                    handleActiveTabIndexChange(tabIndex);
                } else {
                    // Change the tab index to defaultActiveIndex for invalid URL fragments.
                    handleDefaultTabIndexChange(defaultActiveIndex);
                }
            } else {
                // Change the tab index to defaultActiveIndex for invalid URL fragments.
                handleDefaultTabIndexChange(defaultActiveIndex);
            }
        }
    }, [ window.location.hash, totalTabs ]);

    /**
     * Handles the activeTabIndex change.
     *
     * @param tabIndex - Active tab index.
     */
    const handleActiveTabIndexChange = (tabIndex:number): void => {

        history.push({
            hash: `#${ URLFragmentTypes.TAB_INDEX }${ tabIndex }`,
            pathname: window.location.pathname
        });
        setActiveTabIndex(tabIndex);
    };

    /**
     * Handles the defaultActiveIndex change.
     */
    const handleDefaultTabIndexChange = (defaultActiveIndex: number): void => {
        handleActiveTabIndexChange(defaultActiveIndex);
    };

    /**
     * Handles the tab change.
     *
     * @param e - Click event.
     * @param data - Tab properties.
     */
    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        handleActiveTabIndexChange(data.activeIndex as number);
        getUserStore();
    };

    /**
     * Fetches the user store by its id
     */
    const getUserStore = () => {
        getAUserStore(userStoreId).then((response: UserStore) => {
            setUserStore(response);
            //TODO: Add interface for error
        }).catch((error: IdentityAppsError ) => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("userstores:notifications.fetchUserstores.genericError" +
                            ".description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("userstores:notifications.fetchUserstores.genericError" +
                            ".message")
                }
            ));
        });
    };

    /**
     * The tab panes
     */
    const panes: TabProps [ "panes" ] = [
        {
            menuItem: "Setup Guide",
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <SetupGuideTab isUserStoreLoading={ isUserStoreLoading } userStoreId={ userStoreId } />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: "General",
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserStoreGeneralSettings
                        userStoreProperties={ userStoreProperties }
                        isDisabled={ disabled }
                        userStore={ userStore }
                        userStoreId={ userStoreId }
                        handleUserStoreDisabled={ (value: string) => setDisabled(value) }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: "Attribute Mappings",
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <AttributeMappings userStore={ userStore } userStoreId={ userStoreId } />
                </ResourceTab.Pane>
            )
        }
    ];

    return (
        <TabPageLayout
            image={ (
                <GenericIcon
                    bordered
                    defaultIcon
                    size="x60"
                    relaxed="very"
                    shape="rounded"
                    hoverable={ false }
                    icon={ getDatabaseAvatarGraphic() }
                />
            ) }
            title={
                (
                    <>
                        {
                            disabled === "false"
                                ? (
                                    <Popup
                                        trigger={ (
                                            <Icon
                                                className="mr-2 ml-0 vertical-aligned-baseline"
                                                size="small"
                                                name="circle"
                                                color="green"
                                            />
                                        ) }
                                        content={ t("common:enabled") }
                                        inverted
                                    />
                                )
                                : (
                                    <Popup
                                        trigger={ (
                                            <Icon
                                                className="mr-2 ml-0 vertical-aligned-baseline"
                                                size="small"
                                                name="circle"
                                                color="orange"
                                            />
                                        ) }
                                        content={ t("common:disabled") }
                                        inverted
                                    />
                                )
                        }
                        { userStore?.name }
                    </>
                )
            }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t("userstores:pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            isLoading={ isUserStoreLoading || isAgentConnectionsRequestLoading }
            data-testid={ `${ testId }-page-layout` }
        >
            <ResourceTab
                className="remote-user-store-edit-section"
                panes={ panes }
                onTabChange={ handleTabChange }
                data-testid={ `${ testId }-tabs` }
                onInitialize={ ({ panesLength }: { panesLength: number; }) => {
                    setTotalTabs(panesLength);
                } }
                activeIndex= { activeTabIndex }
                defaultActiveIndex={ defaultActiveIndex }
            />
        </TabPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteUserStoreEditPage;
