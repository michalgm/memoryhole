import { useConfirm } from 'material-ui-confirm';
import { useState, useEffect } from 'react';

export const FormStateHandler = ({ blocker }) => {
  const confirm = useConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleNav = async () => {
      if (isDialogOpen) return;

      setIsDialogOpen(true);
      try {
        await confirm({
          title: 'You have unsaved changes. Are you sure you want to leave this page? Changes you made will be lost if you navigate away.',
        });
        blocker.confirm();
      } catch (e) {
        blocker.abort();
      } finally {
        setIsDialogOpen(false);
      }
    };
    if (blocker.state === 'BLOCKED') {
      handleNav();
    }
  }, [blocker, confirm, isDialogOpen]);
  return null;
};
