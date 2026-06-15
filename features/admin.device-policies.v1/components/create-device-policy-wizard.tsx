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

import { alpha, styled, Theme } from "@mui/material/styles";
import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import RulesComponent from "@wso2is/admin.rules.v1/components/rules-component";
import {
    ConditionExpressionMetaInterface,
    ConditionExpressionsMetaDataInterface
} from "@wso2is/admin.rules.v1/models/meta";
import { RuleConditionWithoutIdInterface, RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
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
import { ReactComponent as DeviceOutlineIcon } from "../assets/icons/device-window-outline.svg";
import { ReactComponent as SettingsOutlineIcon } from "../assets/icons/settings-outline.svg";
import { createDevicePolicy } from "../api/device-policies";
import useGetDevicePolicyMetadata from "../hooks/use-get-device-policy-metadata";
import {
    DevicePlatformType,
    DevicePolicyFieldDefinitionInterface,
    PolicyExpressionInterface,
    PolicyResourceRequestInterface,
    PolicyRuleInterface
} from "../models/device-policy";

interface CreateDevicePolicyWizardPropsInterface extends IdentifiableComponentInterface {
    onClose: () => void;
    onSuccess: () => void;
}

enum WizardStep {
    BASIC_DETAILS = 0,
    EXECUTION_RULES = 1,
    REVIEW = 2
}

interface PlatformDefinitionInterface {
    key: DevicePlatformType;
    label: string;
    description: string;
    logo: FunctionComponent | string;
}

/* ------------------------------------------------------------------ */
/*  Styled components                                                   */
/* ------------------------------------------------------------------ */


const StyledPlatformTabBar = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    gap: 4,
    margin: `0 -36px ${theme.spacing(3)}`,
    overflowX: "auto",
    padding: "0 36px"
}));

const StyledPlatformTab = styled("button", {
    shouldForwardProp: (prop: string): boolean => prop !== "isActive"
})<{ isActive?: boolean }>(
    ({ theme, isActive }: { theme: Theme; isActive?: boolean }) => ({
        alignItems: "center",
        background: "transparent",
        border: "none",
        borderBottom: `2.5px solid ${isActive ? theme.palette.primary.main : "transparent"}`,
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
        cursor: "pointer",
        display: "inline-flex",
        fontFamily: "inherit",
        fontSize: 14,
        fontWeight: 600,
        gap: 8,
        marginBottom: -1,
        padding: "14px 16px",
        transition: "color 140ms ease, border-color 140ms ease",
        whiteSpace: "nowrap",
        "&:hover": {
            color: isActive ? theme.palette.primary.main : theme.palette.text.primary
        }
    })
);

const StyledTabBadge = styled(Box, {
    shouldForwardProp: (prop: string): boolean => prop !== "isActive"
})<{ isActive?: boolean }>(
    ({ theme, isActive }: { theme: Theme; isActive?: boolean }) => ({
        background: isActive ? alpha(theme.palette.primary.light, 0.2) : theme.palette.action.hover,
        borderRadius: 999,
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
        fontSize: 11,
        fontWeight: 700,
        lineHeight: "1",
        padding: "2px 7px"
    })
);

const StyledRuleSummaryCode = styled(Box)(({ theme }: { theme: Theme }) => ({
    background: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    fontFamily: "ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    fontSize: 13,
    lineHeight: 1.8,
    padding: theme.spacing(1.5, 1.75)
}));

const StyledReviewPlatformCard = styled(Box)(({ theme }: { theme: Theme }) => ({
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2, 2.25)
}));

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const mapToConditionsMeta = (
    fields: DevicePolicyFieldDefinitionInterface[]
): ConditionExpressionsMetaDataInterface =>
    fields
        .filter((f: DevicePolicyFieldDefinitionInterface): boolean => f.field.name !== "platform")
        .map(
            (f: DevicePolicyFieldDefinitionInterface): ConditionExpressionMetaInterface => ({
                field: f.field,
                operators: f.operators,
                value: {
                    ...f.value,
                    inputType: f.value.inputType.toLowerCase() as "input" | "options"
                }
            })
        );

const buildFlatRule = (rule: RuleWithoutIdInterface | null): PolicyRuleInterface => {
    const expressions: PolicyExpressionInterface[] = (rule?.rules ?? []).flatMap(
        (group: RuleConditionWithoutIdInterface) =>
            (group.expressions ?? []).map(
                (e: { field: string; operator: string; value: string }): PolicyExpressionInterface => ({
                    field: e.field,
                    operator: e.operator,
                    value: e.value
                })
            )
    );

    return { condition: "AND", expressions };
};

