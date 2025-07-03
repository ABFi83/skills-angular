export interface UserResponse {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  role?: RoleResponse;
  code: string;
  is_admin: boolean;
  ratingAverage?: number;
}

export interface RoleResponse {
  id: number;
  code: string;
  name: string;
}
