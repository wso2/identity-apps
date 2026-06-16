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

import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import { ConditionExpressionsMetaDataInterface } from "@wso2is/admin.rules.v1/models/meta";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { getRuleInstanceValue } from "@wso2is/admin.rules.v1/providers/rules-provider";
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
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    Card,
    Form,
    Grid,
    Icon,
    Input,
    InputOnChangeData,
    Modal
} from "semantic-ui-react";
import PolicyReviewStep from "./steps/policy-review-step";
import PolicyRulesStep from "./steps/policy-rules-step";
import { ReactComponent as DeviceOutlineIcon } from "../assets/icons/device-window-outline.svg";
import { ReactComponent as SettingsOutlineIcon } from "../assets/icons/settings-outline.svg";
import { createDevicePolicy } from "../api/device-policies";
import useGetDevicePolicyMetadata from "../hooks/use-get-device-policy-metadata";
import {
    DevicePlatformType,
    DevicePolicyFieldDefinitionInterface,
    PlatformDefinitionInterface,
    PolicyResourceRequestInterface
} from "../models/device-policy";
import { buildFlatRule, mapToConditionsMeta } from "../utils/device-policy-rule-utils";

interface CreateDevicePolicyWizardPropsInterface extends IdentifiableComponentInterface {
    onClose: () => void;
    onSuccess: () => void;
}

enum WizardStep {
    BASIC_DETAILS = 0,
    EXECUTION_RULES = 1,
    REVIEW = 2
}

