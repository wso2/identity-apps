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

import Slider from "@mui/material/Slider";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateCDSConfig } from "../api/config";
import {
    CDS_CONTRADICTION_THRESHOLD,
    CDS_RESOLUTION_DEFAULTS,
    CDS_SCORE_PENALTY_OFFSET,
    CDSConfig
} from "../models/config";

interface ResolutionSettingsProps extends IdentifiableComponentInterface {
    config: CDSConfig;
    /**
     * Refreshes the cached configuration once a save succeeds.
     */
    mutateConfig: () => void;
    isReadOnly?: boolean;
}

interface SettingsState {
    autoMergeEnabled: boolean;
    autoMergeThreshold: string;
    manualReviewThreshold: string;
    deterministicMatchDecisive: boolean;
}

interface OutcomeBand {
    key: string;
    color: string;
    from: number;
    to: number;
    range: string;
    label: string;
}

/**
 * The outcomes are ordered — each asks more of a match than the one before — so they take one
 * hue stepped light to dark rather than status colours, which would read as good and bad.
 * Steps of the Console's primary orange, checked for monotone lightness, visible step gaps and
 * a light end that clears 2:1 against both the light and the dark surface.
 */
const OUTCOME_COLORS: Record<"auto" | "none" | "review", string> = {
    auto: "#8F4000",
    none: "#FF8F33",
    review: "#D45F00"
};

/**
 * A threshold as a point on the 0–1 scale. Anything unparseable sits at 0 so the sliders and
 * the outcome bar still render while a field is mid-edit; the validation error explains it.
 */
const toScalePoint = (value: string): number => {
    const score: number = Number(value);

    return Number.isFinite(score) ? Math.min(Math.max(score, 0), 1) : 0;
};

const formatScore = (score: number): string => score.toFixed(2);

/**
 * A threshold the organisation has never set comes back as 0 rather than being omitted, and
 * the server reads any non-positive value as "unset" and applies its own default. Nullish
 * coalescing alone would show that 0 as if it were a real setting, so the same rule is
 * applied here: anything at or below zero means unset.
 */
const thresholdOrDefault = (value: number | undefined, fallback: number): string =>
    String(value !== undefined && value > 0 ? value : fallback);

const toState = (config: CDSConfig): SettingsState => ({
    autoMergeEnabled: config?.auto_merge_enabled ?? CDS_RESOLUTION_DEFAULTS.autoMergeEnabled,
    autoMergeThreshold: thresholdOrDefault(
        config?.auto_merge_threshold, CDS_RESOLUTION_DEFAULTS.autoMergeThreshold),
    deterministicMatchDecisive:
        config?.deterministic_match_decisive ?? CDS_RESOLUTION_DEFAULTS.deterministicMatchDecisive,
    manualReviewThreshold: thresholdOrDefault(
        config?.manual_review_threshold, CDS_RESOLUTION_DEFAULTS.manualReviewThreshold)
});

interface ThresholdFieldProps extends IdentifiableComponentInterface {
    id: string;
    label: string;
    value: string;
    /**
     * The range the slider and the input's stepper arrows settle within, so neither offers a
     * value the other threshold rules out. The slider still spans 0–1 so the position reads
     * against the whole score range. A value typed past either end is kept, and the
     * validation error explains why it cannot be saved.
     */
    min?: number;
    max?: number;
    hint: string;
    error?: string | null;
    disabled?: boolean;
    onChange: (value: string) => void;
}

/**
 * A slider with a number input beside it, both editing the same value: the slider for a
 * feel of where the threshold sits, the input for an exact figure.
 */
