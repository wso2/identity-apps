/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    Heading,
    Hint,
    InfoCard,
    LinkButton,
    PrimaryButton
} from "@wso2is/react-components";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    DropdownItemProps,
    DropdownProps,
    Form,
    Grid,
    Icon,
    Input,
    Modal,
    ModalProps
} from "semantic-ui-react";
import { Authenticators } from "./authenticators";
import { AppConstants, history } from "../../../../../core";
import { GenericAuthenticatorInterface } from "../../../../../identity-providers";
import { getGeneralIcons } from "../../../../configs";

/**
 * Proptypes for the Add authenticator modal component.
 */
interface AddAuthenticatorModalPropsInterface extends TestableComponentInterface, ModalProps {
    /**
     * Allow social login addition.
     */
    allowSocialLoginAddition: boolean;
    /**
     * Set of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Callback for modal submit.
     */
    onModalSubmit: (authenticators: any, stepToAdd: number) => void;
    /**
     * Optional message component.
     */
    message?: ReactNode;
    /**
     * Should show step selector.
     */
    showStepSelector: boolean;
    /**
     * Currently available step count.
     */
    stepCount: number;
}

/**
 * Authenticator side panel component.
 *
 * @param {AddAuthenticatorModalPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const AddAuthenticatorModal: FunctionComponent<AddAuthenticatorModalPropsInterface> = (
    props: AddAuthenticatorModalPropsInterface
): ReactElement => {

    const {
        allowSocialLoginAddition,
        authenticators,
        className,
        header,
        onClose,
        open,
        onModalSubmit,
        message,
        showStepSelector,
        stepCount,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(open);
    const [
        addSocialLoginRedirectionConfirmationModal,
        setAddSocialLoginRedirectionConfirmationModal
    ] = useState<boolean>(false);
    const [
        selectedAuthenticators,
        setSelectedAuthenticators
    ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(stepCount);

    const classes = classNames(
        "add-authenticator-modal",
        className
    );

    /**
     * Handles the addition of new social login.
     */
    const handleSocialLoginAdd = (): void => {
        setIsModalOpen(false);
        setAddSocialLoginRedirectionConfirmationModal(true);
    };

    const closeAddSocialLoginConfirmation = (): void => {
        setIsModalOpen(true);
        setAddSocialLoginRedirectionConfirmationModal(false);
    };

    /**
     * Shows the aAdd social login confirmation modal
     * @return {ReactElement}
     */
    const renderAddSocialLoginRedirectionConfirmationModal = (): ReactElement => (
        <ConfirmationModal
            onClose={ closeAddSocialLoginConfirmation }
            type="warning"
            open={ addSocialLoginRedirectionConfirmationModal }
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ closeAddSocialLoginConfirmation }
            onPrimaryActionClick={ (): void => {
                history.push(AppConstants.getPaths().get("IDP_TEMPLATES"));
            } }
            data-testid={ `${ testId }-add-social-login-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                { t("console:develop.features.applications.confirmations.addSocialLogin.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("console:develop.features.applications.confirmations.addSocialLogin.subHeader") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
                { t("console:develop.features.applications.confirmations.addSocialLogin.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Generates the options for the step selector dropdown.
     *
     * @return {DropdownItemProps[]}
     */
    const generateStepSelectorOptions = (): DropdownItemProps[] => {

        const options: DropdownItemProps[] = [];

        for (let i = 0; i < stepCount; i++) {
            options.push({
                key: i,
                text: `${ t("common:step") } ${ i + 1 }`,
                value: i + 1
            });
        }

        return options;
    };

    /**
     * Handles the authenticator add step onchange event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - Change Event.
     * @param data - Dropdown data.
     */
    const handleAddStepChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;
        setAuthenticatorAddStep(value as number);
    };

    /**
     * Handles modal submit.
     */
    const handleModalSubmit = (): void => {

        onModalSubmit(selectedAuthenticators, authenticatorAddStep);
    };

    return (
        <>
            <Modal
                className={ classes }
                data-testid={ testId }
                open={ isModalOpen }
                { ...rest }
            >
                <Modal.Header>{ header }</Modal.Header>
                { showStepSelector && (
                    <Modal.Content className="step-selection-dropdown-container">
                        <>
                            <Heading as="h5">
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content." +
                                        "stepSelectDropdown.label")
                                }
                            </Heading>
                            <Hint>
                                {
                                    t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content." +
                                        "stepSelectDropdown.hint")
                                }
                            </Hint>
                            <Form>
                                <Form.Field inline>
                                    <Form.Select
                                        scrolling
                                        placeholder={
                                            t("console:develop.features.applications.edit.sections.signOnMethod." +
                                                "sections.authenticationFlow.sections.stepBased." +
                                                "addAuthenticatorModal.content.stepSelectDropdown.placeholder")
                                        }
                                        options={ generateStepSelectorOptions() }
                                        onChange={ handleAddStepChange }
                                        value={ authenticatorAddStep }
                                        data-testid={ `${ testId }-step-select` }
                                    />
                                </Form.Field>
                            </Form>
                        </>
                    </Modal.Content>
                ) }
                <Modal.Content scrolling>
                    { message }
                    {
                        authenticators
                        && authenticators instanceof Array
                        && authenticators.length > 0 && (
                            <Card.Group
                                itemsPerRow={ 3 }
                                className="authenticator-container"
                            >
                                <Authenticators
                                    authenticators={ authenticators }
                                    emptyPlaceholder={ (
                                        <EmptyPlaceholder
                                            subtitle={
                                                [
                                                    t("console:develop.features" +
                                                        ".applications.placehold" +
                                                        "ers.emptyAuthenticators" +
                                                        "List.subtitles")
                                                ]
                                            }
                                        />
                                    ) }
                                    onAuthenticatorSelect={ (authenticators) => {
                                        setSelectedAuthenticators(authenticators);
                                    } }
                                    data-testid={ `${ testId }-authenticators` }
                                />
                                {
                                    allowSocialLoginAddition && (
                                        <InfoCard
                                            header={ t("common:add") }
                                            subHeader=""
                                            description="Add a custom Authenticator"
                                            image={ getGeneralIcons()?.addCircleOutline }
                                        />
                                    )
                                }
                            </Card.Group>
                        )
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    floated="left"
                                    onClick={ (e: MouseEvent<HTMLButtonElement>) => onClose(e, null) }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    floated="right"
                                    onClick={ handleModalSubmit }
                                    disabled={ isEmpty(selectedAuthenticators) }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("common:add") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
            { addSocialLoginRedirectionConfirmationModal && renderAddSocialLoginRedirectionConfirmationModal() }
        </>
    );
};

/**
 * Add Authenticator Modal component default props.
 */
AddAuthenticatorModal.defaultProps = {
    "data-testid": "add-authenticator-modal",
    size: "small"
};
