/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Heading,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    Steps
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    SVGProps,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    Button,
    Card,
    Checkbox,
    CheckboxProps,
    Divider,
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Form,
    Grid,
    Icon,
    Input,
    InputOnChangeData,
    Label,
    Modal
} from "semantic-ui-react";
import { ReactComponent as DeviceOutlineIcon }
    from "../assets/icons/device-window-outline.svg";
import { ReactComponent as SettingsOutlineIcon }
    from "../assets/icons/settings-outline.svg";
import { updateDevicePolicy } from "../api/device-policies";
import useGetDevicePolicyMetadata from "../hooks/use-get-device-policy-metadata";
import {
    DevicePlatformType,
    DevicePolicyExpressionInterface,
    DevicePolicyFieldDefinitionInterface
} from "../models/devices";

interface EditDevicePolicyWizardPropsInterface extends IdentifiableComponentInterface {
    policyId: string;
    initialName: string;
    initialPlatform: DevicePlatformType;
    initialExpressions: DevicePolicyExpressionInterface[];
    onClose: () => void;
    onSuccess: () => void;
}

enum WizardStep {
    PLATFORM = 0,
    RULE_BUILDER = 1
}

interface PlatformOptionInterface {
    key: DevicePlatformType;
    label: string;
    logo: unknown;
}

interface ConditionStateInterface {
    enabled: boolean;
    operator: string;
    value: string;
    listValues: string[];
}

