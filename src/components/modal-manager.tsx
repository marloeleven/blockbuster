import React, { useCallback, useState, useRef, useEffect } from 'react';
import produce from 'immer';

import noop from 'lodash/noop';

import { Button } from 'reakit/Button';
import { Dialog, useDialogState, Close } from './dialog';

import clsx from 'clsx';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IModalManagerActions } from 'types';

interface ModalManagerContextType {
  showModal: (args: IModalArgs) => Promise<any>;
  closeModal: () => void;
}

export const ModalManagerContext = React.createContext<ModalManagerContextType>(
  {
    showModal: async (args: IModalArgs) => false,
    closeModal: () => {},
  }
);

interface IButtonState {
  enabled: boolean;
  autoFocus: boolean;
  label: string;
  class?: string;
}

type UIMessage = string | React.FunctionComponent | JSX.Element;
interface IModalArgs {
  title: UIMessage;
  message: UIMessage;
  buttonsClass?: string;
  okButton?: Partial<IButtonState>;
  cancelButton?: Partial<IButtonState>;
}

interface IModalState {
  isOpen: boolean;
  title: UIMessage;
  message: UIMessage;
  buttonsClass?: string;
  okButton: IButtonState;
  cancelButton: IButtonState;
  promise: {
    resolve: Function;
    reject: Function;
  };
}

const defaultModalState: IModalState = {
  isOpen: false,
  title: '',
  message: '',
  buttonsClass: 'flex justify-end pt-2 modal-footer',
  okButton: {
    enabled: true,
    autoFocus: true,
    label: 'Ok',
    class: 'btn btn-outline btn-primary mr-2',
  },
  cancelButton: {
    enabled: true,
    autoFocus: false,
    label: 'Cancel',
    class:
      'btn btn-outline btn-secondary border-neutralgray-500 hover:bg-neutralgray-400 hover:text-neutralgray-800',
  },
  promise: {
    resolve: noop,
    reject: noop,
  },
};

export const modalManager$ = new Subject();

const onModalManager$ = modalManager$.pipe(
  map((action) => action as IModalManagerActions)
);

const ModalManager: React.FC<{}> = ({ children }) => {
  const okButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [modalState, setModalState] = useState<IModalState>(defaultModalState);

  const dialog = useDialogState();

  const showModal = useCallback(
    ({ okButton, cancelButton, ...newState }: IModalArgs): Promise<any> => {
      return new Promise((resolve, reject) => {
        setModalState(
          produce(defaultModalState, (draft) => {
            Object.assign(draft, newState, {
              isOpen: true,
              promise: {
                resolve,
                reject,
              },
            });

            Object.assign(draft.okButton, okButton || {});
            Object.assign(draft.cancelButton, cancelButton || {});
          })
        );
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState(
      produce((draft) => {
        draft.promise.reject();
        Object.assign(draft, defaultModalState);
      })
    );
  }, []);

  const acceptButton = useCallback(() => {
    setModalState(
      produce((draft) => {
        draft.promise.resolve();
        Object.assign(draft, defaultModalState);
      })
    );
  }, []);

  useEffect(() => {
    onModalManager$.subscribe((action) => {
      if (action === IModalManagerActions.OK) {
        return acceptButton();
      }

      closeModal();
    });
  }, [acceptButton, closeModal]);

  useEffect(() => {
    if (modalState.isOpen && okButtonRef.current && cancelButtonRef.current) {
      if (modalState.okButton.autoFocus) {
        return okButtonRef.current.focus();
      }

      if (modalState.cancelButton.autoFocus) {
        return cancelButtonRef.current.focus();
      }
    }
  }, [
    modalState.isOpen,
    modalState.okButton.autoFocus,
    modalState.cancelButton.autoFocus,
    okButtonRef,
    cancelButtonRef,
  ]);

  return (
    <ModalManagerContext.Provider
      value={{
        showModal,
        closeModal,
      }}
    >
      {children}
      <Dialog
        {...dialog}
        visible={modalState.isOpen}
        className="flex items-center justify-center h-full"
        defaultStyle={false}
      >
        <div className="confirmation-modal py-3 px-4 w-2/4">
          {/* Title */}
          <div className="bg-blue-400 items-center -mx-4 -mt-4 my-4 py-1 px-2 flex justify-between">
            <p className="text-sm text-white">{modalState.title}</p>
            <Close onClick={closeModal} />
          </div>

          {/* Message body */}
          <div className="md:flex md:items-center mb-6 flex-wrap">
            {modalState.message}
          </div>

          {/* Footer */}
          <div className={clsx(modalState.buttonsClass)}>
            <Button
              ref={okButtonRef}
              className={clsx(modalState.okButton.class, {
                hidden: !modalState.okButton.enabled,
              })}
              onClick={acceptButton}
            >
              {modalState.okButton.label}
            </Button>
            <Button
              ref={cancelButtonRef}
              className={clsx(modalState.cancelButton.class, {
                hidden: !modalState.cancelButton.enabled,
              })}
              onClick={closeModal}
            >
              {modalState.cancelButton.label}
            </Button>
          </div>
        </div>
      </Dialog>
    </ModalManagerContext.Provider>
  );
};

export default ModalManager;
