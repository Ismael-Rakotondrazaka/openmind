export const filterUser = <T>(data: T & User): User => {
  return {
    id: data.id,
    role: data.role,
    createdAt: data.createdAt,
    deletedAt: data.deletedAt,
    firstName: data.firstName,
    name: data.name,
    profileUrl: data.profileUrl,
    updatedAt: data.updatedAt,
    username: data.username,
  };
};
