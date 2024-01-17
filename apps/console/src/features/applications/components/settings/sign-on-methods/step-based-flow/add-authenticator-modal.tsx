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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    EmptyPlaceholder,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    ResourceGrid,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import orderBy from "lodash-es/orderBy";
import startCase from "lodash-es/startCase";
import union from "lodash-es/union";
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
import { useSelector } from "react-redux";
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
import { authenticatorConfig } from "../../../../../../extensions/configs/authenticator";
import { identityProviderConfig } from "../../../../../../extensions/configs/identity-provider";
import useAuthenticationFlow from "../../../../../authentication-flow-builder/hooks/use-authentication-flow";
import { ConnectionManagementConstants } from "../../../../../connections";
import { ConnectionsManagementUtils } from "../../../../../connections/utils/connection-utils";
import { getEmptyPlaceholderIllustrations } from "../../../../../core/configs/ui";
import { AppState } from "../../../../../core/store";
import { EventPublisher } from "../../../../../core/utils/event-publisher";
import { getIdPIcons } from "../../../../../identity-providers/configs/ui";
import {
    IdentityProviderManagementConstants
} from "../../../../../identity-providers/constants/identity-provider-management-constants";
import { AuthenticatorMeta } from "../../../../../identity-providers/meta/authenticator-meta";
import {
    AuthenticatorCategories,
    GenericAuthenticatorInterface,
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface
} from "../../../../../identity-providers/models/identity-provider";
import {
    IdentityProviderManagementUtils
} from "../../../../../identity-providers/utils/identity-provider-management-utils";
import {
    IdentityProviderTemplateManagementUtils
} from "../../../../../identity-providers/utils/identity-provider-template-management-utils";
import { OrganizationType } from "../../../../../organizations/constants";
import { getGeneralIcons } from "../../../../configs/ui";
import { AuthenticationStepInterface } from "../../../../models";

/**
 * Prop-types for the Add authenticator modal component.
 */
export interface AddAuthenticatorModalPropsInterface extends TestableComponentInterface, ModalProps {
    /**
     * Allow social login addition.
     */
    allowSocialLoginAddition: boolean;
    /**
     * Set of authenticators.
     */
    authenticators: {
        local: GenericAuthenticatorInterface[];
        social: GenericAuthenticatorInterface[];
        enterprise: GenericAuthenticatorInterface[];
        secondFactor: GenericAuthenticatorInterface[];
        recovery: GenericAuthenticatorInterface[];
    };
    /**
     * Configured authentication steps.
     */
    authenticationSteps: AuthenticationStepInterface[];
    /**
     * Current step.
     */
    currentStep: number;
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
        authenticators: unfilteredAuthenticators,
        className,
        currentStep,
        header,
        onClose,
        open,
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
    const { getLink } = useDocumentation();
    const { hiddenAuthenticators } = useAuthenticationFlow();

    const isSAASDeployment: boolean = useSelector((state: AppState) => state?.config?.ui?.isSAASDeployment);

