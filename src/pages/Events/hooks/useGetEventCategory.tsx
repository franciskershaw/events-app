// import useAxios from "@/axios/useAxios";
// import { useQuery } from "@tanstack/react-query";
// import useUser from "../../../hooks/user/useUser";

// const useGetEventCategory = () => {
//   const api = useAxios();

//   const getEventCategory = async () => {
//     const res = await api.get("/events", {
//       headers: { Authorization: `Bearer ${user.accessToken}` },
//     });

//     return res.data;
//   };

//   const {
//     data: events = [],
//     isFetching: fetchingEvents,
//     isError: errorFetchingEvents,
//   } = useQuery({
//     queryKey: ["events"],
//     queryFn: getEventCategory,
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });

//   return {
//     events,
//     fetchingEvents,
//     errorFetchingEvents,
//   };
// };

// export default useGetEventCategory;
