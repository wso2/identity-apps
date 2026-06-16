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
import { ConditionExpressionsMetaDataInterface } from "@wso2is/admin.rules.v1/models/meta";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { getRuleInstanceValue } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Heading,
    LinkButton,
    PrimaryButton,
    Steps
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
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
    Grid,
    Icon,
    Modal
} from "semantic-ui-react";
import PolicyReviewStep from "./steps/policy-review-step";
import PolicyRulesStep from "./steps/policy-rules-step";
import { ReactComponent as DeviceOutlineIcon } from "../assets/icons/device-window-outline.svg";
import { ReactComponent as SettingsOutlineIcon } from "../assets/icons/settings-outline.svg";
import { updateDevicePolicy } from "../api/device-policies";
import useGetDevicePolicyMetadata from "../hooks/use-get-device-policy-metadata";
import {
    DevicePlatformType,
    DevicePolicyFieldDefinitionInterface,
    PlatformDefinitionInterface,
    PolicyResourceRequestInterface,
    PolicyResourceResponseInterface
} from "../models/device-policy";
import {
    buildFlatRule,
    convertApiRuleToRuleFormat,
    mapToConditionsMeta
} from "../utils/device-policy-rule-utils";

interface EditDevicePolicyWizardPropsInterface extends IdentifiableComponentInterface {
    policyId: string;
    initialName: string;
    initialRules: PolicyResourceResponseInterface[];
    onClose: () => void;
    onSuccess: () => void;
}

enum WizardStep {
    EXECUTION_RULES = 0,
    REVIEW = 1
}

