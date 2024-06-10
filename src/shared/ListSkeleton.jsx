import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ListSkeleton = (props) => {
  const { rows } = props;
  return (
    <div className="mt-4">
      {[...Array(rows ? rows : 20).keys()].map((row, index) => (
        <div key={index} className="">
          <Skeleton
            color={"#dedede"}
            style={{ width: "100%", height: 25, marginBottom: "15px" }}
          />
        </div>
      ))}
    </div>
  );
};

ListSkeleton.displayName = "ListSkeleton";

export default ListSkeleton;
