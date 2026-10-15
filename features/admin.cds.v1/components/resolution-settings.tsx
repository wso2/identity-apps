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
import Button from "@oxygen-ui/react/Button";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

    /**
     * Mirrors the server's validation, which checks the two thresholds against each other
     * rather than only against 0 and 1.
     *
     * The upper bound exists because a match held back by an objection is scored just under
     * the auto-merge threshold, and it has to stay high enough to still raise a review task
     * — otherwise holding a merge back would discard the pair entirely. The lower bound
     * exists because the review threshold doubles as the bar a rule must clear to count as
     * agreeing, so a value near the contradiction bar lets near-unrelated values decide a
     * merge.
     */
    const validationError: string | null = useMemo(() => {
        const autoMerge: number = Number(settings.autoMergeThreshold);
        const manualReview: number = Number(settings.manualReviewThreshold);

        if (!Number.isFinite(autoMerge) || autoMerge <= 0 || autoMerge > 1) {
            return t("customerDataService:resolutionSettings.errors.autoMergeRange");
        }
        if (!Number.isFinite(manualReview) || manualReview <= 0 || manualReview > 1) {
            return t("customerDataService:resolutionSettings.errors.reviewRange");
        }
        if (manualReview <= CDS_CONTRADICTION_THRESHOLD) {
            return t("customerDataService:resolutionSettings.errors.reviewTooLow",
                { contradiction: CDS_CONTRADICTION_THRESHOLD });
        }

        const highestUsableReview: number = Number((autoMerge - CDS_SCORE_PENALTY_OFFSET).toFixed(4));

        if (manualReview > highestUsableReview) {
            return t("customerDataService:resolutionSettings.errors.reviewTooHigh",
                { highest: highestUsableReview });
        }

        return null;
    }, [ settings.autoMergeThreshold, settings.manualReviewThreshold, t ]);

    const isDirty: boolean = useMemo(() => {
        const original: SettingsState = toState(config);

        return original.autoMergeEnabled !== settings.autoMergeEnabled
            || original.autoMergeThreshold !== settings.autoMergeThreshold
            || original.manualReviewThreshold !== settings.manualReviewThreshold
            || original.deterministicMatchDecisive !== settings.deterministicMatchDecisive;
    }, [ config, settings ]);

    const handleSave = async (): Promise<void> => {
        if (isSaving || validationError !== null) {
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
        <EmphasizedSegment padded="very" data-componentid={ componentId }>
            <Box sx={ { display: "flex", flexDirection: "column", gap: 3, maxWidth: "640px" } }>
                { /* The page is a home for whatever settings the service grows, so each concern
                     names itself here rather than relying on the page title. */ }
                <Box>
                    <Typography variant="h4">
                        { t("customerDataService:resolutionSettings.heading") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={ { mt: 0.5 } }>
                        { t("customerDataService:resolutionSettings.description") }
                    </Typography>
                </Box>

                { /* Whether to unify automatically and the score at which to do it are one
                     decision, not two independent settings. A switch beside a number reads as
                     two knobs whose relationship has to be inferred; as alternatives, the
                     threshold is visibly a property of the second choice. The two values sent
                     to the server are unchanged. */ }
                <FormControl disabled={ isReadOnly }>
                    <FormLabel id={ `${componentId}-auto-unify-label` }>
                        { t("customerDataService:resolutionSettings.fields.autoMerge.label") }
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby={ `${componentId}-auto-unify-label` }
                        value={ settings.autoMergeEnabled ? "above" : "never" }
                        onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                            setSettings((prev: SettingsState) =>
                                ({ ...prev, autoMergeEnabled: event.target.value === "above" })) }
                    >
                        <FormControlLabel
                            value="never"
                            control={ <Radio /> }
                            label={ t("customerDataService:resolutionSettings.fields.autoMerge.never") }
                            data-componentid={ `${componentId}-auto-merge-never` }
                        />
                        <Box sx={ { alignItems: "center", display: "flex", gap: 1.5 } }>
                            <FormControlLabel
                                value="above"
                                control={ <Radio /> }
                                label={ t("customerDataService:resolutionSettings.fields.autoMerge.above") }
                                data-componentid={ `${componentId}-auto-merge-above` }
                            />
                            { /* Editable even under "Never": the score still bounds the review
                                 threshold, and it is still validated. Disabling it while
                                 validating it strands anyone whose stored value is out of
                                 range — the error blocks the update and the field they would
                                 fix it in is dead. */ }
                            <TextField
                                type="number"
                                size="small"
                                inputProps={ { max: 1, min: 0, step: 0.01 } }
                                sx={ { width: "110px" } }
                                value={ settings.autoMergeThreshold }
                                disabled={ isReadOnly }
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                    setSettings((prev: SettingsState) =>
                                        ({ ...prev, autoMergeThreshold: event.target.value })) }
                                data-componentid={ `${componentId}-auto-merge-threshold` }
                            />
                        </Box>
                    </RadioGroup>
                    <Hint>
                        { settings.autoMergeEnabled
                            ? t("customerDataService:resolutionSettings.fields.autoMerge.hint")
                            // The score still bounds the review threshold and still caps a match held
                            // back by a contradiction, so it stays visible with its effect explained
                            // rather than disappearing and leaving a validation error unexplainable.
                            : t("customerDataService:resolutionSettings.fields.autoMerge.neverHint") }
                    </Hint>
                </FormControl>

                <div>
                    <TextField
                        fullWidth
                        type="number"
                        inputProps={ { max: 1, min: 0, step: 0.01 } }
                        label={ t("customerDataService:resolutionSettings.fields.manualReviewThreshold.label") }
                        value={ settings.manualReviewThreshold }
                        disabled={ isReadOnly }
                        error={ validationError !== null }
                        onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                            setSettings((prev: SettingsState) =>
                                ({ ...prev, manualReviewThreshold: event.target.value })) }
                        data-componentid={ `${componentId}-manual-review-threshold` }
                    />
                    <Hint>
                        { validationError
                            ?? t("customerDataService:resolutionSettings.fields.manualReviewThreshold.hint") }
                    </Hint>
                </div>

                { !isReadOnly && (
                    <Box>
                        <Button
                            variant="contained"
                            onClick={ handleSave }
                            disabled={ isSaving || !isDirty || validationError !== null }
                            data-componentid={ `${componentId}-save` }
                        >
                            { isSaving
                                ? t("customerDataService:resolutionSettings.buttons.saving")
                                : t("customerDataService:resolutionSettings.buttons.save") }
                        </Button>
                    </Box>
                ) }
            </Box>
        </EmphasizedSegment>
    );
};

export default ResolutionSettings;
