import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import type { SelectedCountry } from "../../types/vote";

interface VoteDialogProps {
  open: boolean;
  selectedCountry: SelectedCountry | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const VoteDialog = ({
  open,
  selectedCountry,
  loading,
  onConfirm,
  onCancel,
}: VoteDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>
        {selectedCountry?.nameJa} ({selectedCountry?.nameEn}) に投票しますか？
      </DialogTitle>
      <DialogContent>
        <Typography>
          この内容で確定してよろしいですか？
          <br />
          投票は一度のみで、後から変更はできません。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" disabled={loading}>
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? "投票中..." : "投票する"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 