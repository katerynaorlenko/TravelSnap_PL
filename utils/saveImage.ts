import * as FileSystem from "expo-file-system/legacy";

export const saveImage = async (uri: string): Promise<string> => {
  const filename = uri.split("/").pop() || `photo-${Date.now()}.jpg`;
  const dir = FileSystem.documentDirectory + "trips/";

  const dirInfo = await FileSystem.getInfoAsync(dir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, {
      intermediates: true,
    });
  }

  const dest = dir + filename;

  await FileSystem.copyAsync({
    from: uri,
    to: dest,
  });

  return dest;
};