const ThresholdField: FunctionComponent<ThresholdFieldProps> = ({
    id,
    label,
    value,
    min = 0,
    max = 1,
    hint,
    error,
    disabled = false,
    onChange,
    ["data-componentid"]: componentId
}: ThresholdFieldProps): ReactElement => (
    <FormControl fullWidth disabled={ disabled } error={ !!error } data-componentid={ componentId }>
        <FormLabel id={ `${ id }-label` }>{ label }</FormLabel>
        <Box sx={ { alignItems: "center", display: "flex", gap: 3 } }>
            <Slider
                aria-labelledby={ `${ id }-label` }
                value={ toScalePoint(value) }
                min={ 0 }
                max={ 1 }
                step={ 0.01 }
                disabled={ disabled }
                onChange={ (_event: Event, next: number | number[]): void =>
                    // Rounded to the step, and written the way a saved value reads, so dragging
                    // back to where it started does not count as a change.
                    onChange(String(Number(Math.min(Math.max(next as number, min), max).toFixed(2)))) }
                sx={ { flex: 1 } }
                data-componentid={ `${ componentId }-slider` }
            />
            <TextField
                type="number"
                size="small"
                value={ value }
                disabled={ disabled }
                error={ !!error }
                inputProps={ {
                    // The error sits outside the TextField, so it is not linked automatically.
                    "aria-describedby": error ? `${ id }-error` : undefined,
                    "aria-labelledby": `${ id }-label`,
                    max,
                    min,
                    step: 0.01
                } }
                onChange={ (event: React.ChangeEvent<HTMLInputElement>): void => onChange(event.target.value) }
                sx={ { width: "100px" } }
                data-componentid={ `${ componentId }-input` }
            />
        </Box>
        { error
            ? <FormHelperText id={ `${ id }-error` } sx={ { ml: 0 } }>{ error }</FormHelperText>
            : <Hint compact>{ hint }</Hint> }
    </FormControl>
);

/**
 * Settings that decide what the engine does with a score, as opposed to how it is arrived
 * at. The rules on the same page decide what gets compared; these decide what counts as
 * confident enough to act on without asking anyone.
 */