const EditDevicePolicyWizard: FunctionComponent<EditDevicePolicyWizardPropsInterface> = (
    props: EditDevicePolicyWizardPropsInterface
): ReactElement => {
    const {
        "data-componentid": componentId = "edit-device-policy-wizard",
        policyId,
        initialName,
        initialPlatform,
        initialExpressions,
        onClose,
        onSuccess
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ currentStep, setCurrentStep ] = useState<WizardStep>(WizardStep.PLATFORM);
    const [ selectedPlatform, setSelectedPlatform ] = useState<DevicePlatformType | null>(initialPlatform);
    const [ policyName, setPolicyName ] = useState<string>(initialName);
    const [ conditions, setConditions ] = useState<Record<string, ConditionStateInterface>>({});
    const [ listInputValues, setListInputValues ] = useState<Record<string, string>>({});
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ conditionsInitialised, setConditionsInitialised ] = useState<boolean>(false);

    const technologyLogos: ReturnType<typeof getTechnologyLogos> = getTechnologyLogos();

    const platformOptions: PlatformOptionInterface[] = [
        { key: "android", label: t("devices:assurancePolicies.wizard.platforms.android"), logo: technologyLogos.android },
        { key: "ios",     label: t("devices:assurancePolicies.wizard.platforms.ios"),     logo: technologyLogos.ios },
        { key: "macos",   label: t("devices:assurancePolicies.wizard.platforms.macos"),   logo: technologyLogos.macos },
        { key: "windows", label: t("devices:assurancePolicies.wizard.platforms.windows"), logo: technologyLogos.windows }
    ];

    const {
        data: metadata,
        isLoading: isMetadataLoading,
        error: metadataError
    } = useGetDevicePolicyMetadata(selectedPlatform, selectedPlatform !== null);

    const nonPlatformFields: DevicePolicyFieldDefinitionInterface[] = useMemo(
        (): DevicePolicyFieldDefinitionInterface[] =>
            (metadata ?? []).filter(
                (field: DevicePolicyFieldDefinitionInterface): boolean => field.field.name !== "platform"
            ),
        [ metadata ]
    );

    // Initialise conditions from existing expressions when metadata loads; reset when platform changes
    useEffect((): void => {
        if (nonPlatformFields.length === 0) {
            return;
        }

        const initial: Record<string, ConditionStateInterface> = {};

        nonPlatformFields.forEach((field: DevicePolicyFieldDefinitionInterface): void => {
            const existing: DevicePolicyExpressionInterface | undefined = initialExpressions.find(
                (e: DevicePolicyExpressionInterface): boolean => e.field === field.field.name
            );

            const existingOperator: string = existing?.operator ?? field.operators[0]?.name ?? "";
            const isIn: boolean = existingOperator === "in";

            // For "in" operator, split the comma-separated value string into an array
            const existingListValues: string[] = isIn && existing?.value?.value
                ? existing.value.value.split(",").map((v: string): string => v.trim()).filter(Boolean)
                : [];

            initial[field.field.name] = {
                enabled: !!existing,
                listValues: existingListValues,
                operator: existingOperator,
                value: isIn ? "" : (existing?.value?.value ?? (
                    field.value.inputType === "OPTIONS"
                        ? (field.value.values?.[0]?.name ?? "")
                        : ""
                ))
            };
        });

        setConditions(initial);
        setListInputValues({});
        setConditionsInitialised(true);
    }, [ nonPlatformFields ]);

    // When the user switches platforms, clear the pre-populated conditions
    useEffect((): void => {
        if (selectedPlatform !== initialPlatform) {
            setConditionsInitialised(false);
        }
    }, [ selectedPlatform ]);

    useEffect((): void => {
        if (!metadataError) {
            return;
        }

        dispatch(addAlert({
            description: t(
                "devices:assurancePolicies.wizard.notifications.metadataFetch.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: t(
                "devices:assurancePolicies.wizard.notifications.metadataFetch.genericError.message"
            )
        }));
    }, [ metadataError ]);

    const handleToggleCondition = (fieldName: string, checked: boolean): void => {
        setConditions((prev: Record<string, ConditionStateInterface>) => ({
            ...prev,
            [fieldName]: { ...prev[fieldName], enabled: checked }
        }));
    };

    const handleOperatorChange = (fieldName: string, operator: string): void => {
        setConditions((prev: Record<string, ConditionStateInterface>) => ({
            ...prev,
            [fieldName]: { ...prev[fieldName], listValues: [], operator }
        }));
        setListInputValues((prev: Record<string, string>) => ({ ...prev, [fieldName]: "" }));
    };

    const handleValueChange = (fieldName: string, value: string): void => {
        setConditions((prev: Record<string, ConditionStateInterface>) => ({
            ...prev,
            [fieldName]: { ...prev[fieldName], value }
        }));
    };

    const handleListInputChange = (fieldName: string, value: string): void => {
        setListInputValues((prev: Record<string, string>) => ({ ...prev, [fieldName]: value }));
    };

    const handleMultiSelectChange = (fieldName: string, values: string[]): void => {
        setConditions((prev: Record<string, ConditionStateInterface>) => ({
            ...prev,
            [fieldName]: { ...prev[fieldName], listValues: values }
        }));
    };

    const handleAddListValue = (fieldName: string): void => {
        const inputVal: string = (listInputValues[fieldName] ?? "").trim();

        if (!inputVal) {
            return;
        }

        setConditions((prev: Record<string, ConditionStateInterface>) => {
            const existing: string[] = prev[fieldName]?.listValues ?? [];

            if (existing.includes(inputVal)) {
                return prev;
            }

            return {
                ...prev,
                [fieldName]: { ...prev[fieldName], listValues: [ ...existing, inputVal ] }
            };
        });
        setListInputValues((prev: Record<string, string>) => ({ ...prev, [fieldName]: "" }));
    };

    const handleRemoveListValue = (fieldName: string, val: string): void => {
        setConditions((prev: Record<string, ConditionStateInterface>) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                listValues: prev[fieldName].listValues.filter((v: string): boolean => v !== val)
            }
        }));
    };

    const isSaveEnabled: boolean = useMemo((): boolean => {
        if (!policyName.trim()) {
            return false;
        }

        return Object.values(conditions).some((c: ConditionStateInterface): boolean => {
            if (!c.enabled) {
                return false;
            }

            if (c.operator === "in") {
                return c.listValues.length > 0;
            }

            return true;
        });
    }, [ policyName, conditions ]);

    const handleSave = (): void => {
        setIsSubmitting(true);

        const platformExpression: { field: string; operator: string; value: string } = {
            field: "platform",
            operator: "equals",
            value: selectedPlatform
        };

        const enabledExpressions: { field: string; operator: string; value: string }[] =
            nonPlatformFields
                .filter(
                    (field: DevicePolicyFieldDefinitionInterface): boolean =>
                        conditions[field.field.name]?.enabled === true
                )
                .map((field: DevicePolicyFieldDefinitionInterface) => {
                    const state: ConditionStateInterface = conditions[field.field.name];

                    return {
                        field: field.field.name,
                        operator: state.operator,
                        value: state.operator === "in"
                            ? state.listValues.join(",")
                            : String(state.value)
                    };
                });

        updateDevicePolicy(policyId, {
            name: policyName.trim(),
            rule: {
                condition: "AND",
                expressions: [ platformExpression, ...enabledExpressions ]
            }
        })
            .then((): void => {
                dispatch(addAlert({
                    description: t(
                        "devices:assurancePolicies.edit.notifications.update.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devices:assurancePolicies.edit.notifications.update.success.message"
                    )
                }));
                onSuccess();
            })
            .catch((error: AxiosError<{ description?: string }>): void => {
                const errorDescription: string =
                    error?.response?.data?.description
                    ?? t(
                        "devices:assurancePolicies.edit.notifications.update.genericError.description"
                    );

                dispatch(addAlert({
                    description: errorDescription,
                    level: AlertLevels.ERROR,
                    message: t(
                        "devices:assurancePolicies.edit.notifications.update.genericError.message"
                    )
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    const WIZARD_STEPS: { icon: FunctionComponent<SVGProps<SVGSVGElement>>; title: string }[] = [
        {
            icon: DeviceOutlineIcon,
            title: t("devices:assurancePolicies.wizard.steps.platform.title")
        },
        {
            icon: SettingsOutlineIcon,
            title: t("devices:assurancePolicies.wizard.steps.ruleBuilder.title")
        }
    ];

    const renderPlatformStep = (): ReactElement => (
        <div className="device-policy-platform-selection">
            <Heading as="h6">
                { t("devices:assurancePolicies.wizard.steps.platform.heading") }
            </Heading>
            <p className="sub-heading">
                { t("devices:assurancePolicies.wizard.steps.platform.description") }
            </p>
            <Card.Group itemsPerRow={ 2 } className="platform-selection-cards">
                { platformOptions.map((platform: PlatformOptionInterface) => (
                    <SelectionCard
                        key={ platform.key }
                        image={ platform.logo }
                        size="default"
                        header={ platform.label }
                        selected={ selectedPlatform === platform.key }
                        onClick={ (): void => setSelectedPlatform(platform.key) }
                        imageSize="tiny"
                        imageOptions={ {
                            relaxed: true,
                            square: false,
                            width: "auto"
                        } }
                        contentTopBorder={ false }
                        renderDisabledItemsAsGrayscale={ false }
                        data-componentid={ `${ componentId }-${ platform.key }-selection-card` }
                    />
                )) }
            </Card.Group>
        </div>
    );

    const renderConditionValueInput = (
        field: DevicePolicyFieldDefinitionInterface,
        conditionState: ConditionStateInterface
    ): ReactElement => {
        const isIn: boolean = conditionState.operator === "in";
        const isOptions: boolean = field.value.inputType === "OPTIONS";

        const options: DropdownItemProps[] = (field.value.values ?? []).map(
            (v: { name: string; displayName: string }): DropdownItemProps => ({
                key: v.name,
                text: v.displayName,
                value: v.name
            })
        );

        // "in" + OPTIONS → multi-select dropdown
        if (isIn && isOptions) {
            return (
                <Dropdown
                    fluid
                    selection
                    multiple
                    disabled={ !conditionState.enabled }
                    options={ options }
                    value={ conditionState.listValues }
                    onChange={ (
                        _e: SyntheticEvent<HTMLElement>,
                        data: DropdownProps
                    ): void => handleMultiSelectChange(field.field.name, data.value as string[]) }
                    data-componentid={ `${ componentId }-${ field.field.name }-multi-value` }
                />
            );
        }

        // "in" + free-text → chip/tag input
        if (isIn) {
            return (
                <div data-componentid={ `${ componentId }-${ field.field.name }-list-value` }>
                    { conditionState.listValues.length > 0 && (
                        <Label.Group style={ { marginBottom: "6px" } }>
                            { conditionState.listValues.map((val: string): ReactElement => (
                                <Label key={ val } size="small">
                                    { val }
                                    <Icon
                                        name="delete"
                                        onClick={ (): void => {
                                            if (conditionState.enabled) {
                                                handleRemoveListValue(field.field.name, val);
                                            }
                                        } }
                                        style={ { cursor: conditionState.enabled ? "pointer" : "default" } }
                                    />
                                </Label>
                            )) }
                        </Label.Group>
                    ) }
                    <Input
                        fluid
                        disabled={ !conditionState.enabled }
                        placeholder="Type a value and press Add"
                        value={ listInputValues[field.field.name] ?? "" }
                        onChange={ (
                            _e: ChangeEvent<HTMLInputElement>,
                            data: InputOnChangeData
                        ): void => handleListInputChange(field.field.name, data.value) }
                        onKeyDown={ (e: React.KeyboardEvent<HTMLInputElement>): void => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddListValue(field.field.name);
                            }
                        } }
                        action={
                            <Button
                                type="button"
                                disabled={ !conditionState.enabled }
                                onClick={ (): void => handleAddListValue(field.field.name) }
                                data-componentid={ `${ componentId }-${ field.field.name }-add-btn` }
                            >
                                Add
                            </Button>
                        }
                        data-componentid={ `${ componentId }-${ field.field.name }-list-input` }
                    />
                </div>
            );
        }

        // single-select dropdown
        if (isOptions) {
            return (
                <Dropdown
                    fluid
                    selection
                    disabled={ !conditionState.enabled }
                    options={ options }
                    value={ conditionState.value }
                    onChange={ (
                        _e: SyntheticEvent<HTMLElement>,
                        data: DropdownProps
                    ): void => handleValueChange(field.field.name, data.value as string) }
                    data-componentid={ `${ componentId }-${ field.field.name }-value` }
                />
            );
        }

        // free-text number input
        return (
            <Input
                fluid
                type="number"
                disabled={ !conditionState.enabled }
                value={ conditionState.value }
                onChange={ (
                    _e: ChangeEvent<HTMLInputElement>,
                    data: InputOnChangeData
                ): void => handleValueChange(field.field.name, data.value) }
                data-componentid={ `${ componentId }-${ field.field.name }-value` }
            />
        );
    };

    const renderRuleBuilderStep = (): ReactElement => (
        <div className="device-policy-rule-builder">
            <Heading as="h6">
                { t("devices:assurancePolicies.wizard.steps.ruleBuilder.heading") }
            </Heading>
            <p className="sub-heading">
                { t("devices:assurancePolicies.wizard.steps.ruleBuilder.description") }
            </p>
            <Form>
                <Form.Field required>
                    <label>
                        { t("devices:assurancePolicies.wizard.steps.ruleBuilder.policyNameLabel") }
                    </label>
                    <Input
                        fluid
                        value={ policyName }
                        placeholder={ t(
                            "devices:assurancePolicies.wizard.steps.ruleBuilder.policyNamePlaceholder"
                        ) }
                        onChange={ (
                            _e: ChangeEvent<HTMLInputElement>,
                            data: InputOnChangeData
                        ): void => setPolicyName(data.value) }
                        data-componentid={ `${ componentId }-policy-name` }
                    />
                </Form.Field>
            </Form>

            <Divider />

            <Heading as="h6">
                { t("devices:assurancePolicies.wizard.steps.ruleBuilder.conditionsHeading") }
            </Heading>
            <p className="sub-heading">
                { t("devices:assurancePolicies.wizard.steps.ruleBuilder.conditionsDescription") }
            </p>

            <Form>
                { nonPlatformFields.map((field: DevicePolicyFieldDefinitionInterface): ReactElement => {
                    const conditionState: ConditionStateInterface = conditions[field.field.name] ?? {
                        enabled: false,
                        listValues: [],
                        operator: field.operators[0]?.name ?? "",
                        value: ""
                    };

                    const operatorOptions: DropdownItemProps[] = field.operators.map(
                        (op: { name: string; displayName: string }): DropdownItemProps => ({
                            key: op.name,
                            text: op.displayName,
                            value: op.name
                        })
                    );

                    return (
                        <Form.Group
                            key={ field.field.name }
                            className="condition-row"
                            style={ {
                                alignItems: "center",
                                marginBottom: "1rem"
                            } }
                        >
                            <Form.Field
                                width={ 2 }
                                style={ { display: "flex", alignItems: "center" } }
                            >
                                <Checkbox
                                    toggle
                                    checked={ conditionState.enabled }
                                    onChange={ (
                                        _e: SyntheticEvent,
                                        data: CheckboxProps
                                    ): void =>
                                        handleToggleCondition(field.field.name, data.checked as boolean)
                                    }
                                    data-componentid={
                                        `${ componentId }-${ field.field.name }-toggle`
                                    }
                                />
                            </Form.Field>
                            <Form.Field
                                width={ 4 }
                                style={ { display: "flex", alignItems: "center" } }
                            >
                                <strong
                                    style={ {
                                        color: conditionState.enabled
                                            ? "inherit"
                                            : "rgba(0,0,0,0.4)",
                                        whiteSpace: "nowrap"
                                    } }
                                >
                                    { field.field.displayName }
                                </strong>
                            </Form.Field>
                            <Form.Field width={ 4 } disabled={ !conditionState.enabled }>
                                { field.operators.length === 1 ? (
                                    <span
                                        style={ {
                                            color: conditionState.enabled
                                                ? "inherit"
                                                : "rgba(0,0,0,0.4)"
                                        } }
                                    >
                                        { field.operators[0].displayName }
                                    </span>
                                ) : (
                                    <Dropdown
                                        fluid
                                        selection
                                        disabled={ !conditionState.enabled }
                                        options={ operatorOptions }
                                        value={ conditionState.operator }
                                        onChange={ (
                                            _e: SyntheticEvent<HTMLElement>,
                                            data: DropdownProps
                                        ): void =>
                                            handleOperatorChange(
                                                field.field.name,
                                                data.value as string
                                            )
                                        }
                                        data-componentid={
                                            `${ componentId }-${ field.field.name }-operator`
                                        }
                                    />
                                ) }
                            </Form.Field>
                            <Form.Field width={ 5 }>
                                { renderConditionValueInput(field, conditionState) }
                            </Form.Field>
                        </Form.Group>
                    );
                }) }
            </Form>
        </div>
    );

    const resolveStepContent = (): ReactElement => {
        switch (currentStep) {
            case WizardStep.PLATFORM:
                return renderPlatformStep();
            case WizardStep.RULE_BUILDER:
                return renderRuleBuilderStep();
            default:
                return null;
        }
    };

    const resolveFooterActions = (): ReactElement => (
        <Grid>
            <Grid.Row column={ 1 }>
                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                    <LinkButton
                        floated="left"
                        onClick={ onClose }
                        data-componentid={ `${ componentId }-cancel-button` }
                    >
                        { t("devices:assurancePolicies.wizard.buttons.cancel") }
                    </LinkButton>
                </Grid.Column>
                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                    { currentStep === WizardStep.RULE_BUILDER && (
                        <LinkButton
                            floated="right"
                            onClick={ (): void => setCurrentStep(WizardStep.PLATFORM) }
                            data-componentid={ `${ componentId }-back-button` }
                        >
                            <Icon name="arrow left" />
                            { t("devices:assurancePolicies.wizard.buttons.back") }
                        </LinkButton>
                    ) }
                    { currentStep === WizardStep.PLATFORM && (
                        <PrimaryButton
                            floated="right"
                            disabled={ !selectedPlatform || isMetadataLoading }
                            loading={ isMetadataLoading }
                            onClick={ (): void => setCurrentStep(WizardStep.RULE_BUILDER) }
                            data-componentid={ `${ componentId }-next-button` }
                        >
                            { t("devices:assurancePolicies.wizard.buttons.next") }
                            <Icon name="arrow right" />
                        </PrimaryButton>
                    ) }
                    { currentStep === WizardStep.RULE_BUILDER && (
                        <PrimaryButton
                            floated="right"
                            disabled={ !isSaveEnabled || isSubmitting }
                            loading={ isSubmitting }
                            onClick={ handleSave }
                            data-componentid={ `${ componentId }-save-button` }
                        >
                            { t("devices:assurancePolicies.wizard.buttons.save") }
                        </PrimaryButton>
                    ) }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    return (
        <Modal
            open
            className="wizard edit-device-policy-wizard"
            dimmer="blurring"
            size="small"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape={ false }
            data-componentid={ componentId }
        >
            <Modal.Header className="wizard-header">
                { t("devices:assurancePolicies.edit.wizard.heading") }
                <Heading as="h6">
                    { t("devices:assurancePolicies.edit.wizard.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group current={ currentStep }>
                    { WIZARD_STEPS.map((
                        step: { icon: FunctionComponent<SVGProps<SVGSVGElement>>; title: string },
                        index: number
                    ) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { resolveStepContent() }
            </Modal.Content>
            <Modal.Actions>
                { resolveFooterActions() }
            </Modal.Actions>
        </Modal>
    );
};

export default EditDevicePolicyWizard;
