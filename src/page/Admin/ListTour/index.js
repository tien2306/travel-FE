import { useEffect, useState } from "react";
import { Button } from "antd";
import { getTour } from "../../../services/tourService";
import RoomGrid from "../../../components/Admin/ListRoom/RoomGrid";
import RoomTable from "../../../components/Admin/ListRoom/RoomTable";

function ListRoom() {
  const [data, setData] = useState([]);
  const [isGrid, setIsGrid] = useState(true);

  const fetchApi = async () => {
    const res = await getTour();
    //   console.log(res);
    setData(res.reverse());
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleReload = () => {
    fetchApi();
  };

  console.log(data);

  return (
    <>
      <Button onClick={() => setIsGrid(!isGrid)}>Grid/List</Button>
      {isGrid ? (
        <RoomGrid data={data} />
      ) : (
        <RoomTable onReload={handleReload} data={data} />
      )}
    </>
  );
}

export default ListRoom;
