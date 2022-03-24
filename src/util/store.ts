import { persistentWritable } from "./persistentStore";
export { mirroredStore };

const mirroredStore = persistentWritable<boolean>("mirrored", true);
