import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Checkbox, Dropdown, DropdownProps, Form, Table, Segment } from "semantic-ui-react";
import axios from "axios";
import { TabPageLayout, AnimatedAvatar, PrimaryButton } from "@wso2is/react-components";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { Trait } from "../api/traits";
import { Image } from "semantic-ui-react";

interface RouteParams {
    id: string;
}

const TraitsEditPage: FunctionComponent<RouteComponentProps<RouteParams>> = (
    props: RouteComponentProps<RouteParams>
): ReactElement => {

    const { match } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const traitId = match.params.id;

    const [ trait, setTrait ] = useState<Trait>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);

    useEffect(() => {
        fetchTrait();
    }, []);

    const generateTraitLetter = (name: string): string => {
        const cleanName = name?.replace(/^traits\./, "");
        return cleanName?.charAt(0).toUpperCase();
    };
    

    const fetchTrait = () => {
        setIsLoading(true);
        axios.get(`http://localhost:8900/api/v1/profile-schema/traits/${traitId}`)
            .then((response) => setTrait(response.data))
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.message || "Failed to fetch trait.",
                    level: AlertLevels.ERROR,
                    message: "Error"
                }));
            })
            .finally(() => setIsLoading(false));
    };

    const handleUpdateTrait = (updatedFields: Partial<Trait>) => {
        const updatedTrait = { ...trait, ...updatedFields };
        setIsUpdating(true);

        axios.put(`http://localhost:8900/api/v1/profile-schema/traits/${traitId}`, {
            attribute_name: updatedTrait.attribute_name,
            value_type: updatedTrait.value_type,
            merge_strategy: updatedTrait.merge_strategy,
            mutability: updatedTrait.mutability,
            multi_valued: updatedTrait.multi_valued,
            sub_attributes: updatedTrait.sub_attributes
        })
            .then(() => {
                setTrait(updatedTrait);
                dispatch(addAlert({
                    description: "Trait updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Success"
                }));
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.message || "Failed to update trait.",
                    level: AlertLevels.ERROR,
                    message: "Error"
                }));
            })
            .finally(() => setIsUpdating(false));
    };

    const handleMultiValuedToggle = () => {
        handleUpdateTrait({ multi_valued: !trait.multi_valued });
    };

    const handleMergeStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        handleUpdateTrait({ merge_strategy: data.value as string });
    };

    const mergeStrategyOptions = [
        { key: "combine", text: "Combine", value: "combine" },
        { key: "latest", text: "Latest", value: "latest" },
        { key: "oldest", text: "Oldest", value: "oldest" }
    ];

    const valueTypeOptions = [
        { key: "string", text: "Text", value: "string" },
        { key: "integer", text: "Integer", value: "integer" },
        { key: "decimal", text: "Decimal", value: "decimal" },
        { key: "boolean", text: "Boolean", value: "boolean" },
        { key: "complex", text: "Complex", value: "complex" }
    ];

    const generateInitial = (name: string): string => {
        const clean = name.replace(/^traits\./, "");
        return clean.charAt(0).toUpperCase();
    };

    return (
        <TabPageLayout
            isLoading={ isLoading }
            image={ (
                <Image
                    floated="left"
                    verticalAlign="middle"
                    rounded
                    centered
                    size="tiny"
                >
                    <AnimatedAvatar />
                    <span className="claims-letter">
                        { trait && generateTraitLetter(trait?.attribute_name) }
                    </span>
                </Image>
            ) }
            title={ trait ? trait.attribute_name.replace(/^traits\./, "") : "Edit Trait" }
            pageTitle="Edit Trait"
            description="Edit trait details here."
            backButton={ {
                onClick: () => history.push(AppConstants.getPaths().get("TRAITS")),
                text: t("common:back", { defaultValue: "Go back to Traits" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid="traits-edit-page"
        >
            { trait && (
                <Segment className="ui basic very padded segment bordered emphasized">
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <input value={ trait.attribute_name.replace(/^traits\./, "") } readOnly />
                        </Form.Field>

                        <Form.Field>
                            <label>Value Type</label>
                            <Dropdown
                                selection
                                options={ valueTypeOptions }
                                value={ trait.value_type }
                                disabled={ isUpdating }
                                // OnChange can be added if value_type is editable in your flow
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Merge Strategy</label>
                            <Dropdown
                                selection
                                options={ mergeStrategyOptions }
                                value={ trait.merge_strategy }
                                onChange={ handleMergeStrategyChange }
                                disabled={ isUpdating }
                            />
                        </Form.Field>

                        <Form.Field>
                            <Checkbox
                                label="Multi Valued"
                                checked={ trait.multi_valued }
                                onChange={ handleMultiValuedToggle }
                                disabled={ isUpdating }
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Sub Attributes</label>
                            <Table celled compact>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    { trait.sub_attributes?.map((sub) => (
                                        <Table.Row key={ sub.attribute_id }>
                                            <Table.Cell>{ sub.attribute_name.replace(/^traits\./, "") }</Table.Cell>
                                            <Table.Cell>
                                                <PrimaryButton
                                                    size="small"
                                                    negative
                                                    onClick={ () => {
                                                        const updatedSubs = trait.sub_attributes.filter(s => s.attribute_id !== sub.attribute_id);
                                                        handleUpdateTrait({ sub_attributes: updatedSubs });
                                                    } }
                                                    disabled={ isUpdating }
                                                >
                                                    Remove
                                                </PrimaryButton>
                                            </Table.Cell>
                                        </Table.Row>
                                    )) }
                                </Table.Body>
                            </Table>
                        </Form.Field>
                    </Form>
                </Segment>
            )}
        </TabPageLayout>
    );
};

export default TraitsEditPage;
