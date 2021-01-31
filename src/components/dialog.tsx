import * as React from 'react';
import {
  useDialogState,
  Dialog as RKDialog,
  DialogBackdrop,
  DialogDisclosure,
  DialogProps,
} from 'reakit/Dialog';
import { HTMLAttributes } from 'react';
import cx from 'clsx';
import { css } from 'emotion/macro';
import clsx from 'clsx';

export const Close = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function Close(props, ref) {
  return (
    <div
      ref={ref}
      tabIndex={0}
      {...props}
      className={clsx(
        'btn btn-ghost rounded-full',
        'p-1 cursor-pointer z-50',
        props.className
      )}
    >
      <svg fill="currentColor" width="18" height="18" viewBox="0 0 18 18">
        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
      </svg>
    </div>
  );
});

export const CloseDark = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function Close(props, ref) {
  return (
    <div
      ref={ref}
      tabIndex={0}
      {...props}
      className={clsx(
        'btn btn-secondary',
        'p-1 cursor-pointer z-50',
        props.className,
        css({
          '&:hover': {
            svg: {
              fill: '#707070',
            },
          },
        })
      )}
    >
      <svg fill="#231F20" width="24" height="24" viewBox="0 0 18 18">
        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
      </svg>
    </div>
  );
});

interface IDialogProps extends DialogProps {
  defaultStyle?: boolean;
}

const Dialog: React.FC<IDialogProps> = ({
  className,
  children,
  defaultStyle = true,
  ...props
}) => {
  return (
    <DialogBackdrop
      {...props}
      className={cx(
        'absolute left-0 bottom-0 right-0 overflow-auto z-50 bg-gray-900 transition-colors duration-300 ease-in modal bg-opacity-75 h-full'
      )}
    >
      <RKDialog
        {...props}
        className={cx(
          defaultStyle && 'relative outline-none bg-white shadow-lg p-4',
          className,
          !className &&
            'w-11/12 sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-6/12 max-w-screen-xl',
          'focus:outline-none'
        )}
      >
        {children}
      </RKDialog>
    </DialogBackdrop>
  );
};

export { useDialogState, DialogDisclosure, Dialog };
