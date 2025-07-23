import { DeleteRequest } from "../../../../../functions/deleteRequest";
import { PostRequest } from "../../../../../functions/postRequest";

export const DeleteFromAvailableShifts = (url, id = null) => DeleteRequest(url, id);
export const AddToAwardedShifts = (url, jsonBody) => PostRequest(url, jsonBody);