export interface File {
  pk: number;
  uuid: string;

  name: string;
  user_id: number;
  type: string; 
  size: number; 
  url?: string; // S3 URL
}