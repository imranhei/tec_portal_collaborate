import React, { useCallback, useEffect, useState } from "react";

// memoize the data to avoid re-rendering
const BodyItem = React.memo(({ data, style, rowData }) => {
  return (
    <div>
      {data.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col border-b hover:bg-blue-gray-100`}
        >
          <div className={`${style}`}>{rowData(item)}</div>
        </div>
      ))}
    </div>
  );
}, []);

BodyItem.displayName = "BodyItem";

function List({
  data,
  onChangeData,
  loading,
  error,
  property,
  style,
  rowData,
  header,
  title,
  ...restProps
}) {
  const [listItems, setListItems] = useState([...data]);
  const [search, setSearch] = useState("");

  // memoize the data to avoid re-rendering
  const handleChangeData = useCallback(
    (data) => {
      const prevData = listItems;
      setListItems([...prevData, ...data]);
    },
    [listItems]
  );

  useEffect(() => {
    if (data) {
      handleChangeData(data);
    }
    const getData = onChangeData();
    if (getData) {
      handleChangeData(getData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, handleChangeData]);

  const Header = () => {
    return (
      <div>
        {header &&
          header.map((item, index) => (
            <div key={index} className={`${style} uppercase break-all`}>
              <div className="flex items-center">
                <span className="text-lg font-semibold">{item}</span>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg font-semibold">{title}</span>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="px-2 py-1 border border-gray-300 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Header />
        <BodyItem data={listItems} style={style} rowData={rowData} />
      </div>
    </div>
  );
}

export default List;
