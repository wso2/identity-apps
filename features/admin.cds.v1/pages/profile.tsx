// import React, { useState, useEffect } from "react";
// import {
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, Chip, Button, Dialog, DialogActions, DialogContent,
//     DialogContentText, DialogTitle, Typography, Box, Card, CardContent
// } from "@mui/material";
// import { Tabs, Tab } from "@oxygen-ui/react";
// import { fetchUserDetails, deleteUserProfile } from "../api/users";
// import axios from "axios";
// import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';

// interface Profile {
//     profile_id: string;
//     identity_attributes: Record<string, any>;
//     traits: Record<string, any>;
//     application_data: ApplicationData[];
//     profile_hierarchy?: ProfileHierarchy;
// }

// interface ApplicationData {
//     application_id: string;
//     [key: string]: any;
// }

// interface Event {
//     event_id: string;
//     app_id: string;
//     event_name: string;
//     event_type: string;
//     event_timestamp: string;
// }

// interface ProfileHierarchy {
//     parent_profile_id?: string;
//     child_profile_ids?: { child_profile_id: string; rule_name?: string }[];
//     list_profile?: boolean;
// }

// const eventTypeColor: Record<string, any> = {
//     identify: "primary",
//     track: "secondary",
//     page: "info",
//     screen: "warning",
//     group: "success",
//     alias: "error"
// };

// interface RouterProps {
//     pathname: string;
//     navigate: (path: string) => void;
// }

// interface Props {
//     router: RouterProps;
// }

// const UserProfilePage: React.FC<Props> = ({ router }) => {
//     const match = router.pathname?.match(/^\/users\/(.+)$/);
//     const permaId = match?.[1];

//     const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
//     const [selectedAppContextId, setSelectedAppContextId] = useState<string | null>(null);
//     const [selectedEventsAppId, setSelectedEventsAppId] = useState<string | null>(null);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [userEvents, setUserEvents] = useState<Event[]>([]);

//     useEffect(() => {
//         if (permaId) {
//             fetchUserDetails(permaId).then((data) => {
//                 setSelectedProfile(data);

//                 const firstApp = data?.application_data?.[0];
//                 if (firstApp) {
//                     setSelectedAppContextId(firstApp.application_id);
//                     setSelectedEventsAppId(firstApp.application_id);
//                 }
//             });

//             axios.get(`http://localhost:8900/api/v1/${permaId}/events`)
//                 .then((res) => {
//                     if (Array.isArray(res.data)) {
//                         const sorted = res.data.sort((a, b) =>
//                             new Date(b.event_timestamp).getTime() - new Date(a.event_timestamp).getTime()
//                         );
//                         setUserEvents(sorted);
//                     }
//                 })
//                 .catch(console.error);
//         }
//     }, [permaId]);

//     useEffect(() => {
//         if (userEvents.length && !selectedEventsAppId) {
//             const firstAppId = userEvents[0].app_id;
//             setSelectedEventsAppId(firstAppId);
//         }
//     }, [userEvents, selectedEventsAppId]);

//     const groupedEvents = userEvents.reduce<Record<string, Event[]>>((acc, event) => {
//         acc[event.app_id] = acc[event.app_id] || [];
//         acc[event.app_id].push(event);
//         return acc;
//     }, {});

//     const handleDelete = async () => {
//         try {
//             await deleteUserProfile(permaId!);
//             alert("User profile deleted successfully.");
//             router.navigate("/users");
//         } catch (error) {
//             alert("Failed to delete user profile.");
//             console.error(error);
//         }
//     };

//     const ProfileHierarchyGraph = ({ profile }: { profile: Profile }) => {
//         if (!profile || !profile.profile_id) return null;

//         const nodes: Node[] = [];
//         const edges: Edge[] = [];

//         const currentId = profile.profile_id;
//         const parentId = profile.profile_hierarchy?.parent_profile_id;
//         const childProfiles = profile.profile_hierarchy?.child_profile_ids || [];

//         const spacing = 300;
//         const startX = (childProfiles.length - 1) * -spacing / 2;