const countConditions = (rule: RuleWithoutIdInterface | null): number =>
    (rule?.rules ?? []).reduce(
        (acc: number, g: RuleConditionWithoutIdInterface) => acc + (g.expressions?.length ?? 0),
        0
    );

const renderPlatformLogo = (
    logo: FunctionComponent | string,
    size: number
): ReactElement => {
    if (typeof logo === "string") {
        return <img src={ logo } alt="" style={ { height: size, objectFit: "contain", width: size } } />;
    }

    const LogoComponent: FunctionComponent<SVGProps<SVGSVGElement>> = logo as FunctionComponent<SVGProps<SVGSVGElement>>;

    return <LogoComponent width={ size } height={ size } />;
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------ */
    /*  Step renderers                                                      */
    /* ------------------------------------------------------------------ */

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

    const renderRuleEmptyState = (): ReactElement => {
        const pname: string =
            platforms.find((p: PlatformDefinitionInterface) => p.key === activePlatform)?.label
            ?? (activePlatform ?? "");

        return (
            <Alert
                sx={ { backgroundColor: "var(--oxygen-palette-grey-100)" } }
                icon={ false }
                data-componentid={ `${ componentId }-no-rule-info-box` }
            >
                <AlertTitle data-componentid={ `${ componentId }-rule-info-box-title` }>
                    { t("devices:assurancePolicies.wizard.steps.executionRules.emptyState.heading") }
                </AlertTitle>
                { t(
                    "devices:assurancePolicies.wizard.steps.executionRules.emptyState.description",
                    { platform: pname }
                ) }
                <Box sx={ { mt: 1.5 } }>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={ handleConfigureRule }
                        data-componentid={ `${ componentId }-configure-rule-btn` }
                    >
                        { t("devices:assurancePolicies.wizard.steps.executionRules.configureRule") }
                    </Button>
                </Box>
            </Alert>
        );
    };

    const renderRuleBuilder = (): ReactElement => {
        const isLoading: boolean = activePlatform ? metaLoading[activePlatform] : false;

        if (isLoading) {
            return (
                <Box sx={ { pt: 3, color: "text.secondary" } }>
                    <Typography variant="body2">
                        { t("devices:assurancePolicies.wizard.steps.executionRules.loadingMetadata") }
                    </Typography>
                </Box>
            );
        }

        if (activeConditionsMeta.length === 0) {
            return (
                <Box sx={ { pt: 3, color: "text.secondary" } }>
                    <Typography variant="body2">
                        { t("devices:assurancePolicies.wizard.steps.executionRules.noMetadata") }
                    </Typography>
                </Box>
            );
        }

        return (
            <RulesComponent
                key={ `rules-${ activePlatform }` }
                conditionExpressionsMetaData={ activeConditionsMeta }
                initialData={ platformRules[activePlatform] ?? null }
                data-componentid={ `${ componentId }-${ activePlatform }-rules` }
            />
        );
    };

    const renderExecutionRulesStep = (): ReactElement => {
        const activePlatformDef: PlatformDefinitionInterface | undefined =
            platforms.find((p: PlatformDefinitionInterface) => p.key === activePlatform);

        return (
            <Box>
                { /* Platform tab bar with per-tab remove */ }
                <StyledPlatformTabBar>
                    { selectedPlatforms.map((platform: DevicePlatformType, index: number) => {
                        const pDef: PlatformDefinitionInterface | undefined =
                            platforms.find((p: PlatformDefinitionInterface) => p.key === platform);
                        const isActive: boolean = activeTabIndex === index;
                        const condCount: number = platformRules[platform]
                            ? countConditions(platformRules[platform])
                            : 0;
                        const isConfigured: boolean = platformConfigured[platform] === true;

                        return (
                            <StyledPlatformTab
                                key={ platform }
                                type="button"
                                isActive={ isActive }
                                onClick={ (): void => handleTabChange(index) }
                                data-componentid={ `${ componentId }-${ platform }-tab` }
                            >
                                { pDef?.logo ? renderPlatformLogo(pDef.logo, 18) : null }
                                { pDef?.label ?? platform }
                                { isConfigured ? (
                                    <StyledTabBadge isActive={ isActive }>
                                        { condCount }
                                    </StyledTabBadge>
                                ) : (
                                    <StyledTabBadge isActive={ isActive }
                                        sx={ { fontSize: 14, lineHeight: 1, px: "5px", py: 0 } }
                                    >
                                        ·
                                    </StyledTabBadge>
                                ) }
                                { /* Remove platform × */ }
                                <Box
                                    component="span"
                                    onClick={ (e: React.MouseEvent): void => {
                                        e.stopPropagation();
                                        handleRemovePlatformFromStep2(platform);
                                    } }
                                    aria-label={ `Remove ${ pDef?.label ?? platform }` }
                                    sx={ {
                                        alignItems: "center",
                                        borderRadius: "50%",
                                        color: "inherit",
                                        display: "inline-flex",
                                        fontSize: 16,
                                        fontWeight: 400,
                                        height: 18,
                                        justifyContent: "center",
                                        lineHeight: 1,
                                        ml: 0.75,
                                        opacity: 0.6,
                                        width: 18,
                                        "&:hover": { opacity: 1 }
                                    } }
                                >
                                    ×
                                </Box>
                            </StyledPlatformTab>
                        );
                    }) }
                </StyledPlatformTabBar>

                { /* Rule section heading with "Clear Rule" when configured */ }
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={ { mb: 1.5 } }>
                    <Heading as="h5">
                        { t("devices:assurancePolicies.wizard.steps.executionRules.sectionLabel") }
                        { " " }
                        <Typography
                            component="span"
                            variant="body2"
                            sx={ { color: "text.secondary", fontWeight: 400 } }
                        >
                            — { activePlatformDef?.label }
                        </Typography>
                    </Heading>
                    { platformConfigured[activePlatform] && (
                        <Button
                            variant="text"
                            color="error"
                            size="small"
                            startIcon={ <TrashIcon /> }
                            onClick={ handleClearRule }
                            data-componentid={ `${ componentId }-clear-rule-btn` }
                        >
                            { t("devices:assurancePolicies.wizard.steps.executionRules.clearRule") }
                        </Button>
                    ) }
                </Stack>

                { /* Validation error */ }
                { rulesValidationError && (
                    <Typography
                        variant="caption"
                        sx={ { color: "error.main", display: "block", mb: 1.5 } }
                    >
                        { rulesValidationError }
                    </Typography>
                ) }

                { /* Content: empty state or rule builder */ }
                { !platformConfigured[activePlatform]
                    ? renderRuleEmptyState()
                    : renderRuleBuilder()
                }
            </Box>
        );
    };

    const renderReviewStep = (): ReactElement => {
        const selectedPlatformDefs: PlatformDefinitionInterface[] = platforms.filter(
            (p: PlatformDefinitionInterface) => selectedPlatforms.includes(p.key)
        );

        return (
            <Box>
                { /* Policy section */ }
                <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between"
                    sx={ { mb: 1.5 } }
                >
                    <Typography
                        variant="overline"
                        sx={ { fontWeight: 700, letterSpacing: "0.06em", color: "text.secondary" } }
                    >
                        { t("devices:assurancePolicies.wizard.steps.review.sectionPolicy") }
                    </Typography>
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={ (): void => setCurrentStep(WizardStep.BASIC_DETAILS) }
                    >
                        { t("devices:assurancePolicies.wizard.steps.review.edit") }
                    </Button>
                </Stack>
                <Box
                    sx={ {
                        display: "grid",
                        gridTemplateColumns: "160px 1fr",
                        gap: "14px 20px",
                        mb: 3.5
                    } }
                >
                    <Typography variant="body2" sx={ { color: "text.secondary", fontWeight: 600, pt: 0.5 } }>
                        Name
                    </Typography>
                    <Typography variant="body1" sx={ { fontWeight: 600 } }>
                        { policyName || <span style={ { color: "var(--text-disabled)" } }>(not set)</span> }
                    </Typography>
                    <Typography variant="body2" sx={ { color: "text.secondary", fontWeight: 600, pt: 0.5 } }>
                        Platforms
                    </Typography>
                    <Stack direction="row" spacing={ 1 } flexWrap="wrap" useFlexGap>
                        { selectedPlatformDefs.map((p: PlatformDefinitionInterface) => (
                            <Chip
                                key={ p.key }
                                label={ p.label }
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )) }
                    </Stack>
                </Box>

                { /* Execution rules section */ }
                <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between"
                    sx={ { mb: 1.5 } }
                >
                    <Typography
                        variant="overline"
                        sx={ { fontWeight: 700, letterSpacing: "0.06em", color: "text.secondary" } }
                    >
                        { t("devices:assurancePolicies.wizard.steps.review.sectionRules") }
                    </Typography>
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={ (): void => setCurrentStep(WizardStep.EXECUTION_RULES) }
                    >
                        { t("devices:assurancePolicies.wizard.steps.review.edit") }
                    </Button>
                </Stack>

                { selectedPlatformDefs.map((p: PlatformDefinitionInterface) => {
                    const rule: RuleWithoutIdInterface | null | undefined = platformRules[p.key];
                    const isConfigured: boolean = platformConfigured[p.key] === true;
                    const condCount: number = isConfigured && rule ? countConditions(rule) : 0;
                    const groupCount: number = isConfigured && rule ? (rule.rules?.length ?? 0) : 0;

                    return (
                        <StyledReviewPlatformCard key={ p.key }>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={ { mb: 1.25 } }
                            >
                                <Chip
                                    label={ p.label }
                                    size="small"
                                    variant="outlined"
                                    sx={ { color: "text.secondary", borderColor: "divider" } }
                                />
                                <Typography variant="caption" sx={ { color: "text.secondary" } }>
                                    { !isConfigured
                                        ? <span>Applies to <strong>all { p.label } devices</strong></span>
                                        : `${ condCount } condition(s) across ${ groupCount } group(s)`
                                    }
                                </Typography>
                            </Stack>
                            { isConfigured && rule && (
                                <StyledRuleSummaryCode>
                                    { (rule.rules ?? []).map(
                                        (
                                            group: RuleConditionWithoutIdInterface,
                                            gi: number
                                        ): ReactElement => (
                                            <React.Fragment key={ gi }>
                                                { gi > 0 && (
                                                    <Box
                                                        component="div"
                                                        sx={ {
                                                            color: "primary.main",
                                                            fontWeight: 700,
                                                            my: 0.75
                                                        } }
                                                    >
                                                        OR
                                                    </Box>
                                                ) }
                                                <div>
                                                    (
                                                    { (group.expressions ?? []).map(
                                                        (
                                                            expr: {
                                                                field: string;
                                                                operator: string;
                                                                value: string;
                                                            },
                                                            ei: number
                                                        ): ReactElement => (
                                                            <span key={ ei }>
                                                                { ei > 0 && (
                                                                    <Typography
                                                                        component="span"
                                                                        sx={ {
                                                                            color: "text.secondary",
                                                                            fontWeight: 700,
                                                                            fontFamily: "inherit",
                                                                            fontSize: "inherit"
                                                                        } }
                                                                    >
                                                                        { " AND " }
                                                                    </Typography>
                                                                ) }
                                                                <Typography
                                                                    component="span"
                                                                    sx={ {
                                                                        fontWeight: 600,
                                                                        fontFamily: "inherit",
                                                                        fontSize: "inherit"
                                                                    } }
                                                                >
                                                                    { expr.field }
                                                                </Typography>
                                                                <Typography
                                                                    component="span"
                                                                    sx={ {
                                                                        color: "text.secondary",
                                                                        fontFamily: "inherit",
                                                                        fontSize: "inherit"
                                                                    } }
                                                                >
                                                                    { " " }{ expr.operator }{ " " }
                                                                </Typography>
                                                                <Typography
                                                                    component="span"
                                                                    sx={ {
                                                                        color: "primary.main",
                                                                        fontWeight: 600,
                                                                        fontFamily: "inherit",
                                                                        fontSize: "inherit"
                                                                    } }
                                                                >
                                                                    &ldquo;{ expr.value || "?" }&rdquo;
                                                                </Typography>
                                                            </span>
                                                        )
                                                    ) }
                                                    )
                                                </div>
                                            </React.Fragment>
                                        )
                                    ) }
                                </StyledRuleSummaryCode>
                            ) }
                        </StyledReviewPlatformCard>
                    );
                }) }

                <Alert severity="info" sx={ { mt: 3 } } data-componentid={ `${ componentId }-assign-hint` }>
                    <AlertTitle>
                        { t("devices:assurancePolicies.wizard.steps.review.assignHint.title") }
                    </AlertTitle>
                    <ul style={ { margin: "4px 0 0", paddingLeft: 20 } }>
                        <li
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={ {
                                __html: t("devices:assurancePolicies.wizard.steps.review.assignHint.loginFlow")
                            } }
                        />
                        <li
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={ {
                                __html: t("devices:assurancePolicies.wizard.steps.review.assignHint.otherFlows")
                            } }
                        />
                    </ul>
                </Alert>
            </Box>
        );
    };

    const resolveStepContent = (): ReactElement => {
        switch (currentStep) {
            case WizardStep.BASIC_DETAILS:
                return renderBasicDetailsStep();
            case WizardStep.EXECUTION_RULES:
                return renderExecutionRulesStep();
            case WizardStep.REVIEW:
                return renderReviewStep();
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

    /* ------------------------------------------------------------------ */
    /*  Render                                                              */
    /* ------------------------------------------------------------------ */

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
