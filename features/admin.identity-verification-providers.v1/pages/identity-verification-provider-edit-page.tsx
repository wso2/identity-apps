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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants, AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    LabelWithPopup,
    TabPageLayout
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import {
    deleteIdentityVerificationProvider,
    updateIdentityVerificationProvider
} from "../api/identity-verification-provider";
import { useGetIdentityVerificationProvider } from "../api/use-get-idvp";
import { useGetIdVPMetadata } from "../api/use-get-idvp-metadata";
import { useGetIdVPTemplate } from "../api/use-get-idvp-template";
import { EditIdentityVerificationProvider } from "../components/identity-verification-provider-edit";
import { IdentityVerificationProviderConstants } from "../constants/identity-verification-provider-constants";
import {
    IdVPConfigPropertiesInterface,
    IdVPEditTabIDs,
    IdentityVerificationProviderInterface
} from "../models/identity-verification-providers";

/**
 * Proptypes for the IDVP edit page component.
 */
type IDVPEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Identity Verification Provider Edit page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const IdentityVerificationProviderEditPage: FunctionComponent<IDVPEditPagePropsInterface> = ({
    location,
    ["data-componentid"]: componentId = "idvp-edit-page"
}: IDVPEditPagePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const getIDVPId = (pathname : string): string => {
        const path: string[] = pathname.split("/");

        return path[ path.length - 1 ];
    };

    const {
        data: fetchedIdVP,
        error: idvpFetchRequestError,
        isLoading: isIdVPFetchRequestLoading,
        mutate: mutateIdVPFetchRequest
    } = useGetIdentityVerificationProvider(getIDVPId(location.pathname));

    const {
        data: fetchedIdVPMetadata,
        error: metadataFetchRequestError,
        isLoading: isMetadataFetchRequestLoading
    } = useGetIdVPMetadata(fetchedIdVP?.type);

    const {
        data: fetchedTemplateData,
        error: templateDataFetchRequestError,
        isLoading: isTemplateDataFetchRequestLoading
    } = useGetIdVPTemplate(fetchedIdVP?.type);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasIdVPUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.identityVerificationProviders?.scopes?.update);
    const hasIdVPDeletePermissions: boolean = useRequiredScopes(
        featureConfig?.identityVerificationProviders?.scopes?.delete);

    /**
     * Handles the IdVP fetch error.
     */
    useEffect(() => {
        if (idvpFetchRequestError) {
            dispatch(addAlert({
                description: idvpFetchRequestError.response?.data?.description
                    ?? t("idvp:fetch.notifications.idVP.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("idvp:fetch.notifications.idVP.genericError.message")
            }));
        }
    }, [ idvpFetchRequestError ]);

    /**
     * Handles the template data fetch error and metadata fetch error.
     */
    useEffect(() => {
        if (templateDataFetchRequestError || metadataFetchRequestError) {
            dispatch(addAlert({
                description: templateDataFetchRequestError.response?.data?.description
                    ?? metadataFetchRequestError.response?.data?.description
                    ?? t("idvp:fetch.notifications.metadata.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("idvp:fetch.notifications.metadata.genericError.message")
            }));
        }
    }, [ templateDataFetchRequestError, metadataFetchRequestError ]);

    /**
     * Handles the back button click event.
     *
     * @returns void
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Handles the identity verification provider deletion.
     */
    const handleIdentityVerificationProviderDelete = (): void => {
        deleteIdentityVerificationProvider(fetchedIdVP?.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("idvp:delete.notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("idvp:delete.notifications.delete.success.message")
                }));

                history.push(AppConstants.getPaths().get("IDP"));
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        || t("idvp:delete.notifications.delete.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("idvp:delete.notifications.delete.genericError.message")
                }));
            });
    };

    /**
     * Handles the identity verification provider update.
     *
     * @param data - Identity verification provider data to be updated.
     * @param callback - Callback to be called after the update.
     */
    const handleIdentityVerificationProviderUpdate = (
        data: IdentityVerificationProviderInterface,
        callback?: () => void
    ) => {
        updateIdentityVerificationProvider(data)
            .then(() => {
                dispatch(addAlert({
                    description: t("idvp:edit.notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("idvp:edit.notifications.update.success.message")
                }));
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        || t("idvp:edit.notifications.update.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("idvp:edit.notifications.update.genericError.message")
                }));
            })
            .finally(() => {
                callback?.();
                mutateIdVPFetchRequest();
            });
    };

    /**
     * Resolves the identity verification provider image.
     *
     * @param _idVP - Evaluating Identity Verification Provider.
     * @returns React element containing IDVP image.
     */
    const resolveIDVPImage = (_idVP: IdentityVerificationProviderInterface): ReactElement => {

        const { name, image } = _idVP || {};

        if (!(name || image)) {
            return (
                <AppAvatar
                    hoverable={ false }
                    isLoading={ true }
                    size="tiny"
                />
            );
        }

        // Return `AppAvatar` if image exists, otherwise return `AnimatedAvatar`.
        if (image) {
            return (
                <AppAvatar
                    hoverable={ false }
                    name={ name }
                    image={ image }
                    size="tiny"
                />
            );
        }

        return (
            <AnimatedAvatar
                hoverable={ false }
                name={ name }
                size="tiny"
                floated="left"
            />
        );
    };

    /**
     * Resolves the connector status label.
     *
     * @param connector - Evaluating connector.
     *
     * @returns React element.
     */
    const resolveStatusLabel = (): ReactElement => {

        if (!fetchedIdVP) {
            return null;
        }

        const isWebhookConfigured: boolean =
            !(fetchedIdVP.type === IdentityVerificationProviderConstants.IDVP_TEMPLATE_TYPES.onFido)
            || fetchedIdVP.configProperties.some((configProperty: IdVPConfigPropertiesInterface) => {
                return configProperty.key === "webhook_token" && !isEmpty(configProperty.value);
            });

        if (!isWebhookConfigured) {
            return (
                <LabelWithPopup
                    popupHeader={ t("idvp:edit.status.notConfigured.heading") }
                    popupSubHeader={ t("idvp:edit.status.notConfigured.description") }
                    labelColor="red"
                />
            );
        }

        if (fetchedIdVP.isEnabled) {
            return (
                <LabelWithPopup
                    popupHeader={ t("idvp:edit.status.enabled") }
                    labelColor="green"
                />
            );
        }

        return (
            <LabelWithPopup
                popupHeader={ t("idvp:edit.status.disabled") }
                labelColor="grey"
            />
        );
    };

    return (
        <TabPageLayout
            pageTitle="Edit Identity Verification Provider"
            isLoading={ isIdVPFetchRequestLoading || isTemplateDataFetchRequestLoading }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            title={ (
                <>
                    { fetchedIdVP?.name }
                    { resolveStatusLabel() }
                </>
            ) }
            contentTopMargin={ true }
            description={ fetchedIdVP?.description }
            image={ resolveIDVPImage(fetchedIdVP) }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: handleBackButtonClick,
                text: t("idvp:edit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${ componentId }-layout` }
        >
            {
                <EditIdentityVerificationProvider
                    identityVerificationProvider={ fetchedIdVP }
                    isLoading={
                        isIdVPFetchRequestLoading
                        || isMetadataFetchRequestLoading
                        || isIdVPFetchRequestLoading
                    }
                    handleDelete={ handleIdentityVerificationProviderDelete }
                    handleUpdate={ handleIdentityVerificationProviderUpdate }
                    data-componentid={ `${componentId}-edit` }
                    isReadOnly={ !hasIdVPUpdatePermissions }
                    isDeletePermitted={ hasIdVPDeletePermissions }
                    uiMetaData={ fetchedIdVPMetadata }
                    templateData={ fetchedTemplateData }
                    tabIdentifier={ fetchedIdVPMetadata?.edit?.defaultActiveTabId ?? IdVPEditTabIDs.GENERAL }
                />
            }
        </TabPageLayout>
    );
};

export default IdentityVerificationProviderEditPage;
