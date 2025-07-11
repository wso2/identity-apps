import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Typography
} from "@mui/material";

const ProfilesTable = ({ profiles }) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><strong>Profile ID</strong></TableCell>
                    <TableCell><strong>User Info</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {profiles.map((profile) => {
                    const identity = profile.identity || {};
                    const userId = identity.user_id;
                    const username = identity.user_name;

                    return (
                        <TableRow
                            key={ profile.perma_id }
                            hover
                            onClick={ () => window.history.pushState({}, "", `/profile/${profile.perma_id}`) }
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell>
                                <Typography>{ profile.perma_id }</Typography>
                                {username && (
                                    <Typography variant="caption" color="text.secondary">
                                        {username}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                {userId ? (
                                    <>
                                        <Chip label="Registered User" color="success" size="small" />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: "block" }}
                                        >
                                            {userId}
                                        </Typography>
                                    </>
                                ) : (
                                    <Chip label="Anonymous Profile" color="primary" size="small" />
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default ProfilesTable;
