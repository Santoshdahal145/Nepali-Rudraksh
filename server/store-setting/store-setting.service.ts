import { db } from "../../src/prisma/db";
import { UpdateStoreSettingInput } from "./store-setting.schema";


export async function updateStoreSetting(
  data: UpdateStoreSettingInput
) {
  return await db.orm.public.StoreSettings.where({id:1}).update(data)
}


export async function getStoreSetting() {
  return await db.orm.public.StoreSettings.first()
}