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
    Heading, Hint,
    LinkButton,
    PrimaryButton
} from "@wso2is/react-components";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import {
    Divider,
    DropdownItemProps,
    DropdownProps,
    Form,
    Grid,
    Modal,
    ModalProps
} from "semantic-ui-react";
import { Authenticators } from "./authenticators";
import { AppConstants, history } from "../../../../../core";
import { GenericAuthenticatorInterface } from "../../../../../identity-providers";
import { ApplicationManagementConstants } from "../../../../constants";

/**
 * Proptypes for the Add authenticator modal component.
 */
interface AddAuthenticatorModalPropsInterface extends TestableComponentInterface, ModalProps {
    /**
     * Set of authenticator groups.
     */
    authenticatorGroups: AuthenticatorGroupInterface[];
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

export interface AuthenticatorGroupInterface {
    /**
     * Group category.
     */
    category: string;
    /**
     * Group description.
     */
    description?: string;
    /**
     * Heading for the group.
     */
    heading?: string;
    /**
     * Set of authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
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
        authenticatorGroups,
        className,
        header,
        onClose,
        onModalSubmit,
        message,
        showStepSelector,
        stepCount,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const [ AddSocialLoginConfirm, setAddSocialLoginConfirm ] = useState(false);
    const [
        selectedAuthenticators,
        setSelectedAuthenticators
    ] = useState<{ [ key: string ]: GenericAuthenticatorInterface[] }>(null);
    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(stepCount);

    const classes = classNames(
        "add-authenticator-modal",
        className
    );

    /**
     * Handles the addition of new social login.
     */
    const handleSocialLoginAdd = (): void => {
        setAddSocialLoginConfirm(true);
    };

    const closeAddSocialLoginConfirmation = (): void => {
        setAddSocialLoginConfirm(false);
    };

    /**
     * Shows the aAdd social login confirmation modal
     * @return {ReactElement}
     */
    const showAddSocialLoginConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ closeAddSocialLoginConfirmation }
            type="warning"
            open={ AddSocialLoginConfirm }
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
     * Render authenticator group.
     *
     * @param {AuthenticatorGroupInterface} authenticatorGroup - Authenticator group.
     * @param {number} index - Index.
     * @return {React.ReactElement}
     */
    const renderAuthenticatorGroup = (authenticatorGroup: AuthenticatorGroupInterface, index: number): ReactElement => (

        <Fragment key={ index }>
            {
                authenticatorGroup.heading && (
                    <>
                        <Heading
                            as="h6"
                            className={
                                (index > 0 && authenticatorGroup.description !== undefined) ? "mb-2 mt-3" : "mb-2"
                            }
                        >
                            { authenticatorGroup.heading }
                        </Heading>
                        {
                            authenticatorGroup.description && (
                                <Hint className="mb-3">{ authenticatorGroup.description }</Hint>
                            )
                        }
                    </>
                )
            }
            <Authenticators
                authenticators={ authenticatorGroup.authenticators }
                category={ authenticatorGroup.category }
                emptyPlaceholder={ (
                    <EmptyPlaceholder
                        subtitle={
                            [
                                t("console:develop.features" +
                                    ".applications.placehold" +
                                    "ers.emptyAuthenticators" +
                                    "List.subtitles", {
                                    type: authenticatorGroup.heading
                                })
                            ]
                        }
                    />
                ) }
                isSocialLogin={ authenticatorGroup.heading === ApplicationManagementConstants.SOCIAL_LOGIN_HEADER }
                handleSocialLoginAdd={ handleSocialLoginAdd }
                onAuthenticatorSelect={ (authenticators) => {
                    setSelectedAuthenticators({
                        ...selectedAuthenticators,
                        [ authenticatorGroup.category ]: authenticators
                    });
                } }
                data-testid={ `${ testId }-authenticators` }
            />
        </Fragment>
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

        let selected: GenericAuthenticatorInterface[] = [];

        // Bring the selected authenticators to a flat level.
        for (const values of Object.values(selectedAuthenticators)) {
            selected = [ ...selected, ...values ];
        }

        onModalSubmit(selected, authenticatorAddStep);
    };

    return (
        <>
            { AddSocialLoginConfirm && showAddSocialLoginConfirmation() }
            <Modal
                className={ classes }
                data-testid={ testId }
                { ...rest }
            >
                <Modal.Header>{ header }</Modal.Header>
                <Modal.Content scrolling>
                    { showStepSelector && (
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
                            <Divider className="x2" />
                        </>
                    ) }
                    { message }
                    {
                        authenticatorGroups
                        && authenticatorGroups instanceof Array
                        && authenticatorGroups.length > 0 && (
                            <div className="authenticators-section">
                                {
                                    authenticatorGroups.map((authenticator, index: number) => (
                                        authenticator?.authenticators
                                        && authenticator.authenticators instanceof Array
                                        && authenticator.authenticators.length > 0
                                        && (
                                            renderAuthenticatorGroup(authenticator, index)
                                        )
                                    ))
                                }
                            </div>
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
