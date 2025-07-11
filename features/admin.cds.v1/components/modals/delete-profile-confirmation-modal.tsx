import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface DeleteProfileConfirmationModalProps {
    open: boolean;
    profileId: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteProfileConfirmationModal: React.FC<DeleteProfileConfirmationModalProps> = ({
    open,
    profileId,
    onConfirm,
    onCancel
}) => (
    <Dialog open={open} onClose={onCancel}>
        <DialogTitle>Confirm Profile Deletion</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete profile "{profileId}"? This action cannot be undone.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button color="error" onClick={onConfirm}>Delete</Button>
        </DialogActions>
    </Dialog>
);

export default DeleteProfileConfirmationModal;