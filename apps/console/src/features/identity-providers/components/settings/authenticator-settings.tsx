/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    EmptyPlaceholder,
    PrimaryButton,
    SegmentedAccordionTitleActionInterface
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FormEvent, FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { CheckboxProps, Grid, Icon } from "semantic-ui-react";
import { AuthenticatorAccordion, getEmptyPlaceholderIllustrations } from "../../../core";
import {
    getFederatedAuthenticatorDetails,
    getFederatedAuthenticatorMeta,
    getIdentityProviderTemplate,
    getIdentityProviderTemplateList,
    updateFederatedAuthenticator,
    updateFederatedAuthenticators
} from "../../api";
import {
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaDataInterface,
    FederatedAuthenticatorWithMetaInterface,
    IdentityProviderInterface,
    IdentityProviderTemplateListItemInterface,
    IdentityProviderTemplateListItemResponseInterface,
    IdentityProviderTemplateListResponseInterface
} from "../../models";
import { AuthenticatorFormFactory } from "../forms";
import { getFederatedAuthenticators } from "../meta";
import {
    handleGetFederatedAuthenticatorMetadataAPICallError,
    handleGetIDPTemplateAPICallError,
    handleGetIDPTemplateListError
} from "../utils";
import { AuthenticatorCreateWizard } from "../wizards/authenticator-create-wizard";

/**
 * Proptypes for the identity providers settings component.
 */