const CreateDevicePolicyWizard: FunctionComponent<CreateDevicePolicyWizardPropsInterface> = (
    props: CreateDevicePolicyWizardPropsInterface
): ReactElement => {
    const {
        "data-componentid": componentId = "create-device-policy-wizard",
        onClose,
        onSuccess
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const technologyLogos: ReturnType<typeof getTechnologyLogos> = getTechnologyLogos();

    const platforms: PlatformDefinitionInterface[] = useMemo(
        (): PlatformDefinitionInterface[] => [
            {
                description: t("devices:assurancePolicies.wizard.platformDescriptions.android"),
                key: "android",
                label: t("devices:assurancePolicies.wizard.platforms.android"),
                logo: technologyLogos.android as FunctionComponent
            },
            {
                description: t("devices:assurancePolicies.wizard.platformDescriptions.ios"),
                key: "ios",
                label: t("devices:assurancePolicies.wizard.platforms.ios"),
                logo: technologyLogos.ios as FunctionComponent
            },
            {
                description: t("devices:assurancePolicies.wizard.platformDescriptions.macos"),
                key: "macos",
                label: t("devices:assurancePolicies.wizard.platforms.macos"),
                logo: technologyLogos.macos
            },
            {
                description: t("devices:assurancePolicies.wizard.platformDescriptions.windows"),
                key: "windows",
                label: t("devices:assurancePolicies.wizard.platforms.windows"),
                logo: technologyLogos.windows as FunctionComponent
            }
        ],
        [ t, technologyLogos ]
    );

    /* -- State --------------------------------------------------------- */

    const [ currentStep, setCurrentStep ] = useState<WizardStep>(WizardStep.BASIC_DETAILS);
    const [ policyName, setPolicyName ] = useState<string>("");
    const [ nameError, setNameError ] = useState<string>("");
    const [ selectedPlatforms, setSelectedPlatforms ] = useState<DevicePlatformType[]>([]);
    const [ platformsError, setPlatformsError ] = useState<string>("");
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ platformRules, setPlatformRules ] =
        useState<Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>>({});
    const [ platformConfigured, setPlatformConfigured ] =
        useState<Partial<Record<DevicePlatformType, boolean>>>({});
    const [ rulesValidationError, setRulesValidationError ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const activePlatform: DevicePlatformType | null = selectedPlatforms[activeTabIndex] ?? null;

    /* -- Metadata (one hook per platform, SWR caches by URL) ----------- */
    const onRulesStep: boolean = currentStep === WizardStep.EXECUTION_RULES;

    const { data: androidMeta, isLoading: isAndroidLoading } =
        useGetDevicePolicyMetadata("android", onRulesStep && selectedPlatforms.includes("android"));
    const { data: iosMeta, isLoading: isIosLoading } =
        useGetDevicePolicyMetadata("ios", onRulesStep && selectedPlatforms.includes("ios"));
    const { data: macosMeta, isLoading: isMacosLoading } =
        useGetDevicePolicyMetadata("macos", onRulesStep && selectedPlatforms.includes("macos"));
    const { data: windowsMeta, isLoading: isWindowsLoading } =
        useGetDevicePolicyMetadata("windows", onRulesStep && selectedPlatforms.includes("windows"));

    const allRawMeta: Record<DevicePlatformType, DevicePolicyFieldDefinitionInterface[] | undefined> =
        useMemo(() => ({
            android: androidMeta,
            ios: iosMeta,
            macos: macosMeta,
            windows: windowsMeta
        }), [ androidMeta, iosMeta, macosMeta, windowsMeta ]);

    const metaLoading: Record<DevicePlatformType, boolean> = {
        android: isAndroidLoading,
        ios: isIosLoading,
        macos: isMacosLoading,
        windows: isWindowsLoading
    };

    const activeConditionsMeta: ConditionExpressionsMetaDataInterface = useMemo(
        (): ConditionExpressionsMetaDataInterface => {
            if (!activePlatform) {
                return [];
            }

            return mapToConditionsMeta(allRawMeta[activePlatform] ?? []);
        },
        [ activePlatform, allRawMeta ]
    );

    /* -- Handlers ------------------------------------------------------ */

    const handlePlatformToggle = (platform: DevicePlatformType): void => {
        setSelectedPlatforms((prev: DevicePlatformType[]): DevicePlatformType[] => {
            if (prev.includes(platform)) {
                const next: DevicePlatformType[] = prev.filter(
                    (p: DevicePlatformType): boolean => p !== platform
                );

                setPlatformRules(
                    (r: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>) => {
                        const copy: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>> = {
                            ...r
                        };

                        delete copy[platform];

                        return copy;
                    }
                );
                setPlatformConfigured(
                    (c: Partial<Record<DevicePlatformType, boolean>>) => {
                        const copy: Partial<Record<DevicePlatformType, boolean>> = { ...c };

                        delete copy[platform];

                        return copy;
                    }
                );

                return next;
            }

            return [ ...prev, platform ];
        });
        setPlatformsError("");
    };

    const saveActivePlatformRule = (): void => {
        if (activePlatform !== null && platformConfigured[activePlatform]) {
            const rule: RuleWithoutIdInterface | null =
                getRuleInstanceValue() as RuleWithoutIdInterface | null;

            setPlatformRules(
                (prev: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>) => ({
                    ...prev,
                    [activePlatform]: rule
                })
            );
        }
    };

    const handleTabChange = (newIndex: number): void => {
        saveActivePlatformRule();
        setActiveTabIndex(newIndex);
    };

    const handleConfigureRule = (): void => {
        setPlatformConfigured(
            (prev: Partial<Record<DevicePlatformType, boolean>>) => ({
                ...prev,
                [activePlatform]: true
            })
        );
    };

    const handleClearRule = (): void => {
        setPlatformConfigured(
            (prev: Partial<Record<DevicePlatformType, boolean>>) => ({
                ...prev,
                [activePlatform]: false
            })
        );
        setPlatformRules(
            (prev: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>) => ({
                ...prev,
                [activePlatform]: null
            })
        );
    };

    const handleRemovePlatformFromStep2 = (platform: DevicePlatformType): void => {
        if (platform === activePlatform && platformConfigured[platform]) {
            saveActivePlatformRule();
        }

        const newPlatforms: DevicePlatformType[] = selectedPlatforms.filter(
            (p: DevicePlatformType): boolean => p !== platform
        );

        if (newPlatforms.length === 0) {
            setCurrentStep(WizardStep.BASIC_DETAILS);

            return;
        }

        setSelectedPlatforms(newPlatforms);
        setPlatformRules(
            (prev: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>) => {
                const copy: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>> = { ...prev };

                delete copy[platform];

                return copy;
            }
        );
        setPlatformConfigured(
            (prev: Partial<Record<DevicePlatformType, boolean>>) => {
                const copy: Partial<Record<DevicePlatformType, boolean>> = { ...prev };

                delete copy[platform];

                return copy;
            }
        );
        setActiveTabIndex((prev: number): number => Math.min(prev, newPlatforms.length - 1));
        setRulesValidationError("");
    };

    const validateStep1 = (): boolean => {
        let valid: boolean = true;
        const trimmed: string = policyName.trim();

        if (trimmed.length === 0) {
            setNameError(t("devices:assurancePolicies.wizard.notifications.create.genericError.description"));
            valid = false;
        } else if (trimmed.length < 3) {
            setNameError("Use at least 3 characters.");
            valid = false;
        } else {
            setNameError("");
        }

        if (selectedPlatforms.length === 0) {
            setPlatformsError("Select at least one platform.");
            valid = false;
        } else {
            setPlatformsError("");
        }

        return valid;
    };

    const handleNextToRules = (): void => {
        if (!validateStep1()) {
            return;
        }

        setActiveTabIndex(0);
        setCurrentStep(WizardStep.EXECUTION_RULES);
    };

    const handleNextToReview = (): void => {
        saveActivePlatformRule();

        const anyConfigured: boolean = selectedPlatforms.some(
            (p: DevicePlatformType): boolean => platformConfigured[p] === true
        );

        if (!anyConfigured) {
            setRulesValidationError(
                "Configure an execution rule for at least one platform before proceeding."
            );

            return;
        }

        setRulesValidationError("");
        setCurrentStep(WizardStep.REVIEW);
    };

    const handleCreate = (): void => {
        setIsSubmitting(true);

        const saved: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>> = {
            ...platformRules
        };

        if (activePlatform !== null && platformConfigured[activePlatform]) {
            saved[activePlatform] =
                getRuleInstanceValue() as RuleWithoutIdInterface | null;
        }

        const resources: PolicyResourceRequestInterface[] =
            selectedPlatforms.map(
                (p: DevicePlatformType): PolicyResourceRequestInterface => ({
                    rule: buildFlatRule(platformConfigured[p] ? (saved[p] ?? null) : null),
                    resourceType: "RULE",
                    target: p
                })
            );

        createDevicePolicy({ name: policyName.trim(), resources })
            .then((): void => {
                dispatch(addAlert({
                    description: t(
                        "devices:assurancePolicies.wizard.notifications.create.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devices:assurancePolicies.wizard.notifications.create.success.message"
                    )
                }));
                onSuccess();
            })
            .catch((error: AxiosError<{ description?: string }>): void => {
                dispatch(addAlert({
                    description:
                        error?.response?.data?.description
                        ?? t(
                            "devices:assurancePolicies.wizard.notifications.create.genericError.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "devices:assurancePolicies.wizard.notifications.create.genericError.message"
                    )
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    /* -- Wizard steps config ------------------------------------------- */

    const WIZARD_STEPS: { icon: FunctionComponent<SVGProps<SVGSVGElement>>; title: string }[] = [
        {
            icon: DeviceOutlineIcon,
            title: t("devices:assurancePolicies.wizard.steps.platform.title")
        },
        {
            icon: SettingsOutlineIcon,
            title: t("devices:assurancePolicies.wizard.steps.executionRules.title")
        },
        {
            icon: SettingsOutlineIcon,
            title: t("devices:assurancePolicies.wizard.steps.review.title")
        }
    ];

    /* -- Step renderers ------------------------------------------------ */

    const renderBasicDetailsStep = (): ReactElement => (
        <Box>
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
                        error={ nameError.length > 0 }
                        onChange={ (
                            _e: ChangeEvent<HTMLInputElement>,
                            data: InputOnChangeData
                        ): void => {
                            setPolicyName(data.value);
                            if (nameError) {
                                setNameError("");
                            }
                        } }
                        data-componentid={ `${ componentId }-policy-name` }
                    />
                    { nameError && (
                        <Typography
                            variant="caption"
                            sx={ { color: "error.main", mt: 0.5, display: "block" } }
                        >
                            { nameError }
                        </Typography>
                    ) }
                    <Typography variant="caption" sx={ { color: "text.secondary", mt: 0.5, display: "block" } }>
                        A short, recognizable label. 3–80 characters.
                    </Typography>
                </Form.Field>
            </Form>

            <Box sx={ { mt: 3 } }>
                <Form.Field required>
                    <label>
                        { t("devices:assurancePolicies.wizard.steps.platform.heading") }
                    </label>
                </Form.Field>
                <Typography variant="caption" sx={ { color: "text.secondary", mb: 1.5, display: "block" } }>
                    { t("devices:assurancePolicies.wizard.steps.platform.description") }
                </Typography>
                <Card.Group itemsPerRow={ 4 } className="platform-selection-cards">
                    { platforms.map((platform: PlatformDefinitionInterface) => (
                        <SelectionCard
                            key={ platform.key }
                            image={ platform.logo }
                            size="default"
                            header={ platform.label }
                            selected={ selectedPlatforms.includes(platform.key) }
                            onClick={ (): void => handlePlatformToggle(platform.key) }
                            imageSize="tiny"
                            imageOptions={ {
                                relaxed: true,
                                square: false,
                                width: "auto"
                            } }
                            contentTopBorder={ false }
                            renderDisabledItemsAsGrayscale={ false }
                            data-componentid={ `${ componentId }-${ platform.key }-card` }
                        />
                    )) }
                </Card.Group>
                { platformsError && (
                    <Typography variant="caption" sx={ { color: "error.main", mt: 1, display: "block" } }>
                        { platformsError }
                    </Typography>
                ) }
            </Box>
        </Box>
    );

    const resolveStepContent = (): ReactElement => {
        switch (currentStep) {
            case WizardStep.BASIC_DETAILS:
                return renderBasicDetailsStep();
            case WizardStep.EXECUTION_RULES:
                return (
                    <PolicyRulesStep
                        platforms={ platforms }
                        selectedPlatforms={ selectedPlatforms }
                        activeTabIndex={ activeTabIndex }
                        platformRules={ platformRules }
                        platformConfigured={ platformConfigured }
                        activeConditionsMeta={ activeConditionsMeta }
                        isMetadataLoading={ activePlatform ? metaLoading[activePlatform] : false }
                        rulesValidationError={ rulesValidationError }
                        onTabChange={ handleTabChange }
                        onConfigureRule={ handleConfigureRule }
                        onClearRule={ handleClearRule }
                        onRemovePlatform={ handleRemovePlatformFromStep2 }
                        data-componentid={ `${ componentId }-rules-step` }
                    />
                );
            case WizardStep.REVIEW:
                return (
                    <PolicyReviewStep
                        platforms={ platforms }
                        selectedPlatforms={ selectedPlatforms }
                        policyName={ policyName }
                        platformRules={ platformRules }
                        platformConfigured={ platformConfigured }
                        onEditPolicy={ (): void => setCurrentStep(WizardStep.BASIC_DETAILS) }
                        onEditRules={ (): void => setCurrentStep(WizardStep.EXECUTION_RULES) }
                        showAssignHint={ true }
                        data-componentid={ `${ componentId }-review-step` }
                    />
                );
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
                    { currentStep > WizardStep.BASIC_DETAILS && (
                        <LinkButton
                            floated="right"
                            onClick={ (): void => setCurrentStep(
                                (prev: WizardStep): WizardStep => prev - 1
                            ) }
                            data-componentid={ `${ componentId }-back-button` }
                        >
                            <Icon name="arrow left" />
                            { t("devices:assurancePolicies.wizard.buttons.back") }
                        </LinkButton>
                    ) }
                    { currentStep === WizardStep.BASIC_DETAILS && (
                        <PrimaryButton
                            floated="right"
                            onClick={ handleNextToRules }
                            data-componentid={ `${ componentId }-next-button` }
                        >
                            { t("devices:assurancePolicies.wizard.buttons.next") }
                            <Icon name="arrow right" />
                        </PrimaryButton>
                    ) }
                    { currentStep === WizardStep.EXECUTION_RULES && (
                        <PrimaryButton
                            floated="right"
                            onClick={ handleNextToReview }
                            data-componentid={ `${ componentId }-review-button` }
                        >
                            { t("devices:assurancePolicies.wizard.buttons.next") }
                            <Icon name="arrow right" />
                        </PrimaryButton>
                    ) }
                    { currentStep === WizardStep.REVIEW && (
                        <PrimaryButton
                            floated="right"
                            disabled={ isSubmitting }
                            loading={ isSubmitting }
                            onClick={ handleCreate }
                            data-componentid={ `${ componentId }-create-button` }
                        >
                            { t("devices:assurancePolicies.wizard.buttons.create") }
                        </PrimaryButton>
                    ) }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    return (
        <Modal
            open
            className="wizard create-device-policy-wizard"
            dimmer="blurring"
            size="small"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape={ false }
            data-componentid={ componentId }
        >
            <Modal.Header className="wizard-header">
                { t("devices:assurancePolicies.wizard.heading") }
                <Heading as="h6">
                    { t("devices:assurancePolicies.wizard.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group current={ currentStep }>
                    { WIZARD_STEPS.map(
                        (
                            step: { icon: FunctionComponent<SVGProps<SVGSVGElement>>; title: string },
                            index: number
                        ) => (
                            <Steps.Step
                                key={ index }
                                icon={ step.icon }
                                title={ step.title }
                            />
                        )
                    ) }
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

export default CreateDevicePolicyWizard;
