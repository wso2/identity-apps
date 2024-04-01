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

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, RoleConnectedApplicationInterface, RolesInterface } from "@wso2is/core/models";
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
import { useSelector } from "react-redux";
import {  
    Divider,
    Header, 
    Icon, 
    Input, 
    SemanticICONS
} from "semantic-ui-react";
import { applicationListConfig } from "../../../admin-extensions-v1/configs/application-list";
import { ApplicationManagementConstants } from "../../../admin.applications.v1/constants";
import {  
    AppConstants,
    AppState, 
    FeatureConfigInterface,   
    UIConstants, 
    getEmptyPlaceholderIllustrations, 
    history
} from "../../../admin.core.v1";

/**
 * Proptypes for the advance settings component.
 */
interface ConnectedAppsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Currently connected applications.
     */
    role: RolesInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Is read only mode.
     */
    isReadOnly?: boolean;
    /**
     * Handle user update callback.
     */
    onRoleUpdate: (tabIndex: number) => void;
    /**
     * Tab index
     */
    tabIndex: number;
}

/**
 *  Connected Apps settings component.
 *
 * @param props - Props injected to the component.
 * @returns ReactElement
 */
export const RoleConnectedApps: FunctionComponent<ConnectedAppsPropsInterface> = (
    props: ConnectedAppsPropsInterface
): ReactElement => {

    const {
        role,
        isLoading,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ filterSelectedApps, setFilterSelectedApps ] = useState<RoleConnectedApplicationInterface[]>([]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    const associatedApplications: RoleConnectedApplicationInterface[] = role?.associatedApplications;

    useEffect(() => {
        if (!associatedApplications) {
            return;
        }

        setFilterSelectedApps(associatedApplications);
    }, [ associatedApplications ]);
 
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
                render: (app: RoleConnectedApplicationInterface): ReactNode => {                    
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ app?.display }
                                        size="mini"
                                        data-componentid={ `${ componentId }-item-image-inner` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-componentid={ `${ componentId }-item-image` }
                            />
                            <Header.Content>
                                { app?.display }
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
    const handleApplicationEdit = (appId: string, tabName: string): void => {
        history.push({
            pathname: AppConstants.getPaths().get("APPLICATION_SIGN_IN_METHOD_EDIT")
                .replace(":id", appId).replace(":tabName", tabName),
            state: {
                id: role.id,
                name: role.displayName,
                redirectTo: ApplicationManagementConstants.ROLE_CALLBACK_REDIRECT
            }
        });
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns ReactElement
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && filterSelectedApps?.length === 0) {
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

        if (filterSelectedApps?.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("idp:connectedApps.placeholders.emptyList", {
                            idpName: role?.displayName
                        })
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
        return [
            {
                "data-componentid": `${ componentId }-item-edit-button`,
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: (): SemanticICONS => { 
                    return "caret right";
                },
                onClick: (e: SyntheticEvent, app: RoleConnectedApplicationInterface): void =>
                    handleApplicationEdit(app.value, "#tab=" +
                        ApplicationManagementConstants.ROLES_TAB_URL_FRAG),
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
            setFilterSelectedApps(associatedApplications);
        }
    };

    /**
     * Filter applications in the search.
     *
     * @param changevalue-search query.
     */
    const searchFilter = (changeValue: string) => {
        const appNameFilter: RoleConnectedApplicationInterface[] = associatedApplications?.filter(
            (item: RoleConnectedApplicationInterface) => 
                item?.display?.toLowerCase()?.indexOf(changeValue.toLowerCase()) !== -1); 
        
        setFilterSelectedApps(appNameFilter); 
    };

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">{ t("idp:connectedApps.header", 
                { idpName: role?.displayName }) }</Heading>
            <Divider hidden />
            { associatedApplications && (
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
            <DataTable<RoleConnectedApplicationInterface>
                className="connected-applications-table"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={  resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ filterSelectedApps }
                onRowClick={ (e: SyntheticEvent, app: RoleConnectedApplicationInterface): void => {
                    handleApplicationEdit(app.value, "#tab=" +
                        ApplicationManagementConstants.ROLES_TAB_URL_FRAG);
                } }
                placeholders={ showPlaceholders() }
                showHeader={ applicationListConfig.enableTableHeaders }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-componentid={ `${ componentId }-data-table` }
            />
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the Role Connected Apps.
 */
RoleConnectedApps.defaultProps = {
    "data-componentid": "role-edit-connected-apps"
};
