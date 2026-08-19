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

import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { store } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { HttpMethods } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Wizard2, WizardPage } from "@wso2is/forms";
import {
    DocumentationLink,
    GenericIcon,
    Heading,
    Hint,
    Link,
    LinkButton,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Form, Grid as SemanticGrid } from "semantic-ui-react";
import CreateConnectionWizardHelp from "./create-wizard-help";
import { createConnection } from "../../api/connections";
import {
    ConnectionInterface,
    GenericConnectionCreateWizardPropsInterface
} from "../../models/connection";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";

interface PresentationDefinitionListItemInterface {
    id: string;
    name: string;
    description?: string;
}

interface PresentationDefinitionListInterface {
    totalResults?: number;
    presentationDefinitions: PresentationDefinitionListItemInterface[];
}

interface DigitalWalletConnectionCreateWizardPropsInterface extends
    GenericConnectionCreateWizardPropsInterface, IdentifiableComponentInterface {
}

interface DigitalWalletWizardFormValuesInterface {
    name: string;
}

interface WizardRefInterface {
    gotoNextPage: () => void;
}

const I18N_PREFIX: string = "authenticationProvider:templates.digitalWallet";

export const DigitalWalletConnectionCreateWizard: FunctionComponent<
    DigitalWalletConnectionCreateWizardPropsInterface
