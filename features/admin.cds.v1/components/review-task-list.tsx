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
import { ConfirmationModal, DataTable, EmptyPlaceholder } from "@wso2is/react-components";
import get from "lodash-es/get";
import React, { Fragment, FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Header, Popup, Table } from "semantic-ui-react";
import { ProfileModel } from "../models/profiles";
import { ReviewDecision, ReviewTaskModel } from "../models/review-tasks";
import "./review-task-list.scss";

/**
 * A value that is absent reads as a dash rather than as blank space, so a gap in the evidence
 * is visibly a gap — an absent value is itself part of why a pair scored the way it did.
 */
const NO_VALUE: string = "—";

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
}

/**
 * The pairs awaiting a decision.
 *
 * A row is a pair and its overall score; opening it shows the attributes that were compared
 * and the values on each side, which is the only thing that can actually settle the question
 * the row asks. The two levels are separate because the overall score is the score of the rule
 * that decided, not a combination of the per-attribute ones — an attribute can read higher,
 * or zero, while the pair still scores what it scores.
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
     * Strips the scope prefix so the column reads `emailaddress` rather than
     * `identity_attributes.emailaddress` — the same name the rule was written against.
     */
    const describeAttribute = (path: string): string => path.split(".").slice(1).join(".") || path;

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
     * The attributes that were compared, and what sat on each side of the comparison.
     *
     * Attribute first: the values mean nothing until you know which attribute produced them.
     * No decision is offered per attribute — these rows are the evidence behind the one
     * decision the pair carries, not decisions of their own.
     */
    const renderEvidence = (task: ReviewTaskModel): ReactElement => {
        const comparisons: [ string, number ][] = Object.entries(task.score_breakdown ?? {});

        if (comparisons.length === 0) {
            return (
                <Header as="h6" className="mt-0 mb-0" color="grey">
                    { t("customerDataService:reviewTasks.list.noBreakdown") }
                </Header>
            );
        }

        return (
            <>
                <div className="review-task-evidence-caption">
                    { t("customerDataService:reviewTasks.caption") }
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
                            <Table.HeaderCell width={ 5 }>
                                { t("customerDataService:reviewTasks.list.columns.candidateProfile") }
                            </Table.HeaderCell>
                            <Table.HeaderCell width={ 2 }>
                                { t("customerDataService:reviewTasks.list.columns.attribute") }
                            </Table.HeaderCell>
                            { /* Right, with the scores: centred, the heading floats visibly
                                 left of the column it names. */ }
                            <Table.HeaderCell width={ 2 } textAlign="right">
                                { t("customerDataService:reviewTasks.list.columns.attributeMatch") }
                            </Table.HeaderCell>
                            <Table.HeaderCell width={ 3 } />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        { comparisons.map(([ path, score ]: [ string, number ]) => (
                            <Table.Row key={ path }>
                                <Table.Cell>
                                    { renderTruncated(describeValue(task.incoming_profile_id, path)) }
                                </Table.Cell>
                                <Table.Cell>
                                    { renderTruncated(describeValue(task.candidate_profile_id, path)) }
                                </Table.Cell>
                                <Table.Cell>{ describeAttribute(path) }</Table.Cell>
                                <Table.Cell textAlign="right">{ score.toFixed(2) }</Table.Cell>
                                <Table.Cell />
                            </Table.Row>
                        )) }
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
                        { /* Reserved, and holding the attribute name in the detail below. Kept
                             here rather than at the head of the row: the two grids still share
                             one set of widths, but the spare column falls between two populated
                             ones instead of opening the row with a gap. */ }
                        <DataTable.HeaderCell width={ 2 } />
                        <DataTable.HeaderCell width={ 2 } textAlign="right">
                            { t("customerDataService:reviewTasks.list.columns.profileMatch") }
                        </DataTable.HeaderCell>
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
                                    <DataTable.Cell textAlign="right">
                                        { task.match_score.toFixed(2) }
                                    </DataTable.Cell>
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
                                    <DataTable.Cell colSpan={ 5 }>
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