//         childProfiles.forEach((child, index) => {
//             const isCurrent = child.child_profile_id === currentId;
//             const x = startX + index * spacing;

//             nodes.push({
//                 id: child.child_profile_id,
//                 data: {
//                     label: (
//                         <Box textAlign="center">
//                             <Typography variant="body2">{child.child_profile_id}</Typography>
//                             <Chip
//                                 label={isCurrent ? "Current Profile" : "Peer Profile"}
//                                 color={isCurrent ? "info" : "secondary"}
//                                 size="small"
//                             />
//                         </Box>
//                     )
//                 },
//                 position: { x, y: 200 }
//             });

//             if (parentId) {
//                 edges.push({
//                     id: `e-${parentId}-${child.child_profile_id}`,
//                     source: parentId,
//                     target: child.child_profile_id,
//                     label: child.rule_name || "linked",
//                     style: { strokeDasharray: '4 2' }
//                 });
//             }
//         });

//         if (parentId) {
//             nodes.push({
//                 id: parentId,
//                 data: {
//                     label: (
//                         <Box textAlign="center">
//                             <Typography variant="body2">{parentId}</Typography>
//                             <Chip label="Master Profile" color="primary" size="small" />
//                         </Box>
//                     )
//                 },
//                 position: { x: 0, y: 0 }
//             });
//         }

//         if (profile.profile_hierarchy?.list_profile && !parentId) {
//             nodes.push({
//                 id: currentId,
//                 data: {
//                     label: (
//                         <Box textAlign="center">
//                             <Typography variant="body2">{currentId}</Typography>
//                             <Chip label="Master Profile" color="primary" size="small" />
//                         </Box>
//                     )
//                 },
//                 position: { x: 0, y: 0 }
//             });
//         }

//         return (
//             <Box mt={6}>
//                 <Typography variant="h6" gutterBottom>Profile Hierarchy</Typography>
//                 <Box sx={{ height: 500, border: "1px solid #ccc", borderRadius: 2, mt: 2 }}>
//                     <ReactFlow nodes={nodes} edges={edges} fitView>
//                         <Background />
//                         <Controls />
//                     </ReactFlow>
//                 </Box>
//             </Box>
//         );
//     };

//     const renderTableData = (data: Record<string, any>) => {
//         return Object.entries(data || {}).map(([key, value]) => {
//             if (!value || (typeof value === "object" && Object.keys(value).length === 0)) return null;
//             return (
//                 <TableRow key={key}>
//                     <TableCell><strong>{key}</strong></TableCell>
//                     <TableCell>
//                         {Array.isArray(value) ? (
//                             <TableContainer component={Paper}>
//                                 <Table size="small">
//                                     <TableBody>
//                                         {value.map((item, index) => (
//                                             typeof item === "object" ? (
//                                                 <TableRow key={index}>
//                                                     <TableCell colSpan={2}>
//                                                         <TableContainer component={Paper}>
//                                                             <Table size="small">
//                                                                 <TableBody>
//                                                                     {Object.entries(item).map(([nestedKey, nestedValue]) => (
//                                                                         <TableRow key={nestedKey}>
//                                                                             <TableCell>{nestedKey}</TableCell>
//                                                                             <TableCell>{JSON.stringify(nestedValue)}</TableCell>
//                                                                         </TableRow>
//                                                                     ))}
//                                                                 </TableBody>
//                                                             </Table>
//                                                         </TableContainer>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ) : (
//                                                 <TableRow key={index}>
//                                                     <TableCell>{index + 1}</TableCell>
//                                                     <TableCell>{item}</TableCell>
//                                                 </TableRow>
//                                             )
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         ) : (
//                             typeof value === "object" ? JSON.stringify(value) : value
//                         )}
//                     </TableCell>
//                 </TableRow>
//             );
//         });
//     };

//     if (!selectedProfile) return <Box sx={{ p: 6 }}>Loading...</Box>;

//     return <div />; // The rest of the rendering remains the same
// };

// export default UserProfilePage;