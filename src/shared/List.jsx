import clsx from "clsx";
import { get, isEmpty, isEqual, uniqBy } from "lodash";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Fragment } from "react";
import { useRef } from "react";
import { ITEM_PER_PAGE } from "../common/constant";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { useReactToPrint } from "react-to-print";

const BodyListItem = React.memo(
  ({
    id,
    style,
    autoSerialNumber,
    properties,
    itemIndex,
    item,
    customColumnClassNames,
    extraBorder,
    t,
    pageStates,
    header,
    body,
    renderDropdownItem,
    contextMenuData,
    printStyles,
  }) => {
    const wrapperRef = useRef();
    const serialStyles = Array.isArray(customColumnClassNames)
      ? customColumnClassNames.find((item) => item.property === "si")
      : null;

    const contextMenuItems = renderDropdownItem
      ? contextMenuData({ row: item })
      : [];
    const isAnyContextMenuItemsTrue = contextMenuItems.some((item) => {
      return get(item, "display", true);
    });

    return (
      <Fragment>
        <div
          className={`py-2 px-4 md:px-0 print:px-0 ${
            extraBorder
              ? "print:border-b print:border-gray-500"
              : "print:border-b print:border-gray-50"
          } print:w-auto print:py-0`}
          ref={wrapperRef}
          id={id}
        >
          <div
            className={clsx(
              `grid grid-cols-2 border border-borderColor hover:border-teal transition duration-300 md:border-0 md:gap-4 md:px-4 print:md:px-0 print:py-1 print:gap-3 print:border-0` +
                " " +
                style.columnWidth +
                " " +
                style.printColumnWidth,
              printStyles.listItemBody
            )}
          >
            {autoSerialNumber ? (
              <Fragment key={`${id}-${itemIndex}`}>
                <h6 className="pl-4 py-2 md:hidden print:hidden">{t("SL")}</h6>

                <div
                  className={`odd:bg-primary odd:md:bg-transparent text-right md:text-left pr-4 md:pr-0 py-2 md:py-0 print:text-left print:py-0 select-all ${
                    serialStyles ? serialStyles.className : ""
                  }`}
                >
                  {pageStates?.itemPerPage * pageStates?.currentPage +
                    itemIndex +
                    1}
                </div>
              </Fragment>
            ) : (
              <></>
            )}
            {properties.map((propertyKey, propertyIndex) => {
              let hasCustomClassName = customColumnClassNames
                ? customColumnClassNames.filter(
                    (p) => p.property === propertyKey
                  )
                : [];
              return (
                <Fragment key={`${id}-${propertyKey}-${propertyIndex}`}>
                  <div className="md:hidden print:hidden odd-grid-cols-2:bg-default odd-grid-cols-2:md:bg-transparent print:odd-grid-cols-2:bg-transparent py-2 md:py-0 pl-4 md:pl-0">
                    {header[propertyKey]}
                  </div>
                  <div
                    className={`even-grid-cols-2:bg-default md:even-grid-cols-2:bg-transparent print:even-grid-cols-2:bg-transparent text-right md:text-left py-2 md:py-0 pr-4 md:pr-0 print:pr-0 print:even-grid-cols-2:bg-white print:text-left print:py-0 select-all ${
                      hasCustomClassName?.length > 0
                        ? hasCustomClassName[0].className
                        : ""
                    }`}
                    style={{ wordBreak: "break-word" }}
                  >
                    {body({ row: item, column: propertyKey })}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
        {/* {renderDropdownItem && isAnyContextMenuItemsTrue && (
          <ContextMenu
            ref={wrapperRef}
            content={contextMenuData({ row: item })}
          />
        )} */}
      </Fragment>
    );
  },
  isEqual
);

BodyListItem.displayName = "BodyListItem";

const BodyItem = React.memo((props) => {
  const {
    listDataResults,
    lastElementRef,
    onAddRowClassName,
    style,
    autoSerialNumber,
    properties,
    customColumnClassNames,
    extraBorder,
    t,
    pageStates,
    header,
    body,
    renderDropdownItem,
    contextMenuData,
    printStyles,
  } = props;

  const renderAbleTableData = listDataResults;

  return renderAbleTableData?.map?.((item, itemIndex) => {
    const id = get(item, "id", "id");
    const refProp =
      renderAbleTableData?.length === itemIndex + 1
        ? {
            ref: lastElementRef,
          }
        : {};
    const rowClassName =
      typeof onAddRowClassName === "function"
        ? onAddRowClassName({ row: item })
        : "";

    return (
      <div
        className={clsx(
          "print:py-0 print:break-inside-auto print:table-row-group md:border md:border-listItemBorder md:border-x-secondary md:border-t-secondary md:hover:bg-listItemHoverBg md:hover:!border-listItemHoverBorder",
          rowClassName,
          printStyles.listBody
        )}
        key={`${id}-${itemIndex}`}
        {...refProp}
      >
        <BodyListItem
          style={style}
          autoSerialNumber={autoSerialNumber}
          properties={properties}
          itemIndex={itemIndex}
          id={id}
          item={item}
          customColumnClassNames={customColumnClassNames}
          extraBorder={extraBorder}
          t={t}
          pageStates={pageStates}
          header={header}
          body={body}
          renderDropdownItem={renderDropdownItem}
          contextMenuData={contextMenuData}
          printStyles={printStyles}
        />
      </div>
    );
  });
}, isEqual);

BodyItem.displayName = "BodyItem";

const List = forwardRef((props, ref) => {
  const {
    title,
    onChangeData,
    header,
    body,
    properties,
    printFunctionRef,
    style,
    callApi,
    noDataFoundButton,
    message,
    contextMenuData,
    filterBadgeItems,
    showTotal,
    getTotalField,
    printHeaderExtra,
    noPagination,
    customColumnClassNames,
    extraBorder,
    onAddRowClassName,
    numberOfLoadingSkeletonRows,
    mergeableData,
    disabledBottomScrollButton,
    accessorKey,
    useTanstackTable = false,
    autoSerialNumber = true,
    data = {},
    loading = false,
    renderDropdownItem = () => {},
    shouldRenderUniqueList = false,
    uniqueByIdentifier = "id",
    noDataFoundHeading = "",
    printStyles = {
      listWrapper: "print:text-sm",
      listHeader: "print:text-sm",
      listBody: "print:text-sm",
      listItemBody: "",
      printHeader: "print:text-sm",
      filterBadge: "print:text-sm",
    },
  } = props;

  const [listData, setListData] = useState(data);
  const [isLoading, setIsLoading] = useState(loading);
  const [autoScroll, setAutoScroll] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [pageStates, setPageStates] = useState({
    itemPerPage: ITEM_PER_PAGE,
    currentPage: 0,
  });
  const [hasInfiniteScrollError, setHasInfiniteScrollError] = useState(false);
  const [bottomScrollButton, setBottomScrollButton] = useState(
    disabledBottomScrollButton ? disabledBottomScrollButton : false
  );
  const [filterItems, setFilterItems] = useState();
  const [queryValues, setQueryValue] = useState({});

  const printContentRef = useRef(null);

  const scrollDir = useScrollDirection();

  const handlePrint = useReactToPrint({
    content: () => printContentRef.current,
    removeAfterPrint: true,
  });
  const next = get(listData, "next", "");
  const previous = get(listData, "previous", "");
  const count = get(listData, "count", 0);
  const listDataResults = useMemo(() => {
    const allListData = get(listData, "results", []);
    if (shouldRenderUniqueList) {
      return uniqBy(allListData, uniqueByIdentifier);
    } else {
      return allListData;
    }
  }, [listData, shouldRenderUniqueList, uniqueByIdentifier]);

  const getPagePrintStyles = () => {
    return `
            @page {
                size: A4;
                margin-left: 3mm;
                margin-right: 3mm;
                margin-top: 5mm;
                margin-bottom: 5mm;
            }
        `;
  };

  const calculateGrandTotal = useMemo(() => {
    return Array.isArray(listDataResults)
      ? listDataResults
          .reduce(
            (accumulator, current) => accumulator + current[getTotalField],
            0
          )
          .toFixed(2)
      : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listDataResults]);

  const callData = useCallback(
    (url, more) => {
      if (!url) return;

      setIsLoading(true);

      const onSuccess = (response) => {
        const _listData = get(response, "data", {});
        const results = get(response, "data.results", []);
        const updatedData = more
          ? mergeableData
            ? { ..._listData, results: [...mergeableData.results, ...results] }
            : { ..._listData, results: [...listDataResults, ...results] }
          : { ..._listData, results: [...results] };

        if (onChangeData) onChangeData({ ...updatedData });
        setIsLoading(false);
      };

      const onError = (error) => {
        console.error(error);
        setHasInfiniteScrollError(true);
      };

      const onFinally = () => {
        // setIsLoading(false);
      };

      callApi(url, onSuccess, onError, onFinally);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listDataResults, mergeableData, onChangeData]
  );

  useEffect(() => {
    setListData(data);
    setIsLoading(loading);
    if (printFunctionRef) {
      printFunctionRef.current = handlePrint;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  useEffect(() => {
    if (count === 0) {
      setPageStates({ ...pageStates, itemPerPage: 0 });
    } else if (count < ITEM_PER_PAGE) {
      setPageStates({
        itemPerPage: count,
        currentPage: 0,
      });
    } else if (count > ITEM_PER_PAGE) {
      setPageStates({
        itemPerPage: ITEM_PER_PAGE,
        currentPage: queryValues.page ? queryValues.page - 1 : 0,
      });
    } else {
      setPageStates({ ...pageStates, itemPerPage: ITEM_PER_PAGE });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, queryValues]);

  const columns = useMemo(() => {
    return useTanstackTable
      ? properties.map((propertyKey) => {
          return {
            header: header[propertyKey],
            accessorKey: accessorKey[propertyKey],
            propertyKey,
          };
        })
      : [];
  }, [properties, header, accessorKey, useTanstackTable]);

  const renderAbleTableData = listDataResults;

  const HeaderItem = listDataResults?.map?.((item, itemIndex) => {
    const id = get(item, "id", "");
    const serialStyles = customColumnClassNames
      ? customColumnClassNames.find((item) => item.property === "si")
      : {};

    return itemIndex === 0 ? (
      <div
        key={`${id}-${itemIndex}-header`}
        className={`print:break-inside-avoid-page print:table-header-group ${
          bottomScrollButton ? "" : "sticky"
        } print:static ${
          scrollDir === "up" ? "top-[8.74rem]" : "top-[63px]"
        } z-10`}
      >
        <div
          className={clsx(
            `hidden md:grid gap-4 z-10 ${
              bottomScrollButton ? "" : "sticky"
            } print:static top-16 px-4 print:px-0 py-4 border-y border-borderColor drop-shadow-md font-semibold text-xs uppercase print:capitalize text-left bg-default text-accent print:grid print:gap-x-3 print:bg-white print:font-bold print:border-b-2 print:border-t-2 print:py-1 print:my-2 print:border-y-0 print:border-b-black print:border-t-black print:drop-shadow-none print:text-black`,
            style.columnWidth,
            style.printColumnWidth,
            printStyles.listHeader
          )}
          style={{ wordBreak: "break-word" }}
        >
          {autoSerialNumber ? (
            <h6
              className={`print:self-end select-all ${
                serialStyles ? serialStyles.className : ""
              }`}
            >
              Sl
            </h6>
          ) : (
            <></>
          )}
          {properties.map((propertyKey, propertyIndex) => {
            let hasCustomClassName = customColumnClassNames
              ? customColumnClassNames.filter((p) => p.property === propertyKey)
              : [];
            return (
              <h6
                key={`${propertyKey}-${propertyIndex}`}
                className={`print:self-end select-all ${
                  hasCustomClassName?.length > 0
                    ? hasCustomClassName[0].className
                    : ""
                }`}
              >
                {header[propertyKey]}
              </h6>
            );
          })}
        </div>
      </div>
    ) : null;
  });

  const TableItem = (
    <div className="bg-secondary text-accent print:text-black print:table print:w-full print:divide-y print:divide-borderColor">
      {HeaderItem}
      <BodyItem
        listDataResults={renderAbleTableData}
        onAddRowClassName={onAddRowClassName}
        style={style}
        autoSerialNumber={autoSerialNumber}
        properties={properties}
        customColumnClassNames={customColumnClassNames}
        extraBorder={extraBorder}
        pageStates={pageStates}
        header={header}
        body={body}
        renderDropdownItem={renderDropdownItem}
        contextMenuData={contextMenuData}
        printStyles={printStyles}
      />
      {showTotal && !isLoading && (
        <div
          className={
            "py-4 flex flex-row justify-between mx-4 my-2 md:grid" +
            " " +
            style.footerColumnWidth
          }
        >
          <div className="pl-4">Total</div>
          <div className="mr-4 text-right md:mr-0">{calculateGrandTotal}</div>
        </div>
      )}
    </div>
  );

  const NoDataFoundItem = (
    <div className="flex flex-grow justify-center items-center">
      <h1 className="text-lg">{noDataFoundHeading}</h1>
      {noDataFoundButton}
    </div>
  );

  // const PaginationItem = (
  //   <Fragment>
  //     {noPagination || listDataResults?.length < ITEM_PER_PAGE ? (
  //       <></>
  //     ) : (
  //       // paginationType === ENUMS.paginationType.default.value ? (
  //       //     <ScrollItemDefault
  //       //         pageStates={pageStates}
  //       //         setPageStates={setPageStates}
  //       //         listDataResults={listDataResults}
  //       //         t={t}
  //       //         callApi={callApi}
  //       //         count={count}
  //       //         next={next}
  //       //         previous={previous}
  //       //         isLoading={isLoading}
  //       //     />
  //       // ) :
  //       <ScrollItemScroll
  //         listDataResults={listDataResults}
  //         count={count}
  //         loading={isLoading}
  //         next={next}
  //         callData={callData}
  //         autoScroll={autoScroll}
  //         setAutoScroll={setAutoScroll}
  //       />
  //     )}
  //   </Fragment>
  // );

  const ListContentItem = (
    <div
      className={clsx(
        "text-sm flex flex-grow flex-col print:block print:px-4 print:pt-4 print:text-black",
        printStyles.listWrapper
      )}
      ref={printContentRef}
    >
      {Array.isArray(listDataResults) && isEmpty(listDataResults) ? (
        !isLoading ? (
          <div className="flex flex-grow border border-borderColor m-4 items-center">
            {NoDataFoundItem}
          </div>
        ) : (
          <></>
        )
      ) : !isLoading && !Array.isArray(listDataResults) ? (
        <div className="flex flex-grow border border-borderColor m-4 items-center">
          {NoDataFoundItem}
        </div>
      ) : (
        TableItem
      )}
      {isLoading ? (
        <div className="flex flex-grow justify-center items-center">
          <div className="flex flex-col items-center">
            {[...Array(numberOfLoadingSkeletonRows).keys()].map((item) => (
              <div
                key={item}
                className="flex flex-row justify-between w-full my-2"
              >
                <div className="flex flex-col w-1/2 h-8 bg-gray-200 rounded"></div>
                <div className="flex flex-col w-1/2 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  return <>{ListContentItem}</>;
});

List.displayName = "List";

export default List;
