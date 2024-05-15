namespace NSUser {
  export interface IUser {
    id: string;
    name: string;
    email: string;
    photoURL: string;
  }

  // payloads
  export interface IUserCratePayload extends IUser {}
}

export default NSUser;