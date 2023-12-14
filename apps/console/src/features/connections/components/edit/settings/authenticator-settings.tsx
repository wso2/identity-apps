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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    EmphasizedSegment,
    EmptyPlaceholder,
    PrimaryButton,
    SegmentedAccordionTitleActionInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import keyBy from "lodash-es/keyBy";
import React, { FormEvent, FunctionComponent, MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AccordionTitleProps, CheckboxProps, Grid, Icon } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../../extensions";
import { AppState, ConfigReducerStateInterface, getEmptyPlaceholderIllustrations } from "../../../../core";
import { AuthenticatorAccordion } from "../../../../core/components";
import {
    getFederatedAuthenticatorDetails,
    getFederatedAuthenticatorMeta,
    getFederatedAuthenticatorsList,
    updateFederatedAuthenticator,
    updateFederatedAuthenticators
} from "../../../api/authenticators";
import { getConnectionIcons } from "../../../configs/ui";
import { AuthenticatorManagementConstants } from "../../../constants/autheticator-constants";
import { ConnectionManagementConstants } from "../../../constants/connection-constants";
import {
    AuthenticatorSettingsFormModes,
    FederatedAuthenticatorMetaDataInterface
} from "../../../models/authenticators";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    ConnectionInterface,
    ConnectionTemplateInterface,
    ConnectionTemplateItemInterface,
    FederatedAuthenticatorInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaInterface,
    FederatedAuthenticatorWithMetaInterface
} from "../../../models/connection";
import {
    handleGetFederatedAuthenticatorMetadataAPICallError
} from "../../../utils/connection-utils";
import { getConnectorMetadata } from "../../meta/authenticators";
import { AuthenticatorCreateWizard } from "../../wizards/authenticator-create-wizard";
import { AuthenticatorFormFactory } from "../forms";

/**
 * Proptypes for the identity providers settings component.
 */
interface IdentityProviderSettingsPropsInterface extends TestableComponentInterface {
    /**
     * Currently editing idp.
     */
    identityProvider: ConnectionInterface;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
    /**
     * Connection setting section meta data.
     */
    connectionSettingsMetaData: any;
}

const OIDC_CLIENT_ID_SECRET_MAX_LENGTH: number = 100;
const URL_MAX_LENGTH: number = 2048;
/**
 * The backend response includes both of the following keys
 * for different connections.
 */
const AUTHORIZED_REDIRECT_URLS: string[] = [ "callbackUrl", "callBackUrl" ];

