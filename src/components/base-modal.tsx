import React, { useState } from 'react';

import { DialogStateReturn } from 'reakit/Dialog';
import { Dialog, useDialogState } from './dialog';

export interface BaseModalArgs {
  dialog: DialogStateReturn;
  isOpen: boolean;
  setIsOpen: Function;
}

interface BaseModalReq {
  className?: string;
  title?: string;
  defaultStyle?: boolean;
}

export function withBaseModal(Component: React.FC<BaseModalArgs>) {
  const Wrapper: React.FC<BaseModalReq> = ({
    className,
    title,
    defaultStyle,
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dialog = useDialogState({ modal: false });

    return (
      <Dialog
        {...dialog}
        visible={isOpen}
        aria-label={title}
        className={className}
        defaultStyle={defaultStyle}
      >
        <Component dialog={dialog} setIsOpen={setIsOpen} isOpen={isOpen} />
      </Dialog>
    );
  };

  return Wrapper;
}

export default withBaseModal;
