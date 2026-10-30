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

import Collapse from "@oxygen-ui/react/Collapse";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, DataTable, EmptyPlaceholder, Popup } from "@wso2is/react-components";
import get from "lodash-es/get";
import React, { Fragment, FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Header, Label, Table } from "semantic-ui-react";
import { ProfileModel } from "../models/profiles";
import {
    ReviewDecision,
    ReviewReason,
    ReviewRuleOutcome,
    ReviewTaskModel,
    RuleVerdict
} from "../models/review-tasks";
import {
    AttributeLabels,
    describeAttribute,
    describeReason,
    describeReasonLabel,
    formatScore,
    getPairReasons,
    getReasonCategory,
    getReasonTone,
    getRowReasons,
    orderRulesForComparison
} from "../utils/review-task-utils";
import "./review-task-list.scss";

/**
 * An absent value is left blank. Beside a value on the other side, the gap speaks for itself.
 */
const NO_VALUE: string = "";

/**
 * Past this, a value is clipped and the whole of it moves into a tooltip. Long emails and
 * identifiers otherwise force the column wider than its share of the row.
 */
const TRUNCATE_AT: number = 34;

interface ReviewTaskListPropsInterface extends IdentifiableComponentInterface {
    tasks: ReviewTaskModel[];
    /**
     * The profiles the tasks refer to, keyed by id. A missing entry is rendered as an
     * unresolved value rather than blocking the row.
     */
    profiles: Record<string, ProfileModel>;
    /**
     * Ids whose profile could not be fetched. The pair's decision is withheld for these: the
     * row cannot show what was compared, and approving a merge on evidence nobody could see
     * is exactly the mistake this page exists to prevent.
     */
    failedProfileIds: string[];
    isLoading: boolean;
    /**
     * Whether the viewer may act on a task. Read-only viewers still see the evidence.
     */
    canResolve: boolean;
    /**
     * Resolves one task. Awaited, so the row can hold its loading state for exactly as long as
     * the request is in flight.
     */
    onResolve: (task: ReviewTaskModel, decision: ReviewDecision) => Promise<void>;
    /**
     * Display names for attributes, keyed by path, from the organization's profile schema. An
     * attribute without one is shown by its name without the scope prefix.
     */
    attributeLabels?: AttributeLabels;
}

/**
 * The pairs awaiting a decision.
 *
 * A row is a pair; opening it shows what each attribute held on either side and why the pair
 * was held for review, which is what actually settles the question the row asks. The row
 * carries no score: a pair held back from merging is scored just under the merge threshold
 * whatever held it, so the number would say nothing the reasons do not say better.
 *
 * It is assembled from DataTable's own parts rather than from DataTable itself: that component
 * renders one row per item with no way to attach a detail row, and dropping to the parts keeps
 * the Console's table styling while allowing the second row.
 */
