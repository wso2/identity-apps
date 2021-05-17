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
import { ImageUtils, URLUtils } from "@wso2is/core/utils";
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
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import startCase from "lodash-es/startCase";
import React, {
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
    DropdownProps,
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
    GenericAuthenticatorInterface,
    IdentityProviderManagementUtils,
    IdentityProviderTemplateCategoryInterface,
    getIdPIcons
} from "../../../../../identity-providers";
import { getGeneralIcons } from "../../../../configs";
import { ApplicationManagementConstants } from "../../../../constants";

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
     * Categorized IDP templates.
     */
    categorizedIDPTemplates: IdentityProviderTemplateCategoryInterface[];
    /**
     * Callback to be triggered when add new button is clicked.
     */
    onAddNewClick: () => void;
    /**
     * Callback to trigger IDP create wizard.
     */
    onIDPCreateWizardTrigger: (type: string, cb: () => void) => void;
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
        authenticators,
        categorizedIDPTemplates,
        className,
        header,
        onClose,
        open,
        onAddNewClick,
        onIDPCreateWizardTrigger,
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
        selectedAuthenticators,
        setSelectedAuthenticators
    ] = useState<GenericAuthenticatorInterface[]>([]);
    const [
        filteredAuthenticators,
        setFilteredAuthenticators
    ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(stepCount);
    const [ showAddNewAuthenticatorView, setShowAddNewAuthenticatorView ] = useState<boolean>(false);
    const [ filterLabels, setFilterLabels ] = useState<string[]>([]);
    const [ selectedFilterLabels, setSelectedFilterLabels ] = useState<string[]>([]);

    const classes = classNames(
        "add-authenticator-modal",
        className
    );

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
    
    const extractAuthenticatorLabels = (authenticators: GenericAuthenticatorInterface[]) => {
        
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
    
    const handleAuthenticatorSearch = (e, { value }) => {
        
        const searchQuery: string = value.toLocaleLowerCase();

        setFilteredAuthenticators(
            authenticators.filter((authenticator: GenericAuthenticatorInterface) => {
                const name: string = (ApplicationManagementConstants.AUTHENTICATOR_DISPLAY_NAMES.get(authenticator.name)
                    || authenticator.displayName).toLocaleLowerCase();

                if (name.includes(searchQuery)
                    || IdentityProviderManagementUtils.getAuthenticatorLabels(authenticator)
                        .some((tag) => tag.toLocaleLowerCase().includes(searchQuery)
                            || startCase(tag).toLocaleLowerCase().includes(searchQuery))
                    || authenticator.category.toLocaleLowerCase().includes(searchQuery)
                    || authenticator.categoryDisplayName.toLocaleLowerCase().includes(searchQuery)) {

                    return true;
                }
            })
        );
    };
    
    const handleAuthenticatorFilter = (label: string) => {

        let selected: string[] = [];

        if (selectedFilterLabels.includes(label)) {
            selected = selectedFilterLabels.filter((selectedLabel: string) => selectedLabel !== label);
        } else {
            selected = [ ...selectedFilterLabels, label ];
        }

        setSelectedFilterLabels(selected);
        
        if (!isEmpty(selected)) {
            setFilteredAuthenticators(authenticators.filter((authenticator: GenericAuthenticatorInterface) => {
                const labels: string[] = IdentityProviderManagementUtils.getAuthenticatorLabels(authenticator);
                return selected.some((selectedLabel) => labels.includes(selectedLabel));
            }));
            
            return;
        }
        
        setFilteredAuthenticators(authenticators);
    };

    const renderAddNewAuthenticatorContent = () => {

        /**
         * Checks if the template image URL is a valid image URL and if not checks if it's
         * available in the passed in icon set.
         *
         * @param image Input image.
         *
         * @return Predefined image if available. If not, return input parameter.
         */
        const resolveTemplateImage = (image: any) => {
            
            const templateIcons =  getIdPIcons();

            if (image) {
                if (typeof image !== "string") {
                    return image;
                }

                if ((URLUtils.isHttpsUrl(image) || URLUtils.isHttpUrl(image)) && ImageUtils.isValidImageExtension(image)) {
                    return image;
                }

                if (URLUtils.isDataUrl(image)) {
                    return image;
                }

                if (!templateIcons) {
                    return image;
                }
            }
            const match = Object.keys(templateIcons).find(key => key.toString() === image);

            return match ? templateIcons[ match ] : templateIcons[ "default" ] ?? image;
        };

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
                            Go back to selection
                        </div>
                    </div>
                    <Divider hidden />
                    <Card.Group itemsPerRow={ CARDS_PER_ROW }>
                        {
                            categorizedIDPTemplates.map((category) => {
                                return category.templates.map((template, index: number) => (
                                    <InfoCard
                                        key={ index }
                                        header={ template.name }
                                        disabled={ template.disabled }
                                        subHeader={
                                            get(ApplicationManagementConstants.AUTHENTICATOR_TYPE_DISPLAY_NAMES, template.type)
                                                ? t(get(ApplicationManagementConstants.AUTHENTICATOR_TYPE_DISPLAY_NAMES, template.type))
                                                : template.type
                                        }
                                        description={ template.description }
                                        image={ resolveTemplateImage(template.image) }
                                        onClick={ () => {
                                            onIDPCreateWizardTrigger(template.id, () => {
                                               setShowAddNewAuthenticatorView(false); 
                                            });
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

    const renderAuthenticatorSelectionContent = () => (
        <>
            <Modal.Content className="authenticator-search-container">
                <Input
                    loading={ false }
                    className="mb-3"
                    icon={ <Icon name="search"/> }
                    iconPosition="left"
                    fluid
                    onChange={ handleAuthenticatorSearch }
                    placeholder={ "Search for Authenticators" }
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
                                    onAuthenticatorSelect={ (authenticators) => {
                                        setSelectedAuthenticators(authenticators);
                                    } }
                                    selected={ selectedAuthenticators }
                                    data-testid={ `${ testId }-authenticators` }
                                />
                                {
                                    allowSocialLoginAddition && (
                                        <Card
                                            className="basic-card authenticator add-custom-authenticator-card"
                                            onClick={ handleNewAuthenticatorAddClick }
                                        >
                                            <Card.Content textAlign="center">
                                                <GenericIcon
                                                    transparent
                                                    className="mb-3"
                                                    size="mini"
                                                    icon={ getGeneralIcons().addCircleOutline }
                                                />
                                                <Text weight="500">Add New</Text>
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
                                                className="basic-card authenticator add-custom-authenticator-card"
                                                onClick={ handleNewAuthenticatorAddClick }
                                            >
                                                <Card.Content textAlign="center">
                                                    <GenericIcon
                                                        transparent
                                                        className="mb-3"
                                                        size="mini"
                                                        icon={ getGeneralIcons().addCircleOutline }
                                                    />
                                                    <Text weight="500">Add New</Text>
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
    
    const handleNewAuthenticatorAddClick = () => {
        
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
    size: "small"
};
