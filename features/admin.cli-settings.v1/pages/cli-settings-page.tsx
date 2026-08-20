/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Switch from "@oxygen-ui/react/Switch";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import {
    createApplication,
    disableApplication,
    useApplicationList
} from "@wso2is/admin.applications.v1/api/application";
import {
    ApplicationListInterface,
    ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import { CLISettingsPropertiesInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DocumentationLink,
    EmphasizedSegment,
    EmptyPlaceholder,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useCallback,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import CLISettingsTabs from "../components/cli-settings-tabs";
import { CLISettingsConstants } from "../constants/cli-settings-constants";

/**
 * Props interface of {@link CLISettingsPage}
 */
type CLISettingsPageInterface = IdentifiableComponentInterface;

/**
 * CLI Settings page.
 *
 * Manages the "ASG CLI" application. The CLI is considered enabled when the
 * application exists and is not disabled. Toggling on creates (or re-enables)
 * the application while toggling off disables it.
 *
 * @param props - Props injected to the component.
 * @returns CLI Settings page component.
 */
const CLISettingsPage: FunctionComponent<CLISettingsPageInterface> = (
    props: CLISettingsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId = "cli-settings-page" } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);
    const cliFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.cliSettings
    );

    const cliSettingsProperties: CLISettingsPropertiesInterface =
        cliFeatureConfig?.properties as CLISettingsPropertiesInterface;

    const hasCreatePermission: boolean = useRequiredScopes(cliFeatureConfig?.scopes?.create);
    const hasUpdatePermission: boolean = useRequiredScopes(cliFeatureConfig?.scopes?.update);

    /**
     * Enabling the CLI creates the application and disabling it patches the application,
     * hence both create and update permissions are required to manage it. Users with only
     * view (read) permission get a read-only view.
     */
    const isReadOnly: boolean = !hasCreatePermission || !hasUpdatePermission;

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showDisableConfirmationModal, setShowDisableConfirmationModal ] = useState<boolean>(false);

    const cliApplicationName: string = cliSettingsProperties?.applicationName;
    const cliClientId: string = cliSettingsProperties?.clientId;

    const pageDescription: ReactElement = (
        <>
            { t("cliSettings:page.description") }
            <DocumentationLink
                link={ getLink("develop.cliSettings.learnMore") }
                showEmptyLink={ false }
            >
                { t("common:learnMore") }
            </DocumentationLink>
        </>
    );

    /**
     * The CLI tool is only available when its application name and client ID are
     * configured via `ui.cliSettings` in deployment.config.json. When absent (e.g. on
     * Identity Server) the CLI functionality is disabled.
     */
    const isCLISettingsConfigurable: boolean = cliFeatureConfig?.enabled && !!cliApplicationName && !!cliClientId;

    const {
        data,
        isLoading,
        mutate
    } = useApplicationList<ApplicationListInterface>(
        "applicationEnabled",
        10,
        0,
        isCLISettingsConfigurable ? CLISettingsConstants.getCLIApplicationListFilter(cliApplicationName) : undefined,
        isCLISettingsConfigurable
    );

    const cliApplication: ApplicationListItemInterface | undefined = useMemo(
        () => data?.applications?.find(
            (application: ApplicationListItemInterface) =>
                application.name === cliApplicationName
        ),
        [ data, cliApplicationName ]
    );

    const isCLIEnabled: boolean = useMemo(
        () => !!cliApplication && cliApplication.applicationEnabled !== false,
        [ cliApplication ]
    );

    const updateCLIStatus: (enable: boolean) => Promise<void> = useCallback(
        async (enable: boolean): Promise<void> => {
            setIsSubmitting(true);

            try {
                if (enable) {
                    if (cliApplication?.id) {
                        // The application exists but is disabled — re-enable it.
                        await disableApplication(cliApplication.id, true);
                    } else {
                        // No application exists — create it to enable the CLI.
                        await createApplication(
                            CLISettingsConstants.getCLIApplicationCreatePayload(cliApplicationName, cliClientId)
                        );
                    }

                    dispatch(addAlert({
                        description: t("cliSettings:enablement.notifications.enabled.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("cliSettings:enablement.notifications.enabled.message")
                    }));
                } else {
                    if (cliApplication?.id) {
                        await disableApplication(cliApplication.id, false);
                    }

                    dispatch(addAlert({
                        description: t("cliSettings:enablement.notifications.disabled.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("cliSettings:enablement.notifications.disabled.message")
                    }));
                }

                mutate();
            } catch (error) {
                dispatch(addAlert({
                    description: (error as { response?: { data?: { description?: string } } })
                        ?.response?.data?.description
                        || (enable
                            ? t("cliSettings:enablement.notifications.genericError.enableDescription")
                            : t("cliSettings:enablement.notifications.genericError.disableDescription")),
                    level: AlertLevels.ERROR,
                    message: t("cliSettings:enablement.notifications.genericError.message")
                }));
            } finally {
                setIsSubmitting(false);
                setShowDisableConfirmationModal(false);
            }
        },
        [ cliApplication, cliApplicationName, cliClientId, dispatch, mutate, t ]
    );

    /**
     * Handles the enable/disable toggle. Enabling proceeds immediately, while disabling
     * requires confirmation since it interrupts active CLI sessions.
     */
    const handleToggle: (event: ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            if (isReadOnly) {
                return;
            }

            if (event.target.checked) {
                updateCLIStatus(true);
            } else {
                setShowDisableConfirmationModal(true);
            }
        },
        [ isReadOnly, updateCLIStatus ]
    );

    if (!isCLISettingsConfigurable) {
        return (
            <PageLayout
                pageTitle={ t("cliSettings:page.title") }
                title={ t("cliSettings:page.title") }
                description={ pageDescription }
                data-componentid={ `${ componentId }-page-layout` }
            >
                <EmphasizedSegment padded="very">
                    <EmptyPlaceholder
                        title={ t("cliSettings:notConfigured.title", { productName }) }
                        subtitle={ [ t("cliSettings:notConfigured.subtitle", { productName }) ] }
                        data-componentid={ `${ componentId }-not-configured-placeholder` }
                    />
                </EmphasizedSegment>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            pageTitle={ t("cliSettings:page.title") }
            title={ t("cliSettings:page.title") }
            description={ pageDescription }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <EmphasizedSegment padded="very" data-componentid={ `${ componentId }-segment` }>
                <Box
                    sx={ {
                        alignItems: "flex-start",
                        display: "flex",
                        justifyContent: "space-between"
                    } }
                >
                    <Box>
                        <Box sx={ { alignItems: "center", display: "flex", gap: 1 } }>
                            <Typography variant="h5">{ t("cliSettings:enablement.title") }</Typography>
                            { !isLoading && (
                                <Chip
                                    label={ isCLIEnabled
                                        ? t("cliSettings:enablement.status.enabled")
                                        : t("cliSettings:enablement.status.disabled") }
                                    color={ isCLIEnabled ? "success" : "default" }
                                    size="small"
                                    data-componentid={ `${ componentId }-status-chip` }
                                />
                            ) }
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={ { mt: 1 } }>
                            { t("cliSettings:enablement.description") }
                        </Typography>
                    </Box>
                    <Box sx={ { alignItems: "center", display: "flex", ml: 2 } }>
                        { (isLoading || isSubmitting) && (
                            <CircularProgress
                                size={ 20 }
                                sx={ { mr: 1 } }
                                data-componentid={ `${ componentId }-progress` }
                            />
                        ) }
                        <Switch
                            checked={ isCLIEnabled }
                            disabled={ isLoading || isSubmitting || isReadOnly }
                            onChange={ handleToggle }
                            inputProps={ { "aria-label": t("cliSettings:enablement.toggleAriaLabel") } }
                            data-componentid={ `${ componentId }-toggle` }
                        />
                    </Box>
                </Box>
            </EmphasizedSegment>

            { isCLIEnabled && (
                <Box sx={ { mt: 2 } }>
                    <CLISettingsTabs
                        cliApplicationId={ cliApplication?.id }
                        readonly={ isReadOnly }
                        data-componentid={ `${ componentId }-tabs` }
                    />
                </Box>
            ) }

            { showDisableConfirmationModal && (
                <ConfirmationModal
                    onClose={ (): void => setShowDisableConfirmationModal(false) }
                    type="warning"
                    open={ showDisableConfirmationModal }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDisableConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        updateCLIStatus(false);
                    } }
                    primaryActionLoading={ isSubmitting }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${ componentId }-disable-confirmation-modal` }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${ componentId }-disable-confirmation-modal-header` }
                    >
                        { t("cliSettings:enablement.disableConfirmation.heading") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-componentid={ `${ componentId }-disable-confirmation-modal-message` }
                    >
                        { t("cliSettings:enablement.disableConfirmation.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-disable-confirmation-modal-content` }
                    >
                        { t("cliSettings:enablement.disableConfirmation.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </PageLayout>
    );
};

export default CLISettingsPage;