> = (
    props: DigitalWalletConnectionCreateWizardPropsInterface
): ReactElement => {

    const {
        onWizardClose,
        onIDPCreate,
        title,
        subTitle,
        template,
        [ "data-componentid" ]: componentId = "digital-wallet"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();

    const [ selectedPresentationDefinitionId, setSelectedPresentationDefinitionId ] = useState<string>("");
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const wizardRef: MutableRefObject<WizardRefInterface> = useRef<WizardRefInterface>(null);
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const pdRequestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.vpTemplates
    };

    const {
        data: pdListData,
        isLoading: isPdListLoading
    }: RequestResultInterface<PresentationDefinitionListInterface, RequestErrorInterface> =
        useRequest<PresentationDefinitionListInterface, RequestErrorInterface>(pdRequestConfig);

    const pdOptions: DropdownItemProps[] = (pdListData?.presentationDefinitions ?? []).map(
        (pd: PresentationDefinitionListItemInterface): DropdownItemProps => ({
            description: pd.description,
            key: pd.id,
            text: pd.name,
            value: pd.id
        })
    );

    const initialValues: DigitalWalletWizardFormValuesInterface = {
        name: t(`${ I18N_PREFIX }.form.name.defaultValue`)
    };

    const navigateToPresentationDefinitions = (): void => {
        onWizardClose();
        history.push(AppConstants.getPaths().get("VP_DEFINITIONS"));
    };

    const resolveConnectionIcon = (): string => {
        return ConnectionsManagementUtils.resolveConnectionResourcePath("", template?.image);
    };

    const createConnectionFromValues = async (
        values: DigitalWalletWizardFormValuesInterface
    ): Promise<void> => {
        const connection: ConnectionInterface = cloneDeep(template.idp);

        connection.name = values.name;
        connection.description = template?.idp?.description || "";
        connection.templateId = template.templateId;

        connection.federatedAuthenticators.authenticators[ 0 ].properties = [
            { key: "presentationDefinitionId", value: selectedPresentationDefinitionId },
            { key: "responseMode", value: "direct_post.jwt" },
            { key: "timeout", value: "300" },
            { key: "clientIdScheme", value: "x509_san_dns" }
        ];

        if (!isEmpty(UIConfig?.connectionResourcesUrl)) {
            connection.image = UIConfig.connectionResourcesUrl + template.image;
        } else {
            connection.image = resolveConnectionIcon();
        }

        const response: AxiosResponse<ConnectionInterface> = await createConnection(connection);

        eventPublisher.publish("connections-finish-adding-connection", {
            type: componentId
        });

        dispatch(addAlert({
            description: t("authenticationProvider:notifications.addIDP.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("authenticationProvider:notifications.addIDP.success.message")
        }));

        if (!isEmpty(response.headers.location)) {
            const location: string = response.headers.location;
            const createdIdpID: string = location.substring(location.lastIndexOf("/") + 1);

            onIDPCreate(createdIdpID);

            return;
        }

        onIDPCreate();
    };

    const handleFormSubmit = async (values: DigitalWalletWizardFormValuesInterface): Promise<void> => {
        if (isEmpty(selectedPresentationDefinitionId)) {
            setAlert({
                description: t(`${ I18N_PREFIX }.notifications.noPresentationDefinition.description`),
                level: AlertLevels.ERROR,
                message: t(`${ I18N_PREFIX }.notifications.noPresentationDefinition.message`)
            });

            return;
        }

        setIsSubmitting(true);

        try {
            await createConnectionFromValues(values);
        } catch (error) {
            const axiosError: AxiosError<HttpErrorResponseDataInterface> =
                error as AxiosError<HttpErrorResponseDataInterface>;
            const responseData: HttpErrorResponseDataInterface | undefined = axiosError?.response?.data;

            setAlert({
                description: responseData?.description
                    ? t("authenticationProvider:notifications.addIDP.error.description", {
                        description: responseData.description
                    })
                    : t("authenticationProvider:notifications.addIDP.genericError.description"),
                level: AlertLevels.ERROR,
                message: responseData?.description
                    ? t("authenticationProvider:notifications.addIDP.error.message")
                    : t("authenticationProvider:notifications.addIDP.genericError.message")
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const singlePage = (): ReactElement => (
        <WizardPage
            validate={ (values: DigitalWalletWizardFormValuesInterface) => {
                const errors: Record<string, string> = {};
                const name: string = values.name ?? "";

                if (!name) {
                    errors.name = t(`${ I18N_PREFIX }.form.name.validations.required`);
                } else if (name.length > 50) {
                    errors.name = t(`${ I18N_PREFIX }.form.name.validations.maxLength`, { max: 50 });
                } else if (name.length < 3) {
                    errors.name = t(`${ I18N_PREFIX }.form.name.validations.minLength`, { min: 3 });
                }

                setNextShouldBeDisabled(!!errors.name || isEmpty(selectedPresentationDefinitionId));

                return errors;
            } }
        >
            <Field.Input
                ariaLabel="Connection name"
                name="name"
                label={ t(`${ I18N_PREFIX }.form.name.label`) }
                inputType="resource_name"
                required={ true }
                maxLength={ 50 }
                minLength={ 3 }
                width={ 15 }
                placeholder={ t(`${ I18N_PREFIX }.form.name.placeholder`) }
            />
            <Form.Field required>
                <label>{ t(`${ I18N_PREFIX }.form.presentationDefinition.label`) }</label>
                <Dropdown
                    placeholder={
                        isPdListLoading
                            ? t(`${ I18N_PREFIX }.form.presentationDefinition.loadingPlaceholder`)
                            : pdOptions.length === 0
                                ? t(`${ I18N_PREFIX }.form.presentationDefinition.emptyPlaceholder`)
                                : t(`${ I18N_PREFIX }.form.presentationDefinition.placeholder`)
                    }
                    fluid
                    selection
                    loading={ isPdListLoading }
                    options={ pdOptions }
                    value={ selectedPresentationDefinitionId }
                    disabled={ isPdListLoading || pdOptions.length === 0 }
                    onChange={ (_e: SyntheticEvent, data: DropdownProps): void => {
                        setSelectedPresentationDefinitionId(data.value as string);
                    } }
                    data-componentid={ `${ componentId }-presentation-definition-dropdown` }
                />
                { !isPdListLoading && pdOptions.length === 0
                    ? (
                        <Hint warning>
                            <Trans
                                i18nKey={ `${ I18N_PREFIX }.form.presentationDefinition.noneAvailableHint` }
                            >
                                { "No presentation definitions found. " }
                                <Link
                                    link="#"
                                    onClick={ navigateToPresentationDefinitions }
                                    external={ false }
                                    data-componentid={ `${ componentId }-create-pd-link` }
                                >
                                    Create one
                                </Link>
                                { " to proceed." }
                            </Trans>
                        </Hint>
                    )
                    : (
                        <Hint>
                            { t(`${ I18N_PREFIX }.form.presentationDefinition.hint`) }
                        </Hint>
                    )
                }
            </Form.Field>
        </WizardPage>
    );

    const renderHelpPanel = (): ReactElement => {
        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">{ t("common:help") }</div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <CreateConnectionWizardHelp
                        wizardHelp={{
                            fields: [
                                {
                                    fieldName: t(`${ I18N_PREFIX }.wizardHelp.name.heading`),
                                    hint: t(`${ I18N_PREFIX }.wizardHelp.name.hint`)
                                },
                                {
                                    fieldName: t(`${ I18N_PREFIX }.wizardHelp.presentationDefinition.heading`),
                                    hint: t(`${ I18N_PREFIX }.wizardHelp.presentationDefinition.hint`)
                                }
                            ],
                            message: {
                                header: t(`${ I18N_PREFIX }.wizardHelp.heading`),
                                paragraphs: [
                                    t(`${ I18N_PREFIX }.wizardHelp.message.paragraph1`),
                                    t(`${ I18N_PREFIX }.wizardHelp.message.paragraph2`)
                                ]
                            }
                        }}
                    />
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    return (
        <ModalWithSidePanel
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ onWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ `${ componentId }-modal` }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={ `${ componentId }-modal-header` }
                >
                    <div className="display-flex">
                        <GenericIcon
                            icon={ resolveConnectionIcon() }
                            size="mini"
                            transparent
                            spaced="right"
                            data-componentid={ `${ componentId }-image` }
                        />
                        <div className="ml-1">
                            { title }
                            { subTitle && (
                                <Heading as="h6">
                                    { subTitle }
                                    <DocumentationLink link={ template?.docLink }>
                                        { t("common:learnMore") }
                                    </DocumentationLink>
                                </Heading>
                            ) }
                        </div>
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content className="content-container">
                    { alert && alertComponent }
                    <Wizard2
                        ref={ wizardRef }
                        initialValues={ initialValues }
                        onSubmit={ handleFormSubmit }
                        uncontrolledForm={ true }
                    >
                        { singlePage() }
                    </Wizard2>
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <SemanticGrid>
                        <SemanticGrid.Row column={ 1 }>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ onWizardClose }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </SemanticGrid.Column>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    loading={ isSubmitting }
                                    disabled={ nextShouldBeDisabled || isSubmitting }
                                    floated="right"
                                    onClick={ () => wizardRef?.current?.gotoNextPage() }
                                >
                                    { t("common:create") }
                                </PrimaryButton>
                            </SemanticGrid.Column>
                        </SemanticGrid.Row>
                    </SemanticGrid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { renderHelpPanel() }
        </ModalWithSidePanel>
    );
};
