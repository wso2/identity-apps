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
import {
    ConditionExpressionWithoutIdInterface,
    RuleConditionWithoutIdInterface,
    RuleWithoutIdInterface
} from "@wso2is/admin.rules.v1/models/rules";
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
import { ReactComponent as DeviceOutlineIcon } from "../assets/icons/device-window-outline.svg";
import { ReactComponent as SettingsOutlineIcon } from "../assets/icons/settings-outline.svg";
import { updateDevicePolicy } from "../api/device-policies";
import useGetDevicePolicyMetadata from "../hooks/use-get-device-policy-metadata";
import {
    DevicePlatformType,
    DevicePolicyExpressionInterface,
    DevicePolicyFieldDefinitionInterface,
    PolicyExpressionInterface,
    PolicyResourceRequestInterface,
    PolicyResourceResponseInterface,
    PolicyRuleInterface
} from "../models/device-policy";

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

interface PlatformDefinitionInterface {
    key: DevicePlatformType;
    label: string;
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

const convertApiRuleToRuleFormat = (
    platformRule: PolicyResourceResponseInterface
): RuleWithoutIdInterface | null => {
    const groups: { expressions: DevicePolicyExpressionInterface[] }[] =
        platformRule.rule?.rules ?? [];

    if (groups.length === 0) {
        return null;
    }

    const rules: RuleConditionWithoutIdInterface[] = groups.map(
        (group: { expressions: DevicePolicyExpressionInterface[] }): RuleConditionWithoutIdInterface => {
            const expressions: ConditionExpressionWithoutIdInterface[] =
                (group.expressions ?? []).map(
                    (expr: DevicePolicyExpressionInterface): ConditionExpressionWithoutIdInterface => ({
                        field: expr.field,
                        operator: expr.operator,
                        value: expr.value?.value ?? ""
                    })
                );

            return { condition: "AND", expressions } as RuleConditionWithoutIdInterface;
        }
    );

    return { condition: "OR", rules } as unknown as RuleWithoutIdInterface;
};

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

    /* ------------------------------------------------------------------ */
    /*  Step renderers                                                      */
    /* ------------------------------------------------------------------ */

    const renderRuleEmptyState = (): ReactElement => {
        const pname: string =
            allPlatformDefs.find((p: PlatformDefinitionInterface) => p.key === activePlatform)?.label
            ?? (activePlatform ?? "");

        return (
            <Alert
                sx={ { backgroundColor: "var(--oxygen-palette-grey-100)" } }
                icon={ false }
                data-componentid={ `${ componentId }-no-rule-info-box` }
            >
                <AlertTitle>
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
            allPlatformDefs.find((p: PlatformDefinitionInterface) => p.key === activePlatform);

        return (
            <Box>
                <StyledPlatformTabBar>
                    { selectedPlatforms.map((platform: DevicePlatformType, index: number) => {
                        const pDef: PlatformDefinitionInterface | undefined =
                            allPlatformDefs.find((p: PlatformDefinitionInterface) => p.key === platform);
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
                            </StyledPlatformTab>
                        );
                    }) }
                </StyledPlatformTabBar>

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

                { !platformConfigured[activePlatform]
                    ? renderRuleEmptyState()
                    : renderRuleBuilder()
                }
            </Box>
        );
    };

    const renderReviewStep = (): ReactElement => {
        const selectedPlatformDefs: PlatformDefinitionInterface[] = allPlatformDefs.filter(
            (p: PlatformDefinitionInterface) => selectedPlatforms.includes(p.key)
        );

        return (
            <Box>
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
                        { t("devices:assurancePolicies.wizard.steps.review.policyName") }
                    </Typography>
                    <Typography variant="body1" sx={ { fontWeight: 600 } }>
                        { policyName }
                    </Typography>
                    <Typography variant="body2" sx={ { color: "text.secondary", fontWeight: 600, pt: 0.5 } }>
                        { t("devices:assurancePolicies.wizard.steps.review.platforms") }
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
                                        ? (
                                            <span>
                                                Applies to <strong>all { p.label } devices</strong>
                                            </span>
                                        )
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
                                                                            fontFamily: "inherit",
                                                                            fontSize: "inherit",
                                                                            fontWeight: 700
                                                                        } }
                                                                    >
                                                                        { " AND " }
                                                                    </Typography>
                                                                ) }
                                                                <Typography
                                                                    component="span"
                                                                    sx={ {
                                                                        fontFamily: "inherit",
                                                                        fontSize: "inherit",
                                                                        fontWeight: 600
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
                                                                        fontFamily: "inherit",
                                                                        fontSize: "inherit",
                                                                        fontWeight: 600
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
            </Box>
        );
    };

    const resolveStepContent = (): ReactElement => {
        switch (currentStep) {
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

    /* ------------------------------------------------------------------ */
    /*  Render                                                              */
    /* ------------------------------------------------------------------ */

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
