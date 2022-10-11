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


import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
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
import {  
    Divider,
    Header, 
    Icon, 
    Input, 
    Label, 
    SemanticICONS
} from "semantic-ui-react";
import { applicationListConfig } from "../../../../extensions/configs/application-list";
import { getApplicationDetails } from "../../../applications/api";
import { ApplicationManagementConstants } from "../../../applications/constants";
import { 
    ApplicationAccessTypes, 
    ApplicationBasicInterface, 
    ApplicationListItemInterface, 
    ApplicationTemplateListItemInterface 
} from "../../../applications/models";
import { ApplicationTemplateManagementUtils } from "../../../applications/utils";
import {  
    AppConstants,
    AppState, 
    FeatureConfigInterface,   
    UIConstants, 
    getEmptyPlaceholderIllustrations, 
    history
} from "../../../core";
import { getIDPConnectedApps } from "../../api";
import { 
    ConnectedAppInterface,
    ConnectedAppsInterface, 
    IdentityProviderInterface 
} from "../../models";


/**
 * Proptypes for the advance settings component.
 */
interface ConnectedAppsPropsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: IdentityProviderInterface;
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
        [ "data-testid" ]: testId
    } = props;
    
    const dispatch = useDispatch();

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
        getIDPConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                setconnectedAppsCount(response.count);
                
                if (response.count > 0) {
                    
                    const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
                        return getApplicationDetails(app.appId);
                    });

                    const results: ApplicationBasicInterface[] = await Promise.all(
                        appRequests.map(response => response.catch(error => {
                            dispatch(addAlert({
                                description: error?.description
                                    || t("console:develop.features.idp.connectedApps.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: error?.message 
                                    || t("console:develop.features.idp.connectedApps.genericError.message")
                            }));
                        }))
                    );

                    setConnectedApps(results);
                    setFilterSelectedApps(results);
                }
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.description
                        || t("console:develop.features.idp.connectedApps.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("console:develop.features.idp.connectedApps.genericError.message")
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
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.description
                    || t("console:develop.features.applications.notifications.fetchTemplates.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message 
                    || t("console:develop.features.applications.notifications.fetchTemplates.genericError.message")
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
                            && applicationTemplates.find((template) => {
                                return template.id === ApplicationManagementConstants.CUSTOM_APPLICATION;
                            }).name;
                    } else {
                        const relevantApplicationTemplate: ApplicationTemplateListItemInterface | undefined = 
                            applicationTemplates
                            && applicationTemplates instanceof Array
                            && applicationTemplates.length > 0
                            && applicationTemplates.find((template) => {
                                return template.id === app.templateId;
                            });

                        if (relevantApplicationTemplate?.templateGroup) {
                            const templateGroupId: string = relevantApplicationTemplate.templateGroup;

                            templateDisplayName = groupedApplicationTemplates
                                && groupedApplicationTemplates instanceof Array
                                && groupedApplicationTemplates.length > 0
                                && groupedApplicationTemplates.find((group) => {
                                    return (group.id === templateGroupId || group.templateGroup === templateGroupId);
                                }).name;
                        }
                    }

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-item-heading` }
                        >
                            {
                                app.image
                                    ? (
                                        <AppAvatar
                                            size="mini"
                                            name={ app.name }
                                            image={ app.image }
                                            spaced="right"
                                            data-testid={ `${ testId }-item-image` }
                                        />
                                    )
                                    : (
                                        <AppAvatar
                                            image={ (
                                                <AnimatedAvatar
                                                    name={ app.name }
                                                    size="mini"
                                                    data-testid={ `${ testId }-item-image-inner` }
                                                />
                                            ) }
                                            size="mini"
                                            spaced="right"
                                            data-testid={ `${ testId }-item-image` }
                                        />
                                    )
                            }
                            <Header.Content>
                                { app.name }
                                {
                                    app.advancedConfigurations?.fragment && (
                                        <Label size="mini">
                                            { t("console:develop.features.applications.list.labels.fragment") }
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
                title: t("console:develop.features.applications.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:develop.features.applications.list.columns.actions")
            }
        ];
    };


    /**
     * Redirects to the applications edit page when the edit button is clicked.
     *
     * @param appId - Application id.
     * @param access - Access level of the application.
     */
    const handleApplicationEdit = (appId: string, access: ApplicationAccessTypes, tabName: string): void => {
        if (isSetStrongerAuth) {
            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_SIGN_IN_METHOD_EDIT")
                    .replace(":id", appId).replace(":tabName", tabName),
                
                search: `?${ ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_KEY }=
                ${ ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_VALUE }`,
                
                state: { "id": editingIDP.id, "name": editingIDP.name }
            });
        } else {
            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_SIGN_IN_METHOD_EDIT")
                    .replace(":id", appId).replace(":tabName", tabName),
                
                search: access === ApplicationAccessTypes.READ
                    ? `?${ ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY }=true`
                    : "",

                state: { "id": editingIDP.id, "name": editingIDP.name }
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
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (connectedAppsCount === 0) {
            return (
                <EmptyPlaceholder
                    className={ !isRenderedOnPortal ? "list-placeholder" : "" }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("console:develop.features.idp.connectedApps.placeholders.emptyList", 
                            { idpName: editingIDP.name })
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
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
                "data-testid": `${ testId }-item-edit-button`,
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: (): SemanticICONS => { 
                    return "external";
                },
                onClick: (e: SyntheticEvent, app: ApplicationListItemInterface): void =>
                    handleApplicationEdit(app.id, app.access, "#tab=" +
                        ApplicationManagementConstants.SIGN_IN_METHOD_TAB_URL_FRAG),
                popupText: (): string => {
                    return t("console:develop.features.idp.connectedApps.action");
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
    const handleChange = (event) => {
        const changeValue = event.target.value.trim();
        
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
    const searchFilter = (changeValue) => {
        const appNameFilter = connectedApps.filter((item) => 
            item.name.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1); 
        
        setFilterSelectedApps(appNameFilter); 
    };

    if (isAppsLoading) {
        return <Loader />;
    }

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">{ t("console:develop.features.idp.connectedApps.header", 
                { idpName: editingIDP.name }) }</Heading>
            <Heading subHeading ellipsis as="h6">
                { t("console:develop.features.idp.connectedApps.subHeader", { idpName: editingIDP.name }) }
            </Heading>
            <Divider hidden />
            { connectedApps && (
                <Input 
                    icon={ <Icon name="search" /> }
                    iconPosition="left"
                    onChange={ handleChange }
                    placeholder = { t("console:develop.features.idp.connectedApps.placeholders.search") }
                    floated="left"
                    size="small"
                    style={ { width: "250px" } }
                    data-testid={ `${ testId }-searched` }
                />)
            }
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
                    handleApplicationEdit(app.id, app.access, "#signInMethod");
                    onListItemClick && onListItemClick(e, app);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ applicationListConfig.enableTableHeaders }
                transparent={ !(isLoading || isApplicationTemplateRequestLoading) && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the IDP advance settings component.
 */
ConnectedApps.defaultProps = {
    "data-testid": "idp-edit-connected-apps",
    selection: true,
    showListItemActions: true
};