const ResolutionSettings: FunctionComponent<ResolutionSettingsProps> = (
    props: ResolutionSettingsProps
): ReactElement => {
    const {
        config,
        mutateConfig,
        isReadOnly = false,
        ["data-componentid"]: componentId = "cds-resolution-settings"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ settings, setSettings ] = useState<SettingsState>(() => toState(config));
    const [ isSaving, setIsSaving ] = useState<boolean>(false);

    // The configuration arrives asynchronously, so seed the form again whenever a fresh copy
    // lands rather than leaving the defaults showing over real values.
    useEffect(() => {
        setSettings(toState(config));
    }, [
        config?.auto_merge_enabled,
        config?.auto_merge_threshold,
        config?.manual_review_threshold,
        config?.deterministic_match_decisive
    ]);

    const autoMerge: number = toScalePoint(settings.autoMergeThreshold);
    const review: number = toScalePoint(settings.manualReviewThreshold);

    /**
     * The server holds the review threshold below the automatic one even while automatic
     * unification is off: a match an objection holds back is scored just under the automatic
     * threshold, and it has to stay high enough to still be sent for review.
     */
    const highestUsableReview: number = Number((autoMerge - CDS_SCORE_PENALTY_OFFSET).toFixed(4));

    /**
     * The same rule seen from the other side: the automatic threshold has to leave room for the
     * review threshold beneath it, which in turn has to clear the contradiction bar.
     */
    const lowestUsableReview: number = Number((CDS_CONTRADICTION_THRESHOLD + 0.01).toFixed(2));
    const lowestUsableAutoMerge: number =
        Number((Math.max(review, lowestUsableReview) + CDS_SCORE_PENALTY_OFFSET).toFixed(4));

    /**
     * Mirrors the server's validation, which checks the two thresholds against each other
     * rather than only against 0 and 1. Each error belongs to the field that has to change.
     */
    const autoMergeError: string | null = useMemo(() => {
        const value: number = Number(settings.autoMergeThreshold);

        if (!Number.isFinite(value) || value <= 0 || value > 1) {
            return t("customerDataService:resolutionSettings.errors.autoMergeRange");
        }

        return null;
    }, [ settings.autoMergeThreshold, t ]);

    const reviewError: string | null = useMemo(() => {
        const value: number = Number(settings.manualReviewThreshold);

        if (!Number.isFinite(value) || value <= 0 || value > 1) {
            return t("customerDataService:resolutionSettings.errors.reviewRange");
        }
        // The review threshold doubles as the bar a rule must clear to count as agreeing, so a
        // value near the contradiction bar lets near-unrelated values decide a merge.
        if (value <= CDS_CONTRADICTION_THRESHOLD) {
            return t("customerDataService:resolutionSettings.errors.reviewTooLow",
                { contradiction: CDS_CONTRADICTION_THRESHOLD });
        }
        if (autoMergeError === null && value > highestUsableReview) {
            return t("customerDataService:resolutionSettings.errors.reviewTooHigh",
                { highest: highestUsableReview });
        }

        return null;
    }, [ settings.manualReviewThreshold, autoMergeError, highestUsableReview, t ]);

    const hasError: boolean = autoMergeError !== null || reviewError !== null;

    /**
     * What each part of the score range leads to under the settings as they stand, saved or
     * not. Without automatic unification everything from the review threshold up is reviewed.
     */
    const outcomeBands: OutcomeBand[] = useMemo(() => {
        const reviewUpTo: number = settings.autoMergeEnabled ? Math.max(review, autoMerge) : 1;
        // Scores top out at 1, so the last band is a closed range rather than "and above" — and
        // a band starting at 1 is just that one score.
        const upToMax = (from: number): string => from >= 1
            ? formatScore(1)
            : t("customerDataService:resolutionSettings.outcome.toMax", { from: formatScore(from) });

        const bands: OutcomeBand[] = [
            {
                color: OUTCOME_COLORS.none,
                from: 0,
                key: "none",
                label: t("customerDataService:resolutionSettings.outcome.none"),
                range: t("customerDataService:resolutionSettings.outcome.below", { to: formatScore(review) }),
                to: review
            },
            {
                color: OUTCOME_COLORS.review,
                from: review,
                key: "review",
                label: t("customerDataService:resolutionSettings.outcome.review"),
                range: settings.autoMergeEnabled
                    ? t("customerDataService:resolutionSettings.outcome.between",
                        { from: formatScore(review), to: formatScore(reviewUpTo) })
                    : upToMax(review),
                to: reviewUpTo
            }
        ];

        if (settings.autoMergeEnabled) {
            bands.push({
                color: OUTCOME_COLORS.auto,
                from: reviewUpTo,
                key: "auto",
                label: t("customerDataService:resolutionSettings.outcome.auto"),
                range: upToMax(reviewUpTo),
                to: 1
            });
        }

        // An automatic threshold of 1.00 still unifies a perfect score, so the last band keeps a
        // sliver of width rather than vanishing while it still applies.
        return bands
            .filter((band: OutcomeBand) => band.to > band.from || band.key === "auto")
            .map((band: OutcomeBand) => ({ ...band, to: Math.max(band.to, band.from + 0.01) }));
    }, [ settings.autoMergeEnabled, autoMerge, review, t ]);

    const exactRuleLabel: string =
        t("customerDataService:resolutionSettings.fields.deterministicMatchDecisive.label");
    const exactRuleHint: string =
        t("customerDataService:resolutionSettings.fields.deterministicMatchDecisive.hint");

    const isDirty: boolean = useMemo(() => {
        const original: SettingsState = toState(config);

        return original.autoMergeEnabled !== settings.autoMergeEnabled
            || original.autoMergeThreshold !== settings.autoMergeThreshold
            || original.manualReviewThreshold !== settings.manualReviewThreshold
            || original.deterministicMatchDecisive !== settings.deterministicMatchDecisive;
    }, [ config, settings ]);

    const handleApprovalChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const autoMergeEnabled: boolean = event.target.value === "auto";

        setSettings((prev: SettingsState) => ({
            ...prev,
            autoMergeEnabled,
            // The automatic threshold is hidden under approval but still validated and sent,
            // so a half-typed value left behind would block the update with no field to fix
            // it in. Put the saved value back instead.
            autoMergeThreshold: !autoMergeEnabled && autoMergeError !== null
                ? toState(config).autoMergeThreshold
                : prev.autoMergeThreshold
        }));
    };

    const handleSave = async (): Promise<void> => {
        if (isSaving || hasError) {
            return;
        }

        setIsSaving(true);

        try {
            await updateCDSConfig({
                auto_merge_enabled: settings.autoMergeEnabled,
                auto_merge_threshold: Number(settings.autoMergeThreshold),
                deterministic_match_decisive: settings.deterministicMatchDecisive,
                manual_review_threshold: Number(settings.manualReviewThreshold)
            });

            mutateConfig();

            dispatch(addAlert({
                description: t("customerDataService:resolutionSettings.notifications.saved.description"),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:resolutionSettings.notifications.saved.message")
            }));
        } catch (error) {
            // The server explains why it refused — a threshold pair it will not accept, for
            // instance. Showing only "could not be updated" leaves the operator with nothing
            // to act on.
            const serverReason: string =
                (error as { response?: { data?: { description?: string } } })?.response?.data?.description;

            dispatch(addAlert({
                description: serverReason
                    ?? t("customerDataService:resolutionSettings.notifications.saveFailed.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:resolutionSettings.notifications.saveFailed.message")
            }));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card data-componentid={ componentId }>
            <CardContent sx={ { display: "flex", flexDirection: "column", gap: 4, maxWidth: "720px", p: 4 } }>
                <Box>
                    <Typography variant="h4">
                        { t("customerDataService:resolutionSettings.heading") }
                    </Typography>
                    <Hint compact>
                        { t("customerDataService:resolutionSettings.description") }
                    </Hint>
                </Box>

                <Box>
                    <Typography variant="h6" id={ `${ componentId }-automatic-heading` } sx={ { mb: 1 } }>
                        { t("customerDataService:resolutionSettings.groups.automatic") }
                    </Typography>
                    <FormControl disabled={ isReadOnly } fullWidth>
                        <RadioGroup
                            aria-labelledby={ `${ componentId }-automatic-heading` }
                            value={ settings.autoMergeEnabled ? "auto" : "approval" }
                            onChange={ handleApprovalChange }
                        >
                            <FormControlLabel
                                value="approval"
                                control={ <Radio /> }
                                label={ t("customerDataService:resolutionSettings.fields.autoMerge.never") }
                                data-componentid={ `${ componentId }-require-approval` }
                            />
                            <Box sx={ { mb: 1, ml: 4 } }>
                                <Hint compact>
                                    <Trans
                                        i18nKey="customerDataService:resolutionSettings.fields.autoMerge.neverHint"
                                        components={ [ null, <strong key="0" /> ] }
                                    />
                                </Hint>
                            </Box>
                            <FormControlLabel
                                value="auto"
                                control={ <Radio /> }
                                label={ t("customerDataService:resolutionSettings.fields.autoMerge.above") }
                                data-componentid={ `${ componentId }-auto-unify` }
                            />
                            <Box sx={ { ml: 4 } }>
                                <Hint compact>
                                    { t("customerDataService:resolutionSettings.fields.autoMerge.aboveHint") }
                                </Hint>
                            </Box>
                        </RadioGroup>
                    </FormControl>

                    { /* Only meaningful when profiles may be unified without review, so shown
                         only then. Hidden values are kept and still sent, so switching to
                         approval and back changes nothing. */ }
                    { settings.autoMergeEnabled && (
                        <Box sx={ { display: "flex", flexDirection: "column", gap: 2, ml: 4, mt: 2 } }>
                            <ThresholdField
                                id={ `${ componentId }-auto-merge-threshold` }
                                label={ t("customerDataService:resolutionSettings.fields.autoMerge.threshold") }
                                value={ settings.autoMergeThreshold }
                                min={ lowestUsableAutoMerge }
                                hint={ autoMerge >= 1
                                    ? t("customerDataService:resolutionSettings.fields.autoMerge.thresholdHintMax")
                                    : t("customerDataService:resolutionSettings.fields.autoMerge.thresholdHint",
                                        { threshold: formatScore(autoMerge) }) }
                                error={ autoMergeError }
                                disabled={ isReadOnly }
                                onChange={ (value: string) =>
                                    setSettings((prev: SettingsState) => ({ ...prev, autoMergeThreshold: value })) }
                                data-componentid={ `${ componentId }-auto-merge-threshold` }
                            />
                            <FormControl disabled={ isReadOnly } sx={ { ml: 2 } }>
                                <FormControlLabel
                                    control={
                                        (<Checkbox
                                            checked={ settings.deterministicMatchDecisive }
                                            onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                                setSettings((prev: SettingsState) =>
                                                    ({ ...prev, deterministicMatchDecisive: event.target.checked })) }
                                            data-componentid={ `${ componentId }-exact-rule-matches` }
                                        />)
                                    }
                                    label={ exactRuleLabel }
                                />
                                <Box sx={ { ml: 4 } }>
                                    <Hint compact>{ exactRuleHint }</Hint>
                                </Box>
                            </FormControl>
                        </Box>
                    ) }
                </Box>

                <Box>
                    <Typography variant="h6" sx={ { mb: 1 } }>
                        { t("customerDataService:resolutionSettings.groups.review") }
                    </Typography>
                    <ThresholdField
                        id={ `${ componentId }-review-threshold` }
                        label={ t("customerDataService:resolutionSettings.fields.manualReviewThreshold.label") }
                        value={ settings.manualReviewThreshold }
                        min={ lowestUsableReview }
                        max={ highestUsableReview }
                        hint={ t("customerDataService:resolutionSettings.fields.manualReviewThreshold.hint",
                            { threshold: formatScore(review) }) }
                        error={ reviewError }
                        disabled={ isReadOnly }
                        onChange={ (value: string) =>
                            setSettings((prev: SettingsState) => ({ ...prev, manualReviewThreshold: value })) }
                        data-componentid={ `${ componentId }-review-threshold` }
                    />
                </Box>

                { /* Read-only, and drawn from the settings as they stand rather than as saved,
                     so the effect of a change is visible before it is applied. */ }
                <Box data-componentid={ `${ componentId }-outcome` }>
                    <Typography variant="h6" sx={ { mb: 1.5 } }>
                        { t("customerDataService:resolutionSettings.groups.outcome") }
                    </Typography>
                    { /* A 2px gap, not a border, separates the regions. The legend below carries
                         the same information as text, so the bar itself is hidden from assistive
                         technology. */ }
                    <Box aria-hidden sx={ { display: "flex", gap: "2px", height: 12 } }>
                        { outcomeBands.map((band: OutcomeBand) => (
                            <Box
                                key={ band.key }
                                sx={ { bgcolor: band.color, borderRadius: "4px", flexGrow: band.to - band.from } }
                            />
                        )) }
                    </Box>
                    <Box component="ul" sx={ { listStyle: "none", m: 0, mt: 1.5, p: 0 } }>
                        { outcomeBands.map((band: OutcomeBand) => (
                            <Box
                                component="li"
                                key={ band.key }
                                sx={ { alignItems: "center", display: "flex", gap: 1, py: 0.25 } }
                            >
                                <Box
                                    sx={ {
                                        bgcolor: band.color,
                                        borderRadius: "50%",
                                        flexShrink: 0,
                                        height: 10,
                                        width: 10
                                    } }
                                />
                                <Typography variant="body2">
                                    { `${ band.range }: ${ band.label }` }
                                </Typography>
                            </Box>
                        )) }
                    </Box>
                    { settings.autoMergeEnabled && settings.deterministicMatchDecisive && (
                        <Hint compact>
                            { t("customerDataService:resolutionSettings.outcome.exactRule") }
                        </Hint>
                    ) }
                </Box>

                { !isReadOnly && (
                    <Box>
                        <Button
                            variant="contained"
                            onClick={ handleSave }
                            disabled={ isSaving || !isDirty || hasError }
                            data-componentid={ `${ componentId }-save` }
                        >
                            { isSaving
                                ? t("customerDataService:resolutionSettings.buttons.saving")
                                : t("customerDataService:resolutionSettings.buttons.save") }
                        </Button>
                    </Box>
                ) }
            </CardContent>
        </Card>
    );
};

export default ResolutionSettings;
