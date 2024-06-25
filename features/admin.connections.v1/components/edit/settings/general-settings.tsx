/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { getApplicationDetails } from "@wso2is/admin.applications.v1/api";
import { ApplicationBasicInterface } from "@wso2is/admin.applications.v1/models";
import { AppState, FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider, List } from "semantic-ui-react";
import {
    deleteConnection,
    getConnectedApps,
    updateIdentityProviderDetails,
    useGetConnections
} from "../../../api/connections";
import { AuthenticatorManagementConstants } from "../../../constants/autheticator-constants";
import {
    ConnectedAppInterface,
    ConnectedAppsInterface,
    ConnectionInterface
} from "../../../models/connection";
import {
    handleConnectionDeleteError,
    handleConnectionUpdateError,
    handleGetConnectionListCallError
} from "../../../utils/connection-utils";
import { GeneralDetailsForm } from "../forms";

/**
 * Proptypes for the identity provider general details component.
 */
interface GeneralSettingsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: ConnectionInterface;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to be triggered after deleting the idp.
     */
    onDelete: () => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * @see {@link GeneralDetailsFormPopsInterface}
     */
    hideIdPLogoEditField?: boolean;
    /**
     * Explicitly specifies whether the currently displaying
     * IdP is a SAML provider or not.
     */
    isSaml?: boolean;
    /**
     * Explicitly specifies whether the currently displaying
     * IdP is a OIDC provider or not.
     */
    isOidc?: boolean;
    /**
     * Type of the template.
     */
    templateType?: string;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 * Component to edit general details of the identity provider.
 *
 * @param props - Props injected to the component.
 * @returns General Settings component.
 */
