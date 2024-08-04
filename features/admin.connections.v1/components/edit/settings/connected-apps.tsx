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

import { getApplicationDetails } from "@wso2is/admin.applications.v1/api";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants";
import {
    ApplicationAccessTypes,
    ApplicationBasicInterface,
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "@wso2is/admin.applications.v1/models";
import {
    ApplicationTemplateManagementUtils
} from "@wso2is/admin.applications.v1/utils/application-template-management-utils";
import { ConsoleSettingsModes } from "@wso2is/admin.console-settings.v1/models/ui";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "@wso2is/admin.core.v1";
import { OrganizationType } from "@wso2is/admin.core.v1/constants/organization-constants";
import { applicationListConfig } from "@wso2is/admin.extensions.v1/configs/application-list";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentityAppsError } from "@wso2is/core/errors";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    DataTable,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React,
{
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Divider,
    Header,
    Icon,
    Input,
    Label,
    SemanticICONS
} from "semantic-ui-react";
import { getConnectedApps } from "../../../api/connections";
import {
    ConnectedAppInterface,
    ConnectedAppsInterface,
    ConnectionInterface
} from "../../../models/connection";


/**
 * Proptypes for the advance settings component.
 */
interface ConnectedAppsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: ConnectionInterface;
    /**
    * Show sign on methods condition
    */
    isSetStrongerAuth?: boolean;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, app: ApplicationListItemInterface) => void;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
     /**
     * Is the connected apps info request loading.
     */
    isLoading?: boolean;
    /**
     * Is the list rendered on a portal.
     */
    isRenderedOnPortal?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 *  Connected Apps settings component.
 *
 * @param props - Props injected to the component.
 * @returns ReactElement
 */
