/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { CheckboxProps, Divider, List } from "semantic-ui-react";
import { getApplicationDetails } from "../../../applications/api";
import { ApplicationBasicInterface } from "../../../applications/models";
import {
    deleteIdentityProvider,
    getIDPConnectedApps,
    getIdentityProviderList,
    updateIdentityProviderDetails
} from "../../api";
import { IdentityProviderManagementConstants } from "../../constants";
import {
    ConnectedAppInterface,
    ConnectedAppsInterface,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface
} from "../../models";
import { GeneralDetailsForm } from "../forms";
import { handleGetIDPListCallError, handleIDPDeleteError, handleIDPUpdateError } from "../utils";

/**
 * Proptypes for the identity provider general details component.
 */
interface GeneralSettingsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: IdentityProviderInterface;
    /**
     * Identity provider description.
     */
    description?: string;
    /**
     * Is the idp enabled.
     */
    isEnabled?: boolean;
    /**
     * IDP image URL.
     */
    imageUrl?: string;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Name of the idp.
     */
    name: string;
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
        name,
        description,
        isEnabled,
        imageUrl,
        isLoading,
        onDelete,
        onUpdate,
        isReadOnly,
        hideIdPLogoEditField,
        isSaml,
        isOidc,
        loader: Loader,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState(false);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [ showDeleteErrorDueToConnectedAppsModal, setShowDeleteErrorDueToConnectedAppsModal ] =
        useState<boolean>(false);
    const [ isAppsLoading, setIsAppsLoading ] = useState(true);

    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Loads the identity provider authenticators on initial component load.
     */
    useEffect(() => {
        getIDPlist();
    }, []);

    /**
     * Get Idp List.
     */
    const getIDPlist=()=>{
        setIdPListRequestLoading(true);
        getIdentityProviderList(null, null,null)
            .then((response)=> {
                setIdPList(response);
            }).catch((error) => {
                handleGetIDPListCallError(error);
            }).finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    const handleIdentityProviderDeleteAction = (): void => {
        setIsAppsLoading(true);
        getIDPConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    setShowDeleteConfirmationModal(true);
                } else {
                    setShowDeleteErrorDueToConnectedAppsModal(true);
                    const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
                        return getApplicationDetails(app.appId);
                    });

                    const results: ApplicationBasicInterface[] = await Promise.all(
                        appRequests.map(response => response.catch(error => {
                            dispatch(addAlert({
                                description: error?.description
                                    || "Error occurred while trying to retrieve connected applications.",
                                level: AlertLevels.ERROR,
                                message: error?.message || "Error Occurred."
                            }));
                        }))
                    );

                    const appNames: string[] = [];

                    results.forEach((app) => {
                        appNames.push(app.name);
                    });
                    setConnectedApps(appNames);
                }
            })
            .catch((error) => {
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
        deleteIdentityProvider(editingIDP.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications.deleteIDP." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications.deleteIDP." +
                        "success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error) => {
                handleIDPDeleteError(error);
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
    const handleFormSubmit = (updatedDetails: IdentityProviderInterface): void => {
        setIsSubmitting(true);

        updateIdentityProviderDetails({ id: editingIDP.id, ...updatedDetails })
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications.updateIDP." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications.updateIDP." +
                        "success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error) => {
                handleIDPUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleIdentityProviderDisable = (event: any, data: CheckboxProps) => {
        setIsAppsLoading(true);
        getIDPConnectedApps(editingIDP.id)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    handleFormSubmit(
                        {
                            isEnabled: data.checked
                        }
                    );
                } else {
                    dispatch(addAlert({
                        description: "There are applications using this identity provider.",
                        level: AlertLevels.WARNING,
                        message: "Cannot Disable."
                    }));
                }
            })
            .catch((error) => {
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
                        hideIdPLogoEditField={ hideIdPLogoEditField }
                        name={ name }
                        editingIDP={ editingIDP }
                        description={ description }
                        onSubmit={ handleFormSubmit }
                        onUpdate={ onUpdate }
                        imageUrl={ imageUrl }
                        idpList={ idpList }
                        data-testid={ `${ testId }-form` }
                        isReadOnly={ isReadOnly }
                        isSubmitting={ isSubmitting }
                    />
                    <Divider hidden />
                    { !(IdentityProviderManagementConstants.DELETING_FORBIDDEN_IDPS.includes(name)) && (
                        <Show when={ AccessControlConstants.IDP_EDIT || AccessControlConstants.IDP_DELETE }>
                            <DangerZoneGroup
                                sectionHeader={ t("console:develop.features.authenticationProvider." +
                                "dangerZoneGroup.header") }>
                                <Show when={ AccessControlConstants.IDP_EDIT }>
                                    <DangerZone
                                        actionTitle={ t("console:develop.features.authenticationProvider." +
                                            "dangerZoneGroup.disableIDP.actionTitle",
                                        { state: isEnabled ? t("common:disable") : t("common:enable") }) }
                                        header={ t("console:develop.features.authenticationProvider.dangerZoneGroup." +
                                            "disableIDP.header",
                                        { state: isEnabled ? t("common:disable") : t("common:enable") } ) }
                                        subheader={ isEnabled ? t("console:develop.features.authenticationProvider." +
                                            "dangerZoneGroup.disableIDP.subheader") : t("console:develop.features." +
                                                "authenticationProvider.dangerZoneGroup.disableIDP.subheader2") }
                                        onActionClick={ undefined }
                                        toggle={ {
                                            checked: isEnabled,
                                            onChange: handleIdentityProviderDisable
                                        } }
                                        data-testid={ `${ testId }-disable-idp-danger-zone` }
                                    />
                                </Show>
                                <Show when={ AccessControlConstants.IDP_DELETE }>
                                    <DangerZone
                                        actionTitle={ t("console:develop.features.authenticationProvider." +
                                            "dangerZoneGroup.deleteIDP.actionTitle") }
                                        header={ t("console:develop.features.authenticationProvider." +
                                            "dangerZoneGroup.deleteIDP.header") }
                                        subheader={ t("console:develop.features.authenticationProvider." +
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
                                assertion={ name }
                                assertionHint={ t("console:develop.features.authenticationProvider."+
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
                                    { t("console:develop.features.authenticationProvider." +
                                        "confirmations.deleteIDP.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    negative
                                    data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("console:develop.features.authenticationProvider." +
                                        "confirmations.deleteIDP.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("console:develop.features.authenticationProvider." +
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
                                    { t("console:develop.features.authenticationProvider.confirmations." +
                                        "deleteIDPWithConnectedApps.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    negative
                                    data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("console:develop.features.authenticationProvider.confirmations." +
                                        "deleteIDPWithConnectedApps.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("console:develop.features.authenticationProvider.confirmations." +
                                        "deleteIDPWithConnectedApps.content") }
                                    <Divider hidden />
                                    <List ordered className="ml-6">
                                        {
                                            isAppsLoading ? (
                                                <ContentLoader/>
                                            ) :
                                                connectedApps?.map((app, index) => {
                                                    return (
                                                        <List.Item key={ index }>{ app }</List.Item>
                                                    );
                                                })
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