const EditDevicePolicyWizard: FunctionComponent<EditDevicePolicyWizardPropsInterface> = (
    props: EditDevicePolicyWizardPropsInterface
): ReactElement => {
    const {
        "data-componentid": componentId = "edit-device-policy-wizard",
        policyId,
        initialName,
        initialRules,
        onClose,
        onSuccess
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const technologyLogos: ReturnType<typeof getTechnologyLogos> = getTechnologyLogos();

    const allPlatformDefs: PlatformDefinitionInterface[] = useMemo(
        (): PlatformDefinitionInterface[] => [
            {
                key: "android",
                label: t("devices:assurancePolicies.wizard.platforms.android"),
                logo: technologyLogos.android as FunctionComponent
            },
            {
                key: "ios",
                label: t("devices:assurancePolicies.wizard.platforms.ios"),
                logo: technologyLogos.ios as FunctionComponent
            },
            {
                key: "macos",
                label: t("devices:assurancePolicies.wizard.platforms.macos"),
                logo: technologyLogos.macos
            },
            {
                key: "windows",
                label: t("devices:assurancePolicies.wizard.platforms.windows"),
                logo: technologyLogos.windows as FunctionComponent
            }
        ],
        [ t, technologyLogos ]
    );

    const selectedPlatforms: DevicePlatformType[] = useMemo(
        (): DevicePlatformType[] => initialRules.map(
            (r: PolicyResourceResponseInterface): DevicePlatformType => r.target as DevicePlatformType
        ),
        [ initialRules ]
    );

    const initialPlatformRules: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>> = useMemo(
        (): Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>> =>
            initialRules.reduce(
                (
                    acc: Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>,
                    r: PolicyResourceResponseInterface
                ) => ({
                    ...acc,
                    [r.target]: convertApiRuleToRuleFormat(r)
                }),
                {}
            ),
        [ initialRules ]
    );

    const initialPlatformConfigured: Partial<Record<DevicePlatformType, boolean>> = useMemo(
        (): Partial<Record<DevicePlatformType, boolean>> =>
            initialRules.reduce(
                (
                    acc: Partial<Record<DevicePlatformType, boolean>>,
                    r: PolicyResourceResponseInterface
                ) => ({
                    ...acc,
                    [r.target]: (r.rule?.rules?.length ?? 0) > 0
                }),
                {}
            ),
        [ initialRules ]
    );

    /* -- State --------------------------------------------------------- */

    const [ currentStep, setCurrentStep ] = useState<WizardStep>(WizardStep.EXECUTION_RULES);
    const [ policyName ] = useState<string>(initialName);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ platformRules, setPlatformRules ] =
        useState<Partial<Record<DevicePlatformType, RuleWithoutIdInterface | null>>>(initialPlatformRules);
    const [ platformConfigured, setPlatformConfigured ] =
        useState<Partial<Record<DevicePlatformType, boolean>>>(initialPlatformConfigured);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const activePlatform: DevicePlatformType | null = selectedPlatforms[activeTabIndex] ?? null;

    /* -- Metadata ------------------------------------------------------ */

    const { data: androidMeta, isLoading: isAndroidLoading } =
        useGetDevicePolicyMetadata("android", selectedPlatforms.includes("android"));
    const { data: iosMeta, isLoading: isIosLoading } =
        useGetDevicePolicyMetadata("ios", selectedPlatforms.includes("ios"));
    const { data: macosMeta, isLoading: isMacosLoading } =
        useGetDevicePolicyMetadata("macos", selectedPlatforms.includes("macos"));
    const { data: windowsMeta, isLoading: isWindowsLoading } =
        useGetDevicePolicyMetadata("windows", selectedPlatforms.includes("windows"));

    const allRawMeta: Record<DevicePlatformType, DevicePolicyFieldDefinitionInterface[] | undefined> = useMemo(
        () => ({
            android: androidMeta,
            ios: iosMeta,
            macos: macosMeta,
            windows: windowsMeta
        }),
        [ androidMeta, iosMeta, macosMeta, windowsMeta ]
    );

    const metaLoading: Record<DevicePlatformType, boolean> = {
        android: isAndroidLoading,
        ios: isIosLoading,
        macos: isMacosLoading,
        windows: isWindowsLoading
    };

    const activeConditionsMeta: ConditionExpressionsMetaDataInterface = useMemo(
        (): ConditionExpressionsMetaDataInterface => {
            if (!activePlatform) return [];

            return mapToConditionsMeta(allRawMeta[activePlatform] ?? []);
        },
        [ activePlatform, allRawMeta ]
    );

    /* -- Handlers ------------------------------------------------------ */

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

    const handleNextToReview = (): void => {
        saveActivePlatformRule();
        setCurrentStep(WizardStep.REVIEW);
    };

    const handleSave = (): void => {
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

        updateDevicePolicy(policyId, { name: policyName.trim(), resources })
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
                dispatch(addAlert({
                    description:
                        error?.response?.data?.description
                        ?? t(
                            "devices:assurancePolicies.edit.notifications.update.genericError.description"
                        ),
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

    /* -- Wizard steps -------------------------------------------------- */

    const WIZARD_STEPS: { icon: FunctionComponent<SVGProps<SVGSVGElement>>; title: string }[] = [
        {
            icon: SettingsOutlineIcon,
            title: t("devices:assurancePolicies.wizard.steps.executionRules.title")
        },
        {
            icon: DeviceOutlineIcon,
            title: t("devices:assurancePolicies.wizard.steps.review.title")
        }
    ];

    /* -- Step renderers ------------------------------------------------ */

    const resolveStepContent = (): ReactElement => {
        switch (currentStep) {
            case WizardStep.EXECUTION_RULES:
                return (
                    <PolicyRulesStep
                        platforms={ allPlatformDefs }
                        selectedPlatforms={ selectedPlatforms }
                        activeTabIndex={ activeTabIndex }
                        platformRules={ platformRules }
                        platformConfigured={ platformConfigured }
                        activeConditionsMeta={ activeConditionsMeta }
                        isMetadataLoading={ activePlatform ? metaLoading[activePlatform] : false }
                        onTabChange={ handleTabChange }
                        onConfigureRule={ handleConfigureRule }
                        onClearRule={ handleClearRule }
                        data-componentid={ `${ componentId }-rules-step` }
                    />
                );
            case WizardStep.REVIEW:
                return (
                    <PolicyReviewStep
                        platforms={ allPlatformDefs }
                        selectedPlatforms={ selectedPlatforms }
                        policyName={ policyName }
                        platformRules={ platformRules }
                        platformConfigured={ platformConfigured }
                        onEditRules={ (): void => setCurrentStep(WizardStep.EXECUTION_RULES) }
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
                    { currentStep === WizardStep.REVIEW && (
                        <LinkButton
                            floated="right"
                            onClick={ (): void => setCurrentStep(WizardStep.EXECUTION_RULES) }
                            data-componentid={ `${ componentId }-back-button` }
                        >
                            <Icon name="arrow left" />
                            { t("devices:assurancePolicies.wizard.buttons.back") }
                        </LinkButton>
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