/**
 *  Identity Provider and advance settings component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AuthenticatorSettings: FunctionComponent<IdentityProviderSettingsPropsInterface> = (
    props: IdentityProviderSettingsPropsInterface
): ReactElement => {

    const {
        connectionSettingsMetaData,
        identityProvider,
        isLoading,
        onUpdate,
        isReadOnly,
        loader: Loader,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();

    const { t } = useTranslation();

    const identityProviderTemplates: ConnectionTemplateItemInterface[] = UIConfig?.connectionTemplates;

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [
        deletingAuthenticator,
        setDeletingAuthenticator
    ] = useState<FederatedAuthenticatorListItemInterface>(undefined);
    const [ availableAuthenticators, setAvailableAuthenticators ] =
        useState<FederatedAuthenticatorWithMetaInterface[]>([]);
    const [
        availableFederatedAuthenticators,
        setAvailableFederatedAuthenticators
    ] = useState(undefined);
    const [
        availableTemplates,
        setAvailableTemplates
    ] = useState<ConnectionTemplateInterface[]>(undefined);
    const [
        availableManualModeOptions,
        setAvailableManualModeOptions
    ] = useState<FederatedAuthenticatorMetaDataInterface[]>(undefined);
    const [ showAddAuthenticatorWizard, setShowAddAuthenticatorWizard ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>([]);
    const [ isIdPTemplateFetchRequestLoading ] = useState<boolean>(undefined);
    const [
        isFederatedAuthenticatorFetchRequestLoading,
        setFederatedAuthenticatorFetchRequestLoading
    ] = useState<boolean>(undefined);

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const isActiveTemplateExpertMode: boolean = useMemo(() => {
        return identityProviderConfig?.templates?.expertMode &&
            (identityProvider.templateId === ConnectionManagementConstants
                .EXPERT_MODE_TEMPLATE_ID);
    }, [ identityProvider, identityProviderConfig  ]);

    useEffect(() => {
        getAuthenticators();
    }, []);

    /**
     * When `availableAuthenticators` updates, filter the templates.
     */
    useEffect(() => {

        filterTemplates();
    }, [ availableAuthenticators ]);

    /**
     * Gets the list of available authenticator list and sets them in the redux store.
     */
    const getAuthenticators = () => {
        return getFederatedAuthenticatorsList()
            .then((response: FederatedAuthenticatorMetaInterface[]): void => {

                // Filter out legacy SMS and Email OTP authenticators.
                const filteredAuthenticators: FederatedAuthenticatorMetaInterface[] = response.filter(
                    (authenticator: FederatedAuthenticatorMetaInterface) => {
                        return authenticator.authenticatorId !== AuthenticatorManagementConstants
                            .LEGACY_SMS_OTP_AUTHENTICATOR_ID &&
                            authenticator.authenticatorId !== AuthenticatorManagementConstants
                                .LEGACY_EMAIL_OTP_AUTHENTICATOR_ID;
                    }
                );

                setAvailableFederatedAuthenticators(filteredAuthenticators);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:develop.features.authenticationProvider.notifications." +
                                    "getFederatedAuthenticatorsList.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:develop.features.authenticationProvider.notifications." +
                                    "getFederatedAuthenticatorsList.error.message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:develop.features.authenticationProvider.notifications." +
                                "getFederatedAuthenticatorsList.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:develop.features.authenticationProvider.notifications." +
                                "getFederatedAuthenticatorsList.genericError.message"
                        )
                    })
                );
            });
    };

    /**
     * Handles the authenticator config form submit action.
     *
     * @param values - Form values.
     */
    const handleAuthenticatorConfigFormSubmit = (values: FederatedAuthenticatorListItemInterface,
        isDefaultAuthSet: boolean = true): void => {

        addCallbackUrl(values);

        // Only execute this when not in the expert mode since it makes it impossible
        // to disable a Google authenticator in expert mode.
        if (!isActiveTemplateExpertMode) {
            // Special checks on Google IDP
            if (values.authenticatorId === ConnectionManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID) {
                // Enable/disable the Google authenticator based on client id and secret
                const props: CommonPluggableComponentPropertyInterface[] = values.properties;
                let isEnabled: boolean = true;

                props.forEach((prop: CommonPluggableComponentPropertyInterface) => {
                    if (prop.key === "ClientId" || prop.key === "ClientSecret") {
                        if (isEmpty(prop.value)) {
                            isEnabled = false;
                        }
                    }
                });

                values.isEnabled = isEnabled;

                // Remove scopes
                removeElementFromProps(props, "scopes");
            }
        }

        /**
         * `tags` were added to the IDP Rest API with https://github.com/wso2/product-is/issues/11985.
         * But ATM, updating them is not allowed. So to avoid `400` errors in the PUT request,
         * `tags` has to be removed.
         */
        values?.tags && delete values.tags;

        setIsSubmitting(true);

        updateFederatedAuthenticator(identityProvider.id, values)
            .then(() => {
                if (isDefaultAuthSet) {
                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider" +
                            ".notifications.updateFederatedAuthenticator." +
                            "success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:develop.features.authenticationProvider.notifications." +
                            "updateFederatedAuthenticator." +
                            "success.message")
                    }));
                }
                onUpdate(identityProvider.id);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider" +
                            ".notifications.updateFederatedAuthenticator." +
                            "error.description", { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider" +
                            ".notifications.updateFederatedAuthenticator." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "updateFederatedAuthenticator." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "updateFederatedAuthenticator." +
                        "genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     *
     * Add callback URL to the values.
     *
     * @param values - Federated Authenticators.
     */
    const addCallbackUrl = (values: FederatedAuthenticatorListItemInterface) => {

        const isCallbackUrlExist: boolean = !!values?.properties?.find(
            (item: CommonPluggableComponentPropertyInterface) =>
                AUTHORIZED_REDIRECT_URLS.includes(item?.key)
        );

        if (isCallbackUrlExist) {
            return;
        }

        const authenticator: FederatedAuthenticatorWithMetaInterface =
            availableAuthenticators?.find((authenticator: FederatedAuthenticatorWithMetaInterface) => (
                values?.authenticatorId === authenticator?.id
            ));
        const index: number = authenticator?.data?.properties?.findIndex(
            (item: CommonPluggableComponentPropertyInterface) =>
                AUTHORIZED_REDIRECT_URLS.includes(item?.key)
        );

        if (index >= 0) {
            values?.properties?.push(authenticator?.data?.properties[index]);
        }
    };

    const handleGetFederatedAuthenticatorAPICallError = (error: AxiosError) => {
        if (error.response && error.response.data && error.response.data.description) {
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider.notifications." +
                    "getFederatedAuthenticator.error.description",
                { description: error.response.data.description }),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.authenticationProvider." +
                    "notifications.getFederatedAuthenticator.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.authenticationProvider.notifications.getFederatedAuthenticator." +
                "genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.authenticationProvider.notifications." +
                "getFederatedAuthenticator.genericError.message")
        }));
    };

    /**
     * Fetch data and metadata of a given authenticatorId and return a promise.
     *
     * @param authenticatorId - ID of the authenticator.
     */
    const fetchAuthenticator = (authenticatorId: string) => {
        return new Promise((resolve: any) => {
            getFederatedAuthenticatorDetails(identityProvider.id, authenticatorId)
                .then((data: FederatedAuthenticatorMetaInterface) => {
                    getFederatedAuthenticatorMeta(authenticatorId)
                        .then((meta: FederatedAuthenticatorMetaInterface) => {
                            resolve({
                                data: data,
                                id: authenticatorId,
                                meta: meta
                            });
                        })
                        .catch((error: IdentityAppsApiException) => {
                            handleGetFederatedAuthenticatorMetadataAPICallError(error);
                        });
                })
                .catch((error: AxiosError) => {
                    handleGetFederatedAuthenticatorAPICallError(error);
                });
        });
    };

    /**
     * Asynchronous function to loop through federated authenticators, fetch data and metadata and
     * return an array of available authenticators.
     */
    async function fetchAuthenticators() {
        const authenticators: FederatedAuthenticatorWithMetaInterface[] = [];

        for (const authenticator of identityProvider.federatedAuthenticators.authenticators) {
            authenticators.push(await fetchAuthenticator(authenticator.authenticatorId));
        }

        return authenticators;
    }

    useEffect(() => {
        if (isEmpty(identityProvider.federatedAuthenticators?.authenticators)) {
            return;
        }

        setFederatedAuthenticatorFetchRequestLoading(true);
        setAvailableAuthenticators([]);
        fetchAuthenticators()
            .then((res: any) => {
                const authenticator: FederatedAuthenticatorInterface = res[ 0 ].data;

                // TODO: Validate if this is necessary to do on the FE side.
                // Added with:
                // https://github.com/wso2/identity-apps/pull/2053/commits/177e8475aa3e48a7933f877a25c82306b7b3739f
                // This poses issues with the enable toggle in IdP expert mode. So, not executing when in expert mode.
                if (!isActiveTemplateExpertMode) {
                    authenticator.isEnabled = true;
                }
                // Make default authenticator if not added.
                if (!identityProvider.federatedAuthenticators.defaultAuthenticatorId &&
                    identityProvider.federatedAuthenticators.authenticators.length > 0) {
                    authenticator.isDefault = true;

                    const isDefaultAuthIdSet: boolean = Boolean(
                        identityProvider?.federatedAuthenticators?.defaultAuthenticatorId
                    );

                    handleAuthenticatorConfigFormSubmit(authenticator, isDefaultAuthIdSet);
                }
                setAvailableAuthenticators(res);
            })
            .finally(() => setFederatedAuthenticatorFetchRequestLoading(false));
    }, [ identityProvider?.federatedAuthenticators ]);

    /**
     * Handles default authenticator change event.
     *
     * @param e - Event.
     * @param data - Checkbox data.
     * @param id - Id of the authenticator.
     */
    const handleDefaultAuthenticatorChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string):
        void => {
        const authenticator: FederatedAuthenticatorInterface = availableAuthenticators
            .find((authenticator: FederatedAuthenticatorWithMetaInterface) => (authenticator.id === id)).data;

        authenticator.isDefault = data.checked;
        handleAuthenticatorConfigFormSubmit(authenticator);
    };

    /**
     * Handles authenticator enable toggle.
     *
     * @param e -  Event.
     * @param data - Checkbox data.
     * @param id - Id of the authenticator.
     */
    const handleAuthenticatorEnableToggle = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string): void => {
        const authenticator: FederatedAuthenticatorInterface = availableAuthenticators
            .find((authenticator: FederatedAuthenticatorWithMetaInterface) => (authenticator.id === id)).data;

        // Validation
        if (authenticator.isDefault && !data.checked) {
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider.notifications." +
                    "disableAuthenticator.error.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.authenticationProvider.notifications." +
                    "disableAuthenticator.error.message")
            }));
            onUpdate(identityProvider.id);
        } else {
            authenticator.isEnabled = data.checked;
            handleAuthenticatorConfigFormSubmit(authenticator);
        }
    };

    /**
     * Handles Authenticator delete action.
     *
     * @param id - Id of the authenticator.
     */
    const handleAuthenticatorDelete = (id: string): void => {
        const authenticatorsList: FederatedAuthenticatorInterface[] = [];
        const deletingAuthenticator: FederatedAuthenticatorWithMetaInterface = availableAuthenticators
            .find((authenticator: FederatedAuthenticatorWithMetaInterface) => authenticator.id === id);

        availableAuthenticators.map((authenticator: FederatedAuthenticatorWithMetaInterface) => {
            if (authenticator.id !== deletingAuthenticator.id) {
                authenticatorsList.push(authenticator.data);
            }
        });

        const data: { authenticators: FederatedAuthenticatorInterface[], defaultAuthenticatorId: string } = {
            authenticators: authenticatorsList,
            defaultAuthenticatorId: identityProvider.federatedAuthenticators.defaultAuthenticatorId
        };

        updateFederatedAuthenticators(data, identityProvider.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "updateFederatedAuthenticators" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "updateFederatedAuthenticators" +
                        ".success.message")
                }));

                onUpdate(identityProvider.id);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider.notifications." +
                            "updateFederatedAuthenticators" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "updateFederatedAuthenticators" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "updateFederatedAuthenticators" +
                        ".genericError.message")
                }));
            });

        setDeletingAuthenticator(undefined);
        setShowDeleteConfirmationModal(false);
    };

    /**
     * Handles Authenticator delete button on click action.
     *
     * @param e - Click event.
     * @param id - Id of the authenticator.
     */
    const handleAuthenticatorDeleteOnClick = (e: MouseEvent<HTMLDivElement>, id: string): void => {
        if (!id) {
            return;
        }

        if (id == identityProvider.federatedAuthenticators.defaultAuthenticatorId) {
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider" +
                    ".notifications.deleteDefaultAuthenticator" +
                    ".error.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.authenticationProvider.notifications." +
                    "deleteDefaultAuthenticator" +
                    ".error.message")
            }));

            return;
        }

        const deletingAuthenticator: FederatedAuthenticatorWithMetaInterface = availableAuthenticators
            .find((authenticator: FederatedAuthenticatorWithMetaInterface) => authenticator.id === id);

        if (!deletingAuthenticator) {
            return;
        }

        setDeletingAuthenticator(deletingAuthenticator.data);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Filters the templates that are given to the Authenticator create wizard.
     * If the template is already used, we need to remove that from the list of options.
     */
    const filterTemplates = (): void => {

        // Filter out already added authenticators and templates with federated authenticators.
        const availableAuthenticatorIDs: string[] = availableAuthenticators?.map(
            (a: FederatedAuthenticatorWithMetaInterface) => {
                return a.id;
            }
        );

        const filteredTemplates: ConnectionTemplateItemInterface[] = identityProviderTemplates?.filter(
            (template: ConnectionTemplateItemInterface) =>
                (template?.idp?.federatedAuthenticators?.defaultAuthenticatorId &&
                    !availableAuthenticatorIDs?.includes(
                        template?.idp?.federatedAuthenticators?.defaultAuthenticatorId))
        );

        // sort templateList based on display Order
        filteredTemplates?.sort(
            (
                a: ConnectionTemplateItemInterface,
                b: ConnectionTemplateItemInterface
            ) => (a?.displayOrder > b?.displayOrder) ? 1 : -1);

        const flattenedConnectorMetadata: ({ [ key: string ]: FederatedAuthenticatorMetaDataInterface }) = keyBy(
            getConnectorMetadata(), "authenticatorId"
        );
        let moderatedManualModeOptions: FederatedAuthenticatorMetaDataInterface[] = cloneDeep(
            availableFederatedAuthenticators as FederatedAuthenticatorMetaDataInterface[]
        );

        moderatedManualModeOptions = moderatedManualModeOptions?.map(
            (option: FederatedAuthenticatorMetaDataInterface) => {
                return {
                    ...option,
                    ...flattenedConnectorMetadata[ option?.authenticatorId ]
                };
            }
        );

        moderatedManualModeOptions = moderatedManualModeOptions?.filter((a: FederatedAuthenticatorMetaDataInterface) =>
            !availableAuthenticatorIDs.includes(a?.authenticatorId) &&
            a?.authenticatorId !== ConnectionManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID);

        setAvailableManualModeOptions(moderatedManualModeOptions);
        setAvailableTemplates(filteredTemplates);
    };

    /**
     * A predicate that checks whether a give federated authenticator
     * is a default authenticator.
     *
     * @param auth -  Authenticator.
     * @returns true if `auth.data.isDefault` is truthy
     */
    const isDefaultAuthenticatorPredicate = (
        auth: FederatedAuthenticatorWithMetaInterface
    ): boolean => {
        return auth.data?.isDefault;
    };

    /**
     * A helper function that generates {@link SegmentedAccordionTitleActionInterface}
     * accordion actions foreach `availableAuthenticators` when rendering a
     * {@link AuthenticatorAccordion}
     *
     * @see AuthenticatorAccordionItemInterface.actions
     * @param authenticator - Authenticator.
     * @returns SegmentedAccordionTitleActionInterface
     */
    const createAccordionActions = (
        authenticator: FederatedAuthenticatorWithMetaInterface
    ): SegmentedAccordionTitleActionInterface[] => {
        const isDefaultAuthenticator: boolean = isDefaultAuthenticatorPredicate(authenticator);

        return [
            // Checkbox which triggers the default state of authenticator.
            {
                defaultChecked: isDefaultAuthenticator,
                disabled: authenticator.data?.isDefault || !authenticator.data?.isEnabled,
                label: t(isDefaultAuthenticator ?
                    "console:develop.features.authenticationProvider.forms.authenticatorAccordion.default.0" :
                    "console:develop.features.authenticationProvider.forms.authenticatorAccordion.default.1"
                ),
                onChange: handleDefaultAuthenticatorChange,
                type: "checkbox"
            },
            // Toggle Switch which enables/disables the authenticator state.
            {
                defaultChecked: authenticator.data?.isEnabled,
                disabled: isDefaultAuthenticator,
                label: t(authenticator.data?.isEnabled ?
                    "console:develop.features.authenticationProvider.forms.authenticatorAccordion.enable.0" :
                    "console:develop.features.authenticationProvider.forms.authenticatorAccordion.enable.1"
                ),
                onChange: handleAuthenticatorEnableToggle,
                type: "toggle"
            }
        ];
    };

    /**
     * Removes the element identified by the given key, from the properties array.
     */
    const removeElementFromProps = (properties: CommonPluggableComponentPropertyInterface[], key: string) => {
        const elementToRemove: CommonPluggableComponentPropertyInterface = properties.find(
            (p: CommonPluggableComponentPropertyInterface) => {
                return p.key === key;
            }
        );
        const dataIndex: number = properties.indexOf(elementToRemove);

        if (dataIndex >= 0) {
            properties.splice(dataIndex, 1);
        }
    };

    /**
     * Handles accordion title click.
     *
     * @param e - Click event.
     * @param SegmentedAuthenticatedAccordion - Clicked title.
     */
    const handleAccordionOnClick = (e: MouseEvent<HTMLDivElement>,
        SegmentedAuthenticatedAccordion: AccordionTitleProps): void => {
        if (!SegmentedAuthenticatedAccordion) {
            return;
        }
        const newIndexes: number[] = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(SegmentedAuthenticatedAccordion.accordionIndex)) {
            const removingIndex: number = newIndexes.indexOf(SegmentedAuthenticatedAccordion.accordionIndex);

            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(SegmentedAuthenticatedAccordion.accordionIndex);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    /**
     * Shows the authenticator list.
     *
     * @returns Functional component.
     */
    const showAuthenticatorList = (): ReactElement => {

        const resolveAuthenticatorIcon = (authenticator: FederatedAuthenticatorWithMetaInterface) => {
            const found: FederatedAuthenticatorMetaDataInterface = getConnectorMetadata()
                .find((fedAuth: FederatedAuthenticatorMetaDataInterface) => {
                    if (fedAuth?.authenticatorId === authenticator?.id) {
                        return fedAuth;
                    }

                    return null;
                });

            if (!found?.icon) {
                return getConnectionIcons().default;
            }

            return found.icon;
        };

        const resolveAuthenticatorDisplayName = (authenticator: FederatedAuthenticatorWithMetaInterface) => {
            const found: FederatedAuthenticatorMetaDataInterface = getConnectorMetadata()
                .find((fedAuth: FederatedAuthenticatorMetaDataInterface) => {
                    if (fedAuth?.authenticatorId === authenticator?.id) {
                        return fedAuth;
                    }

                    return null;
                });

            if (!found?.displayName) {
                return authenticator.meta?.displayName || authenticator?.data?.name || authenticator.id;
            }

            return found.displayName;
        };

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 } textAlign="right">
                        <PrimaryButton
                            onClick={ handleAddAuthenticator }
                            disabled={
                                ConnectionManagementConstants.SHOW_PREDEFINED_TEMPLATES_IN_EXPERT_MODE_SETUP
                                    ? isEmpty(availableTemplates) && isEmpty(availableManualModeOptions)
                                    : isEmpty(availableManualModeOptions)
                            }
                            loading={ isIdPTemplateFetchRequestLoading }
                            data-testid={ `${ testId }-add-authenticator-button` }
                        >
                            <Icon name="add"/>
                            { t("console:develop.features.authenticationProvider.buttons.addAuthenticator") }
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            availableAuthenticators.map(
                                (authenticator: FederatedAuthenticatorWithMetaInterface, index: number) => {
                                    return (
                                        <AuthenticatorAccordion
                                            key={ index }
                                            globalActions={ [
                                                {
                                                    disabled: isDefaultAuthenticatorPredicate(authenticator),
                                                    icon: "trash alternate",
                                                    onClick: handleAuthenticatorDeleteOnClick,
                                                    popoverText: "Remove Authenticator",
                                                    type: "icon"
                                                }
                                            ] }
                                            authenticators={
                                                [
                                                    {
                                                        actions: createAccordionActions(authenticator),
                                                        content: authenticator && (
                                                            <AuthenticatorFormFactory
                                                                connectionSettingsMetaData={
                                                                    connectionSettingsMetaData
                                                                }
                                                                mode={ AuthenticatorSettingsFormModes.CREATE }
                                                                authenticator={ authenticator }
                                                                metadata={ authenticator.meta }
                                                                showCustomProperties={
                                                                    authenticator.id !== ConnectionManagementConstants
                                                                        .GITHUB_AUTHENTICATOR_ID
                                                                }
                                                                initialValues={ authenticator.data }
                                                                onSubmit={ handleAuthenticatorConfigFormSubmit }
                                                                type={ authenticator.id }
                                                                data-testid={
                                                                    `${ testId }-${ authenticator.meta?.name }-content`
                                                                }
                                                                isReadOnly={ isReadOnly }
                                                                isSubmitting={ isSubmitting }
                                                                templateId={ identityProvider.templateId }
                                                            />
                                                        ),
                                                        hideChevron: isEmpty(authenticator.meta?.properties),
                                                        icon: {
                                                            icon: resolveAuthenticatorIcon(authenticator)
                                                        },
                                                        id: authenticator?.id,
                                                        title: resolveAuthenticatorDisplayName(authenticator)
                                                    }
                                                ]
                                            }
                                            accordionActiveIndexes={ accordionActiveIndexes }
                                            accordionIndex={ index }
                                            handleAccordionOnClick={ handleAccordionOnClick }
                                            data-testid={ `${ testId }-accordion` }
                                        />
                                    );
                                }
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    /**
     * Handles the Add authenticator button clicks.
     */
    const handleAddAuthenticator = (): void => {

        filterTemplates();
        setShowAddAuthenticatorWizard(true);
    };

    /**
     * Shows the Authenticator settings.
     */
    const showAuthenticator = (): ReactElement => {
        if (availableAuthenticators.length > 0) {
            // Only show the Authenticator listing if `expertMode` is enabled.
            if (isActiveTemplateExpertMode) {
                return showAuthenticatorList();
            }

            const authenticator: FederatedAuthenticatorWithMetaInterface =
                availableAuthenticators.find((authenticator: FederatedAuthenticatorWithMetaInterface) => (
                    identityProvider.federatedAuthenticators.defaultAuthenticatorId === authenticator.id
                ));

            if (!authenticator) {
                return;
            }

            // TODO: Need to update below values in the OIDC authenticator metadata API
            // Set additional meta data if the authenticator is OIDC
            if (authenticator.id === ConnectionManagementConstants.OIDC_AUTHENTICATOR_ID) {
                authenticator.meta.properties.map((prop: CommonPluggableComponentMetaPropertyInterface) => {
                    if (prop.key === "ClientId") {
                        prop.displayName = "Client ID";
                        prop.description = "The client identifier value of the identity provider.";
                        prop.maxLength = OIDC_CLIENT_ID_SECRET_MAX_LENGTH;
                    } else if (prop.key === "ClientSecret") {
                        prop.displayName = "Client secret";
                        prop.description = "The client secret value of the identity provider.";
                        prop.maxLength = OIDC_CLIENT_ID_SECRET_MAX_LENGTH;
                    } else if (prop.key === "callbackUrl") {
                        prop.displayName = "Authorized redirect URL";
                        prop.description = `The ${ config.ui.productName } URL to which the user needs to be redirected
                            after completing the authentication at the identity provider. The
                            identity provider needs to send the authorization code to this URL upon
                            successful authentication.`;
                        prop.readOnly = true;
                    } else if (prop.key === "OAuth2AuthzEPUrl") {
                        prop.displayName = "Authorization endpoint URL";
                        prop.description = "The standard authorization endpoint URL obtained from " +
                            "the identity provider.";
                        prop.maxLength = URL_MAX_LENGTH;
                    } else if (prop.key === "OAuth2TokenEPUrl") {
                        prop.displayName = "Token endpoint URL";
                        prop.description = "The standard token endpoint URL obtained from " +
                            "the identity provider.";
                        prop.maxLength = URL_MAX_LENGTH;
                    } else if (prop.key === "UserInfoUrl") {
                        prop.displayName = "User info endpoint URL";
                        prop.description = "The URL corresponding to the userinfo endpoint.";
                        prop.maxLength = URL_MAX_LENGTH;
                    } else if (prop.key === "commonAuthQueryParams") {
                        prop.displayName = "Additional query parameters";
                        prop.description = "These  will be sent to the identity provider as query parameters in the " +
                            "authentication request. \nE.g., loginHint=hint1";
                    } else if (prop.key === "IsBasicAuthEnabled") {
                        prop.displayName = "Enable HTTP basic authentication for client authentication";
                        prop.description = "Specify whether to enable HTTP basic authentication. Unless, client " +
                            "credentials will be sent in the request body";
                    }
                });

                //Temporarily removed until sub attributes are available
                removeElementFromProps(authenticator.meta.properties, "IsUserIdInClaims" );

                if (!authenticator.meta.properties?.find(
                    (prop: CommonPluggableComponentMetaPropertyInterface) => prop.key === "OIDCLogoutEPUrl")) {

                    const logoutUrlData: CommonPluggableComponentPropertyInterface = {
                        key: "OIDCLogoutEPUrl"
                    };

                    authenticator.data.properties.push(logoutUrlData);

                    const logoutUrlMeta: CommonPluggableComponentMetaPropertyInterface = {
                        description: `The URL of the identity provider to which
                         ${ config.ui.productName } will send session
                            invalidation requests.`,
                        displayName: "Logout URL",
                        displayOrder: 7,
                        isConfidential: false,
                        isMandatory: false,
                        key: "OIDCLogoutEPUrl",
                        options: [],
                        subProperties: [],
                        type: "URL"
                    };

                    authenticator.meta.properties.push(logoutUrlMeta);
                }
            }

            return (
                <AuthenticatorFormFactory
                    connectionSettingsMetaData={ connectionSettingsMetaData }
                    mode={ AuthenticatorSettingsFormModes.EDIT }
                    authenticator={ authenticator }
                    metadata={ authenticator.meta }
                    showCustomProperties={
                        authenticator.id !== ConnectionManagementConstants.GITHUB_AUTHENTICATOR_ID
                    }
                    initialValues={ authenticator.data }
                    onSubmit={ handleAuthenticatorConfigFormSubmit }
                    type={ authenticator.meta?.authenticatorId }
                    data-testid={ `${ testId }-${ authenticator.meta?.name }-content` }
                    isReadOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                    templateId={ identityProvider.templateId }
                />
            );
        } else {
            return (
                <EmptyPlaceholder
                    action={ (
                        <Show when={ AccessControlConstants.IDP_EDIT }>
                            <PrimaryButton
                                onClick={ handleAddAuthenticator }
                                loading={ isIdPTemplateFetchRequestLoading }
                                data-testid={ `${ testId }-add-authenticator-button` }
                            >
                                <Icon name="add" />
                                { t("console:develop.features.authenticationProvider.buttons.addAuthenticator") }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:develop.features.authenticationProvider.placeHolders." +
                        "emptyAuthenticatorList.title") }
                    subtitle={ [
                        t("console:develop.features.authenticationProvider.placeHolders." +
                            "emptyAuthenticatorList.subtitles.0"),
                        t("console:develop.features.authenticationProvider.placeHolders." +
                            "emptyAuthenticatorList.subtitles.1"),
                        t("console:develop.features.authenticationProvider.placeHolders." +
                            "emptyAuthenticatorList.subtitles.2")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }
    };

    /**
     * This method will find whether the current identity provider
     * contains a default authenticator or not.
     *
     * @returns Whether the identity provider contains a default authenticator.
     */
    const checkDefaultAuthenticatorAvailable = (): boolean => {
        return !!identityProvider?.federatedAuthenticators?.defaultAuthenticatorId;
    };

    if (isLoading || isFederatedAuthenticatorFetchRequestLoading) {
        return <Loader />;
    }

    return (
        <div className="authentication-section">
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <EmphasizedSegment padded="very">
                            { showAuthenticator() }
                        </EmphasizedSegment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                deletingAuthenticator && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingAuthenticator?.name }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={ "console:develop.features.authenticationProvider." +
                                        "confirmations.deleteAuthenticator.assertionHint" }
                                    tOptions={ { name: deletingAuthenticator?.name } }
                                >
                                    Please type <strong>{ deletingAuthenticator?.name }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={
                            (): void => handleAuthenticatorDelete(deletingAuthenticator.authenticatorId)
                        }
                        data-testid={ `${ testId }-authenticator-delete-confirmation` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                            { t("console:develop.features.authenticationProvider.confirmations." +
                                "deleteAuthenticator.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                            { t("console:develop.features.authenticationProvider.confirmations." +
                                "deleteAuthenticator.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                            { t("console:develop.features.authenticationProvider.confirmations." +
                                "deleteAuthenticator.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showAddAuthenticatorWizard && (
                    <AuthenticatorCreateWizard
                        title={ t("console:develop.features.authenticationProvider.modals." +
                            "addAuthenticator.title") }
                        subTitle={
                            t("console:develop.features.authenticationProvider.modals." +
                            "addAuthenticator.subTitle", { idpName: identityProvider.name })
                        }
                        closeWizard={ () => {
                            setShowAddAuthenticatorWizard(false);
                            setAvailableAuthenticators([]);
                            onUpdate(identityProvider.id);
                        } }
                        manualModeOptions={ availableManualModeOptions }
                        availableTemplates={
                            // TODO: To show predefined templates in the Authenticator add wizard,
                            // The experience should be properly finalized.
                            // 1. Ex: If we show Predefined Facebook Template,
                            //    Should we show the Facebook OIDC Authenticator?
                            // 2. Once the Authenticator is added, there's no way of figuring out
                            //    if the Authenticator is predefined or not in the edit view.
                            ConnectionManagementConstants
                                .SHOW_PREDEFINED_TEMPLATES_IN_EXPERT_MODE_SETUP && availableTemplates
                        }
                        idpId={ identityProvider.id }
                        isDefaultAuthenticatorAvailable={ checkDefaultAuthenticatorAvailable() }
                        data-testid={ `${ testId }-authenticator-create-wizard` }
                    />
                )
            }
        </div>
    );
};

/**
 * Default proptypes for the IDP authenticator settings component.
 */
AuthenticatorSettings.defaultProps = {
    "data-testid": "idp-edit-authenticator-settings"
};
