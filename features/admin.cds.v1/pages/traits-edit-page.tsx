import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import {
    Checkbox,
    Dropdown,
    DropdownProps,
    Form,
    Table,
    Segment,
    Button,
    Image
} from "semantic-ui-react";
import axios from "axios";
import {
    AnimatedAvatar,
    TabPageLayout,
    IconButton,
    PrimaryButton
} from "@wso2is/react-components";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { Trait } from "../api/traits";

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

    const [trait, setTrait] = useState<Trait>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [subAttributes, setSubAttributes] = useState<string[]>([]);
    const [subAttributeOptions, setSubAttributeOptions] = useState<{ key: string, text: string, value: string }[]>([]);

    useEffect(() => {
        fetchTrait();
    }, []);

    useEffect(() => {
        if (trait?.value_type === "complex") {
            fetchSubAttributeOptions(trait.attribute_name);
        }
    }, [trait?.attribute_name, trait?.value_type]);

    const fetchTrait = () => {
        setIsLoading(true);
        axios.get(`http://localhost:8900/api/v1/profile-schema/traits/${traitId}`)
            .then((response) => {
                setTrait(response.data);
                setSubAttributes(response.data?.sub_attributes?.map((s: any) => s.attribute_name) || []);
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.message || "Failed to fetch trait.",
                    level: AlertLevels.ERROR,
                    message: "Error"
                }));
            })
            .finally(() => setIsLoading(false));
    };

    const fetchSubAttributeOptions = (attributeName: string) => {
        const prefix = attributeName.replace(/^traits\./, "") + ".";
        axios.get(`http://localhost:8900/api/v1/profile-schema/traits?filter=attribute_name+co+traits.${prefix}`)
            .then((response) => {
                const options = response.data.map((attr: Trait) => ({
                    key: attr.attribute_id,
                    text: attr.attribute_name.replace(/^traits\./, ""),
                    value: attr.attribute_name
                }));
                setSubAttributeOptions(options);
            });
    };

    const handleUpdate = () => {
        const updatedTrait = {
            ...trait,
            sub_attributes: subAttributes.map(name => ({ attribute_name: name }))
        };

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
                dispatch(addAlert({
                    description: "Trait updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Success"
                }));
                history.push(AppConstants.getPaths().get("TRAITS"));
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

        const generateClaimLetter= (attribute_name: string): string => {
            if (!attribute_name) {
                return "?";
            }
            // const cleanName = attribute_name.replace(/^traits\./, "");
            // return cleanName.charAt(0).toUpperCase();

            const displayName = trait.attribute_name.replace(/^traits\./, "");
            const initial = displayName.split(".").pop();
            return initial ? initial.charAt(0).toUpperCase() : "?";
        }

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
                        { trait && generateClaimLetter(trait.attribute_name) }
                    </span>
                </Image>
            ) }
            title={ trait?.attribute_name?.replace(/^traits\./, "") || "Edit Trait" }
            pageTitle="Edit Trait"
            description="Edit trait details."
            backButton={{
                onClick: () => history.push(AppConstants.getPaths().get("TRAITS")),
                text: t("common:back", { defaultValue: "Go back to Traits" })
            }}
            titleTextAlign="left"
        >
            { trait && (
                <Form>
                    <Form.Input
                        label="Name"
                        value={ trait.attribute_name.replace(/^traits\./, "") }
                        readOnly
                    />

                    <Form.Dropdown
                        label="Value Type"
                        name="valueType"
                        selection
                        options={[
                            { key: "string", text: "Text", value: "string" },
                            { key: "integer", text: "Integer", value: "integer" },
                            { key: "decimal", text: "Decimal", value: "decimal" },
                            { key: "boolean", text: "Boolean", value: "boolean" },
                            { key: "complex", text: "Complex", value: "complex" }
                        ]}
                        value={ trait.value_type }
                        onChange={ (
                            e: React.SyntheticEvent<HTMLElement, Event>,
                            data: DropdownProps
                        ) => {
                            const newType = data.value as string;

                            // If changing *away* from complex, clear subAttributes
                            if (trait.value_type === "complex" && newType !== "complex") {
                                setSubAttributes([]);
                            }

                            setTrait({
                                ...trait,
                                value_type: newType
                            });
                        }}
                    />

                    <Form.Dropdown
                        label="Merge Strategy"
                        selection
                        options={[
                            { key: "combine", text: "Combine", value: "combine" },
                            { key: "latest", text: "Latest", value: "latest" },
                            { key: "earliest", text: "Earliest", value: "earliest" }
                        ]}
                        value={ trait.merge_strategy }
                        onChange={ (e: React.SyntheticEvent, data: DropdownProps) =>
                            setTrait({ ...trait, merge_strategy: data.value as string })
                        }
                    />

                    <Form.Field>
                        <Checkbox
                            label="Multi Valued"
                            checked={ trait.multi_valued }
                            onChange={ () =>
                                setTrait({ ...trait, multi_valued: !trait.multi_valued })
                            }
                        />
                    </Form.Field>

                    { trait.value_type === "complex" && (
                        <>
                            <Form.Dropdown
                                label="Sub Attributes"
                                placeholder="Select sub attributes"
                                search
                                selection
                                options={ subAttributeOptions }
                                onChange={ (e: React.SyntheticEvent, data: { value: string }) => {
                                    if (!subAttributes.includes(data.value)) {
                                        setSubAttributes([...subAttributes, data.value]);
                                    }
                                } }
                            />
                            <div className="sub-attribute-list" style={{ marginTop: "1rem" }}>
                                { subAttributes.map((attribute, index) => (
                                    <div
                                        className="sub-attribute-row"
                                        key={ index }
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: "0.5rem"
                                        }}
                                    >
                                        <span>{ attribute.replace(/^traits\./, "") }</span>
                                        <IconButton
                                            onClick={ () =>
                                                setSubAttributes(
                                                    subAttributes.filter(item => item !== attribute)
                                                )
                                            }
                                            style={{ marginLeft: "auto" }}
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </div>
                                )) }
                            </div>
                        </>
                    )}

                    <div style={{ marginTop: "2rem" }}>
                        <PrimaryButton
                            onClick={ handleUpdate }
                            loading={ isUpdating }
                            disabled={ isUpdating }
                        >
                            Update
                        </PrimaryButton>
                    </div>
                </Form>
            )}
        </TabPageLayout>
    );
};

export default TraitsEditPage;
