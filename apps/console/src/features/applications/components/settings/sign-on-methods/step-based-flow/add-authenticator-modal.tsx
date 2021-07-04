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
    EmptyPlaceholder,
    GenericIcon,
    Heading,
    Hint,
    InfoCard,
    LinkButton,
    PrimaryButton,
    Text
} from "@wso2is/react-components";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import startCase from "lodash-es/startCase";
import React, {
    ChangeEvent,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    Divider,
    DropdownItemProps,
    Form,
    Grid,
    Icon,
    Input,
    Label,
    Modal,
    ModalProps,
    SemanticWIDTHS
} from "semantic-ui-react";
import { Authenticators } from "./authenticators";
import {
    AuthenticatorCategories,
    AuthenticatorMeta,
    GenericAuthenticatorInterface,
    IdentityProviderManagementUtils,
    IdentityProviderTemplateCategoryInterface,
    getIdPIcons
} from "../../../../../identity-providers";
import { getGeneralIcons } from "../../../../configs";
import { AuthenticationStepInterface } from "../../../../models";
import { EventPublisher } from "../../../../../core/utils";

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
     * Configured authentication steps.
     */
    authenticationSteps: AuthenticationStepInterface[];
    /**
     * Categorized IDP templates.
     */
    categorizedIDPTemplates: IdentityProviderTemplateCategoryInterface[];
    /**
     * Current step.
     */
    currentStep: number;
    /**
     * Callback to be triggered when add new button is clicked.
     */
    onAddNewClick: () => void;
    /**
     * Callback to trigger IDP create wizard.
     */
    onIDPCreateWizardTrigger: (type: string, cb: () => void, template?: any) => void;
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
    /**
     * Show/Hide authenticator labels in UI.
     */
    showLabels?: boolean;
}

/**
 * Number of cards per row.
 * @type {SemanticWIDTHS}
 */
