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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    EmptyPlaceholder,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    ResourceGrid,
    Text
} from "@wso2is/react-components";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
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
import { EventPublisher, getEmptyPlaceholderIllustrations } from "../../../../../core";
import {
    GenericAuthenticatorInterface,
    IdentityProviderManagementUtils,
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    getIdPIcons
} from "../../../../../identity-providers";
import { getGeneralIcons } from "../../../../configs";
import { AuthenticationStepInterface } from "../../../../models";

/**
 * Prop-types for the Add authenticator modal component.
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
    subjectStepId: number;
    attributeStepId: number;
    refreshAuthenticators: () => Promise<void>;
}

/**
 * Number of cards per row.
 */
const CARDS_PER_ROW: SemanticWIDTHS = 3;

/**
 * Authenticator side panel component.
 *
 * @param props - Props injected to the component.
 * @returns AddAuthenticator Modal component.
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
        subjectStepId,
        attributeStepId,
        refreshAuthenticators,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const [ isModalOpen ] = useState<boolean>(open);
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

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

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
     * @param authenticators - Set of authenticators.
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
     * @returns Selector options.
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
     * @param event - Change Event.
     * @param value - Value of the step.
     */
    const handleAddStepChange = (event: SyntheticEvent<HTMLElement>, { value }: { value: string }): void => {

        setAuthenticatorAddStep(parseInt(value, 10));
    };

    /**
     * Handles modal submit.
     */
    const handleModalSubmit = (): void => {

        eventPublisher.compute(() => {
            selectedAuthenticators?.forEach(element => {
                eventPublisher.publish("application-sign-in-method-add-new-authenticator", {
                    type: kebabCase(element["defaultAuthenticator"]["name"])
                });
            });
        });
        onModalSubmit(selectedAuthenticators, authenticatorAddStep);
    };

    /**
     * Handles the Authenticator Search input onchange.
     *
     * @param e - Change event.
     * @param value - Input value.
     */
    const handleAuthenticatorSearch = (e: ChangeEvent<HTMLInputElement>, { value }: { value: string }): void => {

        const query: string = value.toLocaleLowerCase();

        setSearchQuery(query);
        setFilteredAuthenticators(getSearchResults(query, selectedFilterLabels));
    };

    /**
     * Get search results.
     *
     * @param query - Search query.
     * @param filterLabels - Filter labels.
     * @returns Get search results.
     */
    const getSearchResults = (query: string, filterLabels: string[]): GenericAuthenticatorInterface[] => {

        /**
         * Checks if any of the filters are matching.
         * @param authenticator - Authenticator object.
         * @returns Is matched or not.
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

            const name: string = authenticator?.displayName?.toLocaleLowerCase();

            if (name.includes(query)
                || IdentityProviderManagementUtils.getAuthenticatorLabels(authenticator)
                    .some((tag) => tag?.toLocaleLowerCase()?.includes(query)
                        || startCase(tag)?.toLocaleLowerCase()?.includes(query))
                || authenticator.category?.toLocaleLowerCase()?.includes(query)
                || authenticator.categoryDisplayName?.toLocaleLowerCase()?.includes(query)) {

                return isFiltersMatched(authenticator);
            }
        });
    };

    /**
     * Handles Authenticator filter.
     *
     * @param label - Selected label.
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
     * @returns Authenticator content.
     */
    const renderAddNewAuthenticatorContent = (): ReactElement => {

        return (
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
                <Divider hidden/>
                {
                    categorizedIDPTemplates
                        .map((category: IdentityProviderTemplateCategoryInterface, index: number) => {
                            return (
                                <ResourceGrid
                                    key={ index }
                                    isEmpty={
                                        !(category?.templates
                                            && Array.isArray(category.templates)
                                            && category.templates.length > 0)
                                    }
                                    emptyPlaceholder={ (
                                        <EmptyPlaceholder
                                            image={ getEmptyPlaceholderIllustrations().newList }
                                            imageSize="tiny"
                                            title={
                                                t("console:develop.features.authenticationProvider" +
                                                    ".placeHolders.emptyConnectionTypeList.title")
                                            }
                                            subtitle={ [
                                                t("console:develop.features.authenticationProvider" +
                                                    ".placeHolders.emptyConnectionTypeList" +
                                                    ".subtitles.0"),
                                                t("console:develop.features.authenticationProvider" +
                                                    ".placeHolders.emptyConnectionTypeList" +
                                                    ".subtitles.1")
                                            ] }
                                            data-testid={ `${ testId }-empty-placeholder` }
                                        />
                                    ) }
                                >
                                    {
                                        category.templates.map((
                                            template: IdentityProviderTemplateInterface,
                                            templateIndex: number
                                        ) => (
                                            <ResourceGrid.Card
                                                key={ templateIndex }
                                                resourceName={ template.name }
                                                isResourceComingSoon={ template.comingSoon }
                                                disabled={ template.disabled }
                                                comingSoonRibbonLabel={ t("common:comingSoon") }
                                                resourceDescription={ template.description }
                                                resourceImage={
                                                    IdentityProviderManagementUtils
                                                        .resolveTemplateImage(template.image, getIdPIcons())
                                                }
                                                tags={ template.tags }
                                                onClick={ () => {
                                                    onIDPCreateWizardTrigger(template.id, () => {
                                                        setShowAddNewAuthenticatorView(false);
                                                    }, template);
                                                } }
                                                showTooltips={ false }
                                                data-testid={ `${ testId }-${ template.name }` }
                                            />
                                        ))
                                    }
                                </ResourceGrid>
                            );
                        })
                }
            </Modal.Content>
        );
    };

    /**
     * Render Authenticator selection content inside modal.
     * @returns Authenticator selection content.
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
                                    refreshAuthenticators={ refreshAuthenticators }
                                    authenticators={ filteredAuthenticators }
                                    authenticationSteps={ authenticationSteps }
                                    onAuthenticatorSelect={ (authenticators) => {
                                        setSelectedAuthenticators(authenticators);
                                    } }
                                    selected={ selectedAuthenticators }
                                    showLabels={ showLabels }
                                    data-testid={ `${ testId }-authenticators` }
                                    currentStep={ currentStep }
                                    subjectStepId={ subjectStepId }
                                    attributeStepId={ attributeStepId }
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
                <Modal.Header>{ header as ReactNode }</Modal.Header>
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
