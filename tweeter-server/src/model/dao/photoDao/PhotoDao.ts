export interface PhotoDao {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
