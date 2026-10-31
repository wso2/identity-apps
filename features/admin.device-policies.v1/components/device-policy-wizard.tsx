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

import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Stack from "@oxygen-ui/react/Stack";
import Step from "@oxygen-ui/react/Step";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import Tab from "@oxygen-ui/react/Tab";
import Tabs from "@oxygen-ui/react/Tabs";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    ChangeEvent,
    FunctionComponent,
    KeyboardEvent,
    ReactElement,
    SVGProps,
    SyntheticEvent,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import DevicePolicyRuleEditor from "./device-policy-rule-editor";
import DevicePolicyRules from "./device-policy-rules";
import createDevicePolicy from "../api/create-device-policy";
import updateDevicePolicy from "../api/update-device-policy";
import {
    DEVICE_PLATFORMS,
    DEVICE_POLICY_NAME_MAX_LENGTH,
    DEVICE_POLICY_TYPE
} from "../constants/device-policy-constants";
import {
    DevicePolicyInterface,
    DevicePolicyResourceInterface,
    DevicePolicyResourceRequestInterface
} from "../models/device-policy";
import { isRuleComplete, toRuleData, toRuleRequest } from "../utils/device-policy-rule-utils";

interface DevicePolicyWizardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Policy to edit. A new policy is created when not given.
     */
    policy?: DevicePolicyInterface;
    /**
     * Callback to close the wizard.
     */
    onClose: () => void;
    /**
     * Callback to run after the policy is saved.
     */
    onSuccess: (policy: DevicePolicyInterface) => void;
}

enum WizardStep {
    GENERAL = 0,
    RULES = 1,
    REVIEW = 2
}

type PlatformRulesType = Record<string, RuleWithoutIdInterface>;

/**
 * Wizard to create a device assurance policy, or to change the platforms and rules of an existing one.
 *
 * @param props - Props injected to the component.
 * @returns Device policy wizard.
 */
