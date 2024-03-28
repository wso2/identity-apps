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

import Grid from "@oxygen-ui/react/Grid";
import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { applicationConfig } from "../../../extensions";
import { applicationListConfig } from "../../admin-extensions-v1/configs/application-list";
import { ConsoleSettingsModes } from "../../admin-console-settings-v1/models/ui";
import {
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConfigInterface,
    getEmptyPlaceholderIllustrations,
    history
} from "../../admin-core-v1";
import { OrganizationType } from "../../admin-organizations-v1/constants";
import { useGetCurrentOrganizationType } from "../../admin-organizations-v1/hooks/use-get-organization-type";
import { deleteApplication } from "../api";
import { ApplicationManagementConstants } from "../constants";
import {
    ApplicationAccessTypes,
    ApplicationInboundTypes,
    ApplicationListInterface,
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "../models";
import { ApplicationManagementUtils } from "../utils/application-management-utils";
import { ApplicationTemplateManagementUtils } from "../utils/application-template-management-utils";

/**
 *
 * Proptypes for the applications list component.
 */
interface ApplicationListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface, IdentifiableComponentInterface {

    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Application list.
     */
    list: ApplicationListInterface;
    /**
     * On application delete callback.
     */
    onApplicationDelete?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, app: ApplicationListItemInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show sign on methods condition
     */
    isSetStrongerAuth?: boolean;
    /**
     * Is the list rendered on a portal.
     */
    isRenderedOnPortal?: boolean;
}

/**
 * Application list component.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
export const ApplicationList: FunctionComponent<ApplicationListPropsInterface> = (
    props: ApplicationListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        featureConfig,
        isLoading,
        list,
        onApplicationDelete,
        onListItemClick,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        isSetStrongerAuth,
        isRenderedOnPortal,
        [ "data-testid" ]: testId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const groupedApplicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state?.application?.groupedTemplates);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);

    const { organizationType } = useGetCurrentOrganizationType();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingApplication, setDeletingApplication ] = useState<ApplicationListItemInterface>(undefined);
    const [ loading, setLoading ] = useState(false);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Fetch the application templates if list is not available in redux.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationTemplateManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates, groupedApplicationTemplates ]);

    /**
     * Redirects to the applications edit page when the edit button is clicked.
     *
     * @param appId - Application id.
     * @param access - Access level of the application.
     */
    const handleApplicationEdit = (appId: string, access: ApplicationAccessTypes, appName: string): void => {
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
                            organizationType === OrganizationType.SUBORGANIZATION
                                ? ApplicationManagementConstants.SUB_ORG_MY_ACCOUNT_LOGIN_FLOW_TAB
                                : ApplicationManagementConstants.MY_ACCOUNT_LOGIN_FLOW_TAB
                        }`
                    });

                    return;
                }
            }

            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", appId),
                search: `?${ ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_KEY }=${
                    ApplicationManagementConstants.APP_STATE_STRONG_AUTH_PARAM_VALUE }`
            });
        } else {
            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", appId),
                search: access === ApplicationAccessTypes.READ
                    ? `?${ ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY }=true`
                    : ""
            });
        }
    };

    /**
     * Deletes an application when the delete application button is clicked.
     *
     * @param appId - Application id.
     */
    const handleApplicationDelete = (appId: string): void => {

        setLoading(true);
        deleteApplication(appId)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.deleteApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.deleteApplication.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onApplicationDelete();
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.deleteApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(setAlert({
                    description: t("applications:notifications.deleteApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.deleteApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
                        } else {
                            templateDisplayName = applicationTemplates
                            && applicationTemplates instanceof Array
                            && applicationTemplates?.length > 0
                            && applicationTemplates.find((template: ApplicationTemplateListItemInterface) => {
                                return template?.id === app?.templateId;
                            })?.name;
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
                                            { t("applications:list.labels.fragment") }
                                        </Label>
                                    )
                                }
                                <Grid container spacing={ 1 }>
                                    <Grid alignItems="flex-end">
                                        <div>
                                            { templateDisplayName && (
                                                <Label
                                                    className="no-margin-left"
                                                    size="mini"
                                                >
                                                    { templateDisplayName }
                                                </Label>
                                            ) }
                                        </div>
                                    </Grid>
                                    {
                                        ApplicationManagementUtils.isChoreoApplication(app)
                                            && (<Grid>
                                                <div>
                                                    <Label
                                                        size="mini"
                                                        className="choreo-label no-margin-left"
                                                    >
                                                        { t("extensions:develop.apiResource.managedByChoreoText") }
                                                    </Label>
                                                </div>
                                            </Grid>)
                                    }
                                </Grid>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("applications:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "inboundKey",
                id: "inboundKey",
                key: "inboundKey",
                render: (app: ApplicationListItemInterface): ReactNode => {
                    let inboundAuthKey: string = "";
                    let inboundAuthType: ApplicationInboundTypes;
                    let inboundAuthTypeLabelClass: string = "";

                    if (app?.clientId) {
                        if (!(app?.issuer || app?.realm)) {
                            inboundAuthKey = app.clientId;
                            inboundAuthType = ApplicationInboundTypes.CLIENTID;
                            inboundAuthTypeLabelClass = "client-id-label";
                        }
                    } else if (app?.issuer) {
                        if (!(app?.clientId || app?.realm)) {
                            inboundAuthKey = app.issuer;
                            inboundAuthType = ApplicationInboundTypes.ISSUER;
                            inboundAuthTypeLabelClass = "issuer-label";
                        }
                    }

                    return (
                        <Header as="h6" data-testid={ `${ testId }-col-2-item-heading` }>
                            <Header.Content>
                                <Header.Subheader data-testid={ `${ testId }-col-2-item-sub-heading` }>
                                    { inboundAuthKey }
                                    {
                                        inboundAuthType && (
                                            <Label
                                                pointing="left"
                                                size="mini"
                                                className={ inboundAuthTypeLabelClass }
                                            >
                                                { inboundAuthType }
                                            </Label>
                                        )
                                    }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("applications:list.columns.inboundKey")
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
                icon: (app: ApplicationListItemInterface): SemanticICONS => {
                    return app?.access === ApplicationAccessTypes.READ
                        || !hasRequiredScopes(featureConfig?.applications,
                            featureConfig?.applications?.scopes?.update, allowedScopes)
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, app: ApplicationListItemInterface): void =>
                    handleApplicationEdit(app.id, app.access, app.name),
                popupText: (app: ApplicationListItemInterface): string => {
                    return app?.access === ApplicationAccessTypes.READ
                        || !hasRequiredScopes(featureConfig?.applications,
                            featureConfig?.applications?.scopes?.update, allowedScopes)
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${ testId }-item-delete-button`,
                hidden: (app: ApplicationListItemInterface) => {
                    const hasScopes: boolean = !hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.delete, allowedScopes);
                    const isSuperTenant: boolean = (tenantDomain === AppConstants.getSuperTenant());
                    const isSystemApp: boolean = isSuperTenant && (UIConfig.systemAppsIdentifiers.includes(app?.name));
                    const isFragmentApp: boolean = app.advancedConfigurations?.fragment || false;

                    return hasScopes ||
                        isSystemApp ||
                        (app?.access === ApplicationAccessTypes.READ) ||
                        !applicationConfig.editApplication.showDeleteButton(app) ||
                        isFragmentApp;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, app: ApplicationListItemInterface): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingApplication(app);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && list?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("console:develop.placeholders.emptySearchResult.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:develop.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder-icon` }
                />
            );
        }

        if (list?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    className={ !isRenderedOnPortal ? "list-placeholder mr-0" : "" }
                    action={ (onEmptyListPlaceholderActionClick
                        && organizationType !== OrganizationType.SUBORGANIZATION)
                        && (
                            <Show when={ AccessControlConstants.APPLICATION_WRITE }>
                                <PrimaryButton
                                    onClick={ () => {
                                        eventPublisher.publish(componentId + "-click-new-application-button");
                                        onEmptyListPlaceholderActionClick();
                                    } }>
                                    <Icon name="add" />
                                    { t("applications:placeholders.emptyList.action") }
                                </PrimaryButton>
                            </Show>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("applications:placeholders.emptyList.subtitles.0")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<ApplicationListItemInterface>
                className="applications-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading || isApplicationTemplateRequestLoading }
                actions={ !isSetStrongerAuth && resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list?.applications }
                onRowClick={ (e: SyntheticEvent, app: ApplicationListItemInterface): void => {
                    handleApplicationEdit(app.id, app.access, app.name);
                    onListItemClick && onListItemClick(e, app);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ applicationListConfig.enableTableHeaders }
                transparent={ !(isLoading || isApplicationTemplateRequestLoading) && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                deletingApplication && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("applications:confirmations.deleteApplication." +
                            "assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => handleApplicationDelete(deletingApplication.id) }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        {
                            ApplicationManagementUtils.isChoreoApplication(deletingApplication)
                                ? (
                                    <>
                                        <ConfirmationModal.Header
                                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteChoreoApplication.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            negative
                                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteChoreoApplication.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                                        >
                                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                                            <Trans
                                                i18nKey= { "applications:confirmations." +
                                                "deleteChoreoApplication.content" }>
                                                Deleting this application will break the authentication flows and cause
                                                the associated Choreo application to be unusable with its credentials.
                                                <b>Proceed at your own risk.</b>
                                            </Trans>
                                        </ConfirmationModal.Content>
                                    </>
                                )
                                : (
                                    <>
                                        <ConfirmationModal.Header
                                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteApplication.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            negative
                                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteApplication.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                                        >
                                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                                            { t("applications:confirmations." +
                                                "deleteApplication.content") }
                                        </ConfirmationModal.Content>
                                    </>
                                )
                        }
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
ApplicationList.defaultProps = {
    "data-componentid": "application",
    "data-testid": "application-list",
    selection: true,
    showListItemActions: true
};