    const hiddenConnectionTemplates: string[] = useSelector(
        (state: AppState) => state.config?.ui?.hiddenConnectionTemplates
    );
    const groupedIDPTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider?.groupedTemplates
    );
    const orgType: OrganizationType = useSelector((state: AppState) => {
        return state?.organization?.organizationType;
    });

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const [ isModalOpen ] = useState<boolean>(open);
    const [
        selectedAuthenticators,
        setSelectedAuthenticators
    ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ allAuthenticators, setAllAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [
        filteredAuthenticators,
        setFilteredAuthenticators
    ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(stepCount);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ showAddNewAuthenticatorView, setShowAddNewAuthenticatorView ] = useState<boolean>(false);
    const [ filterLabels, setFilterLabels ] = useState<string[]>([]);
    const [ selectedFilterLabels, setSelectedFilterLabels ] = useState<string[]>([]);
    const [
        categorizedIdPTemplates,
        setCategorizedIdPTemplates
    ] = useState<IdentityProviderTemplateCategoryInterface[]>([]);

    /**
     * Fetches IdP templates if not available.
     */
    useEffect(() => {
        if (groupedIDPTemplates) {
            return;
        }

        IdentityProviderTemplateManagementUtils.getIdentityProviderTemplates();
    }, [ groupedIDPTemplates ]);

    /**
     * Update the internal filtered authenticators state when the prop changes.
     */
    useEffect(() => {
        if (!unfilteredAuthenticators) {
            return;
        }

        let _filteredAuthenticators: GenericAuthenticatorInterface[] = [
            ...moderateAuthenticators(unfilteredAuthenticators.local,
                AuthenticatorCategories.LOCAL,
                t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.LOCAL))),
            ...moderateAuthenticators(unfilteredAuthenticators.social,
                AuthenticatorCategories.SOCIAL,
                t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.SOCIAL))),
            ...moderateAuthenticators(unfilteredAuthenticators.secondFactor,
                AuthenticatorCategories.SECOND_FACTOR,
                t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.SECOND_FACTOR))),
            ...moderateAuthenticators(unfilteredAuthenticators.enterprise,
                AuthenticatorCategories.ENTERPRISE,
                t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.ENTERPRISE))),
            ...moderateAuthenticators(unfilteredAuthenticators.recovery,
                AuthenticatorCategories.RECOVERY,
                t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.RECOVERY)))
        ];

        // Remove SMS OTP authenticator from the list at the sub org level.
        _filteredAuthenticators = (orgType === OrganizationType.SUBORGANIZATION &&
            identityProviderConfig?.disableSMSOTPInSubOrgs)
            ? _filteredAuthenticators.filter((authenticator: GenericAuthenticatorInterface) => {
                return (
                    authenticator.name !==
                          IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID &&
                    authenticator.name !==authenticatorConfig?.overriddenAuthenticatorNames
                        ?.SMS_OTP_AUTHENTICATOR
                );
            })
            : _filteredAuthenticators;

        setFilteredAuthenticators(_filteredAuthenticators);
        setAllAuthenticators(_filteredAuthenticators);
        extractAuthenticatorLabels(_filteredAuthenticators);
    }, [ unfilteredAuthenticators ]);

    /**
     * Persists the categorized IDP templates.
     *
     * @param templates - Templates to persist.
     * @returns Promise returned from `categorizeTemplates`.
     */
    const persistCategorizedTemplates = (
        templates: IdentityProviderTemplateInterface[]
    ): Promise<void | IdentityProviderTemplateCategoryInterface[]> => {

        return IdentityProviderTemplateManagementUtils.categorizeTemplates(templates)
            .then((response: IdentityProviderTemplateCategoryInterface[]) => {

                let tags: string[] = [];

                response.filter((category: IdentityProviderTemplateCategoryInterface) => {
                    // Order the templates by pushing coming soon items to the end.
                    category.templates = orderBy(category.templates, [ "comingSoon" ], [ "desc" ]);

                    category.templates.filter((template: IdentityProviderTemplateInterface) => {
                        if (!(template?.tags && Array.isArray(template.tags) && template.tags.length > 0)) {
                            return;
                        }

                        tags = union(tags, template.tags);
                    });
                });

                setCategorizedIdPTemplates(response);
            })
            .catch(() => {
                setCategorizedIdPTemplates([]);
            });
    };

    /**
     * Filter out the displayable set of authenticators by validating against
     * the array of authenticators defined to be hidden in the config.
     *
     * @param authenticators - Authenticators to be filtered.
     * @param category - Authenticator category.
     * @param categoryDisplayName - Authenticator category display name.
     * @returns List of moderated authenticators
     */
    const moderateAuthenticators = (authenticators: GenericAuthenticatorInterface[],
        category: string,
        categoryDisplayName: string) => {

        if (isEmpty(authenticators)) {
            return [];
        }

        // If the config is undefined or empty, return the original.
        if (!hiddenAuthenticators
            || !Array.isArray(hiddenAuthenticators)
            || hiddenAuthenticators.length < 1) {

            return authenticators;
        }

        return authenticators
            .filter((authenticator: GenericAuthenticatorInterface) => {
                return !hiddenAuthenticators.includes(authenticator.name);
            })
            .map((authenticator: GenericAuthenticatorInterface) => {
                return {
                    ...authenticator,
                    category,
                    categoryDisplayName
                };
            });
    };

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

        for (let i: number = 0; i < stepCount; i++) {
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
            selectedAuthenticators?.forEach((element: GenericAuthenticatorInterface) => {
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
                .some((selectedLabel: string) => filterLabels.includes(selectedLabel));
        };

        return allAuthenticators.filter((authenticator: GenericAuthenticatorInterface) => {

            if (!query) {
                return isFiltersMatched(authenticator);
            }

            const name: string = authenticator?.displayName?.toLocaleLowerCase();

            if (name.includes(query)
                || IdentityProviderManagementUtils.getAuthenticatorLabels(authenticator)
                    .some((tag: string) => tag?.toLocaleLowerCase()?.includes(query)
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
                    categorizedIdPTemplates
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
                                        ) => {

                                            const hiddenTemplates: string[] = [
                                                ConnectionManagementConstants.IDP_TEMPLATE_IDS.LINKEDIN,
                                                ConnectionManagementConstants.IDP_TEMPLATE_IDS
                                                    .ORGANIZATION_ENTERPRISE_IDP,
                                                ConnectionManagementConstants.TRUSTED_TOKEN_TEMPLATE_ID,
                                                ...hiddenConnectionTemplates
                                            ];

                                            if (hiddenTemplates.includes(template?.templateId)) {
                                                return null;
                                            }

                                            return (
                                                <ResourceGrid.Card
                                                    showSetupGuideButton={ !!isSAASDeployment }
                                                    navigationLink={
                                                        getLink(ConnectionsManagementUtils
                                                            .resolveConnectionDocLink(template.id))
                                                    }
                                                    key={ templateIndex }
                                                    resourceName={
                                                        template?.name === "Expert Mode"
                                                            ? "Custom Connector"
                                                            : template?.name
                                                    }
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
                                            );
                                        })
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
                                filterLabels.map((label: string, index: number) => {
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
                                    onAuthenticatorSelect={ (authenticators: GenericAuthenticatorInterface[]) => {
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
        if (groupedIDPTemplates) {
            persistCategorizedTemplates(groupedIDPTemplates)
                .then(() => setShowAddNewAuthenticatorView(true));

            return;
        }
    };

    return (
        <Modal
            className={ classNames("add-authenticator-modal", className) }
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
                showAddNewAuthenticatorView && categorizedIdPTemplates
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
