import { httpClient } from "../config/AxiosHelper";

export const createRoomApi = async (roomDetail) => {
  const respone = await httpClient.post(`/rooms`, roomDetail, {
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
    },
  });
  return respone.data;
};

export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/rooms/${roomId}`);
  return response.data;
};

export const getMessagess = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};
