/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, PageLayout, ResourceTab } from "@wso2is/react-components";
import React, {FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { AppConstants, history } from "../../../../features/core";
import {
    UserStore,
    getAUserStore,
    getDatabaseAvatarGraphic,
    TypeProperty,
    DISABLED,
    getAType,
    UserstoreType,
    reOrganizeProperties,
    CategorizedProperties,
} from "../../../../features/userstores";
import { AttributeMappings, SetupGuideTab, UserStoreGeneralSettings } from "../components";
import { URLFragmentTypes } from "../../../../features/applications";
import isEmpty from "lodash-es/isEmpty";
import { Icon, Popup, TabProps } from "semantic-ui-react";
import inRange from "lodash-es/inRange";
import { RemoteUserStoreConstants } from "../constants";
import delay from "lodash-es/delay";

/**
 * Props for the Remote user store edit page.
 */
interface RemoteUserStoreEditPageInterface extends TestableComponentInterface, RouteComponentProps { }

/**
 * This renders the userstore edit page.
 *
 * @param {RemoteUserStoreEditPageInterface & RouteComponentProps<RouteParams>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const RemoteUserStoreEditPage: FunctionComponent<RemoteUserStoreEditPageInterface> = (
    props: RemoteUserStoreEditPageInterface
): ReactElement => {

    const { match, [ "data-testid" ]: testId } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const userStoreId = match.params[ "id" ];

    const [ userStore, setUserStore ] = useState<UserStore>(null);
    const [ userStoreType, setUserStoreType ] = useState<UserstoreType>(null);
    const [ userStoreProperties, setUserStoreProperties ] = useState<CategorizedProperties>(null);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(undefined);
    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number>(undefined);
    const [ totalTabs, setTotalTabs ] = useState<number>(undefined);
    const [ disabled, setDisabled ] = useState<string>("");
    const [ isUserStoreLoading, setIsUserStoreLoading ] = useState<boolean>(false);

    useEffect(() => {
        if (window.location.hash) {
            return;
        }
        getUserStore();
    }, []);

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
            .then((response) => {
                setUserStoreType(response);
            });
    }, []);

    useEffect(() => {
        if (userStoreType) {
            setUserStoreProperties(reOrganizeProperties(userStoreType?.properties, userStore?.properties));
        }
    }, [ userStoreType ]);

    useEffect(() => {
        if (userStoreProperties) {
            setDisabled(userStoreProperties?.basic.required?.find(
                (property: TypeProperty) => property?.name === DISABLED
            )?.defaultValue);
        }
    }, [ userStoreProperties ]);

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
     * @param {number} tabIndex - Active tab index.
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
     * @param {React.SyntheticEvent} e - Click event.
     * @param {TabProps} data - Tab properties.
     */
    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        handleActiveTabIndexChange(data.activeIndex as number);
        getUserStore();
    };

    /**
     * Fetches the user store by its id
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
                        || t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                            ".message")
                }
            ));
        });
    };

    /**
     * The tab panes
     */
    const panes = [
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
                        handleUserStoreDisabled={ (value) => setDisabled(value) }
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
        <PageLayout
            image={
                <GenericIcon
                    bordered
                    defaultIcon
                    size="x60"
                    relaxed="very"
                    shape="rounded"
                    hoverable={ false }
                    icon={ getDatabaseAvatarGraphic() }
                />
            }
            title={
                <>
                    {
                        disabled === "false"
                            ? <Popup
                                trigger={
                                    <Icon
                                        className="mr-2 ml-0 vertical-aligned-baseline"
                                        size="small"
                                        name="circle"
                                        color="green"
                                    />
                                }
                                content={ t("common:enabled") }
                                inverted
                            />
                            : <Popup
                                trigger={
                                    <Icon
                                        className="mr-2 ml-0 vertical-aligned-baseline"
                                        size="small"
                                        name="circle"
                                        color="yellow"
                                    />
                                }
                                content={ t("common:disabled") }
                                inverted
                            />
                    }
                    { userStore?.name }
                </>
            }
            description={ t("console:manage.features.userstores.pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t("console:manage.features.userstores.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            isLoading={ isUserStoreLoading }
            data-testid={ `${ testId }-page-layout` }
        >
            <ResourceTab
                className="remote-user-store-edit-section"
                panes={ panes }
                onTabChange={ handleTabChange }
                data-testid={ `${ testId }-tabs` }
                onInitialize={ ({ panesLength }) => {
                    setTotalTabs(panesLength);
                } }
                activeIndex= { activeTabIndex }
                defaultActiveIndex={ defaultActiveIndex }
            />
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteUserStoreEditPage;