const DevicePolicyWizard: FunctionComponent<DevicePolicyWizardPropsInterface> = ({
    policy,
    onClose,
    onSuccess,
    "data-componentid": componentId = "device-policy-wizard"
}: DevicePolicyWizardPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const isEdit: boolean = !!policy;
    const ruleResources: DevicePolicyResourceInterface[] = (policy?.resources ?? []).filter(
        (resource: DevicePolicyResourceInterface) => resource.resourceType === "RULE"
    );

    const [ currentStep, setCurrentStep ] = useState<WizardStep>(WizardStep.GENERAL);
    const [ name, setName ] = useState<string>(policy?.name ?? "");
    const [ nameError, setNameError ] = useState<string | undefined>(undefined);
    const [ platforms, setPlatforms ] = useState<string[]>(
        ruleResources.map((resource: DevicePolicyResourceInterface) => resource.target)
    );
    const [ platformsError, setPlatformsError ] = useState<string | undefined>(undefined);
    const [ platformRules, setPlatformRules ] = useState<PlatformRulesType>(
        Object.fromEntries(ruleResources.map((resource: DevicePolicyResourceInterface) => [
            resource.target,
            toRuleData(resource.rule)
        ]))
    );
    const [ activePlatform, setActivePlatform ] = useState<string | undefined>(undefined);
    const [ rulesError, setRulesError ] = useState<string | undefined>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const getPlatformLabel = (platform: string): string =>
        t(`devices:assurancePolicies.platforms.${ platform }`, { defaultValue: platform });

    const handlePlatformToggle = (platform: string): void => {
        // Rules of a removed platform are kept, so they come back if the platform is added again.
        setPlatforms((selected: string[]) => selected.includes(platform)
            ? selected.filter((selectedPlatform: string) => selectedPlatform !== platform)
            : DEVICE_PLATFORMS.filter((p: string) => p === platform || selected.includes(p)));
        setPlatformsError(undefined);
    };

    const handlePlatformRuleChange = (
        platform: string,
        rule: RuleWithoutIdInterface
    ): void => {
        setPlatformRules((rules: PlatformRulesType) => ({ ...rules, [ platform ]: rule }));
        setRulesError(undefined);
    };

    const handleNextToRules: () => void = (): void => {
        const trimmedName: string = name.trim();
        let isValid: boolean = true;

        if (!trimmedName) {
            setNameError(t("devices:assurancePolicies.wizard.general.name.validations.required"));
            isValid = false;
        }

        if (platforms.length === 0) {
            setPlatformsError(t("devices:assurancePolicies.wizard.general.platforms.validations.required"));
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        if (!activePlatform || !platforms.includes(activePlatform)) {
            setActivePlatform(platforms[0]);
        }
        setCurrentStep(WizardStep.RULES);
    };

    const handleNextToReview: () => void = (): void => {
        const incompletePlatforms: string[] = platforms.filter(
            (platform: string) => !isRuleComplete(platformRules[platform])
        );

        if (incompletePlatforms.length > 0) {
            setActivePlatform(incompletePlatforms[0]);
            setRulesError(t("devices:assurancePolicies.wizard.rules.validations.incomplete", {
                platforms: incompletePlatforms.map(getPlatformLabel).join(", ")
            }));

            return;
        }

        setCurrentStep(WizardStep.REVIEW);
    };

    const handleSubmit: () => void = (): void => {
        const resources: DevicePolicyResourceRequestInterface[] = platforms.map((platform: string) => ({
            resourceType: "RULE",
            rule: toRuleRequest(platformRules[platform]),
            target: platform
        }));
        const notificationKey: string =
            `devices:assurancePolicies.wizard.notifications.${ isEdit ? "update" : "create" }`;

        setIsSubmitting(true);

        (policy
            ? updateDevicePolicy(policy.id, { resources })
            : createDevicePolicy({ name: name.trim(), resources, type: DEVICE_POLICY_TYPE }))
            .then((savedPolicy: DevicePolicyInterface): void => {
                dispatch(addAlert({
                    description: t(`${ notificationKey }.success.description`),
                    level: AlertLevels.SUCCESS,
                    message: t(`${ notificationKey }.success.message`)
                }));
                onSuccess(savedPolicy);
            })
            .catch((error: AxiosError<{ description?: string }>): void => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t(`${ notificationKey }.genericError.description`),
                    level: AlertLevels.ERROR,
                    message: t(`${ notificationKey }.genericError.message`)
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    const renderPlatformLogo: (platform: string) => ReactElement = (platform: string): ReactElement => {
        const logo: FunctionComponent<SVGProps<SVGSVGElement>> | string =
            getTechnologyLogos()[ platform ] as FunctionComponent<SVGProps<SVGSVGElement>> | string;

        if (typeof logo === "string") {
            return <img src={ logo } alt="" height={ 40 } />;
        }

        const Logo: FunctionComponent<SVGProps<SVGSVGElement>> = logo;

        return <Logo height={ 40 } width={ 40 } />;
    };

    const renderGeneralStep: () => ReactElement = (): ReactElement => (
        <Stack spacing={ 3 }>
            <TextField
                fullWidth
                required
                disabled={ isEdit }
                label={ t("devices:assurancePolicies.wizard.general.name.label") }
                placeholder={ t("devices:assurancePolicies.wizard.general.name.placeholder") }
                value={ name }
                error={ !!nameError }
                helperText={ nameError ?? (isEdit
                    ? t("devices:assurancePolicies.wizard.general.name.editHint")
                    : t("devices:assurancePolicies.wizard.general.name.hint")) }
                inputProps={ { maxLength: DEVICE_POLICY_NAME_MAX_LENGTH } }
                onChange={ (event: ChangeEvent<HTMLInputElement>): void => {
                    setName(event.target.value);
                    setNameError(undefined);
                } }
                data-componentid={ `${ componentId }-name` }
            />
            <div>
                <Typography variant="body1">
                    { t("devices:assurancePolicies.wizard.general.platforms.label") }
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={ { mb: 1.5 } }>
                    { t("devices:assurancePolicies.wizard.general.platforms.hint") }
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={ 2 }>
                    { DEVICE_PLATFORMS.map((platform: string) => {
                        const isSelected: boolean = platforms.includes(platform);

                        return (
                            <Card
                                key={ platform }
                                variant="outlined"
                                role="checkbox"
                                aria-checked={ isSelected }
                                tabIndex={ 0 }
                                onClick={ (): void => handlePlatformToggle(platform) }
                                onKeyDown={ (event: KeyboardEvent<HTMLDivElement>): void => {
                                    if (event.key === " " || event.key === "Enter") {
                                        event.preventDefault();
                                        handlePlatformToggle(platform);
                                    }
                                } }
                                sx={ { borderColor: isSelected ? "primary.main" : undefined, cursor: "pointer", p: 2 } }
                                data-componentid={ `${ componentId }-${ platform }-card` }
                            >
                                <Stack alignItems="center" spacing={ 1 }>
                                    { renderPlatformLogo(platform) }
                                    <Typography variant="body2">{ getPlatformLabel(platform) }</Typography>
                                </Stack>
                            </Card>
                        );
                    }) }
                </Box>
                { platformsError && (
                    <Typography
                        variant="caption"
                        color="error"
                        data-componentid={ `${ componentId }-platforms-error` }
                    >
                        { platformsError }
                    </Typography>
                ) }
            </div>
        </Stack>
    );

    const renderRulesStep: () => ReactElement = (): ReactElement => (
        <>
            <Typography variant="body2" color="text.secondary">
                { t("devices:assurancePolicies.wizard.rules.hint") }
            </Typography>
            <Tabs
                value={ activePlatform }
                onChange={ (_event: SyntheticEvent, platform: string): void => setActivePlatform(platform) }
                data-componentid={ `${ componentId }-platform-tabs` }
            >
                { platforms.map((platform: string) => (
                    <Tab
                        key={ platform }
                        value={ platform }
                        label={ getPlatformLabel(platform) }
                        data-componentid={ `${ componentId }-${ platform }-tab` }
                    />
                )) }
            </Tabs>
            <Box sx={ { mt: 3 } }>
                { rulesError && (
                    <Typography
                        variant="body2"
                        color="error"
                        sx={ { mb: 2 } }
                        data-componentid={ `${ componentId }-rules-error` }
                    >
                        { rulesError }
                    </Typography>
                ) }
                { activePlatform && (
                    <DevicePolicyRuleEditor
                        key={ activePlatform }
                        platform={ activePlatform }
                        rule={ platformRules[ activePlatform ] }
                        onChange={ (rule: RuleWithoutIdInterface): void =>
                            handlePlatformRuleChange(activePlatform, rule) }
                        data-componentid={ `${ componentId }-${ activePlatform }-rule-editor` }
                    />
                ) }
            </Box>
        </>
    );

    const renderReviewStep: () => ReactElement = (): ReactElement => (
        <Stack spacing={ 3 }>
            <div>
                <Typography variant="h6" sx={ { mb: 1 } }>
                    { t("devices:assurancePolicies.wizard.general.name.label") }
                </Typography>
                <Typography variant="body1" data-componentid={ `${ componentId }-review-name` }>
                    { name.trim() }
                </Typography>
            </div>
            { platforms.map((platform: string) => (
                <div key={ platform }>
                    <Typography variant="h6" sx={ { mb: 1 } }>{ getPlatformLabel(platform) }</Typography>
                    <DevicePolicyRules
                        platform={ platform }
                        rule={ platformRules[ platform ] }
                        data-componentid={ `${ componentId }-${ platform }-review-rules` }
                    />
                </div>
            )) }
        </Stack>
    );

    const steps: string[] = [
        t("devices:assurancePolicies.wizard.steps.general"),
        t("devices:assurancePolicies.wizard.steps.rules"),
        t("devices:assurancePolicies.wizard.steps.review")
    ];

    return (
        <Dialog
            open={ true }
            fullWidth
            maxWidth="md"
            onClose={ (_event: unknown, reason: string): void => {
                if (reason !== "backdropClick" && !isSubmitting) {
                    onClose();
                }
            } }
            data-componentid={ componentId }
        >
            <DialogTitle>
                { policy
                    ? t("devices:assurancePolicies.wizard.edit.heading", { name: policy.name })
                    : t("devices:assurancePolicies.wizard.create.heading") }
                <Typography variant="body2" color="text.secondary">
                    { isEdit
                        ? t("devices:assurancePolicies.wizard.edit.subHeading")
                        : t("devices:assurancePolicies.wizard.create.subHeading") }
                </Typography>
            </DialogTitle>
            <DialogContent dividers sx={ { paddingY: 3 } }>
                <Stepper
                    activeStep={ currentStep }
                    alternativeLabel
                    sx={ {
                        "& .MuiStepConnector-root": {
                            left: "calc(-50% + 24px)",
                            marginLeft: 0,
                            right: "calc(50% + 24px)",
                            top: 15
                        },
                        mb: 3
                    } }
                >
                    { steps.map((step: string) => (
                        <Step key={ step }>
                            <StepLabel>{ step }</StepLabel>
                        </Step>
                    )) }
                </Stepper>
                { currentStep === WizardStep.GENERAL && renderGeneralStep() }
                { currentStep === WizardStep.RULES && renderRulesStep() }
                { currentStep === WizardStep.REVIEW && renderReviewStep() }
            </DialogContent>
            <DialogActions sx={ { paddingX: 2, paddingY: 1.5 } }>
                <LinkButton
                    disabled={ isSubmitting }
                    onClick={ onClose }
                    data-componentid={ `${ componentId }-cancel-button` }
                >
                    { t("common:cancel") }
                </LinkButton>
                <Box flexGrow={ 1 } />
                { currentStep > WizardStep.GENERAL && (
                    <LinkButton
                        disabled={ isSubmitting }
                        onClick={ (): void => setCurrentStep(currentStep - 1) }
                        data-componentid={ `${ componentId }-previous-button` }
                    >
                        { t("common:previous") }
                    </LinkButton>
                ) }
                { currentStep === WizardStep.GENERAL && (
                    <PrimaryButton onClick={ handleNextToRules } data-componentid={ `${ componentId }-next-button` }>
                        { t("common:next") }
                    </PrimaryButton>
                ) }
                { currentStep === WizardStep.RULES && (
                    <PrimaryButton onClick={ handleNextToReview } data-componentid={ `${ componentId }-next-button` }>
                        { t("common:next") }
                    </PrimaryButton>
                ) }
                { currentStep === WizardStep.REVIEW && (
                    <PrimaryButton
                        disabled={ isSubmitting }
                        loading={ isSubmitting }
                        onClick={ handleSubmit }
                        data-componentid={ `${ componentId }-submit-button` }
                    >
                        { isEdit ? t("common:update") : t("common:create") }
                    </PrimaryButton>
                ) }
            </DialogActions>
        </Dialog>
    );
};

export default DevicePolicyWizard;