interface IdentityProviderSettingsPropsInterface extends TestableComponentInterface {
    /**
     * Currently editing idp.
     */
    identityProvider: IdentityProviderInterface;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  Identity Provider and advance settings component.
 *
 * @param {IdentityProviderSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorSettings: FunctionComponent<IdentityProviderSettingsPropsInterface> = (
    props: IdentityProviderSettingsPropsInterface
): ReactElement => {

    const {
        identityProvider,
        isLoading,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [
        deletingAuthenticator,
        setDeletingAuthenticator
    ] = useState<FederatedAuthenticatorListItemInterface>(undefined);
    const [ availableAuthenticators, setAvailableAuthenticators ] =
        useState<FederatedAuthenticatorWithMetaInterface[]>([]);
    const [ availableTemplates, setAvailableTemplates ] =
        useState<IdentityProviderTemplateListItemInterface[]>(undefined);
    const [ availableManualModeOptions, setAvailableManualModeOptions ] =
        useState<FederatedAuthenticatorMetaDataInterface[]>(undefined);
    const [ showAddAuthenticatorWizard, setShowAddAuthenticatorWizard ] = useState<boolean>(false);
    const [ isTemplatesLoading, setIsTemplatesLoading ] = useState<boolean>(false);
    const [ isPageLoading, setIsPageLoading ] = useState<boolean>(true);

    /**
     * Handles the authenticator config form submit action.
     *
     * @param values - Form values.
     */
    const handleAuthenticatorConfigFormSubmit = (values: any): void => {
        setIsPageLoading(true);
        updateFederatedAuthenticator(identityProvider.id, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.updateFederatedAuthenticator." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.updateFederatedAuthenticator." + 
                        "success.message")
                }));
                onUpdate(identityProvider.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: t("console:develop.features.idp.notifications.updateFederatedAuthenticator." +
                            "error.description", { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.idp.notifications.updateFederatedAuthenticator." + 
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.updateFederatedAuthenticator." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idp.notifications.updateFederatedAuthenticator." +
                        "genericError.message")
                }));
            });
    };

    const handleGetFederatedAuthenticatorAPICallError = (error) => {
        if (error.response && error.response.data && error.response.data.description) {
            dispatch(addAlert({
                description: t("console:develop.features.idp.notifications.getFederatedAuthenticator.error.description",
                    { description: error.response.data.description }),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.idp.notifications.getFederatedAuthenticator.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.idp.notifications.getFederatedAuthenticator." + 
                "genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.idp.notifications.getFederatedAuthenticator.genericError.message")
        }));
    };

    /**
     * Fetch data and metadata of a given authenticatorId and return a promise.
     *
     * @param authenticatorId ID of the authenticator.
     */
    const fetchAuthenticator = (authenticatorId: string) => {
        return new Promise(resolve => {
            getFederatedAuthenticatorDetails(identityProvider.id, authenticatorId)
                .then(data => {
                    getFederatedAuthenticatorMeta(authenticatorId)
                        .then(meta => {
                            resolve({
                                data: data,
                                id: authenticatorId,
                                meta: meta
                            });
                        })
                        .catch(error => {
                            handleGetFederatedAuthenticatorMetadataAPICallError(error);
                        });
                })
                .catch(error => {
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
        if (_.isEmpty(identityProvider.federatedAuthenticators)) {
            return;
        }
        setIsPageLoading(true);
        setAvailableAuthenticators([]);
        fetchAuthenticators()
            .then((res) => {
                // Make default authenticator if not added.
                if (!identityProvider.federatedAuthenticators.defaultAuthenticatorId &&
                    identityProvider.federatedAuthenticators.authenticators.length > 0) {
                    const authenticator = res[0].data;
                    authenticator.isDefault = true;
                    handleAuthenticatorConfigFormSubmit(authenticator);
                }
                setAvailableAuthenticators(res);
                setIsPageLoading(false);
            });
    }, [identityProvider?.federatedAuthenticators]);

    /**
     * Handles default authenticator change event.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the authenticator.
     */
    const handleDefaultAuthenticatorChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string):
        void => {
        const authenticator = availableAuthenticators.find(authenticator => (authenticator.id === id)).data;
        authenticator.isDefault = data.checked;
        handleAuthenticatorConfigFormSubmit(authenticator);
    };

    /**
     * Handles authenticator enable toggle.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorEnableToggle = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string): void => {
        const authenticator = availableAuthenticators.find(authenticator => (authenticator.id === id)).data;
        // Validation
        if (authenticator.isDefault && !data.checked) {
            dispatch(addAlert({
                description: t("console:develop.features.idp.notifications.disableAuthenticator.error.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.idp.notifications.disableAuthenticator.error.message")
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
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorDelete = (id: string): void => {
        const authenticatorsList = [];
        const deletingAuthenticator = availableAuthenticators.find((authenticator) => authenticator.id === id);

        availableAuthenticators.map((authenticator) => {
            if (authenticator.id !== deletingAuthenticator.id) {
                authenticatorsList.push(authenticator.data);
            }
        });

        const data = {
            authenticators: authenticatorsList,
            defaultAuthenticatorId: identityProvider.federatedAuthenticators.defaultAuthenticatorId
        };

        updateFederatedAuthenticators(data, identityProvider.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.updateFederatedAuthenticators" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.updateFederatedAuthenticators" +
                        ".success.message")
                }));

                onUpdate(identityProvider.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.idp.notifications.updateFederatedAuthenticators" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.updateFederatedAuthenticators" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idp.notifications.updateFederatedAuthenticators" +
                        ".genericError.message")
                }));
            });

        setDeletingAuthenticator(undefined);
        setShowDeleteConfirmationModal(false);
    };

    /**
     * Handles Authenticator delete button on click action.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e - Click event.
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorDeleteOnClick = (e: MouseEvent<HTMLDivElement>, id: string): void => {
        if (!id) {
            return;
        }

        if (id == identityProvider.federatedAuthenticators.defaultAuthenticatorId) {
            dispatch(addAlert({
                description: t("console:develop.features.idp.notifications.deleteDefaultAuthenticator" +
                    ".error.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.idp.notifications.deleteDefaultAuthenticator" +
                    ".error.message")
            }));
            return;
        }

        const deletingAuthenticator = availableAuthenticators.find((authenticator) => authenticator.id === id);

        if (!deletingAuthenticator) {
            return;
        }

        setDeletingAuthenticator(deletingAuthenticator.data);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Handles add new authenticator action.
     */
    const handleAddAuthenticator = () => {
        setIsTemplatesLoading(true);
        setShowAddAuthenticatorWizard(false);

        // Get the list of available templates from the server
        getIdentityProviderTemplateList()
            .then((response: IdentityProviderTemplateListResponseInterface) => {
                if (!response?.totalResults) {
                    return;
                }
                // Load all templates
                fetchIDPTemplates(response?.templates)
                    .then((templates) => {

                        // Filter out already added authenticators and templates with federated authenticators.
                        const availableAuthenticatorIDs = availableAuthenticators.map((a) => {
                            return a.id;
                        });
                        const filteredTemplates = templates.filter((template) =>
                            (template.idp.federatedAuthenticators.defaultAuthenticatorId &&
                            !availableAuthenticatorIDs.includes(
                                template.idp.federatedAuthenticators.defaultAuthenticatorId))
                        );

                        // Set filtered manual mode options.
                        setAvailableManualModeOptions(getFederatedAuthenticators().filter(a =>
                            !availableAuthenticatorIDs.includes(a.authenticatorId)));

                        // sort templateList based on display Order
                        filteredTemplates.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);

                        setAvailableTemplates(filteredTemplates);
                        setShowAddAuthenticatorWizard(true);
                    });
            })
            .catch((error) => {
                handleGetIDPTemplateListError(error);
            })
            .finally(() => {
                setIsTemplatesLoading(false);
            });
    };

    /**
     * Asynchronous function to loop through IDP templates list and fetch templates.
     *
     * @param templatesList List of templates.
     */
    async function fetchIDPTemplates(templatesList: IdentityProviderTemplateListItemResponseInterface[]) {
        const templates: IdentityProviderTemplateListItemInterface[] = [];
        for (const template of templatesList) {
            templates.push(await fetchIDPTemplate(template.id));
        }
        return templates;
    }

    /**
     * Fetch IDP template corresponds to the given tempalte ID.
     *
     * @param templateId ID of the authenticator.
     */
    const fetchIDPTemplate = (templateId: string): Promise<IdentityProviderTemplateListItemInterface> => {
        return new Promise(resolve => {
            getIdentityProviderTemplate(templateId)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    handleGetIDPTemplateAPICallError(error);
                });
        });
    };

    const showEmptyPlaceholder = (): ReactElement => {
        return (
            <EmptyPlaceholder
                action={ (
                    <PrimaryButton onClick={ handleAddAuthenticator } loading={ isTemplatesLoading }
                                   data-testid={ `${ testId }-add-authenticator-button` }>
                        <Icon name="add"/>{ t("console:develop.features.idp.buttons.addAuthenticator") }
                    </PrimaryButton>
                ) }
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
                title={ t("console:develop.features.idp.placeHolders.emptyAuthenticatorList.title") }
                subtitle={ [
                    t("console:develop.features.idp.placeHolders.emptyAuthenticatorList.subtitles.0"),
                    t("console:develop.features.idp.placeHolders.emptyAuthenticatorList.subtitles.1"),
                    t("console:develop.features.idp.placeHolders.emptyAuthenticatorList.subtitles.2")
                ] }
                data-testid={ `${ testId }-empty-placeholder` }
            />
        );
    };

    /**
     * A predicate that checks whether a give federated authenticator
     * is a default authenticator.
     *
     * @param {FederatedAuthenticatorWithMetaInterface} auth - Authenticator.
     * @returns true if {@code auth.data.isDefault} is truthy
     */
    const isDefaultAuthenticatorPredicate = (
        auth: FederatedAuthenticatorWithMetaInterface
    ): boolean => {
        return auth.data?.isDefault;
    };

    /**
     * A helper function that generates {@link SegmentedAccordionTitleActionInterface}
     * accordion actions foreach {@code availableAuthenticators} when rendering a
     * {@link AuthenticatorAccordion}
     *
     * @see AuthenticatorAccordionItemInterface.actions
     * @param authenticator
     * @returns SegmentedAccordionTitleActionInterface
     */
    const createAccordionActions = (
        authenticator: FederatedAuthenticatorWithMetaInterface
    ): SegmentedAccordionTitleActionInterface[] => {
        const isDefaultAuthenticator = isDefaultAuthenticatorPredicate(authenticator);
        return [
            // Checkbox which triggers the default state of authenticator.
            {
                defaultChecked: isDefaultAuthenticator,
                disabled: authenticator.data?.isDefault || !authenticator.data?.isEnabled,
                label: t(isDefaultAuthenticator ?
                    "console:develop.features.idp.forms.authenticatorAccordion.default.0" :
                    "console:develop.features.idp.forms.authenticatorAccordion.default.1"
                ),
                onChange: handleDefaultAuthenticatorChange,
                type: "checkbox"
            },
            // Toggle Switch which enables/disables the authenticator state.
            {
                defaultChecked: authenticator.data?.isEnabled,
                label: t(authenticator.data?.isEnabled ?
                    "console:develop.features.idp.forms.authenticatorAccordion.enable.0" :
                    "console:develop.features.idp.forms.authenticatorAccordion.enable.1"
                ),
                disabled: isDefaultAuthenticator,
                onChange: handleAuthenticatorEnableToggle,
                type: "toggle"
            }
        ];
    };

    const showAuthenticatorList = (): ReactElement => {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 } textAlign="right">
                        <PrimaryButton onClick={ handleAddAuthenticator } loading={ isTemplatesLoading }
                                       data-testid={ `${ testId }-add-authenticator-button` }>
                            <Icon name="add"/>
                            { t("console:develop.features.idp.buttons.addAuthenticator") }
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            availableAuthenticators.map((authenticator, index) => {
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
                                                            metadata={ authenticator.meta }
                                                            initialValues={ authenticator.data }
                                                            onSubmit={ handleAuthenticatorConfigFormSubmit }
                                                            type={ authenticator.meta?.name }
                                                            data-testid={ `${ testId }-${ authenticator.meta?.name }
                                                            -content` }
                                                        />
                                                    ),
                                                    icon: {
                                                        icon: authenticator.id && (getFederatedAuthenticators().find(
                                                            (fedAuth) =>
                                                            (fedAuth.authenticatorId === authenticator.id)))?.icon
                                                    },
                                                    id: authenticator?.id,
                                                    title: authenticator.id && (getFederatedAuthenticators().find(
                                                        (fedAuth) =>
                                                        (fedAuth.authenticatorId === authenticator.id)))?.displayName
                                                }
                                            ]
                                        }
                                        data-testid={ `${ testId }-accordion` }
                                    />
                                );
                            })
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    return (
        (!isLoading && !isPageLoading)
            ? (
                <div className="authentication-section">
                    { availableAuthenticators.length > 0 ? showAuthenticatorList() : showEmptyPlaceholder() }

                    {
                        deletingAuthenticator && (
                            <ConfirmationModal
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="warning"
                                open={ showDeleteConfirmationModal }
                                assertion={ deletingAuthenticator?.name }
                                assertionHint={ (
                                    <p>
                                        <Trans
                                            i18nKey="console:develop.features.idp.confirmations.deleteAuthenticator.
                                            assertionHint"
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
                                    { t("console:develop.features.idp.confirmations.deleteAuthenticator.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached warning
                                    data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                                    { t("console:develop.features.idp.confirmations.deleteAuthenticator.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content
                                    data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                                    { t("console:develop.features.idp.confirmations.deleteAuthenticator.content") }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                    {
                         showAddAuthenticatorWizard && (
                             <AuthenticatorCreateWizard
                                 title={ t("console:develop.features.idp.modals.addAuthenticator.title") }
                                 subTitle={ t("console:develop.features.idp.modals.addAuthenticator.subTitle",
                                     { idpName: identityProvider.name }) }
                                 closeWizard={ () => {
                                     setShowAddAuthenticatorWizard(false);
                                     setAvailableAuthenticators([]);
                                     onUpdate(identityProvider.id);
                                 } }
                                 manualModeOptions={ availableManualModeOptions }
                                 availableTemplates={ availableTemplates }
                                 idpId={ identityProvider.id }
                                 data-testid={ `${ testId }-authenticator-create-wizard` }
                             />
                         )
                    }
                </div>
            )
            : <ContentLoader/>
    );
};

/**
 * Default proptypes for the IDP authenticator settings component.
 */
AuthenticatorSettings.defaultProps = {
    "data-testid": "idp-edit-authenticator-settings"
};