export const GeneralSettings: FunctionComponent<GeneralSettingsInterface> = (
    props: GeneralSettingsInterface
): ReactElement => {

    const {
        editingIDP,
        isLoading,
        onDelete,
        onUpdate,
        isReadOnly,
        hideIdPLogoEditField,
        isSaml,
        isOidc,
        templateType,
        loader: Loader,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState(false);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [ showDeleteErrorDueToConnectedAppsModal, setShowDeleteErrorDueToConnectedAppsModal ] =
        useState<boolean>(false);
    const [ isAppsLoading, setIsAppsLoading ] = useState(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: idpList,
        isLoading: isIdPListRequestLoading,
        error: idpListError
    } = useGetConnections();

    /**
     * Loads the identity provider authenticators on initial component load.
     */
    useEffect(() => {
        idpListError && handleGetConnectionListCallError(idpListError);
    }, [ idpListError ]);

    const handleIdentityProviderDeleteAction = (): void => {
        setIsAppsLoading(true);
        getConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    setShowDeleteConfirmationModal(true);
                } else {
                    setShowDeleteErrorDueToConnectedAppsModal(true);
                    const appRequests: Promise<ApplicationBasicInterface>[]
                        = response.connectedApps.map((app: ConnectedAppInterface) =>
                            getApplicationDetails(app.appId)
                        );

                    const results: ApplicationBasicInterface[] = await Promise.all(
                        appRequests.map((response: Promise<ApplicationBasicInterface>) =>
                            response.catch((error: IdentityAppsError) => {
                                dispatch(addAlert({
                                    description: error?.description
                                        || "Error occurred while trying to retrieve connected applications.",
                                    level: AlertLevels.ERROR,
                                    message: error?.message || "Error Occurred."
                                }));
                            }))
                    ) as ApplicationBasicInterface[];

                    const appNames: string[] = results.map((app: ApplicationBasicInterface) => app?.name);

                    setConnectedApps(appNames);
                }
            })
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description || "Error occurred while trying to retrieve connected " +
                    "applications.",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Error Occurred."
                }));
            })
            .finally(() => {
                setIsAppsLoading(false);
            });
    };

    /**
     * Deletes an identity provider.
     */
    const handleIdentityProviderDelete = (): void => {
        setLoading(true);
        deleteConnection(editingIDP.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.deleteIDP." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.deleteIDP." +
                        "success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error: AxiosError) => {
                handleConnectionDeleteError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    /**
     * Handles form submit action.
     *
     * @param updatedDetails - Form values.
     */
    const handleFormSubmit = (updatedDetails: ConnectionInterface): void => {
        setIsSubmitting(true);

        updateIdentityProviderDetails({ id: editingIDP.id, ...updatedDetails }, editingIDP.idpIssuerName === undefined)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.updateIDP." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.updateIDP." +
                        "success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error: AxiosError) => {
                handleConnectionUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleIdentityProviderDisable = (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        setIsAppsLoading(true);
        getConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    handleFormSubmit(
                        {
                            isEnabled: data.checked
                        }
                    );
                } else {
                    dispatch(addAlert({
                        description: t("authenticationProvider:notifications" +
                            ".disableIDPWithConnectedApps.error.description"),
                        level: AlertLevels.WARNING,
                        message: t("authenticationProvider:notifications" +
                            ".disableIDPWithConnectedApps.error.message")
                    }));
                }
            })
            .catch((error: IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description || "Error occurred while trying to retrieve connected " +
                        "applications.",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Error Occurred."
                }));
            })
            .finally(() => {
                setIsAppsLoading(false);
            });

    };

    return (
        !isLoading && !isIdPListRequestLoading
            ? (
                <>
                    <GeneralDetailsForm
                        isSaml={ isSaml }
                        isOidc={ isOidc }
                        templateType={ templateType }
                        hideIdPLogoEditField={ hideIdPLogoEditField }
                        editingIDP={ editingIDP }
                        onSubmit={ handleFormSubmit }
                        onUpdate={ onUpdate }
                        idpList={ idpList }
                        data-testid={ `${ testId }-form` }
                        isReadOnly={ isReadOnly }
                        isSubmitting={ isSubmitting }
                    />
                    <Divider hidden />
                    { !(AuthenticatorManagementConstants.DELETING_FORBIDDEN_IDPS.includes(editingIDP.name)) && (
                        <Show
                            when={ featureConfig?.identityProviders?.scopes?.update ||
                                featureConfig?.identityProviders?.scopes?.delete }
                        >
                            <DangerZoneGroup
                                sectionHeader={ t("authenticationProvider:" +
                                "dangerZoneGroup.header") }>
                                <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                    <DangerZone
                                        actionTitle={ t("authenticationProvider:" +
                                            "dangerZoneGroup.disableIDP.actionTitle",
                                        { state: editingIDP.isEnabled ? t("common:disable") : t("common:enable") }) }
                                        header={ t("authenticationProvider:dangerZoneGroup." +
                                            "disableIDP.header",
                                        { state: editingIDP.isEnabled ? t("common:disable") : t("common:enable") } ) }
                                        subheader={ editingIDP.isEnabled
                                            ? t("authenticationProvider:" +
                                                "dangerZoneGroup.disableIDP.subheader")
                                            : t("authenticationProvider:dangerZoneGroup.disableIDP.subheader2") }
                                        onActionClick={ undefined }
                                        toggle={ {
                                            checked: editingIDP.isEnabled,
                                            onChange: handleIdentityProviderDisable
                                        } }
                                        data-testid={ `${ testId }-disable-idp-danger-zone` }
                                    />
                                </Show>
                                <Show when={ featureConfig?.identityProviders?.scopes?.delete }>
                                    <DangerZone
                                        actionTitle={ t("authenticationProvider:" +
                                            "dangerZoneGroup.deleteIDP.actionTitle") }
                                        header={ t("authenticationProvider:" +
                                            "dangerZoneGroup.deleteIDP.header") }
                                        subheader={ t("authenticationProvider:" +
                                            "dangerZoneGroup.deleteIDP.subheader") }
                                        onActionClick={ handleIdentityProviderDeleteAction }
                                        data-testid={ `${ testId }-delete-idp-danger-zone` }
                                    />
                                </Show>
                            </DangerZoneGroup>
                        </Show>
                    ) }
                    {
                        showDeleteConfirmationModal && (
                            <ConfirmationModal
                                primaryActionLoading={ loading }
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="negative"
                                open={ showDeleteConfirmationModal }
                                assertion={ editingIDP.name }
                                assertionHint={ t("authenticationProvider:"+
                                "confirmations.deleteIDP.assertionHint") }
                                assertionType="checkbox"
                                primaryAction={ t("common:confirm") }
                                secondaryAction={ t("common:cancel") }
                                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                                onPrimaryActionClick={ (): void => handleIdentityProviderDelete() }
                                data-testid={ `${ testId }-delete-idp-confirmation` }
                                closeOnDimmerClick={ false }
                            >
                                <ConfirmationModal.Header data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("authenticationProvider:" +
                                        "confirmations.deleteIDP.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    negative
                                    data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("authenticationProvider:" +
                                        "confirmations.deleteIDP.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("authenticationProvider:" +
                                        "confirmations.deleteIDP.content") }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                    {
                        showDeleteErrorDueToConnectedAppsModal && (
                            <ConfirmationModal
                                onClose={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                                type="negative"
                                open={ showDeleteErrorDueToConnectedAppsModal }
                                secondaryAction={ t("common:close") }
                                onSecondaryActionClick={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                                data-testid={ `${ testId }-delete-idp-confirmation` }
                                closeOnDimmerClick={ false }
                            >
                                <ConfirmationModal.Header data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("authenticationProvider:confirmations." +
                                        "deleteIDPWithConnectedApps.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    negative
                                    data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("authenticationProvider:confirmations." +
                                        "deleteIDPWithConnectedApps.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("authenticationProvider:confirmations." +
                                        "deleteIDPWithConnectedApps.content") }
                                    <Divider hidden />
                                    <List ordered className="ml-6">
                                        {
                                            isAppsLoading
                                                ? <ContentLoader/>
                                                : connectedApps?.map((app: string, index: number) => (
                                                    <List.Item key={ index }>{ app }</List.Item>
                                                ))
                                        }
                                    </List>
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                </>
            )
            : <Loader />
    );
};

/**
 * Default proptypes for the IDP general settings component.
 */
GeneralSettings.defaultProps = {
    "data-testid": "idp-edit-general-settings",
    hideIdPLogoEditField: false
};