const ReviewTaskList: FunctionComponent<ReviewTaskListPropsInterface> = ({
    tasks,
    profiles,
    failedProfileIds,
    isLoading,
    canResolve,
    onResolve,
    attributeLabels = {},
    ["data-componentid"]: componentId = "cds-review-task-list"
}: ReviewTaskListPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const [ openTaskIds, setOpenTaskIds ] = useState<string[]>([]);
    const [ pendingDecision, setPendingDecision ] =
        useState<{ task: ReviewTaskModel; decision: ReviewDecision }>(null);
    // Which row is mid-flight and on which decision, so only the pressed button spins while
    // both are held closed against a second submission.
    const [ resolving, setResolving ] = useState<{ taskId: string; decision: ReviewDecision }>(null);

    const toggleTask = (taskId: string): void => setOpenTaskIds((open: string[]) =>
        open.includes(taskId)
            ? open.filter((id: string) => id !== taskId)
            : [ ...open, taskId ]);

    /**
     * A profile named the way an administrator would recognize it, or nothing when the profile
     * carries no name. The fallback stops there rather than reaching for any remaining
     * attribute: the next value it would find is usually the one the rule matched on, and the
     * compared values are already shown a row below.
     */
    const describeProfile = (profileId: string): string => {
        const identity: Record<string, any> = profiles[profileId]?.identity_attributes ?? {};

        return `${ identity.givenname ?? "" } ${ identity.lastname ?? "" }`.trim();
    };

    /**
     * One compared value as text. Values arrive as strings, numbers, booleans or not at all.
     */
    const describeValue = (profileId: string, path: string): string => {
        const profile: ProfileModel = profiles[profileId];

        if (!profile) {
            return t("customerDataService:reviewTasks.list.unresolved");
        }

        const value: unknown = get(profile, path);

        if (value === undefined || value === null || value === "") {
            return NO_VALUE;
        }
        if (typeof value === "boolean") {
            return String(value);
        }

        return typeof value === "object" ? JSON.stringify(value) : String(value);
    };

    /**
     * Text that keeps to its column, with the whole of it a hover away when it does not fit.
     */
    const renderTruncated = (value: string): ReactElement => {
        if (value.length <= TRUNCATE_AT) {
            return <span>{ value }</span>;
        }

        return (
            <Popup
                trigger={ <span className="review-task-truncated">{ value }</span> }
                content={ value }
                position="top left"
                inverted
            />
        );
    };

    const renderProfileCell = (profileId: string): ReactElement => (
        <Header as="h6">
            <Header.Content>
                { renderTruncated(profileId) }
                <Header.Subheader>
                    { describeProfile(profileId) || null }
                </Header.Subheader>
            </Header.Content>
        </Header>
    );

    const renderDisclosure = (task: ReviewTaskModel, isOpen: boolean): ReactElement => {
        const label: string = t(isOpen
            ? "customerDataService:reviewTasks.list.actions.collapse"
            : "customerDataService:reviewTasks.list.actions.expand");

        return (
            <Popup
                trigger={ (
                    // A Button rather than a bare Icon: an icon with an onClick is not in the
                    // tab order and answers neither Enter nor Space, which would leave the
                    // evidence unreachable without a mouse.
                    <Button
                        basic
                        icon={ isOpen ? "angle up" : "angle down" }
                        size="tiny"
                        className="review-task-disclosure"
                        aria-label={ label }
                        aria-expanded={ isOpen }
                        onClick={ (event: SyntheticEvent) => {
                            event.stopPropagation();
                            toggleTask(task.id);
                        } }
                        data-componentid={ `${ componentId }-toggle-${ task.id }` }
                    />
                ) }
                position="top center"
                content={ label }
                inverted
            />
        );
    };

    /**
     * Whether a profile has a value at this path. An unloaded profile counts as having one: its
     * row stays, showing that it could not be loaded, rather than silently disappearing.
     */
    const hasValue = (profileId: string, path: string): boolean => {
        const profile: ProfileModel = profiles[profileId];

        if (!profile) {
            return true;
        }

        const value: unknown = get(profile, path);

        return value !== undefined && value !== null && value !== "";
    };

    /**
     * A reason as a chip, with the full explanation a hover or a focus away. The chip is what a
     * reviewer scans; the explanation carries the specifics — which attributes, what score, what
     * threshold — for when the chip alone does not settle it. Its tone says how the reason bears on
     * the match.
     */
    const renderReasonChip = (task: ReviewTaskModel, shown: ReviewReason, key: string): ReactElement => {
        return (
            <Popup
                key={ key }
                on={ [ "hover", "focus" ] }
                trigger={ (
                    <Label
                        basic
                        size="mini"
                        className={ `review-task-chip review-task-reason-chip ${ getReasonTone(shown) } `
                            + `category-${ getReasonCategory(shown) }` }
                        tabIndex={ 0 }
                        data-componentid={ `${ componentId }-reason-${ task.id }-${ shown.code }` }
                    >
                        { describeReasonLabel(shown, t) }
                    </Label>
                ) }
                content={ describeReason(task, shown, t, attributeLabels) }
                position="top center"
                inverted
            />
        );
    };

    /**
     * The review context, beside the comparison's heading: reasons about the pair as a whole — the match falling short of the merge
     * threshold, a rejection, automatic merging disabled, a merge that failed. One chip each.
     */
    const renderReviewContext = (task: ReviewTaskModel): ReactElement => {
        const reasons: ReviewReason[] = getPairReasons(task);

        if (reasons.length === 0) {
            return null;
        }

        return (
            <div
                className="review-task-context"
                data-componentid={ `${ componentId }-context-${ task.id }` }
            >
                { reasons.map((reason: ReviewReason, index: number) =>
                    renderReasonChip(task, reason, `${ reason.code }-${ index }`)) }
            </div>
        );
    };

    /**
     * A rule's verdict as a chip, in the tinted style the other Customer Data screens use for their
     * labels. A verdict that needs explaining — one that counted neither way, or a comparison that
     * could not be made — carries the explanation a hover or a focus away.
     */
    const renderVerdictChip = (label: string, hint: string, kind: string): ReactElement => {
        const chip: ReactElement = (
            <Label
                size="mini"
                className={ `review-task-chip review-task-verdict-chip ${ kind }` }
                tabIndex={ hint ? 0 : undefined }
            >
                { label }
            </Label>
        );

        if (!hint) {
            return chip;
        }

        return (
            <Popup
                on={ [ "hover", "focus" ] }
                trigger={ chip }
                content={ hint }
                position="top center"
                inverted
            />
        );
    };

    /**
     * What a rule found, as one chip that names the verdict and carries the score — "Match · 1",
     * "Match · 0.97", "Inconclusive · 0.5", "Different · 0" — so the comparison reads down the column
     * without decoding a number. A full score is still "Match", not "Exact match": a comparator can
     * score 1 for values that are not literally the same, such as a name with its parts reordered.
     * Its colour sets it apart from a partial match instead.
     *
     * A rule that could not compare anything says so, with no score: a 0 there would read as a
     * difference. A task raised before explanations has no verdicts, so its scores stand alone.
     */
    const renderMatch = (rule: ReviewRuleOutcome): ReactElement => {
        const key: string = "customerDataService:reviewTasks.explanation.match";

        if (rule.verdict === RuleVerdict.UNKNOWN || (rule.verdict && rule.score === undefined)) {
            return renderVerdictChip(t(`${ key }.notCompared`), t(`${ key }.notComparedHint`), "not-compared");
        }

        const score: string = formatScore(rule.score);

        switch (rule.verdict) {
            case RuleVerdict.AGREE:
                return renderVerdictChip(t(`${ key }.agree`, { score }), null,
                    (rule.score ?? 0) >= 1 ? "exact" : "agree");
            case RuleVerdict.DISAGREE:
                return renderVerdictChip(t(`${ key }.differs`, { score }), null, "differs");
            case RuleVerdict.INCONCLUSIVE:
                return renderVerdictChip(
                    t(`${ key }.inconclusive`, { score }), t(`${ key }.inconclusiveHint`), "inconclusive");
            default:
                return renderVerdictChip(score, null, "score-only");
        }
    };

    /**
     * The attribute by the name an administrator knows, with the rule behind it a hover away for
     * anyone who needs to trace the comparison back to its configuration.
     */
    const renderAttribute = (task: ReviewTaskModel, rule: ReviewRuleOutcome): ReactElement => {
        const attribute: string = describeAttribute(rule.property_name, attributeLabels);

        if (!task.explanation) {
            return <span>{ attribute }</span>;
        }

        return (
            <Popup
                trigger={ <span className="review-task-attribute">{ attribute }</span> }
                content={ t("customerDataService:reviewTasks.explanation.ruleHint", {
                    property: rule.property_name,
                    rule: rule.rule_name
                }) }
                position="top left"
                inverted
            />
        );
    };

    /**
     * The attributes that were compared, what sat on each side, and why the pair is in review.
     *
     * Reasons sit with what they explain. One about the pair as a whole goes beside the comparison's
     * heading; one about particular rules goes in the Match cell of each rule it names, beside the
     * verdict it qualifies. Reasons are placed by rule ID only, so no attribute is marked
     * for what its type usually means — only for what the server reported about this pair.
     *
     * Rows run from what agreed, to what differed, to what could not be read either way, to what
     * could not be compared. An attribute neither profile has is left out — it was never part of the
     * comparison, and an empty row only pushes the evidence down. A task raised before the server
     * recorded explanations has only its breakdown, so its rows carry scores alone.
     */
    const renderEvidence = (task: ReviewTaskModel): ReactElement => {
        const rules: ReviewRuleOutcome[] = orderRulesForComparison(task.explanation?.rules
            ?? Object.entries(task.score_breakdown ?? {}).map(([ path, score ]: [ string, number ]) => ({
                attribute_type: "",
                match_strength: "",
                mismatch_strength: "",
                priority: 0,
                property_name: path,
                rule_id: path,
                rule_name: path,
                score,
                unification_method: "",
                verdict: null
            })))
            .filter((rule: ReviewRuleOutcome) =>
                hasValue(task.incoming_profile_id, rule.property_name)
                    || hasValue(task.candidate_profile_id, rule.property_name));

        if (rules.length === 0) {
            return (
                <Header as="h6" className="mt-0 mb-0" color="grey">
                    { t("customerDataService:reviewTasks.list.noBreakdown") }
                </Header>
            );
        }

        return (
            <>
                { /* What the pair is in review for sits on the comparison's own heading line,
                     read together with the evidence rather than above it. */ }
                <div className="review-task-evidence-header">
                    <span className="review-task-evidence-caption">
                        { t("customerDataService:reviewTasks.caption") }
                    </span>
                    { renderReviewContext(task) }
                </div>
                <Table
                    basic="very"
                    fixed
                    className="review-task-evidence"
                    data-componentid={ `${ componentId }-evidence-${ task.id }` }
                >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={ 4 }>
                                { t("customerDataService:reviewTasks.list.columns.profile") }
                            </Table.HeaderCell>
                            <Table.HeaderCell width={ 4 }>
                                { t("customerDataService:reviewTasks.list.columns.candidateProfile") }
                            </Table.HeaderCell>
                            <Table.HeaderCell width={ 3 }>
                                { t("customerDataService:reviewTasks.list.columns.attribute") }
                            </Table.HeaderCell>
                            <Table.HeaderCell width={ 5 }>
                                { t("customerDataService:reviewTasks.list.columns.attributeMatch") }
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        { rules.map((rule: ReviewRuleOutcome) => {
                            const reasons: ReviewReason[] = getRowReasons(task, rule);

                            return (
                                <Table.Row
                                    key={ rule.rule_id }
                                    className={ rule.verdict === RuleVerdict.UNKNOWN ? "not-compared" : undefined }
                                    data-componentid={ `${ componentId }-rule-${ task.id }-${ rule.rule_id }` }
                                >
                                    <Table.Cell>
                                        { renderTruncated(describeValue(task.incoming_profile_id, rule.property_name)) }
                                    </Table.Cell>
                                    <Table.Cell>
                                        { renderTruncated(describeValue(task.candidate_profile_id, rule.property_name)) }
                                    </Table.Cell>
                                    <Table.Cell>{ renderAttribute(task, rule) }</Table.Cell>
                                    { /* The verdict and the reasons that qualify it read as one
                                         evaluation: side by side with a small gap, most informative
                                         first, wrapping beneath where the cell is narrow. Every
                                         reason the server named for the rule is shown. */ }
                                    <Table.Cell>
                                        <div className="review-task-evaluation">
                                            { renderMatch(rule) }
                                            { reasons.map((reason: ReviewReason) =>
                                                renderReasonChip(task, reason, `${ rule.rule_id }-${ reason.code }`)) }
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }) }
                    </Table.Body>
                </Table>
            </>
        );
    };

    const handleConfirm = async (): Promise<void> => {
        const { task, decision } = pendingDecision;

        setPendingDecision(null);
        setResolving({ decision, taskId: task.id });

        try {
            await onResolve(task, decision);
        } finally {
            setResolving(null);
        }
    };

    if (!isLoading && tasks.length === 0) {
        return (
            <EmptyPlaceholder
                image={ getEmptyPlaceholderIllustrations().emptyList }
                imageSize="tiny"
                title={ t("customerDataService:reviewTasks.placeholders.empty.title") }
                subtitle={ [ t("customerDataService:reviewTasks.placeholders.empty.subtitle") ] }
                data-componentid={ `${ componentId }-empty` }
            />
        );
    }

    const confirmationKey: string = pendingDecision?.decision === ReviewDecision.APPROVED
        ? "confirm"
        : "reject";

    return (
        <>
            <Table
                className="data-table cds-review-task-list"
                selectable
                fixed
                stackable
                data-componentid={ componentId }
            >
                <DataTable.Header>
                    <DataTable.Row>
                        <DataTable.HeaderCell width={ 4 }>
                            { t("customerDataService:reviewTasks.list.columns.profile") }
                        </DataTable.HeaderCell>
                        <DataTable.HeaderCell width={ 5 }>
                            { t("customerDataService:reviewTasks.list.columns.candidateProfile") }
                        </DataTable.HeaderCell>
                        { /* Reserved: it held the pair's score, which the server no longer sends —
                             a held pair's score sat just under the merge threshold whatever held
                             it. The reasons are in the comparison below. */ }
                        <DataTable.HeaderCell width={ 4 } />
                        { /* Only the label moves: the controls stay at the right edge of the
                             row, and the heading is offset in from that edge to sit over the
                             first of them rather than over the collapse icon. */ }
                        <DataTable.HeaderCell
                            width={ 3 }
                            textAlign="right"
                            className="review-task-actions-header"
                        >
                            { t("customerDataService:reviewTasks.list.columns.actions") }
                        </DataTable.HeaderCell>
                    </DataTable.Row>
                </DataTable.Header>
                <DataTable.Body>
                    { tasks.map((task: ReviewTaskModel) => {
                        const isOpen: boolean = openTaskIds.includes(task.id);
                        const rowResolving: ReviewDecision =
                            resolving?.taskId === task.id ? resolving.decision : null;
                        // A decision needs the evidence on screen. failedProfileIds only fills
                        // once the whole fetch settles — it is empty on first load and holds the
                        // previous page's ids after a page change — so absence of a known
                        // failure is not presence of the profiles. Gate on having them.
                        const evidenceReady: boolean = Boolean(
                            profiles[task.incoming_profile_id] && profiles[task.candidate_profile_id]);
                        const evidenceMissing: boolean =
                            failedProfileIds.includes(task.incoming_profile_id)
                                || failedProfileIds.includes(task.candidate_profile_id);
                        // Any row mid-flight holds every decision closed, so a second request
                        // cannot be sent against a list that is about to change underneath it.
                        const actionsDisabled: boolean = resolving !== null || !evidenceReady;

                        return (
                            <Fragment key={ task.id }>
                                { /* Clicking anywhere on the row opens it. The chevron stays
                                     as the labelled, keyboard-reachable control; this is the
                                     mouse shortcut over the whole target. */ }
                                <DataTable.Row
                                    className={ `review-task-row${ isOpen ? " open" : "" }` }
                                    onClick={ () => toggleTask(task.id) }
                                    data-componentid={ `${ componentId }-task-${ task.id }` }
                                >
                                    <DataTable.Cell>
                                        { renderProfileCell(task.incoming_profile_id) }
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        { renderProfileCell(task.candidate_profile_id) }
                                    </DataTable.Cell>
                                    <DataTable.Cell />
                                    <DataTable.Cell textAlign="right" className="review-task-actions">
                                        { /* A disabled pair of buttons with no reason given is
                                             its own dead end, so the row says why. */ }
                                        <Popup
                                            disabled={ !evidenceMissing }
                                            position="top right"
                                            inverted
                                            content={ t("customerDataService:reviewTasks.list.evidenceMissing") }
                                            trigger={ (
                                                <div className="review-task-action-group">
                                                { canResolve && (
                                                    <>
                                                        <Button
                                                            primary
                                                            size="tiny"
                                                            compact
                                                            disabled={ actionsDisabled }
                                                            loading={ rowResolving === ReviewDecision.APPROVED }
                                                            onClick={ (event: SyntheticEvent) => {
                                                                event.stopPropagation();
                                                                setPendingDecision({
                                                                    decision: ReviewDecision.APPROVED,
                                                                    task
                                                                });
                                                            } }
                                                            data-componentid={ `${ componentId }-approve-${ task.id }` }
                                                        >
                                                            { t("customerDataService:reviewTasks.list.actions.approve") }
                                                        </Button>
                                                        { /* Outlined, not destructive: calling a pair
                                                             different people is a classification, and
                                                             neither profile is removed by it. */ }
                                                        <Button
                                                            basic
                                                            size="tiny"
                                                            compact
                                                            disabled={ actionsDisabled }
                                                            loading={ rowResolving === ReviewDecision.REJECTED }
                                                            onClick={ (event: SyntheticEvent) => {
                                                                event.stopPropagation();
                                                                setPendingDecision({
                                                                    decision: ReviewDecision.REJECTED,
                                                                    task
                                                                });
                                                            } }
                                                            data-componentid={ `${ componentId }-reject-${ task.id }` }
                                                        >
                                                            { t("customerDataService:reviewTasks.list.actions.reject") }
                                                        </Button>
                                                    </>
                                                ) }
                                                    { renderDisclosure(task, isOpen) }
                                                </div>
                                            ) }
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>

                                { /* The detail row is always present and Collapse carries its
                                     height, so opening and closing animate. A closed row has no
                                     padding and no content, so it occupies nothing. */ }
                                <DataTable.Row
                                    className={ `review-task-detail-row${ isOpen ? " open" : "" }` }
                                    data-componentid={ `${ componentId }-detail-${ task.id }` }
                                >
                                    <DataTable.Cell colSpan={ 4 }>
                                        <Collapse in={ isOpen } timeout="auto" unmountOnExit>
                                            <div className="review-task-detail">
                                                { renderEvidence(task) }
                                            </div>
                                        </Collapse>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </Fragment>
                        );
                    }) }
                </DataTable.Body>
            </Table>

            { pendingDecision && (
                <ConfirmationModal
                    onClose={ () => setPendingDecision(null) }
                    type="warning"
                    open
                    primaryAction={ t(`customerDataService:reviewTasks.confirmations.${
                        confirmationKey }.primaryAction`) }
                    secondaryAction={ t("customerDataService:common.buttons.cancel") }
                    onSecondaryActionClick={ () => setPendingDecision(null) }
                    onPrimaryActionClick={ handleConfirm }
                    data-componentid={ `${ componentId }-${ confirmationKey }-confirmation` }
                >
                    <ConfirmationModal.Header>
                        { t(`customerDataService:reviewTasks.confirmations.${ confirmationKey }.header`) }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Content>
                        { t(`customerDataService:reviewTasks.confirmations.${ confirmationKey }.content`) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ReviewTaskList;
