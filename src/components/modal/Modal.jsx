import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MdClose } from "react-icons/md";
import React, { Fragment, useRef } from "react";

function Modal(props) {
  const { isOpen = false, onClose, title = "", size = "lg", children } = props;
  const ref = useRef(null);
  return (
    <Transition static={true} show={isOpen} as={Fragment}>
      <Dialog
        // as="div"
        className="relative z-50"
        initialFocus={ref}
        onClose={() => {
          // setOpen(false);
          // onClose();
        }}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed z-10 inset-0 bg-black bg-opacity-50 backdrop-blur-xs transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`transform rounded-md bg-white  text-left align-middle shadow-xl transition-all flex flex-col overflow-visible w-full ${
                  size === "lg"
                    ? "max-w-2xl"
                    : size === "sm"
                    ? "max-w-xl"
                    : size === "xxl"
                    ? "max-w-6xl"
                    : "max-w-3xl"
                } `}
              >
                <div className={``}>
                  <div className="flex h-12 justify-between items-center my-3 px-5">
                    <h2 className="text-xl  font-semibold">
                      {title ? title : "Modal"}
                    </h2>
                    <button
                      className="text-lg p-2 border-2 border-opacity-10 hover:bg-slate-100 hover:border-opacity-700 border-gray-700 hover:border-2 rounded-lg text-red-500"
                      onClick={onClose}
                    >
                      <MdClose size={24} />
                    </button>
                  </div>
                  <hr />
                  <div className="p-4">{children}</div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