const CARDS_PER_ROW: SemanticWIDTHS = 3;

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
        authenticationSteps,
        authenticators,
        categorizedIDPTemplates,
        className,
        currentStep,
        header,
        onClose,
        open,
        onAddNewClick,
        onIDPCreateWizardTrigger,
        onModalSubmit,
        message,
        showStepSelector,
        stepCount,
        showLabels,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(open);
    const [
        selectedAuthenticators,
        setSelectedAuthenticators
    ] = useState<GenericAuthenticatorInterface[]>([]);
    const [
        filteredAuthenticators,
        setFilteredAuthenticators
    ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(stepCount);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ showAddNewAuthenticatorView, setShowAddNewAuthenticatorView ] = useState<boolean>(false);
    const [ filterLabels, setFilterLabels ] = useState<string[]>([]);
    const [ selectedFilterLabels, setSelectedFilterLabels ] = useState<string[]>([]);

    const classes = classNames(
        "add-authenticator-modal",
        className
    );

    const eventPublisher = EventPublisher.getInstance();

    /**
     * Update the internal filtered authenticators state when the prop changes.
     */
    useEffect(() => {
        if (!authenticators) {
            return;
        }

        setFilteredAuthenticators(authenticators);

        extractAuthenticatorLabels(authenticators);
    }, [ authenticators ]);

    /**
     * Extract Authenticator labels.
     *
     * @param {GenericAuthenticatorInterface[]} authenticators - Set of authenticators.
     */
    const extractAuthenticatorLabels = (authenticators: GenericAuthenticatorInterface[]): void => {

        const labels: string[] = [];

        authenticators.filter((authenticator: GenericAuthenticatorInterface) => {
            IdentityProviderManagementUtils.getAuthenticatorLabels(authenticator).filter((label: string) => {
                if (!labels.includes(label)) {
                    labels.push(label);
                }
            });
        });

        setFilterLabels(labels);
    };

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
     * @param {string} value - Value of the step.
     */
    const handleAddStepChange = (event: SyntheticEvent<HTMLElement>, { value }: { value: string }): void => {

        setAuthenticatorAddStep(parseInt(value, 10));
    };

    /**
     * Handles modal submit.
     */
    const handleModalSubmit = (): void => {

        selectedAuthenticators.forEach(element => {
            eventPublisher.publish("application-sign-in-method-add-new-authenticator", {
                "authenticator": element["defaultAuthenticator"]["name"]
            });
        });

        onModalSubmit(selectedAuthenticators, authenticatorAddStep);
    };

    /**
     * Handles the Authenticator Search input onchange.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Change event.
     * @param {string} value - Input value.
     */
    const handleAuthenticatorSearch = (e: ChangeEvent<HTMLInputElement>, { value }: { value: string }): void => {

        const query: string = value.toLocaleLowerCase();

        setSearchQuery(query);
        setFilteredAuthenticators(getSearchResults(query, selectedFilterLabels));
    };

    /**
     * Get search results.
     *
     * @param {string} query - Search query.
     * @param {string[]} filterLabels - Filter labels.
     *
     * @return {GenericAuthenticatorInterface[]}
     */
    const getSearchResults = (query: string, filterLabels: string[]): GenericAuthenticatorInterface[] => {

        /**
         * Checks if any of the filters are matching.
         * @param {GenericAuthenticatorInterface} authenticator - Authenticator object.
         * @return {boolean}
         */
        const isFiltersMatched = (authenticator: GenericAuthenticatorInterface): boolean => {

            if (isEmpty(filterLabels)) {
                return true;
            }

            return IdentityProviderManagementUtils.getAuthenticatorLabels(authenticator)
                .some((selectedLabel) => filterLabels.includes(selectedLabel));
        };

        return authenticators.filter((authenticator: GenericAuthenticatorInterface) => {

            if (!query) {
                return isFiltersMatched(authenticator);
            }

            const name: string = (AuthenticatorMeta.getAuthenticatorDisplayName(
                authenticator.defaultAuthenticator.authenticatorId)
                || authenticator.displayName).toLocaleLowerCase();

            if (name.includes(query)
                || IdentityProviderManagementUtils.getAuthenticatorLabels(authenticator)
                    .some((tag) => tag.toLocaleLowerCase().includes(query)
                        || startCase(tag).toLocaleLowerCase().includes(query))
                || authenticator.category.toLocaleLowerCase().includes(query)
                || authenticator.categoryDisplayName.toLocaleLowerCase().includes(query)) {

                return isFiltersMatched(authenticator);
            }
        });
    };

    /**
     * Handles Authenticator filter.
     *
     * @param {string} label - Selected label.
     */
    const handleAuthenticatorFilter = (label: string): void => {

        let selected: string[] = [];

        if (selectedFilterLabels.includes(label)) {
            selected = selectedFilterLabels.filter((selectedLabel: string) => selectedLabel !== label);
        } else {
            selected = [ ...selectedFilterLabels, label ];
        }

        setSelectedFilterLabels(selected);

        setFilteredAuthenticators(getSearchResults(searchQuery, selected));
    };

    /**
     * Renders add new authenticator content inside modal.
     * @return {React.ReactElement}
     */
    const renderAddNewAuthenticatorContent = (): ReactElement => {

        return (
            <>
                <Modal.Content
                    scrolling
                    className="authenticator-container"
                >
                    <div className="page-header-wrapper">
                        <div
                            className="back-button mb-0"
                            onClick={ () => setShowAddNewAuthenticatorView(false) }
                        >
                            <Icon name="arrow left"/>
                            {
                                t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                    "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.goBackButton")
                            }
                        </div>
                    </div>
                    <Divider hidden />
                    <Card.Group itemsPerRow={ CARDS_PER_ROW }>
                        {
                            categorizedIDPTemplates.map((category) => {
                                return category?.templates?.map((template, index: number) => (
                                    <InfoCard
                                        key={ index }
                                        header={ template.name }
                                        disabled={ template.disabled }
                                        subHeader={
                                            AuthenticatorMeta.getAuthenticatorTypeDisplayName(template.type as
                                                    AuthenticatorCategories)
                                                ? t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(template.type as
                                                    AuthenticatorCategories))
                                                : template.type
                                        }
                                        description={ template.description }
                                        image={
                                            IdentityProviderManagementUtils
                                                .resolveTemplateImage(template.image, getIdPIcons())
                                        }
                                        onClick={ () => {
                                            onIDPCreateWizardTrigger(template.id, () => {
                                               setShowAddNewAuthenticatorView(false);
                                            }, template);
                                        } }
                                    />
                                ));
                            })
                        }
                    </Card.Group>
                </Modal.Content>
            </>
        );
    };

    /**
     * Render Authenticator selection content inside modal.
     * @return {React.ReactElement}
     */
    const renderAuthenticatorSelectionContent = (): ReactElement => (

        <>
            <Modal.Content className="authenticator-search-container">
                <Input
                    loading={ false }
                    className="mb-3"
                    icon={ <Icon name="search"/> }
                    value={ searchQuery }
                    iconPosition="left"
                    fluid
                    onChange={ handleAuthenticatorSearch }
                    placeholder={
                        t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                            "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.search.placeholder")
                    }
                />
                {
                    (filterLabels && Array.isArray(filterLabels) && filterLabels.length > 0) && (
                        <Label.Group>
                            {
                                filterLabels.map((label, index: number) => {
                                    const isSelected: boolean = selectedFilterLabels.includes(label);

                                    return (
                                        <Label
                                            basic
                                            key={ index }
                                            as="a"
                                            className={ `filter-label ${ isSelected ? "active" : "" }` }
                                            onClick={ () => handleAuthenticatorFilter(label) }
                                        >
                                            { IdentityProviderManagementUtils.getAuthenticatorLabelDisplayName(label) }
                                            { isSelected && <Icon name="check"/> }
                                        </Label>
                                    );
                                })
                            }
                        </Label.Group>
                    )
                }
            </Modal.Content>
            <Modal.Content
                scrolling
                className="authenticator-container"
            >
                { message }
                {
                    (filteredAuthenticators
                        && Array.isArray(filteredAuthenticators)
                        && filteredAuthenticators.length > 0)
                        ? (
                            <Card.Group itemsPerRow={ CARDS_PER_ROW }>
                                <Authenticators
                                    authenticators={ filteredAuthenticators }
                                    authenticationSteps={ authenticationSteps }
                                    onAuthenticatorSelect={ (authenticators) => {
                                        setSelectedAuthenticators(authenticators);
                                    } }
                                    selected={ selectedAuthenticators }
                                    showLabels={ showLabels }
                                    data-testid={ `${ testId }-authenticators` }
                                    currentStep={ currentStep }
                                />
                                {
                                    allowSocialLoginAddition && (
                                        <Card
                                            as="div"
                                            className={
                                                `basic-card authenticator add-custom-authenticator-card ${
                                                    showLabels ? "with-labels" : ""
                                                }`
                                            }
                                            onClick={ handleNewAuthenticatorAddClick }
                                        >
                                            <Card.Content textAlign="center">
                                                <GenericIcon
                                                    transparent
                                                    className="mb-3"
                                                    size="mini"
                                                    icon={ getGeneralIcons().addCircleOutline }
                                                />
                                                <Text weight="500">
                                                    {
                                                        t("console:develop.features.applications.edit.sections." +
                                                            "signOnMethod.sections.authenticationFlow.sections." +
                                                            "stepBased.addAuthenticatorModal.content." +
                                                            "addNewAuthenticatorCard.title")
                                                    }
                                                </Text>
                                            </Card.Content>
                                        </Card>
                                    )
                                }
                            </Card.Group>
                        )
                        : (
                            <div>
                                <EmptyPlaceholder
                                    subtitle={
                                        [
                                            t("console:develop.features.applications.placeholders" +
                                                ".emptyAuthenticatorsList.subtitles")
                                        ]
                                    }
                                />
                                {
                                    allowSocialLoginAddition && (
                                        <Card.Group centered itemsPerRow={ CARDS_PER_ROW }>
                                            <Card
                                                as="div"
                                                className={
                                                    `basic-card authenticator add-custom-authenticator-card ${
                                                        showLabels ? "with-labels" : ""
                                                        }`
                                                }
                                                onClick={ handleNewAuthenticatorAddClick }
                                            >
                                                <Card.Content textAlign="center">
                                                    <GenericIcon
                                                        transparent
                                                        className="mb-3"
                                                        size="mini"
                                                        icon={ getGeneralIcons().addCircleOutline }
                                                    />
                                                    <Text weight="500">
                                                        {
                                                            t("console:develop.features.applications.edit.sections." +
                                                                "signOnMethod.sections.authenticationFlow.sections." +
                                                                "stepBased.addAuthenticatorModal.content." +
                                                                "addNewAuthenticatorCard.title")
                                                        }
                                                    </Text>
                                                </Card.Content>
                                            </Card>
                                        </Card.Group>
                                    )
                                }
                            </div>
                        )
                }
            </Modal.Content>
        </>
    );

    /**
     * Authenticator add click.
     */
    const handleNewAuthenticatorAddClick = (): void => {

        onAddNewClick();
        setShowAddNewAuthenticatorView(true);
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
                {
                    showAddNewAuthenticatorView && categorizedIDPTemplates
                        ? renderAddNewAuthenticatorContent()
                        : renderAuthenticatorSelectionContent()
                }
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
                            {
                                !showAddNewAuthenticatorView && (
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
                                )
                            }
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
    showLabels: true,
    size: "small"
};