export const ConnectedApps: FunctionComponent<ConnectedAppsPropsInterface> = (
    props: ConnectedAppsPropsInterface
): ReactElement => {

    const {
        editingIDP,
        isSetStrongerAuth,
        defaultListItemLimit,
        showListItemActions,
        onListItemClick,
        selection,
        isRenderedOnPortal,
        isLoading,
        loader: Loader,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { organizationType } = useGetCurrentOrganizationType();

    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);

    const [ connectedApps, setConnectedApps ] = useState<ConnectedAppInterface[]>();
    const [ filterSelectedApps, setFilterSelectedApps ] = useState<ConnectedAppInterface[]>([]);
    const [ connectedAppsCount, setconnectedAppsCount ] = useState<number>(0);
    const [ isAppsLoading, setIsAppsLoading ] = useState<boolean>(true);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const groupedApplicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state?.application?.groupedTemplates);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        setIsAppsLoading(true);
        getConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                setconnectedAppsCount(response.count);

                if (response.count > 0) {

                    const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
                        return getApplicationDetails(app.appId);
                    });

                    const results: ApplicationBasicInterface[] = await Promise.all(
                        appRequests.map((response: Promise<any>) => response.catch((error: IdentityAppsError) => {
                            dispatch(addAlert({
                                description: error?.description
                                    || t("idp:connectedApps.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: error?.message
                                    || t("idp:connectedApps.genericError.message")
                            }));
                        }))
                    );

                    setConnectedApps(results);
                    setFilterSelectedApps(results);
                }
            })
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description
                        || t("idp:connectedApps.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("idp:connectedApps.genericError.message")
                }));
            })
            .finally(() => {
                setIsAppsLoading(false);
            });
    }, []);

    /**
     * Fetch the application templates if list is not available in redux.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationTemplateManagementUtils.getApplicationTemplates()
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description
                    || t("applications:notifications.fetchTemplates.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                    || t("applications:notifications.fetchTemplates.genericError.message")
                }));
            })
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates, groupedApplicationTemplates ]);

    /**
     * Resolves data table columns.
     *
     * @returns TableColumnInterface[]
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (app: ApplicationListItemInterface): ReactNode => {

                    /**
                     * Note: the templateId for Standard-Based Applications in applicationTemplates is
                     * 'custom-application'(only 1 template is available).
                     * But backend passes 3 distinct ids for Standard Based Applications.
                     */

                    // Create a set with custom-application Ids.
                    const customApplicationIds: Set<string> = new Set([
                        ApplicationManagementConstants.CUSTOM_APPLICATION_SAML,
                        ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC,
                        ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
                    ]);

                    let templateDisplayName: string = "";

                    // Checking whether the templateId from backend, is for a custom application.
                    if (customApplicationIds.has(app.templateId)) {
                        templateDisplayName = applicationTemplates
                            && applicationTemplates instanceof Array
                            && applicationTemplates.length > 0
                            && applicationTemplates.find((template: ApplicationTemplateListItemInterface) => {
                                return template.id === ApplicationManagementConstants.CUSTOM_APPLICATION;
                            }).name;
                    } else {
                        const relevantApplicationTemplate: ApplicationTemplateListItemInterface | undefined =
                            applicationTemplates
                            && applicationTemplates instanceof Array
                            && applicationTemplates.length > 0
                            && applicationTemplates.find((template: ApplicationTemplateListItemInterface) => {
                                return template.id === app.templateId;
                            });

                        if (relevantApplicationTemplate?.templateGroup) {
                            const templateGroupId: string = relevantApplicationTemplate.templateGroup;

                            templateDisplayName = groupedApplicationTemplates
                                && groupedApplicationTemplates instanceof Array
                                && groupedApplicationTemplates.length > 0
                                && groupedApplicationTemplates.find((group: ApplicationTemplateListItemInterface) => {
                                    return (group.id === templateGroupId || group.templateGroup === templateGroupId);
                                }).name;
                        }
                    }

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            {
                                app.image
                                    ? (
                                        <AppAvatar
                                            size="mini"
                                            name={ app.name }
                                            image={ app.image }
                                            spaced="right"
                                            data-componentid={ `${ componentId }-item-image` }
                                        />
                                    )
                                    : (
                                        <AppAvatar
                                            image={ (
                                                <AnimatedAvatar
                                                    name={ app.name }
                                                    size="mini"
                                                    data-componentid={ `${ componentId }-item-image-inner` }
                                                />
                                            ) }
                                            size="mini"
                                            spaced="right"
                                            data-componentid={ `${ componentId }-item-image` }
                                        />
                                    )
                            }
                            <Header.Content>
                                { app.name }
                                {
                                    app.advancedConfigurations?.fragment && (
                                        <Label size="mini">
                                            { t("applications:list.labels.fragment") }
                                        </Label>
                                    )
                                }
                                <div>
                                    { templateDisplayName && (
                                        <Label className="no-margin-left" size="tiny">{ templateDisplayName }</Label>
                                    ) }
                                </div>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("applications:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("applications:list.columns.actions")
            }
        ];
    };


    /**
     * Redirects to the applications edit page when the edit button is clicked.
     *
     * @param appId - Application id.
     * @param access - Access level of the application.
     */
    const handleApplicationEdit = (
        appId: string,
        access: ApplicationAccessTypes,
        tabName: string,
        appName: string
    ): void => {
        if (isSetStrongerAuth) {
            if (!UIConfig?.legacyMode?.applicationListSystemApps) {
                if (appName === ApplicationManagementConstants.CONSOLE_APP_NAME) {
                    history.push({
                        hash: `tab=${ ConsoleSettingsModes.LOGIN_FLOW }`,
                        pathname: AppConstants.getPaths().get("CONSOLE_SETTINGS")
                    });

                    return;
                } else if (appName === ApplicationManagementConstants.MY_ACCOUNT_APP_NAME) {
                    history.push({
                        pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", appId),
                        search: `#tab=${
                            ApplicationManagementConstants.MY_ACCOUNT_LOGIN_FLOW_TAB }`
                    });

                    return;
                }
            }

            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_SIGN_IN_METHOD_EDIT")
                    .replace(":id", appId).replace(":tabName", tabName),

                search: `?${ ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_KEY }=
                ${ ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_VALUE }`,

                state: { id: editingIDP.id, name: editingIDP.name }
            });
        } else {
            if (!UIConfig?.legacyMode?.applicationListSystemApps) {
                if (appName === ApplicationManagementConstants.CONSOLE_APP_NAME) {
                    history.push({
                        hash: `tab=${ ConsoleSettingsModes.LOGIN_FLOW }`,
                        pathname: AppConstants.getPaths().get("CONSOLE_SETTINGS")
                    });

                    return;
                } else if (appName === ApplicationManagementConstants.MY_ACCOUNT_APP_NAME) {
                    history.push({
                        pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", appId),
                        search: `#tab=${
                            organizationType === OrganizationType.SUBORGANIZATION
                                ? ApplicationManagementConstants.SUB_ORG_MY_ACCOUNT_LOGIN_FLOW_TAB
                                : ApplicationManagementConstants.MY_ACCOUNT_LOGIN_FLOW_TAB
                        }`
                    });

                    return;
                }
            }

            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_SIGN_IN_METHOD_EDIT")
                    .replace(":id", appId).replace(":tabName", tabName),

                search: access === ApplicationAccessTypes.READ
                    ? `?${ ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY }=true`
                    : "",

                state: { id: editingIDP.id, name: editingIDP.name }
            });
        }
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns ReactElement
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (filterSelectedApps.length === 0 && connectedAppsCount !== 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:develop.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        if (connectedAppsCount === 0) {
            return (
                <EmptyPlaceholder
                    className={ !isRenderedOnPortal ? "list-placeholder mr-0" : "" }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("idp:connectedApps.placeholders.emptyList",
                            { idpName: editingIDP.name })
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table actions.
     *
     * @returns TableActionsInterface[]
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                "data-componentid": `${ componentId }-item-edit-button`,
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: (): SemanticICONS => {
                    return "caret right";
                },
                onClick: (_: SyntheticEvent, app: ApplicationListItemInterface): void => {
                    handleApplicationEdit(
                        app.id,
                        app.access,
                        `#tab=${
                            ApplicationManagementConstants.SIGN_IN_METHOD_TAB_URL_FRAG
                        }`,
                        app.name
                    );
                },
                popupText: (): string => {
                    return t("idp:connectedApps.action");
                },
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Handle change event of the search input.
     *
     * @param event-change event.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changeValue: string = event.target.value.trim();

        setSearchQuery(changeValue);

        if (changeValue.length > 0) {
            searchFilter(changeValue);
        } else {
            setFilterSelectedApps(connectedApps);
        }
    };

    /**
     * Filter applications in the search.
     *
     * @param changevalue-search query.
     */
    const searchFilter = (changeValue: string) => {
        const appNameFilter: ConnectedAppInterface[] = connectedApps.filter((item: ConnectedAppInterface) =>
            item.name.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

        setFilterSelectedApps(appNameFilter);
    };

    if (isAppsLoading) {
        return <Loader />;
    }

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">{ t("idp:connectedApps.header",
                { idpName: editingIDP.name }) }</Heading>
            <Divider hidden />
            { connectedApps && (
                <Input
                    icon={ <Icon name="search" /> }
                    iconPosition="left"
                    onChange={ handleChange }
                    placeholder = { t("idp:connectedApps.placeholders.search") }
                    floated="left"
                    size="small"
                    style={ { width: "250px" } }
                    data-componentid={ `${ componentId }-searched` }
                />
            ) }
            <DataTable<ConnectedAppInterface>
                className="connected-applications-table"
                isLoading={ isLoading || isApplicationTemplateRequestLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ !isSetStrongerAuth && resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ filterSelectedApps }
                onRowClick={ (e: SyntheticEvent, app: ApplicationListItemInterface): void => {
                    handleApplicationEdit(
                        app.id,
                        app.access,
                        `#tab=${
                            ApplicationManagementConstants.SIGN_IN_METHOD_TAB_URL_FRAG
                        }`,
                        app.name
                    );
                    onListItemClick && onListItemClick(e, app);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ applicationListConfig.enableTableHeaders }
                transparent={ !(isLoading || isApplicationTemplateRequestLoading) && (showPlaceholders() !== null) }
                data-componentid={ `${ componentId }-data-table` }
            />
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the IDP advance settings component.
 */
ConnectedApps.defaultProps = {
    "data-componentid": "idp-edit-connected-apps",
    selection: true,
    showListItemActions: true
};

