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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { store } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { HttpMethods } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Wizard2, WizardPage, composeValidators } from "@wso2is/forms";
import {
    DocumentationLink,
    GenericIcon,
    Heading,
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
import { useTranslation } from "react-i18next";
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

interface DigitalCredentialsConnectionCreateWizardPropsInterface extends
    GenericConnectionCreateWizardPropsInterface, IdentifiableComponentInterface {
}

interface DigitalCredentialWizardFormValuesInterface {
    name: string;
}

interface WizardRefInterface {
    gotoNextPage: () => void;
}

export const DigitalCredentialsConnectionCreateWizard: FunctionComponent<
    DigitalCredentialsConnectionCreateWizardPropsInterface
> = (
    props: DigitalCredentialsConnectionCreateWizardPropsInterface
): ReactElement => {

    const {
        onWizardClose,
        onIDPCreate,
        title,
        subTitle,
        template,
        [ "data-componentid" ]: componentId = "digital-credentials"
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

    const initialValues: DigitalCredentialWizardFormValuesInterface = {
        name: "Digital Credentials"
    };

    const resolveConnectionIcon = (): string => {
        return ConnectionsManagementUtils.resolveConnectionResourcePath("", template?.image);
    };

    const createConnectionFromValues = async (
        values: DigitalCredentialWizardFormValuesInterface
    ): Promise<void> => {
        const connection: ConnectionInterface = cloneDeep(template.idp);

        connection.name = values.name;
        connection.description = "";
        connection.templateId = template.templateId;

        connection.federatedAuthenticators.authenticators[ 0 ].properties = [
            { key: "presentationDefinitionId", value: selectedPresentationDefinitionId },
            { key: "responseMode", value: "direct_post.jwt" },
            { key: "timeout", value: "300" },
            { key: "clientIdScheme", value: "x509_san_dns" },
            { key: "clientId", value: "" },
            { key: "registrationCert", value: "" }
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

    const handleFormSubmit = async (values: DigitalCredentialWizardFormValuesInterface): Promise<void> => {
        if (isEmpty(selectedPresentationDefinitionId)) {
            setAlert({
                description: "Please select a presentation definition before creating the connection.",
                level: AlertLevels.ERROR,
                message: "Presentation definition required"
            });

            return;
        }

        setIsSubmitting(true);

        try {
            await createConnectionFromValues(values);
        } catch (error) {
            const axiosError: AxiosError = error as AxiosError;
            const responseData: any = axiosError?.response?.data;

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
            validate={ (values: DigitalCredentialWizardFormValuesInterface) => {
                const errors: Record<string, string> = {};

                errors.name = composeValidators(required, length({ max: 50, min: 3 }))(values.name);

                setNextShouldBeDisabled(
                    ifFieldsHave(errors) || isEmpty(selectedPresentationDefinitionId)
                );

                return errors;
            } }
        >
            <Field.Input
                ariaLabel="Connection name"
                name="name"
                label="Name"
                inputType="resource_name"
                required={ true }
                maxLength={ 50 }
                minLength={ 3 }
                width={ 15 }
                placeholder="My Digital Credentials Connection"
            />
            <Form.Field required>
                <label>Presentation Definition</label>
                <Dropdown
                    placeholder={
                        isPdListLoading
                            ? "Loading presentation definitions..."
                            : pdOptions.length === 0
                                ? "No presentation definitions found — create one under Credential Types first"
                                : "Select a presentation definition"
                    }
                    fluid
                    selection
                    loading={ isPdListLoading }
                    options={ pdOptions }
                    value={ selectedPresentationDefinitionId }
                    disabled={ isPdListLoading }
                    onChange={ (_e: SyntheticEvent, data: DropdownProps): void => {
                        setSelectedPresentationDefinitionId(data.value as string);
                        setNextShouldBeDisabled(isEmpty(data.value as string));
                    } }
                />
                <p style={ { color: "#767676", fontSize: "0.9em", marginTop: "0.4em" } }>
                    Select an existing presentation definition. You can create and manage them
                    under <strong>Credential Types</strong> in the sidebar.
                </p>
            </Form.Field>
        </WizardPage>
    );

    const renderHelpPanel = (): ReactElement => {
        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        Help
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <CreateConnectionWizardHelp
                        wizardHelp={ {
                            fields: [
                                {
                                    fieldName: "Name",
                                    hint: "Provide a unique name for the connection."
                                },
                                {
                                    fieldName: "Presentation Definition",
                                    hint: "Select an existing presentation definition that specifies " +
                                        "which credentials and claims to request from the user's wallet. " +
                                        "You can create presentation definitions under Credential Types."
                                }
                            ],
                            message: {
                                header: "About Digital Credentials Connections",
                                paragraphs: [
                                    "A Digital Credentials connection allows users to authenticate " +
                                        "by presenting a verifiable credential from their wallet app.",
                                    "The selected presentation definition controls what credentials " +
                                        "and claims are requested during authentication."
                                ]
                            }
                        } }
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

const ifFieldsHave = (errors: Record<string, string>): boolean => {
    return !Object.keys(errors).every((key: string) => !errors[ key ]);
};

const required = (value: string): string => {
    if (!value) {
        return "This is a required field";
    }

    return undefined;
};

const length = (minMax: { min: number; max: number }) => (value: string): string => {
    if (!value && minMax.min > 0) {
        return "You cannot leave this blank";
    }

    if (value?.length > minMax.max) {
        return `Cannot exceed more than ${ minMax.max } characters.`;
    }

    if (value?.length < minMax.min) {
        return `Should have at least ${ minMax.min } characters.`;
    }

    return undefined;
};
