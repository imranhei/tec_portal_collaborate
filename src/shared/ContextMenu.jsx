import { Menu, MenuItem, Transition } from "@headlessui/react";
import { forwardRef, Fragment, memo } from "react";
import useContextMenu from "../hooks/useContextMenu";

const ContextMenu = forwardRef((props, ref) => {
  const { content } = props;
  const { anchorPoint, show } = useContextMenu(ref);

  return (
    <Menu as="div" className="print:hidden">
      <Transition
        show={show}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div
          static
          style={{ top: anchorPoint?.y, left: anchorPoint?.x }}
          className="absolute z-20 mr-3 min-w-[54px] py-3 origin-top-right divide-y divide-borderColor rounded-md bg-secondary border border-borderColor shadow-lg drop-shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1 flex flex-col">
            {content &&
              content.map((item, index) =>
                item.display === false ? null : (
                  <MenuItem key={index}>
                    <div
                      className={`flex flex-row text:sm py-2 px-4 hover:bg-default cursor-pointer ${
                        item.className ? `${item.className}` : ""
                      }`}
                      onClick={item.function}
                    >
                      {item.icon}
                      <span className={`ml-2 `}>{item.name}</span>
                    </div>
                  </MenuItem>
                )
              )}
          </div>
        </div>
      </Transition>
    </Menu>
  );
});

ContextMenu.displayName = "ContextMenu";

export default memo(ContextMenu);
